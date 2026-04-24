import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { ApiCreatedResponse, ApiSuccessResponse } from 'src/common/swagger/api-responses';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';
import { projectExample } from './project.examples';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses/:businessId/projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @ApiOperation({ summary: 'Create a project within a business' })
  @ApiCreatedResponse('project created successfully', projectExample)
  @Post()
  createProject(
    @Param('businessId') businessId: string,
    @Body() dto: CreateProjectDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.projectService.createProject(dto, businessId, user.id);
  }

  @ApiOperation({ summary: 'List all projects in a business' })
  @ApiSuccessResponse('projects fetched successfully', [projectExample])
  @Get()
  getBusinessProjects(@Param('businessId') businessId: string) {
    return this.projectService.getBusinessProjects(businessId);
  }

  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiSuccessResponse('project fetched successfully', projectExample)
  @Get(':id')
  getProjectById(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
  }

  @ApiOperation({ summary: 'Update a project' })
  @ApiSuccessResponse('project updated successfully', { ...projectExample, name: 'Staging' })
  @Patch(':id')
  updateProject(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectService.updateProject(id, dto);
  }

  @ApiOperation({ summary: 'Delete a project' })
  @ApiSuccessResponse('project deleted successfully')
  @Delete(':id')
  deleteProject(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }
}
