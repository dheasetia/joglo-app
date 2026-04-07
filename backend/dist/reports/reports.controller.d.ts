import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsController {
    private readonly reportsService;
    private prisma;
    constructor(reportsService: ReportsService, prisma: PrismaService);
    getStudentProgress(user: any, id: string): Promise<{
        totalMemorizedPages: number;
        lastMemorizedPage: number | null;
        halaqah: {
            teacher: {
                user: {
                    photoUrl: string | null;
                };
            } & {
                id: string;
                fullName: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                notes: string | null;
                userId: string;
                phone: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            teacherId: string;
            description: string | null;
        };
        sessions: {
            id: string;
            halaqahId: string;
            createdAt: Date;
            updatedAt: Date;
            sessionDate: Date;
            studentId: string;
            sessionType: import("@prisma/client").$Enums.SessionType;
            recommendation: import("@prisma/client").$Enums.Recommendation;
            totalPages: number | null;
            endPage: number | null;
            startPage: number | null;
            score: number;
            teacherId: string;
            notes: string | null;
            isApprovedForNextStep: boolean | null;
        }[];
        exams: {
            id: string;
            halaqahId: string;
            createdAt: Date;
            updatedAt: Date;
            examDate: Date;
            studentId: string;
            recommendation: import("@prisma/client").$Enums.Recommendation;
            endPage: number | null;
            startPage: number | null;
            score: number;
            teacherId: string;
            notes: string | null;
            examType: import("@prisma/client").$Enums.ExamType;
            title: string | null;
            startJuz: number | null;
            endJuz: number | null;
            periodStart: Date | null;
            periodEnd: Date | null;
            resultStatus: import("@prisma/client").$Enums.ExamResultStatus;
        }[];
        id: string;
        nis: string | null;
        fullName: string;
        photoUrl: string | null;
        gender: import("@prisma/client").$Enums.Gender;
        level: string | null;
        className: string | null;
        halaqahId: string;
        isActive: boolean;
        currentJuz: number;
        currentPage: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getHalaqahReport(user: any, id: string): Promise<{
        teacher: {
            user: {
                photoUrl: string | null;
            };
        } & {
            id: string;
            fullName: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            userId: string;
            phone: string | null;
        };
        students: {
            id: string;
            nis: string | null;
            fullName: string;
            photoUrl: string | null;
            currentJuz: number;
            _count: {
                sessions: number;
            };
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        teacherId: string;
        description: string | null;
    }>;
}
