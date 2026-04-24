import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { ApiCreatedResponse, ApiSuccessResponse } from 'src/common/swagger/api-responses';
import { CreateWebhookEndpointDto, UpdateWebhookEndpointDto } from './dto/webhook-endpoint.dto';
import { WebhookEndpointService } from './webhook-endpoint.service';
import { endpointExample } from 'src/modules/webhook/webhook.examples';

@ApiTags('Webhook Endpoints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/endpoints')
export class WebhookEndpointController {
  constructor(private webhookEndpointService: WebhookEndpointService) {}

  @ApiOperation({ summary: 'Create a webhook endpoint for a project' })
  @ApiCreatedResponse('endpoint created successfully', endpointExample)
  @Post()
  createEndpoint(
    @Param('projectId') projectId: string,
    @Body() dto: CreateWebhookEndpointDto,
  ) {
    return this.webhookEndpointService.createEndpoint(dto, projectId);
  }

  @ApiOperation({ summary: 'List all endpoints for a project' })
  @ApiSuccessResponse('endpoints fetched successfully', [endpointExample])
  @Get()
  getProjectEndpoints(@Param('projectId') projectId: string) {
    return this.webhookEndpointService.getProjectEndpoints(projectId);
  }

  @ApiOperation({ summary: 'Get a webhook endpoint by ID' })
  @ApiSuccessResponse('endpoint fetched successfully', endpointExample)
  @Get(':id')
  getEndpointById(@Param('id') id: string) {
    return this.webhookEndpointService.getEndpointById(id);
  }

  @ApiOperation({ summary: 'Update a webhook endpoint' })
  @ApiSuccessResponse('endpoint updated successfully', { ...endpointExample, name: 'Updated Server' })
  @Patch(':id')
  updateEndpoint(@Param('id') id: string, @Body() dto: UpdateWebhookEndpointDto) {
    return this.webhookEndpointService.updateEndpoint(id, dto);
  }

  @ApiOperation({ summary: 'Delete a webhook endpoint' })
  @ApiSuccessResponse('endpoint deleted successfully')
  @Delete(':id')
  deleteEndpoint(@Param('id') id: string) {
    return this.webhookEndpointService.deleteEndpoint(id);
  }

  @ApiOperation({ summary: 'Roll the signing secret for an endpoint' })
  @ApiCreatedResponse('secret rolled successfully', { ...endpointExample, secret: 'whsec_newxyz789' })
  @Post(':id/roll-secret')
  rollSecret(@Param('id') id: string) {
    return this.webhookEndpointService.rollSecret(id);
  }
}
