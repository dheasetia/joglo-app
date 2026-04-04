import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { FileAssetsService } from './file-assets.service';
import { CreatePresignedUploadUrlDto } from './dto/create-presigned-upload-url.dto';
import { CreateFileAssetDto } from './dto/create-file-asset.dto';
import { GenerateSignedDownloadUrlDto } from './dto/generate-signed-download-url.dto';
import { FileAssetTenantGuard } from './guards/file-asset-tenant.guard';

@UseGuards(JwtGuard, FileAssetTenantGuard)
@Controller('file-assets')
export class FileAssetsController {
  constructor(private readonly fileAssetsService: FileAssetsService) {}

  @Post('presigned-upload-url')
  createPresignedUploadUrl(@Body() dto: CreatePresignedUploadUrlDto, @Req() req: any) {
    return this.fileAssetsService.createPresignedUploadUrl(dto, req.user);
  }

  @Post()
  createMetadata(@Body() dto: CreateFileAssetDto, @Req() req: any) {
    return this.fileAssetsService.saveMetadata(dto, req.user);
  }

  @Get(':id/signed-download-url')
  createSignedDownloadUrl(
    @Param('id') id: string,
    @Query() query: GenerateSignedDownloadUrlDto,
    @Req() req: any,
  ) {
    return this.fileAssetsService.generateSignedDownloadUrl(id, query.tenantId, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.fileAssetsService.remove(id, req.user);
  }
}
