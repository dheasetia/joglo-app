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
        student: {
            id: string;
            halaqahId: string;
            createdAt: Date;
            updatedAt: Date;
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
            teacherId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
        };
    } & {
        sessionDate: Date;
        id: string;
        sessionType: import("@prisma/client").$Enums.SessionType;
        studentId: string;
        teacherId: string;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
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
        student: {
            id: string;
            halaqahId: string;
            createdAt: Date;
            updatedAt: Date;
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
            teacherId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
        };
    } & {
        sessionDate: Date;
        id: string;
        sessionType: import("@prisma/client").$Enums.SessionType;
        studentId: string;
        teacherId: string;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    })[]>;
    findOne(id: string): Promise<{
        student: {
            id: string;
            halaqahId: string;
            createdAt: Date;
            updatedAt: Date;
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
            teacherId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
        };
    } & {
        sessionDate: Date;
        id: string;
        sessionType: import("@prisma/client").$Enums.SessionType;
        studentId: string;
        teacherId: string;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    }>;
    findByStudent(studentId: string): Promise<({
        student: {
            id: string;
            halaqahId: string;
            createdAt: Date;
            updatedAt: Date;
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
            teacherId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
        };
    } & {
        sessionDate: Date;
        id: string;
        sessionType: import("@prisma/client").$Enums.SessionType;
        studentId: string;
        teacherId: string;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    })[]>;
    findByTeacher(teacherId: string, studentId?: string): Promise<({
        student: {
            id: string;
            halaqahId: string;
            createdAt: Date;
            updatedAt: Date;
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
            teacherId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
        };
    } & {
        sessionDate: Date;
        id: string;
        sessionType: import("@prisma/client").$Enums.SessionType;
        studentId: string;
        teacherId: string;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
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
        student: {
            id: string;
            halaqahId: string;
            createdAt: Date;
            updatedAt: Date;
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
            teacherId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
        };
    } & {
        sessionDate: Date;
        id: string;
        sessionType: import("@prisma/client").$Enums.SessionType;
        studentId: string;
        teacherId: string;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    }>;
    updateNote(sessionId: string, noteId: string, dto: {
        noteType?: SessionNoteType;
        page?: number;
        line?: number;
        description?: string;
    }): Promise<{
        student: {
            id: string;
            halaqahId: string;
            createdAt: Date;
            updatedAt: Date;
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
            teacherId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
        };
    } & {
        sessionDate: Date;
        id: string;
        sessionType: import("@prisma/client").$Enums.SessionType;
        studentId: string;
        teacherId: string;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    }>;
    removeNote(sessionId: string, noteId: string): Promise<{
        student: {
            id: string;
            halaqahId: string;
            createdAt: Date;
            updatedAt: Date;
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
            teacherId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
        };
    } & {
        sessionDate: Date;
        id: string;
        sessionType: import("@prisma/client").$Enums.SessionType;
        studentId: string;
        teacherId: string;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    }>;
    remove(id: string, requesterRole: UserRole, teacherId?: string): Promise<{
        sessionDate: Date;
        id: string;
        sessionType: import("@prisma/client").$Enums.SessionType;
        studentId: string;
        teacherId: string;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private updateStudentProgress;
}
