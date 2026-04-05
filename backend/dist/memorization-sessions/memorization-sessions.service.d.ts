import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
import { UserRole } from '@prisma/client';
export declare class MemorizationSessionsService {
    private prisma;
    constructor(prisma: PrismaService);
    private buildDateRange;
    create(teacherId: string, dto: CreateSessionDto): Promise<{
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            halaqahId: string;
            nis: string | null;
            fullName: string;
            photoUrl: string | null;
            gender: import("@prisma/client").$Enums.Gender;
            level: string | null;
            className: string | null;
            isActive: boolean;
            currentJuz: number;
            currentPage: number | null;
            lastMemorizedPage: number | null;
            totalMemorizedPages: number;
        };
        teacher: {
            id: string;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            isActive: boolean;
            userId: string;
            phone: string | null;
        };
    } & {
        id: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        teacherId: string;
        halaqahId: string;
    }>;
    findAll(): Promise<({
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            halaqahId: string;
            nis: string | null;
            fullName: string;
            photoUrl: string | null;
            gender: import("@prisma/client").$Enums.Gender;
            level: string | null;
            className: string | null;
            isActive: boolean;
            currentJuz: number;
            currentPage: number | null;
            lastMemorizedPage: number | null;
            totalMemorizedPages: number;
        };
        teacher: {
            id: string;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            isActive: boolean;
            userId: string;
            phone: string | null;
        };
        halaqah: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            teacherId: string;
            name: string;
            isActive: boolean;
            description: string | null;
        };
    } & {
        id: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        teacherId: string;
        halaqahId: string;
    })[]>;
    findByDate(date: string, options?: {
        studentId?: string;
        teacherId?: string;
    }): Promise<({
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            halaqahId: string;
            nis: string | null;
            fullName: string;
            photoUrl: string | null;
            gender: import("@prisma/client").$Enums.Gender;
            level: string | null;
            className: string | null;
            isActive: boolean;
            currentJuz: number;
            currentPage: number | null;
            lastMemorizedPage: number | null;
            totalMemorizedPages: number;
        };
        teacher: {
            id: string;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            isActive: boolean;
            userId: string;
            phone: string | null;
        };
        halaqah: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            teacherId: string;
            name: string;
            isActive: boolean;
            description: string | null;
        };
    } & {
        id: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        teacherId: string;
        halaqahId: string;
    })[]>;
    findOne(id: string): Promise<{
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            halaqahId: string;
            nis: string | null;
            fullName: string;
            photoUrl: string | null;
            gender: import("@prisma/client").$Enums.Gender;
            level: string | null;
            className: string | null;
            isActive: boolean;
            currentJuz: number;
            currentPage: number | null;
            lastMemorizedPage: number | null;
            totalMemorizedPages: number;
        };
        teacher: {
            id: string;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            isActive: boolean;
            userId: string;
            phone: string | null;
        };
        halaqah: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            teacherId: string;
            name: string;
            isActive: boolean;
            description: string | null;
        };
    } & {
        id: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        teacherId: string;
        halaqahId: string;
    }>;
    findByStudent(studentId: string): Promise<({
        teacher: {
            id: string;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            isActive: boolean;
            userId: string;
            phone: string | null;
        };
        halaqah: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            teacherId: string;
            name: string;
            isActive: boolean;
            description: string | null;
        };
    } & {
        id: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        teacherId: string;
        halaqahId: string;
    })[]>;
    update(id: string, dto: UpdateSessionDto): Promise<{
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            halaqahId: string;
            nis: string | null;
            fullName: string;
            photoUrl: string | null;
            gender: import("@prisma/client").$Enums.Gender;
            level: string | null;
            className: string | null;
            isActive: boolean;
            currentJuz: number;
            currentPage: number | null;
            lastMemorizedPage: number | null;
            totalMemorizedPages: number;
        };
        teacher: {
            id: string;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            isActive: boolean;
            userId: string;
            phone: string | null;
        };
    } & {
        id: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        teacherId: string;
        halaqahId: string;
    }>;
    remove(id: string, requesterRole: UserRole, teacherId?: string): Promise<{
        id: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        teacherId: string;
        halaqahId: string;
    }>;
    private updateStudentProgress;
}
