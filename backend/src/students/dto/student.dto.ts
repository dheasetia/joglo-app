import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsBoolean } from 'class-validator';
import { Gender } from '@prisma/client';

export class CreateStudentDto {
  @IsString()
  @IsOptional()
  nis?: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  className?: string;

  @IsString()
  @IsNotEmpty()
  halaqahId: string;
}

export class UpdateStudentDto {
  @IsString()
  @IsOptional()
  nis?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  className?: string;

  @IsString()
  @IsOptional()
  halaqahId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @IsOptional()
  currentJuz?: number;

  @IsInt()
  @IsOptional()
  currentPage?: number;

  @IsInt()
  @IsOptional()
  lastMemorizedPage?: number;

  @IsInt()
  @IsOptional()
  totalMemorizedPages?: number;
}
