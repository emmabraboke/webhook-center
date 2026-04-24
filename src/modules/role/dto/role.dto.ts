import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Permission } from '@prisma/client';

export class CreateRoleDto {
  @ApiProperty({ example: 'Developer' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: Permission, isArray: true, example: ['manage_endpoints', 'send_events'] })
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}

export class UpdateRoleDto {
  @ApiPropertyOptional({ example: 'Senior Developer' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: Permission, isArray: true, example: ['manage_endpoints'] })
  @IsArray()
  @IsEnum(Permission, { each: true })
  @IsOptional()
  permissions?: Permission[];
}
