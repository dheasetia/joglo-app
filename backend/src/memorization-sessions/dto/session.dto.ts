import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsDateString, IsBoolean } from 'class-validator';
import { SessionType, Recommendation } from '@prisma/client';

export class CreateSessionDto {
  @IsDateString()
  @IsNotEmpty()
  sessionDate: string;

  @IsEnum(SessionType)
  sessionType: SessionType;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  halaqahId: string;

  @IsInt()
  @IsOptional()
  startPage?: number;

  @IsInt()
  @IsOptional()
  endPage?: number;

  @IsInt()
  @IsNotEmpty()
  score: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(Recommendation)
  recommendation: Recommendation;

  @IsBoolean()
  @IsOptional()
  isApprovedForNextStep?: boolean;
}

export class UpdateSessionDto {
  @IsDateString()
  @IsOptional()
  sessionDate?: string;

  @IsEnum(SessionType)
  @IsOptional()
  sessionType?: SessionType;

  @IsInt()
  @IsOptional()
  startPage?: number;

  @IsInt()
  @IsOptional()
  endPage?: number;

  @IsInt()
  @IsOptional()
  score?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(Recommendation)
  @IsOptional()
  recommendation?: Recommendation;

  @IsBoolean()
  @IsOptional()
  isApprovedForNextStep?: boolean;
}
