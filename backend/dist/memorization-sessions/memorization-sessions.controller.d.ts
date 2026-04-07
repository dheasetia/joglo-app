import { MemorizationSessionsService } from './memorization-sessions.service';
import { CreateSessionDto, CreateSessionNoteDto, UpdateSessionDto } from './dto/session.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class MemorizationSessionsController {
    private readonly sessionsService;
    private prismaService;
    constructor(sessionsService: MemorizationSessionsService, prismaService: PrismaService);
    private getTeacherByUser;
    private ensureSessionAccess;
    create(user: any, createSessionDto: CreateSessionDto): Promise<any>;
    findAll(user: any, studentId?: string, date?: string): Promise<({
        teacher: {
            id: string;
            userId: string;
            fullName: string;
            phone: string | null;
            notes: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        halaqah: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            teacherId: string;
        };
        student: {
            id: string;
            fullName: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            halaqahId: string;
            nis: string | null;
            photoUrl: string | null;
            gender: import("@prisma/client").$Enums.Gender;
            level: string | null;
            className: string | null;
            currentJuz: number;
            currentPage: number | null;
            lastMemorizedPage: number | null;
            totalMemorizedPages: number;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
        studentId: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    })[]>;
    findOne(user: any, id: string): Promise<{
        teacher: {
            id: string;
            userId: string;
            fullName: string;
            phone: string | null;
            notes: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        halaqah: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            teacherId: string;
        };
        student: {
            id: string;
            fullName: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            halaqahId: string;
            nis: string | null;
            photoUrl: string | null;
            gender: import("@prisma/client").$Enums.Gender;
            level: string | null;
            className: string | null;
            currentJuz: number;
            currentPage: number | null;
            lastMemorizedPage: number | null;
            totalMemorizedPages: number;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
        studentId: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    }>;
    createNote(user: any, id: string, dto: CreateSessionNoteDto): Promise<{
        teacher: {
            id: string;
            userId: string;
            fullName: string;
            phone: string | null;
            notes: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        halaqah: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            teacherId: string;
        };
        student: {
            id: string;
            fullName: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            halaqahId: string;
            nis: string | null;
            photoUrl: string | null;
            gender: import("@prisma/client").$Enums.Gender;
            level: string | null;
            className: string | null;
            currentJuz: number;
            currentPage: number | null;
            lastMemorizedPage: number | null;
            totalMemorizedPages: number;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
        studentId: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    }>;
    updateNote(user: any, id: string, noteId: string, dto: CreateSessionNoteDto): Promise<{
        teacher: {
            id: string;
            userId: string;
            fullName: string;
            phone: string | null;
            notes: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        halaqah: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            teacherId: string;
        };
        student: {
            id: string;
            fullName: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            halaqahId: string;
            nis: string | null;
            photoUrl: string | null;
            gender: import("@prisma/client").$Enums.Gender;
            level: string | null;
            className: string | null;
            currentJuz: number;
            currentPage: number | null;
            lastMemorizedPage: number | null;
            totalMemorizedPages: number;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
        studentId: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    }>;
    removeNote(user: any, id: string, noteId: string): Promise<{
        teacher: {
            id: string;
            userId: string;
            fullName: string;
            phone: string | null;
            notes: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        halaqah: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            teacherId: string;
        };
        student: {
            id: string;
            fullName: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            halaqahId: string;
            nis: string | null;
            photoUrl: string | null;
            gender: import("@prisma/client").$Enums.Gender;
            level: string | null;
            className: string | null;
            currentJuz: number;
            currentPage: number | null;
            lastMemorizedPage: number | null;
            totalMemorizedPages: number;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
        studentId: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
    } & {
        noteSummary: {
            KESALAHAN: number;
            TEGURAN: number;
            PERHATIAN: number;
        };
    }>;
    update(user: any, id: string, updateSessionDto: UpdateSessionDto): Promise<any>;
    remove(user: any, id: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
        studentId: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
    }>;
}
