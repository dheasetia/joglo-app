import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateHalaqahDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  teacherId: string;
}

export class UpdateHalaqahDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  teacherId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
