import { Module } from '@nestjs/common';
import { BusinessMemberModule } from 'src/modules/business-member/business-member.module';
import { BusinessModule } from 'src/modules/business/business.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { MemberInviteController } from './member-invite.controller';
import { MemberInviteRepository } from './member-invite.repository';
import { MemberInviteService } from './member-invite.service';

@Module({
  imports: [BusinessMemberModule, BusinessModule, MailModule],
  controllers: [MemberInviteController],
  providers: [MemberInviteService, MemberInviteRepository],
  exports: [MemberInviteService],
})
export class MemberInviteModule {}
