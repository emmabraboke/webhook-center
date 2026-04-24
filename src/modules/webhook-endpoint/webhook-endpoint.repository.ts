import { Injectable } from '@nestjs/common';
import { EndpointStatus, Prisma, WebhookEndpoint } from '@prisma/client';
import { BaseDelegate, BaseRepository } from 'src/database/base.repository';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class WebhookEndpointRepository extends BaseRepository<WebhookEndpoint> {
  constructor(private prisma: PrismaService) {
    super(prisma.webhookEndpoint as unknown as BaseDelegate<WebhookEndpoint>);
  }

  findSubscribedEndpoints(projectId: string, eventType: string) {
    return this.prisma.webhookEndpoint.findMany({
      where: {
        projectId,
        status: EndpointStatus.active,
        deletedAt: null,
        subscriptions: { some: { source: { name: eventType } } },
      },
    });
  }
}
