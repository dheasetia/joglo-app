import { Module } from '@nestjs/common';
import { MemorizationSessionsService } from './memorization-sessions.service';
import { MemorizationSessionsController } from './memorization-sessions.controller';

@Module({
  providers: [MemorizationSessionsService],
  controllers: [MemorizationSessionsController]
})
export class MemorizationSessionsModule {}
