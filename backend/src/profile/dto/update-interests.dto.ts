import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInterestsDto {
  @ApiProperty({ example: ['Sport', 'Voyage', 'Technologie'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  interestNames: string[];
}
