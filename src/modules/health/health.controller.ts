import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @ApiOperation({ summary: 'Check API health status' })
  @Get()
  check() {
    return this.healthService.check();
  }
}
