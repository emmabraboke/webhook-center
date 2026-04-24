import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateWebhookSourceDto {
  @ApiProperty({ example: 'Stripe Production' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateWebhookSourceDto {
  @ApiProperty({ example: 'Stripe Staging' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
