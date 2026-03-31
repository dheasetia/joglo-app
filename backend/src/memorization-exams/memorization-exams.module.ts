import { Module } from '@nestjs/common';
import { MemorizationExamsService } from './memorization-exams.service';
import { MemorizationExamsController } from './memorization-exams.controller';

@Module({
  providers: [MemorizationExamsService],
  controllers: [MemorizationExamsController]
})
export class MemorizationExamsModule {}
