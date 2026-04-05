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
    findOne(user: any, id: string): Promise<{
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
    createNote(user: any, id: string, dto: CreateSessionNoteDto): Promise<{
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
    update(user: any, id: string, updateSessionDto: UpdateSessionDto): Promise<any>;
    remove(user: any, id: string): Promise<{
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
}
