import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class IngestEventDto {
  @ApiProperty({ example: 'payment.success' })
  @IsString()
  eventType: string;

  @ApiProperty({ example: { amount: 1000, currency: 'USD', customerId: 'cus_123' } })
  @IsObject()
  payload: Record<string, unknown>;
}
