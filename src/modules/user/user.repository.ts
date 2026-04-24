import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { BaseDelegate, BaseRepository } from 'src/database/base.repository';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private prisma: PrismaService) {
    super(prisma.user as unknown as BaseDelegate<User>);
  }

  incrementTokenVersion(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { tokenVersion: { increment: 1 } },
    });
  }
}
