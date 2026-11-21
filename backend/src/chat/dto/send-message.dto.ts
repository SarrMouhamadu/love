import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AttachmentDto {
  @ApiProperty({ example: 'https://storage.example.com/chat/audio_123.mp3' })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({ example: 'audio', enum: ['image', 'audio'] })
  @IsString()
  @IsNotEmpty()
  fileType: string;

  @ApiPropertyOptional({ example: 12, description: 'Durée en secondes pour une note vocale' })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;
}

export class SendMessageDto {
  @ApiProperty({ example: 'uuid-of-conversation' })
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @ApiPropertyOptional({ example: 'Bonjour ! Comment vas-tu ?' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ type: [AttachmentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}
