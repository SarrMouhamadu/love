import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportStatus, UserStatus } from '@prisma/client';

export class ActionReportDto {
  @ApiProperty({ enum: ReportStatus, example: ReportStatus.ACTIONED })
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @ApiPropertyOptional({ example: 'Compte suspendu pour propos abusifs confirmés.' })
  @IsOptional()
  @IsString()
  actionNotes?: string;

  @ApiPropertyOptional({ example: false, description: 'Bannir l utilisateur signalé' })
  @IsOptional()
  @IsBoolean()
  banUser?: boolean;
}

export class UpdateUserStatusDto {
  @ApiProperty({ enum: UserStatus, example: UserStatus.SUSPENDED })
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiPropertyOptional({ example: 'Signalement répété pour spam' })
  @IsOptional()
  @IsString()
  reason?: string;
}
