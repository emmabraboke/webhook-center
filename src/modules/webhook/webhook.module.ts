import { Module } from '@nestjs/common';
import { WebhookEventRepository } from './repositories/webhook-event.repository';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { IngestController } from './ingest.controller';
import { EventDeliveryModule } from '../event-delivery/event-delivery.module';
import { WebhookSourceModule } from 'src/modules/webhook-source/webhook-source.module';
import { WebhookSubscriptionModule } from 'src/modules/webhook-subscription/webhook-subscription.module';

@Module({
  imports: [EventDeliveryModule, WebhookSourceModule, WebhookSubscriptionModule],
  controllers: [WebhookController, IngestController],
  providers: [WebhookService, WebhookEventRepository],
})
export class WebhookModule {}
