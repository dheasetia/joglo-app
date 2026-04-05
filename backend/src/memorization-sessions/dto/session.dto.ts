import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsDateString, IsBoolean, Min, Max } from 'class-validator';
import { SessionType, Recommendation, SessionNoteType } from '@prisma/client';

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

export class CreateSessionNoteDto {
  @IsEnum(SessionNoteType)
  noteType: SessionNoteType;

  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  @Max(15)
  line: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
