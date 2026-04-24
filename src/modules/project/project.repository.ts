import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/client';
import { BaseDelegate, BaseRepository } from 'src/database/base.repository';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ProjectRepository extends BaseRepository<Project> {
  constructor(prisma: PrismaService) {
    super(prisma.project as unknown as BaseDelegate<Project>);
  }
}
