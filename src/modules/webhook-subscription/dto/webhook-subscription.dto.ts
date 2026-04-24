import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateWebhookSubscriptionDto {
  @ApiProperty({ example: 'Payments Delivery' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  endpointId: string;
}
