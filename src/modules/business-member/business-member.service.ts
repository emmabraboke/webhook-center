import { Injectable, NotFoundException } from '@nestjs/common';
import { success } from 'src/common/helper/utils';
import { UpdateMemberRoleDto } from './dto/business-member.dto';
import { BusinessMemberRepository } from './business-member.repository';
import { AddMemberData } from './interfaces/business-member.interfaces';

@Injectable()
export class BusinessMemberService {
  constructor(private businessMemberRepository: BusinessMemberRepository) {}

  async addMember(dto: AddMemberData) {
    return this.businessMemberRepository.create(dto);
  }

  async getBusinessMembers(businessId: string) {
    const members = await this.businessMemberRepository.findBusinessMembers(businessId);
    return success('members fetched successfully', members);
  }

  async updateMemberRole(id: string, dto: UpdateMemberRoleDto) {
    const member = await this.businessMemberRepository.findById(id);
    if (!member) throw new NotFoundException('member not found');
    const updated = await this.businessMemberRepository.updateById(id, { roleId: dto.roleId });
    return success('member role updated successfully', updated);
  }

  async removeMember(id: string) {
    const member = await this.businessMemberRepository.findById(id);
    if (!member) throw new NotFoundException('member not found');
    await this.businessMemberRepository.deleteById(id);
    return success('member removed successfully');
  }
}
