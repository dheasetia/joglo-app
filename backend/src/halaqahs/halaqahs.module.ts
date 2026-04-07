import { Module } from '@nestjs/common';
import { HalaqahsService } from './halaqahs.service';
import { HalaqahsController } from './halaqahs.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [HalaqahsService],
  controllers: [HalaqahsController]
})
export class HalaqahsModule {}
