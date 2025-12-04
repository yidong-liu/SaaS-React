import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  planId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  metadata?: Record<string, any>;
}
