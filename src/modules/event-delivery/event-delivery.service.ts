import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { EventDelivery, EventDeliveryStatus } from '@prisma/client';
import axios, { AxiosInstance } from 'axios';
import { createHmac } from 'crypto';
import { Queue } from 'bullmq';
import moment from 'moment';
import { success } from 'src/common/helper/utils';
import { DeliveryAttemptRepository } from './repositories/delivery-attempt.repository';
import { EventDeliveryRepository } from './repositories/event-delivery.repository';
import { QueueName } from 'src/common/enum/queue.enum';
import { EventDeliveryWithRelations } from './types/event-delivery.type';

@Injectable()
export class EventDeliveryService {
  private readonly logger = new Logger(EventDeliveryService.name);
  private readonly http: AxiosInstance;

  constructor(
    private eventDeliveryRepository: EventDeliveryRepository,
    private deliveryAttemptRepository: DeliveryAttemptRepository,
    @InjectQueue(QueueName.EventDelivery) private deliveryQueue: Queue,
  ) {
    this.http = axios.create({
      timeout: 30_000,
      validateStatus: () => true,
    });
  }

  async createAndQueueDelivery(
    eventId: string,
    endpointId: string,
  ): Promise<void> {
    const delivery = await this.eventDeliveryRepository.create({
      eventId,
      endpointId,
      status: EventDeliveryStatus.pending,
    });
    // await this.deliveryQueue.add('deliver', { eventDeliveryId: delivery.id });
  }

  async getDeliveriesByEventId(eventId: string) {
    const deliveries = await this.eventDeliveryRepository.find({
      eventId,
    } as any);
    return success('deliveries fetched successfully', deliveries);
  }

  async getDelivery(id: string) {
    const delivery =
      await this.eventDeliveryRepository.findWithEventAndEndpoint(id);
    if (!delivery) throw new NotFoundException('event delivery not found');
    return success('delivery fetched successfully', delivery);
  }

  async getDeliveryAttempts(deliveryId: string) {
    const delivery = await this.eventDeliveryRepository.findById(deliveryId);
    if (!delivery) throw new NotFoundException('event delivery not found');
    const attempts =
      await this.deliveryAttemptRepository.findByDeliveryId(deliveryId);
    return success('attempts fetched successfully', attempts);
  }

  async replayDelivery(id: string) {
    const delivery = await this.eventDeliveryRepository.findById(id);
    if (!delivery) throw new NotFoundException('event delivery not found');

    if (delivery.status !== EventDeliveryStatus.failed) {
      throw new BadRequestException('only failed deliveries can be replayed');
    }

    await this.eventDeliveryRepository.updateById(id, {
      status: EventDeliveryStatus.pending,
      retries: 0,
      nextRetry: null,
    });

    await this.deliveryQueue.add('deliver', { eventDeliveryId: id });

    return success('delivery queued for replay');
  }

  async processDelivery(eventDeliveryId: string): Promise<void> {
    const delivery =
      await this.eventDeliveryRepository.findWithEventAndEndpoint(
        eventDeliveryId,
      );

    if (!delivery) {
      this.logger.warn(`EventDelivery ${eventDeliveryId} not found`);
      return;
    }

    await this.eventDeliveryRepository.updateById(eventDeliveryId, {
      status: EventDeliveryStatus.processing,
    });

    const endpoint = delivery.endpoint;

    const response = await this.sendWebhookRequest(delivery);

    await this.deliveryAttemptRepository.create(response);

    const retries = delivery.retries + 1;

    if (success) {
      await this.eventDeliveryRepository.updateById(eventDeliveryId, {
        status: EventDeliveryStatus.delivered,
        retries,
      });
      return;
    }

    if (retries >= endpoint.maxRetries) {
      await this.eventDeliveryRepository.updateById(eventDeliveryId, {
        status: EventDeliveryStatus.failed,
        retries,
      });
      this.logger.warn(
        `Delivery ${eventDeliveryId} permanently failed after ${retries} attempts`,
      );
      return;
    }

    const delayMs = Math.pow(2, retries) * 30_000;
    const nextRetry = moment().add(delayMs, 'milliseconds').toDate();

    await this.eventDeliveryRepository.updateById(eventDeliveryId, {
      status: EventDeliveryStatus.pending,
      retries,
      nextRetry,
    });

    await this.deliveryQueue.add(
      'deliver',
      { eventDeliveryId },
      { delay: delayMs },
    );

    this.logger.log(
      `Delivery ${eventDeliveryId} retry ${retries}/${endpoint.maxRetries} in ${delayMs / 1000}s`,
    );
  }

  private async sendWebhookRequest(delivery: EventDeliveryWithRelations) {
    const { event, endpoint } = delivery;
    const body = JSON.stringify(event.payload);
    const signature = this.sign(body, endpoint.secret);
    const startTime = Date.now();
    const eventDeliveryId = delivery.id;

    let statusCode: number | null = null,
      responseBody: string | null = null,
      error: string | null = null,
      success = false;

    try {
      const response = await this.http.post(endpoint.url, body, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': `sha256=${signature}`,
          'X-Webhook-Event': event.eventType,
          'X-Webhook-Delivery': eventDeliveryId,
          ...((endpoint.customHeaders as Record<string, string>) ?? {}),
        },
      });

      statusCode = response.status;
      responseBody =
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data);
      success = response.status >= 200 && response.status < 300;

      if (!success) {
        error = `Endpoint returned HTTP ${statusCode}`;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      this.logger.error(`Delivery ${eventDeliveryId} failed: ${error}`);
    }

    const duration = Date.now() - startTime;

    return {
      eventDeliveryId,
      statusCode,
      responseBody,
      error,
      duration,
    };
  }

  private sign(payload: string, secret: string): string {
    return createHmac('sha256', secret).update(payload).digest('hex');
  }
}
