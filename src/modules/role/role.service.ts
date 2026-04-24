import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { success } from 'src/common/helper/utils';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async findOrCreateOwnerRole() {
    const existing = await this.roleRepository.findOne({ name: 'Owner' } as any);
    if (existing) return existing;
    return this.roleRepository.create({ name: 'Owner', permissions: Object.values(Permission) });
  }

  async createRole(dto: CreateRoleDto) {
    const existing = await this.roleRepository.findOne({ name: dto.name } as any);
    if (existing) throw new ConflictException('role name already exists');
    const role = await this.roleRepository.create(dto);
    return success('role created successfully', role);
  }

  async getRoles() {
    const roles = await this.roleRepository.findAllWithPermissions();
    return success('roles fetched successfully', roles);
  }

  async getRoleById(id: string) {
    const role = await this.roleRepository.findByIdWithPermissions(id);
    if (!role) throw new NotFoundException('role not found');
    return success('role fetched successfully', role);
  }

  async updateRole(id: string, dto: UpdateRoleDto) {
    const role = await this.roleRepository.findById(id);
    if (!role) throw new NotFoundException('role not found');
    const updated = await this.roleRepository.updateById(id, dto);
    return success('role updated successfully', updated);
  }

  async deleteRole(id: string) {
    const role = await this.roleRepository.findById(id);
    if (!role) throw new NotFoundException('role not found');
    await this.roleRepository.deleteById(id);
    return success('role deleted successfully');
  }
}
