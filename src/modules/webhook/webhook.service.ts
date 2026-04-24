import { Injectable, NotFoundException } from '@nestjs/common';
import { WebhookEventStatus } from '@prisma/client';
import { success } from 'src/common/helper/utils';
import { EventDeliveryService } from '../event-delivery/event-delivery.service';
import { WebhookEventRepository } from './repositories/webhook-event.repository';
import { WebhookSourceService } from 'src/modules/webhook-source/webhook-source.service';
import { WebhookSubscriptionService } from 'src/modules/webhook-subscription/webhook-subscription.service';
import { IngestEventDto } from './dto/webhook.dto';

@Injectable()
export class WebhookService {
  constructor(
    private webhookEventRepository: WebhookEventRepository,
    private webhookSourceService: WebhookSourceService,
    private webhookSubscriptionService: WebhookSubscriptionService,
    private eventDeliveryService: EventDeliveryService,
  ) {}

  async ingestFromSource(
    sourceKey: string,
    payload: Record<string, unknown>,
    headers: Record<string, string>,
  ) {
    const source = await this.webhookSourceService.findSourceByIngestKey(sourceKey);
    if (!source) throw new NotFoundException('source not found');

    const event = await this.webhookEventRepository.createEvent({
      project: { connect: { id: source.projectId } },
      eventType: source.name,
      payload,
      headers,
      status: WebhookEventStatus.pending,
      sourceId: source.id,
    });

    const subscriptions = await this.webhookSubscriptionService.findSubscribedEndpoints(source.id);

    if (subscriptions.length === 0) {
      await this.webhookEventRepository.updateById(event.id, { status: WebhookEventStatus.discarded });
      return { received: true };
    }

    await Promise.all(
      subscriptions.map((sub) =>
        this.eventDeliveryService.createAndQueueDelivery(event.id, sub.endpointId),
      ),
    );

    await this.webhookEventRepository.updateById(event.id, { status: WebhookEventStatus.processing });

    return { received: true };
  }

  async ingestEvent(
    projectId: string,
    dto: IngestEventDto,
    rawHeaders: Record<string, string>,
  ) {
    const event = await this.webhookEventRepository.createEvent({
      project: { connect: { id: projectId } },
      eventType: dto.eventType,
      payload: dto.payload,
      headers: rawHeaders,
      status: WebhookEventStatus.pending,
    });

    return success('event ingested successfully', event);
  }

  async getProjectEvents(projectId: string) {
    const events = await this.webhookEventRepository.find({ projectId } as any);
    return success('events fetched successfully', events);
  }

  getEventDeliveries(eventId: string) {
    return this.eventDeliveryService.getDeliveriesByEventId(eventId);
  }
}
