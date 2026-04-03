import { MemorizationSessionsService } from './memorization-sessions.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class MemorizationSessionsController {
    private readonly sessionsService;
    private prismaService;
    constructor(sessionsService: MemorizationSessionsService, prismaService: PrismaService);
    create(user: any, createSessionDto: CreateSessionDto): Promise<{
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
    findAll(user: any, studentId?: string): Promise<({
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
    update(id: string, updateSessionDto: UpdateSessionDto): Promise<{
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
    remove(user: any, id: string): Promise<{
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
}
