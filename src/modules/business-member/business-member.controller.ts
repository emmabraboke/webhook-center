import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permission } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { PermissionsGuard } from 'src/common/guard/permissions.guard';
import { RequirePermission } from 'src/common/decorator/require-permission.decorator';
import { ApiSuccessResponse } from 'src/common/swagger/api-responses';
import { BusinessMemberService } from './business-member.service';
import { UpdateMemberRoleDto } from './dto/business-member.dto';
import { memberExample } from './business-member.examples';

@ApiTags('Business Members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('businesses/:businessId/members')
export class BusinessMemberController {
  constructor(private businessMemberService: BusinessMemberService) {}

  @ApiOperation({ summary: 'List members of a business' })
  @ApiSuccessResponse('members fetched successfully', [memberExample])
  @RequirePermission(Permission.manage_members)
  @Get()
  getBusinessMembers(@Param('businessId') businessId: string) {
    return this.businessMemberService.getBusinessMembers(businessId);
  }

  @ApiOperation({ summary: 'Update the role of a business member' })
  @ApiSuccessResponse('member role updated successfully', { ...memberExample, role: { name: 'Admin' } })
  @RequirePermission(Permission.manage_members)
  @Patch(':id')
  updateMemberRole(@Param('id') id: string, @Body() dto: UpdateMemberRoleDto) {
    return this.businessMemberService.updateMemberRole(id, dto);
  }

  @ApiOperation({ summary: 'Remove a member from a business' })
  @ApiSuccessResponse('member removed successfully')
  @RequirePermission(Permission.manage_members)
  @Delete(':id')
  removeMember(@Param('id') id: string) {
    return this.businessMemberService.removeMember(id);
  }
}
