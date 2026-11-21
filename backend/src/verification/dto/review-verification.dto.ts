import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '@prisma/client';

export class ReviewVerificationDto {
  @ApiProperty({
    enum: [
      VerificationStatus.VERIFIED,
      VerificationStatus.REJECTED,
      VerificationStatus.NEEDS_RESUBMISSION,
    ],
    example: VerificationStatus.VERIFIED,
  })
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @ApiPropertyOptional({ example: 'Le selfie ne correspond pas aux photos du profil.' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
