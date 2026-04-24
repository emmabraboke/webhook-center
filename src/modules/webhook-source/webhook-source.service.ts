import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { success } from 'src/common/helper/utils';
import { CreateWebhookSourceDto, UpdateWebhookSourceDto } from './dto/webhook-source.dto';
import { WebhookSourceRepository } from './webhook-source.repository';

@Injectable()
export class WebhookSourceService {
  constructor(private webhookSourceRepository: WebhookSourceRepository) {}

  findSource(where: Partial<{ id: string; projectId: string; ingestKey: string }>) {
    return this.webhookSourceRepository.findOne(where as any);
  }

  findSourceByIngestKey(ingestKey: string) {
    return this.webhookSourceRepository.findByIngestKey(ingestKey);
  }

  async createSource(projectId: string, dto: CreateWebhookSourceDto) {
    const ingestKey = randomBytes(16).toString('hex');
    const source = await this.webhookSourceRepository.create({
      ...dto,
      projectId,
      ingestKey,
    });
    return success('source created successfully', source);
  }

  async getProjectSources(projectId: string) {
    const sources = await this.webhookSourceRepository.find({ projectId } as any);
    return success('sources fetched successfully', sources);
  }

  async getSourceById(id: string) {
    const source = await this.webhookSourceRepository.findById(id);
    if (!source) throw new NotFoundException('source not found');
    return success('source fetched successfully', source);
  }

  async updateSource(id: string, dto: UpdateWebhookSourceDto) {
    const source = await this.webhookSourceRepository.findById(id);
    if (!source) throw new NotFoundException('source not found');
    const updated = await this.webhookSourceRepository.updateById(id, dto);
    return success('source updated successfully', updated);
  }

  async deleteSource(id: string) {
    const source = await this.webhookSourceRepository.findById(id);
    if (!source) throw new NotFoundException('source not found');
    await this.webhookSourceRepository.deleteById(id);
    return success('source deleted successfully');
  }
}
