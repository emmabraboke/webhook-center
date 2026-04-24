import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { RolesGuard } from 'src/common/guard/user.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserRoles } from 'src/common/enum/role.enum';
import { ApiCreatedResponse, ApiSuccessResponse } from 'src/common/swagger/api-responses';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { RoleService } from './role.service';
import { roleExample } from './role.examples';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([UserRoles.Admin])
@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOperation({ summary: 'Create a role (Admin only)' })
  @ApiCreatedResponse('role created successfully', roleExample)
  @Post()
  createRole(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @ApiOperation({ summary: 'List all roles (Admin only)' })
  @ApiSuccessResponse('roles fetched successfully', [roleExample])
  @Get()
  getRoles() {
    return this.roleService.getRoles();
  }

  @ApiOperation({ summary: 'Get a role by ID (Admin only)' })
  @ApiSuccessResponse('role fetched successfully', roleExample)
  @Get(':id')
  getRoleById(@Param('id') id: string) {
    return this.roleService.getRoleById(id);
  }

  @ApiOperation({ summary: 'Update a role (Admin only)' })
  @ApiSuccessResponse('role updated successfully', { ...roleExample, name: 'Senior Developer' })
  @Patch(':id')
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.updateRole(id, dto);
  }

  @ApiOperation({ summary: 'Delete a role (Admin only)' })
  @ApiSuccessResponse('role deleted successfully')
  @Delete(':id')
  deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }
}
