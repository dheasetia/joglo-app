import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
import { SessionNoteType, UserRole } from '@prisma/client';
export declare class MemorizationSessionsService {
    private prisma;
    constructor(prisma: PrismaService);
    private isSessionNoteTableMissing;
    private isSessionNoteSchemaNotReady;
    private buildDateRange;
    private withDetailsInclude;
    private withBasicInclude;
    private findManyWithSafeInclude;
    private findUniqueWithSafeInclude;
    private withNoteSummary;
    create(teacherId: string, dto: CreateSessionDto): Promise<any>;
    findAll(): Promise<({
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
        halaqah: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            teacherId: string;
        };
        student: {
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
        };
    } & {
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
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    })[]>;
    findByDate(date: string, options?: {
        studentId?: string;
        teacherId?: string;
    }): Promise<({
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
        halaqah: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            teacherId: string;
        };
        student: {
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
        };
    } & {
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
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    })[]>;
    findOne(id: string): Promise<{
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
        halaqah: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            teacherId: string;
        };
        student: {
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
        };
    } & {
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
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    }>;
    findByStudent(studentId: string): Promise<({
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
        halaqah: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            teacherId: string;
        };
        student: {
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
        };
    } & {
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
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    })[]>;
    findByTeacher(teacherId: string, studentId?: string): Promise<({
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
        halaqah: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            teacherId: string;
        };
        student: {
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
        };
    } & {
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
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    })[]>;
    update(id: string, dto: UpdateSessionDto): Promise<any>;
    createNote(sessionId: string, dto: {
        noteType: SessionNoteType;
        page: number;
        line: number;
        description: string;
    }): Promise<{
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
        halaqah: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            teacherId: string;
        };
        student: {
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
        };
    } & {
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
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    }>;
    remove(id: string, requesterRole: UserRole, teacherId?: string): Promise<{
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
    }>;
    private updateStudentProgress;
}
