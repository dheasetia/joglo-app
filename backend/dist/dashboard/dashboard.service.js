"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DashboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = DashboardService_1 = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    logger = new common_1.Logger(DashboardService_1.name);
    async getRecentSessions(teacherId) {
        const queryAll = this.prisma.$queryRaw `
      SELECT
        ms."id",
        COALESCE(ms."sessionDate", ms."createdAt", now()) AS "sessionDate",
        ms."score",
        ms."sessionType"::text AS "sessionType",
        s."fullName" AS "studentName",
        t."fullName" AS "teacherName"
      FROM "MemorizationSession" ms
      LEFT JOIN "Student" s ON s."id" = ms."studentId"
      LEFT JOIN "Teacher" t ON t."id" = ms."teacherId"
      ORDER BY ms."createdAt" DESC
      LIMIT 5
    `;
        const queryByTeacher = this.prisma.$queryRaw `
      SELECT
        ms."id",
        COALESCE(ms."sessionDate", ms."createdAt", now()) AS "sessionDate",
        ms."score",
        ms."sessionType"::text AS "sessionType",
        s."fullName" AS "studentName",
        t."fullName" AS "teacherName"
      FROM "MemorizationSession" ms
      LEFT JOIN "Student" s ON s."id" = ms."studentId"
      LEFT JOIN "Teacher" t ON t."id" = ms."teacherId"
      WHERE ms."teacherId" = ${teacherId ?? ''}
      ORDER BY ms."createdAt" DESC
      LIMIT 5
    `;
        let rows = [];
        try {
            rows = teacherId ? await queryByTeacher : await queryAll;
        }
        catch (error) {
            this.logger.error('Failed to load recent sessions for dashboard', error);
            rows = [];
        }
        return rows.map((row) => ({
            id: row.id,
            sessionDate: row.sessionDate,
            score: row.score ?? 0,
            sessionType: row.sessionType ?? '-',
            student: { fullName: row.studentName ?? '-' },
            teacher: { fullName: row.teacherName ?? '-' },
        }));
    }
    async getUpcomingExams(teacherId) {
        const queryAll = this.prisma.$queryRaw `
      SELECT
        me."id",
        COALESCE(me."examDate", me."createdAt", now()) AS "examDate",
        me."score",
        me."resultStatus"::text AS "resultStatus",
        me."examType"::text AS "examType",
        s."fullName" AS "studentName",
        t."fullName" AS "teacherName"
      FROM "MemorizationExam" me
      LEFT JOIN "Student" s ON s."id" = me."studentId"
      LEFT JOIN "Teacher" t ON t."id" = me."teacherId"
      ORDER BY me."examDate" DESC
      LIMIT 5
    `;
        const queryByTeacher = this.prisma.$queryRaw `
      SELECT
        me."id",
        COALESCE(me."examDate", me."createdAt", now()) AS "examDate",
        me."score",
        me."resultStatus"::text AS "resultStatus",
        me."examType"::text AS "examType",
        s."fullName" AS "studentName",
        t."fullName" AS "teacherName"
      FROM "MemorizationExam" me
      LEFT JOIN "Student" s ON s."id" = me."studentId"
      LEFT JOIN "Teacher" t ON t."id" = me."teacherId"
      WHERE me."teacherId" = ${teacherId ?? ''}
      ORDER BY me."examDate" DESC
      LIMIT 5
    `;
        let rows = [];
        try {
            rows = teacherId ? await queryByTeacher : await queryAll;
        }
        catch (error) {
            this.logger.error('Failed to load upcoming exams for dashboard', error);
            rows = [];
        }
        return rows.map((row) => ({
            id: row.id,
            examDate: row.examDate,
            score: row.score ?? 0,
            resultStatus: row.resultStatus ?? 'FAILED',
            examType: row.examType ?? '-',
            student: { fullName: row.studentName ?? '-' },
            teacher: { fullName: row.teacherName ?? '-' },
        }));
    }
    async getAdminStats() {
        const totalStudents = await this.prisma.student.count({ where: { isActive: true } });
        const totalTeachers = await this.prisma.teacher.count({ where: { isActive: true } });
        const totalHalaqahs = await this.prisma.halaqah.count({ where: { isActive: true } });
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
    async getTeacherStats(teacherId) {
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = DashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map