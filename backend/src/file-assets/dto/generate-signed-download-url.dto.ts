import { IsOptional, IsString } from 'class-validator';

export class GenerateSignedDownloadUrlDto {
  @IsOptional()
  @IsString()
  tenantId?: string;
}
