import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
  status: UserStatus;
  emailVerified: boolean;
  tokenVersion: number;
}

export class GetUserQueryDto {
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  page: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  size: string;
}
