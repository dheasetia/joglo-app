import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeachersModule } from './teachers/teachers.module';
import { HalaqahsModule } from './halaqahs/halaqahs.module';
import { StudentsModule } from './students/students.module';
import { MemorizationSessionsModule } from './memorization-sessions/memorization-sessions.module';
import { MemorizationExamsModule } from './memorization-exams/memorization-exams.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { StorageModule } from './storage/storage.module';
import { FileAssetsModule } from './file-assets/file-assets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TeachersModule,
    HalaqahsModule,
    StudentsModule,
    MemorizationSessionsModule,
    MemorizationExamsModule,
    DashboardModule,
    ReportsModule,
    StorageModule,
    FileAssetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
