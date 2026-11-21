import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LikeDto {
  @ApiProperty({ example: 'uuid-of-user-to-like' })
  @IsString()
  @IsNotEmpty()
  targetUserId: string;
}

export class PassDto {
  @ApiProperty({ example: 'uuid-of-user-to-pass' })
  @IsString()
  @IsNotEmpty()
  targetUserId: string;
}

export class RewindDto {
  @ApiProperty({ example: 'uuid-of-user-to-rewind' })
  @IsString()
  @IsNotEmpty()
  targetUserId: string;
}
