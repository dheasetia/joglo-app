import { MemorizationSessionsService } from './memorization-sessions.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class MemorizationSessionsController {
    private readonly sessionsService;
    private prismaService;
    constructor(sessionsService: MemorizationSessionsService, prismaService: PrismaService);
    create(user: any, createSessionDto: CreateSessionDto): Promise<{
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
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        studentId: string;
        halaqahId: string;
    }>;
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
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        studentId: string;
        halaqahId: string;
    })[]>;
    findOne(id: string): Promise<{
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
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        studentId: string;
        halaqahId: string;
    }>;
    update(id: string, updateSessionDto: UpdateSessionDto): Promise<{
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
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        studentId: string;
        halaqahId: string;
    }>;
    remove(user: any, id: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        studentId: string;
        halaqahId: string;
    }>;
}
