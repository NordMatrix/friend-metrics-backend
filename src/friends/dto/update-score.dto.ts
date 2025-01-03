import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScoreDto {
  @ApiProperty({ description: 'Change in relationship score (-100 to 100)' })
  @IsNumber()
  @Min(-100)
  @Max(100)
  scoreChange: number;
} 