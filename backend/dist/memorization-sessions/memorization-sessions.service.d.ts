import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
export declare class MemorizationSessionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(teacherId: string, dto: CreateSessionDto): Promise<{
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
    }>;
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
    })[]>;
    update(id: string, dto: UpdateSessionDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
