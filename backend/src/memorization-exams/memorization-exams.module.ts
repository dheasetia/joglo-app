import { Module } from '@nestjs/common';
import { MemorizationExamsService } from './memorization-exams.service';
import { MemorizationExamsController } from './memorization-exams.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [MemorizationExamsService],
  controllers: [MemorizationExamsController]
})
export class MemorizationExamsModule {}
