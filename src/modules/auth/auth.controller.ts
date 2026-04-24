import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import {
  ApiCreatedResponse,
  ApiTokenResponse,
} from 'src/common/swagger/api-responses';
import { AuthService } from './auth.service';
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
import { userExample } from './auth.examples';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiTokenResponse('sign up successful', { ...userExample, otpId: 'otp_abc123xyz' })
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto);
  }

  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiTokenResponse('login successful', userExample)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Verify email address with OTP' })
  @ApiCreatedResponse('email verified successfully')
  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @ApiOperation({ summary: 'Resend OTP to email' })
  @ApiCreatedResponse('otp resent successfully', { otpId: 'otp_abc123xyz' })
  @Post('resend-otp')
  resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto);
  }

  @ApiOperation({ summary: 'Request a password reset OTP' })
  @ApiCreatedResponse('otp sent to email', { otpId: 'otp_abc123xyz' })
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiCreatedResponse('password reset successful')
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @ApiOperation({ summary: 'Exchange refresh token for a new access token' })
  @ApiCreatedResponse('access token generated', {
    accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzEifQ.sig',
  })
  @Post('refresh')
  getAccessToken(@Body() dto: GetAccessTokenDto) {
    return this.authService.getAccessToken(dto);
  }

  @ApiOperation({ summary: 'Accept a business member invite' })
  @ApiTokenResponse('invite accepted successfully', userExample)
  @Post('accept-invite')
  acceptInvite(@Body() dto: AcceptInviteDto) {
    return this.authService.acceptInvite(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log out and invalidate all existing JWTs' })
  @ApiCreatedResponse('logged out successfully')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

}