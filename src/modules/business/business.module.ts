import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { BusinessRepository } from './business.repository';
import { RoleModule } from 'src/modules/role/role.module';
import { BusinessMemberModule } from 'src/modules/business-member/business-member.module';

@Module({
  imports: [RoleModule, BusinessMemberModule],
  controllers: [BusinessController],
  providers: [BusinessService, BusinessRepository],
  exports: [BusinessService],
})
export class BusinessModule {}
