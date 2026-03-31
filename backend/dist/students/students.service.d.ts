import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateStudentDto): Promise<{
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
    findAll(): Promise<({
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
    })[]>;
    findOne(id: string): Promise<{
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
        _count: {
            sessions: number;
            exams: number;
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
    }>;
    findByHalaqah(halaqahId: string): Promise<({
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
    })[]>;
    update(id: string, dto: UpdateStudentDto): Promise<{
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
    remove(id: string): Promise<{
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
}
