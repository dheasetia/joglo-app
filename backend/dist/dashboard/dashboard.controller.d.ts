import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardController {
    private readonly dashboardService;
    private prismaService;
    constructor(dashboardService: DashboardService, prismaService: PrismaService);
    getStats(user: any): Promise<{
        totalStudents: number;
        totalTeachers: number;
        totalHalaqahs: number;
        recentSessionsCount: number;
        averageJuz: number;
        recentSessions: {
            id: string;
            sessionDate: Date;
            score: number;
            sessionType: string;
            student: {
                fullName: string;
                photoUrl: string | null;
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
            examType: string;
            student: {
                fullName: string;
                photoUrl: string | null;
            };
            teacher: {
                fullName: string;
            };
        }[];
    } | {
        myStudentCount: number;
        sessionsToday: number;
        myHalaqahCount: number;
        recentSessions: {
            id: string;
            sessionDate: Date;
            score: number;
            sessionType: string;
            student: {
                fullName: string;
                photoUrl: string | null;
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
            examType: string;
            student: {
                fullName: string;
                photoUrl: string | null;
            };
            teacher: {
                fullName: string;
            };
        }[];
    }>;
}
