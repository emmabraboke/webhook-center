import { Injectable } from '@nestjs/common';
import { HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { success } from 'src/common/helper/utils';
import { PrismaHealthIndicator } from './health.indicator';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private db: PrismaHealthIndicator,
  ) {}

  async check() {
    const result = await this.health.check([
      () => this.db.isHealthy('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
    return success('service is healthy', result.info);
  }
}
