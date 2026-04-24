import { Injectable } from '@nestjs/common';
import { Prisma, WebhookEvent } from '@prisma/client';
import { BaseDelegate, BaseRepository } from 'src/database/base.repository';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class WebhookEventRepository extends BaseRepository<WebhookEvent> {
  constructor(private prisma: PrismaService) {
    super(prisma.webhookEvent as unknown as BaseDelegate<WebhookEvent>);
  }

  createEvent(
    data: Omit<
      Prisma.WebhookEventCreateInput,
      'payload' | 'headers' | 'sourceId'
    > & {
      payload: Record<string, unknown>;
      headers: Record<string, string>;
      sourceId?: string;
    },
  ) {
    const { sourceId, ...rest } = data;
    return this.prisma.webhookEvent.create({
      data: {
        ...rest,
        payload: data.payload as Prisma.InputJsonValue,
        headers: data.headers as Prisma.InputJsonValue,
        ...(sourceId && { source: { connect: { id: sourceId } } }),
      },
    });
  }
}
