import { Injectable, NotFoundException } from '@nestjs/common';
import { success } from 'src/common/helper/utils';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectService {
  constructor(private projectRepository: ProjectRepository) {}

  async createProject(dto: CreateProjectDto, businessId: string, userId: string) {
    const project = await this.projectRepository.create({
      ...dto,
      businessId,
      userId,
    });
    return success('project created successfully', project);
  }

  async getBusinessProjects(businessId: string) {
    const projects = await this.projectRepository.findActive({ businessId } as any);
    return success('projects fetched successfully', projects);
  }

  async getProjectById(id: string) {
    const project = await this.projectRepository.findActiveById(id);
    if (!project) throw new NotFoundException('project not found');
    return success('project fetched successfully', project);
  }

  async updateProject(id: string, dto: UpdateProjectDto) {
    const project = await this.projectRepository.findActiveById(id);
    if (!project) throw new NotFoundException('project not found');
    const updated = await this.projectRepository.updateById(id, dto);
    return success('project updated successfully', updated);
  }

  async deleteProject(id: string) {
    const project = await this.projectRepository.findActiveById(id);
    if (!project) throw new NotFoundException('project not found');
    await this.projectRepository.softDelete(id);
    return success('project deleted successfully');
  }
}
