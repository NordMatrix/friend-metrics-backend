import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateFriendDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  relationshipScore?: number;
}
