import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { BaseDelegate, BaseRepository } from 'src/database/base.repository';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(private prisma: PrismaService) {
    super(prisma.role as unknown as BaseDelegate<Role>);
  }

  findAllWithPermissions() {
    return this.prisma.role.findMany({ orderBy: { name: 'asc' } });
  }

  findByIdWithPermissions(id: string) {
    return this.prisma.role.findUnique({ where: { id } });
  }
}
