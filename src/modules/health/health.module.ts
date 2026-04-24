import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from 'src/database/database.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaHealthIndicator } from './health.indicator';

@Module({
  imports: [TerminusModule, DatabaseModule],
  controllers: [HealthController],
  providers: [HealthService, PrismaHealthIndicator],
})
export class HealthModule {}
