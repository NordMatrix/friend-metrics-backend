import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// MBTI characteristics (-100 to 100)
export class CreatePersonalityDto {
  @ApiProperty({ description: 'Extraversion (-100) to Introversion (100)' })
  @IsNumber()
  @Min(-100)
  @Max(100)
  extroversionIntroversion: number;

  @ApiProperty({ description: 'Sensing (-100) to Intuition (100)' })
  @IsNumber()
  @Min(-100)
  @Max(100)
  sensingIntuition: number;

  @ApiProperty({ description: 'Thinking (-100) to Feeling (100)' })
  @IsNumber()
  @Min(-100)
  @Max(100)
  thinkingFeeling: number;

  @ApiProperty({ description: 'Judging (-100) to Perceiving (100)' })
  @IsNumber()
  @Min(-100)
  @Max(100)
  judgingPerceiving: number;

  // Big Five characteristics (0 to 100)
  @ApiProperty({ description: 'Openness score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  openness: number;

  @ApiProperty({ description: 'Conscientiousness score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  conscientiousness: number;

  @ApiProperty({ description: 'Extraversion score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  extraversion: number;

  @ApiProperty({ description: 'Agreeableness score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  agreeableness: number;

  @ApiProperty({ description: 'Neuroticism score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  neuroticism: number;
}
