import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    private readonly logger;
    private getRecentSessions;
    private getUpcomingExams;
    getAdminStats(): Promise<{
        totalStudents: number;
        totalTeachers: number;
        totalHalaqahs: number;
        recentSessionsCount: number;
        averageJuz: number;
        recentSessions: {
            id: string;
            sessionDate: Date;
            score: number;
            student: {
                fullName: string;
            };
            teacher: {
                fullName: string;
            };
        }[];
        upcomingExams: {
            id: string;
            examDate: Date;
            score: number;
            resultStatus: string;
            student: {
                fullName: string;
            };
        }[];
    }>;
    getTeacherStats(teacherId: string): Promise<{
        myStudentCount: number;
        sessionsToday: number;
        myHalaqahCount: number;
        recentSessions: {
            id: string;
            sessionDate: Date;
            score: number;
            student: {
                fullName: string;
            };
            teacher: {
                fullName: string;
            };
        }[];
        upcomingExams: {
            id: string;
            examDate: Date;
            score: number;
            resultStatus: string;
            student: {
                fullName: string;
            };
        }[];
    }>;
}
