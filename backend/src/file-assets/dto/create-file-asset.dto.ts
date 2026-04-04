import { FileVisibility } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateFileAssetDto {
  @IsString()
  originalName: string;

  @IsString()
  key: string;

  @IsString()
  bucket: string;

  @IsString()
  mimeType: string;

  @IsInt()
  @Min(1)
  size: number;

  @IsOptional()
  @IsEnum(FileVisibility)
  visibility?: FileVisibility;

  @IsString()
  module: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsString()
  studentId?: string;
}
