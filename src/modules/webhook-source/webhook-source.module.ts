import { Module } from '@nestjs/common';
import { WebhookSourceRepository } from './webhook-source.repository';
import { WebhookSourceService } from './webhook-source.service';
import { WebhookSourceController } from './webhook-source.controller';

@Module({
  controllers: [WebhookSourceController],
  providers: [WebhookSourceService, WebhookSourceRepository],
  exports: [WebhookSourceService],
})
export class WebhookSourceModule {}
