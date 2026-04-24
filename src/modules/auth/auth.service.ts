import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { success } from 'src/common/helper/utils';
import { Token } from 'src/common/types/response.type';
import { UserRoles } from 'src/common/enum/role.enum';
import { MailService } from 'src/modules/mail/mail.service';
import { OtpService } from 'src/modules/otp/otp.service';
import { OtpActions } from 'src/common/enum/otp-actions.enum';
import { JwtPayloadDto } from 'src/common/dto/jwt-payload.dto';
import { MemberInviteService } from 'src/modules/member-invite/member-invite.service';
import { InviteJwtPayload } from 'src/modules/member-invite/interfaces/member-invite.interfaces';
import {
  AcceptInviteDto,
  CreateUserDto,
  ForgotPasswordDto,
  GetAccessTokenDto,
  LoginDto,
  ResendOtpDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private otpService: OtpService,
    private memberInviteService: MemberInviteService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const { password, ...userData } = dto;

    const existing = await this.userService.findUser({ email: userData.email });
    if (existing)
      throw new UnprocessableEntityException('email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.createUser({
      ...userData,
      role: UserRoles.User,
      password: hashedPassword,
    });

    const { otpId, otp } = await this.otpService.createOtp(
      user.email,
      OtpActions.Registration,
      600,
    );

    try {
      await this.mailService.sendVerificationEmail(user.email, otp);
    } catch (error) {
      console.error('Mail send error:', error);
      // Continue without failing registration
    }

    const token = await this.getToken(user);
    const { password: _, ...userDetails } = user;

    return success(
      'sign up successful',
      { ...userDetails, otpId },
      undefined,
      token,
    );
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findUser({ email: dto.email });

    if (!user || !user.password) {
      throw new UnauthorizedException('invalid email or password');
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('invalid email or password');

    if (user.status === UserStatus.suspended) {
      throw new UnauthorizedException('your account has been suspended');
    }

    const token = await this.getToken(user);
    const { password: _, ...userData } = user;

    return success('login successful', userData, undefined, token);
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const otpData = await this.otpService.getOtp(
      dto.otpId,
      OtpActions.Registration,
    );

    if (!otpData || otpData.otp !== dto.otp) {
      throw new UnprocessableEntityException('invalid otp');
    }

    const user = await this.userService.findUser({ email: otpData.email });
    if (!user) throw new NotFoundException('user not found');

    await this.userService.updateUserById(user.id, {
      emailVerified: true,
      status: UserStatus.active,
    });

    await this.otpService.deleteOtp(dto.otpId, OtpActions.Registration);

    return success('email verified successfully');
  }

  async resendOtp(dto: ResendOtpDto) {
    const user = await this.userService.findUser({ email: dto.email });
    if (!user) throw new NotFoundException('user not found');

    if (dto.action === OtpActions.Registration && user.emailVerified) {
      throw new BadRequestException('email is already verified');
    }

    const { otpId, otp } = await this.otpService.createOtp(
      user.email,
      dto.action,
      600,
    );

    try {
      if (dto.action === OtpActions.Registration) {
        await this.mailService.sendVerificationEmail(user.email, otp);
      } else {
        await this.mailService.sendPasswordResetEmail({
          email: user.email,
          otp,
        });
      }
    } catch (error) {
      console.error('Mail send error:', error);
      // Continue without failing resend OTP
    }

    return success('otp resent successfully', { otpId });
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userService.findUser({ email: dto.email });
    if (!user) throw new NotFoundException('user not found');

    const { otpId, otp } = await this.otpService.createOtp(
      user.email,
      OtpActions.ResetPassword,
    );

    try {
      await this.mailService.sendPasswordResetEmail({ email: user.email, otp });
    } catch (error) {
      console.error('Mail send error:', error);
      // Continue without failing forgot password
    }

    return success('otp sent to email', { otpId });
  }

  async resetPassword(dto: ResetPasswordDto) {
    const otpData = await this.otpService.getOtp(
      dto.otpId,
      OtpActions.ResetPassword,
    );

    if (!otpData || otpData.otp !== dto.otp) {
      throw new UnprocessableEntityException('invalid otp');
    }

    const user = await this.userService.findUser({ email: otpData.email });
    if (!user) throw new NotFoundException('user not found');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.userService.updateUserById(user.id, {
      password: hashedPassword,
    });
    await this.otpService.deleteOtp(dto.otpId, OtpActions.ResetPassword);

    return success('password reset successful');
  }

  async getAccessToken(dto: GetAccessTokenDto) {
    let decoded = this.verifyToken<JwtPayloadDto>(dto.refreshToken);

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('invalid token type');
    }

    const user = await this.userService.findUser({ id: decoded.id });

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      throw new UnauthorizedException('invalid token');
    }

    const updatedUser = await this.userService.incrementTokenVersion(user.id);
    const token = await this.getToken(updatedUser);

    return success('access token generated', null, undefined, token);
  }

  async acceptInvite(dto: AcceptInviteDto) {
    let payload: InviteJwtPayload;
    try {
      payload = this.jwtService.verify<InviteJwtPayload>(dto.token);
    } catch {
      throw new UnauthorizedException('invite token is invalid or has expired');
    }

    let user = await this.userService.findUser({ email: payload.email });

    if (!user) {
      if (!dto.firstName || !dto.lastName || !dto.password) {
        throw new BadRequestException(
          'firstName, lastName and password are required to create an account',
        );
      }
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      user = await this.userService.createUser({
        email: payload.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: hashedPassword,
        emailVerified: true,
        status: UserStatus.active,
        role: UserRoles.User,
      });
    }

    await this.memberInviteService.acceptInvite(dto.token, user.id);

    const token = await this.getToken(user);
    const { password: _, ...userData } = user;
    return success('invite accepted successfully', userData, undefined, token);
  }

  async logout(userId: string) {
    await this.userService.incrementTokenVersion(userId);
    return success('logged out successfully');
  }

  private async getToken(user: {
    id: string;
    email: string;
    tokenVersion: number;
  }): Promise<Token> {
    const base = {
      id: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
    };
    return {
      accessToken: this.jwtService.sign(
        { ...base, type: 'access' },
        { expiresIn: '1d' },
      ),
      refreshToken: this.jwtService.sign(
        { ...base, type: 'refresh' },
        { expiresIn: '30d' },
      ),
    };
  }

  private verifyToken<T extends object>(token: string) {
    try {
      return this.jwtService.verify<T>(token);
    } catch {
      throw new UnauthorizedException('invite token is invalid or has expired');
    }
  }
}
