import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(DashboardService.name);

  private async getRecentSessions(teacherId?: string) {
    const queryAll = this.prisma.$queryRaw<Array<{
      id: string;
      sessionDate: Date;
      score: number | null;
      studentName: string | null;
      teacherName: string | null;
    }>>`
      SELECT
        ms."id",
        COALESCE(ms."sessionDate", ms."createdAt", now()) AS "sessionDate",
        ms."score",
        s."fullName" AS "studentName",
        t."fullName" AS "teacherName"
      FROM "MemorizationSession" ms
      LEFT JOIN "Student" s ON s."id" = ms."studentId"
      LEFT JOIN "Teacher" t ON t."id" = ms."teacherId"
      ORDER BY ms."createdAt" DESC
      LIMIT 5
    `;

    const queryByTeacher = this.prisma.$queryRaw<Array<{
      id: string;
      sessionDate: Date;
      score: number | null;
      studentName: string | null;
      teacherName: string | null;
    }>>`
      SELECT
        ms."id",
        COALESCE(ms."sessionDate", ms."createdAt", now()) AS "sessionDate",
        ms."score",
        s."fullName" AS "studentName",
        t."fullName" AS "teacherName"
      FROM "MemorizationSession" ms
      LEFT JOIN "Student" s ON s."id" = ms."studentId"
      LEFT JOIN "Teacher" t ON t."id" = ms."teacherId"
      WHERE ms."teacherId" = ${teacherId ?? ''}
      ORDER BY ms."createdAt" DESC
      LIMIT 5
    `;

    let rows: Array<{
      id: string;
      sessionDate: Date;
      score: number | null;
      studentName: string | null;
      teacherName: string | null;
    }> = [];

    try {
      rows = teacherId ? await queryByTeacher : await queryAll;
    } catch (error) {
      this.logger.error('Failed to load recent sessions for dashboard', error as Error);
      rows = [];
    }

    return rows.map((row) => ({
      id: row.id,
      sessionDate: row.sessionDate,
      score: row.score ?? 0,
      student: { fullName: row.studentName ?? '-' },
      teacher: { fullName: row.teacherName ?? '-' },
    }));
  }

  private async getUpcomingExams(teacherId?: string) {
    const queryAll = this.prisma.$queryRaw<Array<{
      id: string;
      examDate: Date;
      score: number | null;
      resultStatus: string | null;
      studentName: string | null;
    }>>`
      SELECT
        me."id",
        COALESCE(me."examDate", me."createdAt", now()) AS "examDate",
        me."score",
        me."resultStatus"::text AS "resultStatus",
        s."fullName" AS "studentName"
      FROM "MemorizationExam" me
      LEFT JOIN "Student" s ON s."id" = me."studentId"
      ORDER BY me."examDate" DESC
      LIMIT 5
    `;

    const queryByTeacher = this.prisma.$queryRaw<Array<{
      id: string;
      examDate: Date;
      score: number | null;
      resultStatus: string | null;
      studentName: string | null;
    }>>`
      SELECT
        me."id",
        COALESCE(me."examDate", me."createdAt", now()) AS "examDate",
        me."score",
        me."resultStatus"::text AS "resultStatus",
        s."fullName" AS "studentName"
      FROM "MemorizationExam" me
      LEFT JOIN "Student" s ON s."id" = me."studentId"
      WHERE me."teacherId" = ${teacherId ?? ''}
      ORDER BY me."examDate" DESC
      LIMIT 5
    `;

    let rows: Array<{
      id: string;
      examDate: Date;
      score: number | null;
      resultStatus: string | null;
      studentName: string | null;
    }> = [];

    try {
      rows = teacherId ? await queryByTeacher : await queryAll;
    } catch (error) {
      this.logger.error('Failed to load upcoming exams for dashboard', error as Error);
      rows = [];
    }

    return rows.map((row) => ({
      id: row.id,
      examDate: row.examDate,
      score: row.score ?? 0,
      resultStatus: row.resultStatus ?? 'FAILED',
      student: { fullName: row.studentName ?? '-' },
    }));
  }

  async getAdminStats() {
    const totalStudents = await this.prisma.student.count({ where: { isActive: true } });
    const totalTeachers = await this.prisma.teacher.count({ where: { isActive: true } });
    const totalHalaqahs = await this.prisma.halaqah.count({ where: { isActive: true } });
    
    // Get last 7 days sessions count
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentSessionsCount = await this.prisma.memorizationSession.count({
      where: {
        sessionDate: {
          gte: sevenDaysAgo,
        },
      },
    });

    const averageJuz = await this.prisma.student.aggregate({
      where: { isActive: true },
      _avg: { currentJuz: true },
    });

    const recentSessions = await this.getRecentSessions();

    const upcomingExams = await this.getUpcomingExams();

    return {
      totalStudents,
      totalTeachers,
      totalHalaqahs,
      recentSessionsCount,
      averageJuz: averageJuz._avg.currentJuz || 0,
      recentSessions,
      upcomingExams,
    };
  }

  async getTeacherStats(teacherId: string) {
    const halaqahs = await this.prisma.halaqah.findMany({
      where: { teacherId },
      select: { id: true },
    });
    
    const halaqahIds = halaqahs.map(h => h.id);

    const studentCount = await this.prisma.student.count({
      where: {
        halaqahId: { in: halaqahIds },
        isActive: true,
      },
    });

    const sessionCount = await this.prisma.memorizationSession.count({
      where: {
        teacherId,
        sessionDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const recentSessions = await this.getRecentSessions(teacherId);

    const upcomingExams = await this.getUpcomingExams(teacherId);

    return {
      myStudentCount: studentCount,
      sessionsToday: sessionCount,
      myHalaqahCount: halaqahIds.length,
      recentSessions,
      upcomingExams,
    };
  }
}
