import { FileVisibility } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreatePresignedUploadUrlDto {
  @IsString()
  fileName: string;

  @IsString()
  contentType: string;

  @IsString()
  module: string;

  @IsString()
  folder: string;

  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50 * 1024 * 1024)
  size?: number;

  @IsOptional()
  @IsEnum(FileVisibility)
  visibility?: FileVisibility;
}
