import { Injectable } from '@nestjs/common';
import { Business } from '@prisma/client';
import { BaseDelegate, BaseRepository } from 'src/database/base.repository';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class BusinessRepository extends BaseRepository<Business> {
  constructor(private prisma: PrismaService) {
    super(prisma.business as unknown as BaseDelegate<Business>);
  }

  findActive(where: Partial<Business>): Promise<Business[]> {
    return this.prisma.business.findMany({ where: { ...where, deletedAt: null } });
  }

  findActiveById(id: string): Promise<Business | null> {
    return this.prisma.business.findFirst({ where: { id, deletedAt: null } });
  }

  softDelete(id: string): Promise<Business> {
    return this.prisma.business.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
