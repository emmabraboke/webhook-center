import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { success } from 'src/common/helper/utils';
import { CreateWebhookSubscriptionDto } from './dto/webhook-subscription.dto';
import { WebhookSourceService } from 'src/modules/webhook-source/webhook-source.service';
import { WebhookEndpointService } from 'src/modules/webhook-endpoint/webhook-endpoint.service';
import { WebhookSubscriptionRepository } from './webhook-subscription.repository';

@Injectable()
export class WebhookSubscriptionService {
  constructor(
    private webhookSubscriptionRepository: WebhookSubscriptionRepository,
    private webhookSourceService: WebhookSourceService,
    private webhookEndpointService: WebhookEndpointService,
  ) {}

  async createSubscription(sourceId: string, dto: CreateWebhookSubscriptionDto) {
    const source = await this.webhookSourceService.findSource({ id: sourceId });
    if (!source) throw new NotFoundException('source not found');

    const endpoint = await this.webhookEndpointService.findEndpoint({ id: dto.endpointId });
    if (!endpoint) throw new NotFoundException('endpoint not found');

    const existing = await this.webhookSubscriptionRepository.findOne({
      sourceId,
      endpointId: dto.endpointId,
    } as any);
    if (existing) throw new ConflictException('endpoint already subscribed to this source');

    const subscription = await this.webhookSubscriptionRepository.create({
      name: dto.name,
      sourceId,
      endpointId: dto.endpointId,
    });
    return success('subscription created successfully', subscription);
  }

  async getSourceSubscriptions(sourceId: string) {
    const subscriptions = await this.webhookSubscriptionRepository.find({ sourceId } as any);
    return success('subscriptions fetched successfully', subscriptions);
  }

  findSubscribedEndpoints(sourceId: string) {
    return this.webhookSubscriptionRepository.findSubscribedEndpoints(sourceId);
  }

  async deleteSubscription(id: string) {
    const subscription = await this.webhookSubscriptionRepository.findById(id);
    if (!subscription) throw new NotFoundException('subscription not found');
    await this.webhookSubscriptionRepository.deleteById(id);
    return success('subscription deleted successfully');
  }
}
