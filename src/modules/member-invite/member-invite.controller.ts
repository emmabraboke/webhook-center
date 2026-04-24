import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permission } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { PermissionsGuard } from 'src/common/guard/permissions.guard';
import { RequirePermission } from 'src/common/decorator/require-permission.decorator';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { ApiCreatedResponse, ApiSuccessResponse } from 'src/common/swagger/api-responses';
import { SendInviteDto } from './dto/member-invite.dto';
import { MemberInviteService } from './member-invite.service';
import { inviteExample } from './member-invite.examples';

@ApiTags('Member Invites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('businesses/:businessId/invites')
export class MemberInviteController {
  constructor(private memberInviteService: MemberInviteService) {}

  @ApiOperation({ summary: 'Send a member invite' })
  @ApiCreatedResponse('invite sent successfully', inviteExample)
  @RequirePermission(Permission.manage_members)
  @Post()
  sendInvite(
    @Param('businessId') businessId: string,
    @Body() dto: SendInviteDto,
    @CurrentUser('id') senderId: string,
  ) {
    return this.memberInviteService.sendInvite(dto, senderId, businessId);
  }

  @ApiOperation({ summary: 'List all invites for a business' })
  @ApiSuccessResponse('invites fetched successfully', [inviteExample])
  @RequirePermission(Permission.manage_members)
  @Get()
  getBusinessInvites(@Param('businessId') businessId: string) {
    return this.memberInviteService.getBusinessInvites(businessId);
  }

  @ApiOperation({ summary: 'Revoke a pending invite' })
  @ApiSuccessResponse('invite revoked successfully', { ...inviteExample, status: 'revoked' })
  @RequirePermission(Permission.manage_members)
  @Patch(':id/revoke')
  revokeInvite(@Param('id') id: string) {
    return this.memberInviteService.revokeInvite(id);
  }
}
