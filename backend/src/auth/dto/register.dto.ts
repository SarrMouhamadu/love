import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Adresse email invalide' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'MotDePasseFort123!' })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit comporter au moins 8 caractères' })
  password: string;

  @ApiProperty({ example: 'Amadou' })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({ example: '2000-01-15' })
  @IsDateString({}, { message: 'Date de naissance invalide (AAAA-MM-JJ)' })
  birthDate: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender, { message: 'Genre invalide' })
  gender: Gender;

  @ApiPropertyOptional({ example: 'Dakar' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  marketingConsent?: boolean;
}
