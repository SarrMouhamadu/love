import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitVerificationDto {
  @ApiProperty({ example: 'https://storage.example.com/verification/selfie1.jpg' })
  @IsString()
  @IsNotEmpty()
  selfie1Url: string;

  @ApiProperty({ example: 'Tournez la tête vers la droite' })
  @IsString()
  @IsNotEmpty()
  selfie1Instruction: string;

  @ApiProperty({ example: 'https://storage.example.com/verification/selfie2.jpg' })
  @IsString()
  @IsNotEmpty()
  selfie2Url: string;

  @ApiProperty({ example: 'Faites un signe de la main' })
  @IsString()
  @IsNotEmpty()
  selfie2Instruction: string;

  @ApiProperty({ example: 'https://storage.example.com/verification/audio.mp3' })
  @IsString()
  @IsNotEmpty()
  audioUrl: string;

  @ApiProperty({ example: 'Je certifie être le titulaire du compte Anonyme Pro [Code: 8492]' })
  @IsString()
  @IsNotEmpty()
  audioPhrase: string;
}
