import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import {
  ApiCreatedResponse,
  ApiSuccessResponse,
} from 'src/common/swagger/api-responses';
import { EventDeliveryService } from './event-delivery.service';
import { attemptExample, deliveryExample } from './event-delivery.examples';

@ApiTags('Event Deliveries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('event-deliveries')
export class EventDeliveryController {
  constructor(private eventDeliveryService: EventDeliveryService) {}

  @ApiOperation({ summary: 'Get a delivery by ID' })
  @ApiSuccessResponse('delivery fetched successfully', deliveryExample)
  @Get(':id')
  getDelivery(@Param('id') id: string) {
    return this.eventDeliveryService.getDelivery(id);
  }

  @ApiOperation({ summary: 'List all attempts for a delivery' })
  @ApiSuccessResponse('attempts fetched successfully', [attemptExample])
  @Get(':id/attempts')
  getDeliveryAttempts(@Param('id') id: string) {
    return this.eventDeliveryService.getDeliveryAttempts(id);
  }

  @ApiOperation({ summary: 'Replay a failed delivery' })
  @ApiCreatedResponse('delivery queued for replay')
  @Post(':id/replay')
  replayDelivery(@Param('id') id: string) {
    return this.eventDeliveryService.replayDelivery(id);
  }
}
