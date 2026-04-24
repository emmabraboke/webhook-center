import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsObject, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';
import { EndpointStatus } from '@prisma/client';

export class CreateWebhookEndpointDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  maxRetries?: number;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  customHeaders?: Record<string, string>;
}

export class UpdateWebhookEndpointDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiProperty({ required: false, enum: EndpointStatus })
  @IsEnum(EndpointStatus)
  @IsOptional()
  status?: EndpointStatus;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  maxRetries?: number;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  customHeaders?: Record<string, string>;
}
