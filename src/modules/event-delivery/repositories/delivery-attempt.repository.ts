import { Injectable } from '@nestjs/common';
import { DeliveryAttempt } from '@prisma/client';
import { BaseDelegate, BaseRepository } from 'src/database/base.repository';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DeliveryAttemptRepository extends BaseRepository<DeliveryAttempt> {
  constructor(private prisma: PrismaService) {
    super(prisma.deliveryAttempt as unknown as BaseDelegate<DeliveryAttempt>);
  }

  findByDeliveryId(eventDeliveryId: string) {
    return this.prisma.deliveryAttempt.findMany({
      where: { eventDeliveryId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
