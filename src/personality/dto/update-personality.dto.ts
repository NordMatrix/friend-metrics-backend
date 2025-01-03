import { IsNumber, Min, Max, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

// MBTI characteristics (-100 to 100)
export class UpdatePersonalityDto {
  @ApiPropertyOptional({ description: 'Extraversion (-100) to Introversion (100)' })
  @IsOptional()
  @IsNumber()
  @Min(-100)
  @Max(100)
  extroversionIntroversion?: number;

  @ApiPropertyOptional({ description: 'Sensing (-100) to Intuition (100)' })
  @IsOptional()
  @IsNumber()
  @Min(-100)
  @Max(100)
  sensingIntuition?: number;

  @ApiPropertyOptional({ description: 'Thinking (-100) to Feeling (100)' })
  @IsOptional()
  @IsNumber()
  @Min(-100)
  @Max(100)
  thinkingFeeling?: number;

  @ApiPropertyOptional({ description: 'Judging (-100) to Perceiving (100)' })
  @IsOptional()
  @IsNumber()
  @Min(-100)
  @Max(100)
  judgingPerceiving?: number;

  // Big Five characteristics (0 to 100)
  @ApiPropertyOptional({ description: 'Openness score (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  openness?: number;

  @ApiPropertyOptional({ description: 'Conscientiousness score (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  conscientiousness?: number;

  @ApiPropertyOptional({ description: 'Extraversion score (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  extraversion?: number;

  @ApiPropertyOptional({ description: 'Agreeableness score (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  agreeableness?: number;

  @ApiPropertyOptional({ description: 'Neuroticism score (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  neuroticism?: number;
} 