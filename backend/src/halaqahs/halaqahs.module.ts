import { Module } from '@nestjs/common';
import { HalaqahsService } from './halaqahs.service';
import { HalaqahsController } from './halaqahs.controller';

@Module({
  providers: [HalaqahsService],
  controllers: [HalaqahsController]
})
export class HalaqahsModule {}
