import { IsString, IsNumber, IsOptional, IsObject, IsEnum } from 'class-validator';
import { InteractionTypes, InteractionType } from '../constants/interaction-types';

export class CreateInteractionDto {
  @IsEnum(InteractionTypes)
  type: InteractionType;

  @IsNumber()
  scoreChange: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 