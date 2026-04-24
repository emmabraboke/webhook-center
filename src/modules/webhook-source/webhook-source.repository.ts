import { Injectable } from '@nestjs/common';
import { WebhookSource } from '@prisma/client';
import { BaseDelegate, BaseRepository } from 'src/database/base.repository';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class WebhookSourceRepository extends BaseRepository<WebhookSource> {
  constructor(private prisma: PrismaService) {
    super(prisma.webhookSource as unknown as BaseDelegate<WebhookSource>);
  }

  findByIngestKey(ingestKey: string): Promise<WebhookSource | null> {
    return this.prisma.webhookSource.findUnique({ where: { ingestKey } });
  }
}
