import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';
import { success } from 'src/common/helper/utils';
import {
  CreateWebhookEndpointDto,
  UpdateWebhookEndpointDto,
} from './dto/webhook-endpoint.dto';
import { WebhookEndpointRepository } from './webhook-endpoint.repository';

@Injectable()
export class WebhookEndpointService {
  constructor(private webhookEndpointRepository: WebhookEndpointRepository) {}

  findEndpoint(where: Partial<{ id: string; projectId: string }>) {
    return this.webhookEndpointRepository.findActiveById(where.id);
  }

  async createEndpoint(dto: CreateWebhookEndpointDto, projectId: string) {
    const secret = randomBytes(32).toString('hex');
    const endpoint = await this.webhookEndpointRepository.create({
      ...dto,
      projectId,
      secret,
      customHeaders: (dto.customHeaders ?? null) as Prisma.JsonValue,
    });
    return success('endpoint created successfully', endpoint);
  }

  async getProjectEndpoints(projectId: string) {
    const endpoints = await this.webhookEndpointRepository.findActive({
      projectId,
    } as any);
    return success('endpoints fetched successfully', endpoints);
  }

  async getEndpointById(id: string) {
    const endpoint = await this.webhookEndpointRepository.findActiveById(id);
    if (!endpoint) throw new NotFoundException('endpoint not found');
    return success('endpoint fetched successfully', endpoint);
  }

  async updateEndpoint(id: string, dto: UpdateWebhookEndpointDto) {
    const endpoint = await this.webhookEndpointRepository.findActiveById(id);
    if (!endpoint) throw new NotFoundException('endpoint not found');
    const updated = await this.webhookEndpointRepository.updateById(id, {
      ...dto,
      customHeaders: dto.customHeaders as Prisma.JsonValue,
    });
    return success('endpoint updated successfully', updated);
  }

  async deleteEndpoint(id: string) {
    const endpoint = await this.webhookEndpointRepository.findActiveById(id);
    if (!endpoint) throw new NotFoundException('endpoint not found');
    await this.webhookEndpointRepository.softDelete(id);
    return success('endpoint deleted successfully');
  }

  async rollSecret(id: string) {
    const endpoint = await this.webhookEndpointRepository.findActiveById(id);
    if (!endpoint) throw new NotFoundException('endpoint not found');
    const secret = randomBytes(32).toString('hex');
    const updated = await this.webhookEndpointRepository.updateById(id, {
      secret,
    });
    return success('secret rotated successfully', { secret: updated.secret });
  }
}
