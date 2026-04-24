import { Injectable } from '@nestjs/common';
import { EventDelivery } from '@prisma/client';
import { BaseDelegate, BaseRepository } from 'src/database/base.repository';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class EventDeliveryRepository extends BaseRepository<EventDelivery> {
  constructor(private prisma: PrismaService) {
    super(prisma.eventDelivery as unknown as BaseDelegate<EventDelivery>);
  }

  findWithEventAndEndpoint(id: string) {
    return this.prisma.eventDelivery.findUnique({
      where: { id },
      include: { event: true, endpoint: true },
    });
  }
}
