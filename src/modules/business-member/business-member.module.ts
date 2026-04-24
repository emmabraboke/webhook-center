import { Module } from '@nestjs/common';
import { BusinessMemberController } from './business-member.controller';
import { BusinessMemberRepository } from './business-member.repository';
import { BusinessMemberService } from './business-member.service';

@Module({
  controllers: [BusinessMemberController],
  providers: [BusinessMemberService, BusinessMemberRepository],
  exports: [BusinessMemberService, BusinessMemberRepository],
})
export class BusinessMemberModule {}
