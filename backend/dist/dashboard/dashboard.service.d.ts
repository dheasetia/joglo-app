import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
export declare class DashboardService {
    private prisma;
    private readonly storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    private readonly logger;
    private mapPhotoUrl;
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
            sessionType: string;
            student: {
                fullName: string;
                photoUrl: string | null;
                level: string | null;
                className: string | null;
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
                level: string | null;
                className: string | null;
            };
            teacher: {
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
            sessionType: string;
            student: {
                fullName: string;
                photoUrl: string | null;
                level: string | null;
                className: string | null;
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
                level: string | null;
                className: string | null;
            };
            teacher: {
                fullName: string;
            };
        }[];
    }>;
}
