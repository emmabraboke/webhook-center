import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InviteStatus } from '@prisma/client';
import { BusinessMemberRepository } from 'src/modules/business-member/business-member.repository';
import { BusinessService } from 'src/modules/business/business.service';
import { MailService } from 'src/modules/mail/mail.service';
import { success } from 'src/common/helper/utils';
import { SendInviteDto } from './dto/member-invite.dto';
import { MemberInviteRepository } from './member-invite.repository';
import { InviteJwtPayload } from './interfaces/member-invite.interfaces';

@Injectable()
export class MemberInviteService {
  constructor(
    private memberInviteRepository: MemberInviteRepository,
    private businessMemberRepository: BusinessMemberRepository,
    private businessService: BusinessService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async sendInvite(dto: SendInviteDto, senderId: string, businessId: string) {
    const invite = await this.memberInviteRepository.create({
      email: dto.email,
      roleId: dto.roleId,
      token: 'pending',
      senderId,
      businessId,
    });

    const payload: InviteJwtPayload = {
      inviteId: invite.id,
      email: dto.email,
      businessId,
      roleId: dto.roleId,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.memberInviteRepository.updateById(invite.id, { token });

    const business = await this.businessService.findBusiness({ id: businessId });

    await this.mailService.sendInviteEmail({
      email: dto.email,
      businessName: business.name,
      inviteToken: token,
    });

    return success('invite sent successfully', {
      id: invite.id,
      email: dto.email,
      inviteToken: token,
    });
  }

  async acceptInvite(token: string, userId: string) {
    let payload = this.verifyToken<InviteJwtPayload>(token);

    const invite = await this.memberInviteRepository.findById(payload.inviteId);

    if (!invite) throw new NotFoundException('invite not found');

    if (invite.token !== token)
      throw new UnauthorizedException('invite token mismatch');

    if (invite.status !== InviteStatus.pending) {
      throw new BadRequestException(`invite has already been ${invite.status}`);
    }

    const existingMember = await this.businessMemberRepository.findMember(
      userId,
      payload.businessId,
    );

    if (existingMember)
      throw new ConflictException('you are already a member of this business');

    await this.businessMemberRepository.create({
      userId,
      businessId: payload.businessId,
      roleId: payload.roleId,
    });

    await this.memberInviteRepository.updateById(invite.id, {
      status: InviteStatus.accepted,
    });
  }

  async revokeInvite(id: string) {
    const invite = await this.memberInviteRepository.findById(id);
    if (!invite) throw new NotFoundException('invite not found');

    if (invite.status !== InviteStatus.pending) {
      throw new BadRequestException('only pending invites can be revoked');
    }

    await this.memberInviteRepository.updateById(id, {
      status: InviteStatus.revoked,
    });

    return success('invite revoked successfully');
  }

  async getBusinessInvites(businessId: string) {
    const invites =
      await this.memberInviteRepository.findByBusinessId(businessId);
    return success('invites fetched successfully', invites);
  }

  private verifyToken<T extends object>(token: string) {
    try {
      return this.jwtService.verify<T>(token);
    } catch {
      throw new UnauthorizedException('invite token is invalid or has expired');
    }
  }
}
