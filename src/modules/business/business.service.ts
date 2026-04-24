import { Injectable, NotFoundException } from '@nestjs/common';
import { Business } from '@prisma/client';
import { BusinessRepository } from './business.repository';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';
import { success } from 'src/common/helper/utils';
import { RoleService } from 'src/modules/role/role.service';
import { BusinessMemberService } from 'src/modules/business-member/business-member.service';

@Injectable()
export class BusinessService {
  constructor(
    private businessRepository: BusinessRepository,
    private roleService: RoleService,
    private businessMemberService: BusinessMemberService,
  ) {}

  async createBusiness(dto: CreateBusinessDto, userId: string) {
    const business = await this.businessRepository.create({ ...dto, userId });
    const ownerRole = await this.roleService.findOrCreateOwnerRole();
    await this.businessMemberService.addMember({ userId, businessId: business.id, roleId: ownerRole.id });
    return success('business created successfully', business);
  }

  async getUserBusinesses(userId: string) {
    const businesses = await this.businessRepository.findActive({ userId });
    return success('businesses fetched successfully', businesses);
  }

  findBusiness(where: Partial<Business>) {
    return this.businessRepository.findOne({ ...where, deletedAt: null });
  }

  async getBusinessById(id: string) {
    const business = await this.businessRepository.findActiveById(id);
    if (!business) throw new NotFoundException('business not found');
    return success('business fetched successfully', business);
  }

  async updateBusiness(id: string, dto: UpdateBusinessDto) {
    const business = await this.businessRepository.findActiveById(id);
    if (!business) throw new NotFoundException('business not found');
    const updated = await this.businessRepository.updateById(id, dto);
    return success('business updated successfully', updated);
  }

  async deleteBusiness(id: string) {
    const business = await this.businessRepository.findActiveById(id);
    if (!business) throw new NotFoundException('business not found');
    await this.businessRepository.softDelete(id);
    return success('business deleted successfully');
  }
}
