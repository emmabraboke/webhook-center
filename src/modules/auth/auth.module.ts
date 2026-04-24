import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/modules/user/user.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { OtpModule } from 'src/modules/otp/otp.module';
import { MemberInviteModule } from 'src/modules/member-invite/member-invite.module';

@Module({
  imports: [UserModule, MailModule, OtpModule, MemberInviteModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
