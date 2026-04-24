import { Injectable } from '@nestjs/common';
import { BusinessMember } from '@prisma/client';
import { BaseDelegate, BaseRepository } from 'src/database/base.repository';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class BusinessMemberRepository extends BaseRepository<BusinessMember> {
  constructor(private prisma: PrismaService) {
    super(prisma.businessMember as unknown as BaseDelegate<BusinessMember>);
  }

  findMember(userId: string, businessId: string) {
    return this.prisma.businessMember.findFirst({
      where: { userId, businessId },
      include: { role: true },
    });
  }

  findBusinessMembers(businessId: string) {
    return this.prisma.businessMember.findMany({
      where: { businessId },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        role: true,
      },
    });
  }
}
