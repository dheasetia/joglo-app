import { Module } from '@nestjs/common';
import { MemorizationSessionsService } from './memorization-sessions.service';
import { MemorizationSessionsController } from './memorization-sessions.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [MemorizationSessionsService],
  controllers: [MemorizationSessionsController]
})
export class MemorizationSessionsModule {}
