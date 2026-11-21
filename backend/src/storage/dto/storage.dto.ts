import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PresignedUrlDto {
  @ApiProperty({ example: 'photo_avatar.jpg' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  @IsNotEmpty()
  fileType: string;

  @ApiProperty({ enum: ['profiles', 'verification', 'chat'], example: 'profiles' })
  @IsString()
  @IsIn(['profiles', 'verification', 'chat'])
  folder: 'profiles' | 'verification' | 'chat';
}
