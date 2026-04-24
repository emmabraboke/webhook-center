import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendInviteEmailDto, SendPasswordResetEmailDto } from './dto/mail.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  private get year() {
    return new Date().getFullYear();
  }

  async sendVerificationEmail(email: string, otp: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      template: 'verify-email',
      context: { otp, year: this.year },
    });
  }

  async sendPasswordResetEmail(dto: SendPasswordResetEmailDto): Promise<void> {
    await this.mailerService.sendMail({
      to: dto.email,
      subject: 'Password Reset',
      template: 'password-reset',
      context: { otp: dto.otp, year: this.year },
    });
  }

  async sendInviteEmail(dto: SendInviteEmailDto): Promise<void> {
    await this.mailerService.sendMail({
      to: dto.email,
      subject: `You've been invited to join ${dto.businessName}`,
      template: 'member-invite',
      context: {
        businessName: dto.businessName,
        inviteToken: dto.inviteToken,
        year: this.year,
      },
    });
  }
}
