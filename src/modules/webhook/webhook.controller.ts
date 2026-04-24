import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import {
  ApiCreatedResponse,
  ApiSuccessResponse,
} from 'src/common/swagger/api-responses';
import { IngestEventDto } from './dto/webhook.dto';
import { WebhookService } from './webhook.service';
import { eventExample } from './webhook.examples';

@ApiTags('Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/events')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @ApiOperation({ summary: 'Ingest a new webhook event' })
  @ApiCreatedResponse('event ingested successfully', eventExample)
  @Post()
  ingestEvent(
    @Param('projectId') projectId: string,
    @Body() dto: IngestEventDto,
    @Headers() headers: Record<string, string>,
  ) {
    return this.webhookService.ingestEvent(projectId, dto, headers);
  }

  @ApiOperation({ summary: 'List all events for a project' })
  @ApiSuccessResponse('events fetched successfully', [eventExample])
  @Get()
  getProjectEvents(@Param('projectId') projectId: string) {
    return this.webhookService.getProjectEvents(projectId);
  }

  @ApiOperation({ summary: 'List all deliveries for an event' })
  @ApiSuccessResponse('deliveries fetched successfully', [])
  @Get(':eventId/deliveries')
  getEventDeliveries(@Param('eventId') eventId: string) {
    return this.webhookService.getEventDeliveries(eventId);
  }
}
