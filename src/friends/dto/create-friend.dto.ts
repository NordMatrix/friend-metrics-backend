import { IsString, IsOptional } from 'class-validator';

export class CreateFriendDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  notes?: string;
} 