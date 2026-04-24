import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { DeliveryAttemptRepository } from './repositories/delivery-attempt.repository';
import { EventDeliveryRepository } from './repositories/event-delivery.repository';
import { EventDeliveryService } from './event-delivery.service';
import { EventDeliveryWorker } from './event-delivery.worker';
import { EventDeliveryController } from './event-delivery.controller';
import { QueueName } from 'src/common/enum/queue.enum';

@Module({
  imports: [BullModule.registerQueue({ name: QueueName.EventDelivery })],
  controllers: [EventDeliveryController],
  providers: [
    EventDeliveryService,
    EventDeliveryWorker,
    EventDeliveryRepository,
    DeliveryAttemptRepository,
  ],
  exports: [EventDeliveryService],
})
export class EventDeliveryModule {}
