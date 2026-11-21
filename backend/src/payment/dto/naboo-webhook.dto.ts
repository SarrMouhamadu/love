import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NabooWebhookDto {
  @ApiProperty({ example: 'nb_order_abc123' })
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @ApiPropertyOptional({ example: 'paid' })
  @IsOptional()
  @IsString()
  transaction_status?: string;

  @ApiPropertyOptional({ example: 'paid' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  total_amount?: number;
}
