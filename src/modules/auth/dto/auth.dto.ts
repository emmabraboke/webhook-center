import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OtpActions } from 'src/common/enum/otp-actions.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional()
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otpId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class ResendOtpDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: OtpActions })
  @IsEnum(OtpActions)
  action: OtpActions;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otpId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class GetAccessTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class AcceptInviteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(3)
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(3)
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
