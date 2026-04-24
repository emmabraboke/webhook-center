import { Module } from '@nestjs/common';
import { WebhookEndpointRepository } from './webhook-endpoint.repository';
import { WebhookEndpointService } from './webhook-endpoint.service';
import { WebhookEndpointController } from './webhook-endpoint.controller';

@Module({
  controllers: [WebhookEndpointController],
  providers: [WebhookEndpointService, WebhookEndpointRepository],
  exports: [WebhookEndpointService],
})
export class WebhookEndpointModule {}
