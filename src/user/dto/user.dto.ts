import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
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
