import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EventDeliveryService } from './event-delivery.service';
import { QueueName } from 'src/common/enum/queue.enum';

@Processor(QueueName.EventDelivery)
export class EventDeliveryWorker extends WorkerHost {
  private readonly logger = new Logger(EventDeliveryWorker.name);

  constructor(private eventDeliveryService: EventDeliveryService) {
    super();
  }

  async process(job: Job<{ eventDeliveryId: string }>) {
    this.logger.log(
      `Processing delivery job ${job.id} for eventDelivery ${job.data.eventDeliveryId}`,
    );
    await this.eventDeliveryService.processDelivery(job.data.eventDeliveryId);
  }
}
