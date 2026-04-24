import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { ApiCreatedResponse, ApiSuccessResponse } from 'src/common/swagger/api-responses';
import { subscriptionExample } from 'src/modules/webhook/webhook.examples';
import { CreateWebhookSubscriptionDto } from './dto/webhook-subscription.dto';
import { WebhookSubscriptionService } from './webhook-subscription.service';

@ApiTags('Webhook Subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sources/:sourceId/subscriptions')
export class WebhookSubscriptionController {
  constructor(private webhookSubscriptionService: WebhookSubscriptionService) {}

  @ApiOperation({ summary: 'Subscribe an endpoint to a source' })
  @ApiCreatedResponse('subscription created successfully', subscriptionExample)
  @Post()
  createSubscription(
    @Param('sourceId') sourceId: string,
    @Body() dto: CreateWebhookSubscriptionDto,
  ) {
    return this.webhookSubscriptionService.createSubscription(sourceId, dto);
  }

  @ApiOperation({ summary: 'List all subscriptions for a source' })
  @ApiSuccessResponse('subscriptions fetched successfully', [subscriptionExample])
  @Get()
  getSourceSubscriptions(@Param('sourceId') sourceId: string) {
    return this.webhookSubscriptionService.getSourceSubscriptions(sourceId);
  }

  @ApiOperation({ summary: 'Delete a subscription' })
  @ApiSuccessResponse('subscription deleted successfully')
  @Delete(':id')
  deleteSubscription(@Param('id') id: string) {
    return this.webhookSubscriptionService.deleteSubscription(id);
  }
}
