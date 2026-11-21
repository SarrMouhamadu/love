import { IsOptional, IsArray, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiPropertyOptional({
    example: ['wave', 'orange_money'],
    description: 'Moyens de paiement acceptés via NabooPay (wave, orange_money)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  paymentMethods?: string[];

  @ApiPropertyOptional({ example: '+221770000000' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
