import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportReason } from '@prisma/client';

export class BlockUserDto {
  @ApiProperty({ example: 'uuid-of-user-to-block' })
  @IsString()
  @IsNotEmpty()
  blockedUserId: string;
}

export class ReportUserDto {
  @ApiProperty({ example: 'uuid-of-user-to-report' })
  @IsString()
  @IsNotEmpty()
  reportedUserId: string;

  @ApiProperty({ enum: ReportReason, example: ReportReason.HARASSMENT })
  @IsEnum(ReportReason)
  reason: ReportReason;

  @ApiPropertyOptional({ example: 'Comportement irrespectueux et messages inappropriés.' })
  @IsOptional()
  @IsString()
  details?: string;
}
