import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { StorageService } from '../storage/storage.service';
export declare class StudentsService {
    private prisma;
    private readonly storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    private mapPhotoUrl;
    private normalizeOptionalString;
    create(dto: CreateStudentDto): Promise<{
        halaqah: {
            teacher: {
                id: string;
                fullName: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                phone: string | null;
                notes: string | null;
            };
        } & {
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
        createdAt: Date;
        updatedAt: Date;
        halaqahId: string;
    }>;
    findAll(): Promise<({
        halaqah: {
            teacher: {
                id: string;
                fullName: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                phone: string | null;
                notes: string | null;
            };
        } & {
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
        createdAt: Date;
        updatedAt: Date;
        halaqahId: string;
    })[]>;
    findOne(id: string): Promise<{
        halaqah: {
            teacher: {
                id: string;
                fullName: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                phone: string | null;
                notes: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            teacherId: string;
        };
        sessions: ({
            teacher: {
                id: string;
                fullName: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                phone: string | null;
                notes: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            halaqahId: string;
            teacherId: string;
            notes: string | null;
            sessionDate: Date;
            sessionType: import("@prisma/client").$Enums.SessionType;
            studentId: string;
            startPage: number | null;
            endPage: number | null;
            totalPages: number | null;
            score: number;
            recommendation: import("@prisma/client").$Enums.Recommendation;
            isApprovedForNextStep: boolean | null;
        })[];
        exams: ({
            teacher: {
                id: string;
                fullName: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                phone: string | null;
                notes: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            halaqahId: string;
            teacherId: string;
            notes: string | null;
            examDate: Date;
            studentId: string;
            startPage: number | null;
            endPage: number | null;
            score: number;
            recommendation: import("@prisma/client").$Enums.Recommendation;
            examType: import("@prisma/client").$Enums.ExamType;
            title: string | null;
            startJuz: number | null;
            endJuz: number | null;
            periodStart: Date | null;
            periodEnd: Date | null;
            resultStatus: import("@prisma/client").$Enums.ExamResultStatus;
        })[];
        _count: {
            sessions: number;
            exams: number;
        };
    } & {
        id: string;
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
        createdAt: Date;
        updatedAt: Date;
        halaqahId: string;
    }>;
    findByHalaqah(halaqahId: string): Promise<({
        halaqah: {
            teacher: {
                id: string;
                fullName: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                phone: string | null;
                notes: string | null;
            };
        } & {
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
        createdAt: Date;
        updatedAt: Date;
        halaqahId: string;
    })[]>;
    findByHalaqahIds(halaqahIds: string[]): Promise<({
        halaqah: {
            teacher: {
                id: string;
                fullName: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                phone: string | null;
                notes: string | null;
            };
        } & {
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
        createdAt: Date;
        updatedAt: Date;
        halaqahId: string;
    })[]>;
    update(id: string, dto: UpdateStudentDto): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
        halaqahId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
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
        createdAt: Date;
        updatedAt: Date;
        halaqahId: string;
    }>;
}
