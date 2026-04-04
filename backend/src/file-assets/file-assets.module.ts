import { Module } from '@nestjs/common';
import { FileAssetsController } from './file-assets.controller';
import { FileAssetsService } from './file-assets.service';
import { StorageModule } from '../storage/storage.module';
import { FileAssetTenantGuard } from './guards/file-asset-tenant.guard';

@Module({
  imports: [StorageModule],
  controllers: [FileAssetsController],
  providers: [FileAssetsService, FileAssetTenantGuard],
})
export class FileAssetsModule {}
