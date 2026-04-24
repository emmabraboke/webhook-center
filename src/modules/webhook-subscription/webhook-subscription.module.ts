import { Module } from '@nestjs/common';
import { WebhookSubscriptionRepository } from './webhook-subscription.repository';
import { WebhookSubscriptionService } from './webhook-subscription.service';
import { WebhookSubscriptionController } from './webhook-subscription.controller';
import { WebhookSourceModule } from 'src/modules/webhook-source/webhook-source.module';
import { WebhookEndpointModule } from 'src/modules/webhook-endpoint/webhook-endpoint.module';

@Module({
  imports: [WebhookSourceModule, WebhookEndpointModule],
  controllers: [WebhookSubscriptionController],
  providers: [WebhookSubscriptionService, WebhookSubscriptionRepository],
  exports: [WebhookSubscriptionService],
})
export class WebhookSubscriptionModule {}
