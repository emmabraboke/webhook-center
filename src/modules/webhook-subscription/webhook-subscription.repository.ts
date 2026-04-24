import { Injectable } from '@nestjs/common';
import { EndpointStatus, WebhookSubscription } from '@prisma/client';
import { BaseDelegate, BaseRepository } from 'src/database/base.repository';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class WebhookSubscriptionRepository extends BaseRepository<WebhookSubscription> {
  constructor(private prisma: PrismaService) {
    super(prisma.webhookSubscription as unknown as BaseDelegate<WebhookSubscription>);
  }

  findSubscribedEndpoints(sourceId: string) {
    return this.prisma.webhookSubscription.findMany({
      where: {
        sourceId,
        endpoint: { status: EndpointStatus.active, deletedAt: null },
      },
      include: { endpoint: true },
    });
  }
}
