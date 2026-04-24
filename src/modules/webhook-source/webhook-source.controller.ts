import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { ApiCreatedResponse, ApiSuccessResponse } from 'src/common/swagger/api-responses';
import { sourceExample } from 'src/modules/webhook/webhook.examples';
import { CreateWebhookSourceDto, UpdateWebhookSourceDto } from './dto/webhook-source.dto';
import { WebhookSourceService } from './webhook-source.service';

@ApiTags('Webhook Sources')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/sources')
export class WebhookSourceController {
  constructor(private webhookSourceService: WebhookSourceService) {}

  @ApiOperation({ summary: 'Create a webhook source' })
  @ApiCreatedResponse('source created successfully', sourceExample)
  @Post()
  createSource(@Param('projectId') projectId: string, @Body() dto: CreateWebhookSourceDto) {
    return this.webhookSourceService.createSource(projectId, dto);
  }

  @ApiOperation({ summary: 'List all sources for a project' })
  @ApiSuccessResponse('sources fetched successfully', [sourceExample])
  @Get()
  getProjectSources(@Param('projectId') projectId: string) {
    return this.webhookSourceService.getProjectSources(projectId);
  }

  @ApiOperation({ summary: 'Get a source by ID' })
  @ApiSuccessResponse('source fetched successfully', sourceExample)
  @Get(':id')
  getSourceById(@Param('id') id: string) {
    return this.webhookSourceService.getSourceById(id);
  }

  @ApiOperation({ summary: 'Update a source' })
  @ApiSuccessResponse('source updated successfully', { ...sourceExample, name: 'Stripe Staging' })
  @Patch(':id')
  updateSource(@Param('id') id: string, @Body() dto: UpdateWebhookSourceDto) {
    return this.webhookSourceService.updateSource(id, dto);
  }

  @ApiOperation({ summary: 'Delete a source' })
  @ApiSuccessResponse('source deleted successfully')
  @Delete(':id')
  deleteSource(@Param('id') id: string) {
    return this.webhookSourceService.deleteSource(id);
  }
}
