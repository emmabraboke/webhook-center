import { Injectable } from '@nestjs/common';
import { MemberInvite } from '@prisma/client';
import { BaseDelegate, BaseRepository } from 'src/database/base.repository';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class MemberInviteRepository extends BaseRepository<MemberInvite> {
  constructor(private prisma: PrismaService) {
    super(prisma.memberInvite as unknown as BaseDelegate<MemberInvite>);
  }

  findByBusinessId(businessId: string) {
    return this.prisma.memberInvite.findMany({
      where: { businessId },
      include: { sender: { select: { id: true, email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
