import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsDateString } from 'class-validator';
import { ExamType, Recommendation, ExamResultStatus } from '@prisma/client';

export class CreateExamDto {
  @IsDateString()
  @IsNotEmpty()
  examDate: string;

  @IsEnum(ExamType)
  @IsNotEmpty()
  examType: ExamType;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  halaqahId: string;

  @IsInt()
  @IsNotEmpty()
  startPage: number;

  @IsInt()
  @IsNotEmpty()
  endPage: number;

  @IsDateString()
  @IsOptional()
  periodStart?: string;

  @IsDateString()
  @IsOptional()
  periodEnd?: string;

  @IsInt()
  @IsNotEmpty()
  score: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(Recommendation)
  @IsNotEmpty()
  recommendation: Recommendation;

  @IsEnum(ExamResultStatus)
  @IsNotEmpty()
  resultStatus: ExamResultStatus;
}

export class UpdateExamDto {
  @IsDateString()
  @IsOptional()
  examDate?: string;

  @IsEnum(ExamType)
  @IsOptional()
  examType?: ExamType;

  @IsString()
  @IsOptional()
  title?: string;

  @IsInt()
  @IsOptional()
  startPage?: number;

  @IsInt()
  @IsOptional()
  endPage?: number;


  @IsDateString()
  @IsOptional()
  periodStart?: string;

  @IsDateString()
  @IsOptional()
  periodEnd?: string;

  @IsInt()
  @IsOptional()
  score?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(Recommendation)
  @IsOptional()
  recommendation?: Recommendation;

  @IsEnum(ExamResultStatus)
  @IsOptional()
  resultStatus?: ExamResultStatus;
}
