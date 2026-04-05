import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getStudentProgress(studentId: string): Promise<{
        halaqah: {
            teacher: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                fullName: string;
                phone: string | null;
                notes: string | null;
                userId: string;
            };
        } & {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            teacherId: string;
        };
        sessions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            teacherId: string;
            halaqahId: string;
            sessionDate: Date;
            sessionType: import("@prisma/client").$Enums.SessionType;
            studentId: string;
            startPage: number | null;
            endPage: number | null;
            score: number;
            recommendation: import("@prisma/client").$Enums.Recommendation;
            isApprovedForNextStep: boolean | null;
            totalPages: number | null;
        }[];
        exams: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            teacherId: string;
            halaqahId: string;
            studentId: string;
            startPage: number | null;
            endPage: number | null;
            score: number;
            recommendation: import("@prisma/client").$Enums.Recommendation;
            examDate: Date;
            examType: import("@prisma/client").$Enums.ExamType;
            title: string | null;
            periodStart: Date | null;
            periodEnd: Date | null;
            resultStatus: import("@prisma/client").$Enums.ExamResultStatus;
            startJuz: number | null;
            endJuz: number | null;
        }[];
    } & {
        id: string;
        photoUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        nis: string | null;
        gender: import("@prisma/client").$Enums.Gender;
        level: string | null;
        className: string | null;
        halaqahId: string;
        currentJuz: number;
        currentPage: number | null;
        lastMemorizedPage: number | null;
        totalMemorizedPages: number;
    }>;
    getHalaqahReport(halaqahId: string): Promise<{
        teacher: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            phone: string | null;
            notes: string | null;
            userId: string;
        };
        students: ({
            _count: {
                sessions: number;
            };
        } & {
            id: string;
            photoUrl: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            nis: string | null;
            gender: import("@prisma/client").$Enums.Gender;
            level: string | null;
            className: string | null;
            halaqahId: string;
            currentJuz: number;
            currentPage: number | null;
            lastMemorizedPage: number | null;
            totalMemorizedPages: number;
        })[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        teacherId: string;
    }>;
}
