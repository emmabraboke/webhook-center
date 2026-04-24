import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';

@ApiTags('Ingest')
@Controller('ingest')
export class IngestController {
  constructor(private webhookService: WebhookService) {}

  @ApiOperation({ summary: 'Public ingest endpoint — use this URL in Stripe, Paystack, etc.' })
  @Post(':sourceKey')
  ingest(
    @Param('sourceKey') sourceKey: string,
    @Body() payload: Record<string, unknown>,
    @Headers() headers: Record<string, string>,
  ) {
    return this.webhookService.ingestFromSource(sourceKey, payload, headers);
  }
}
