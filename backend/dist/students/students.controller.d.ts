import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
export declare class StudentsController {
    private readonly studentsService;
    private prismaService;
    private readonly storageService;
    constructor(studentsService: StudentsService, prismaService: PrismaService, storageService: StorageService);
    private static readonly imageUploadOptions;
    create(createStudentDto: CreateStudentDto, user: any, file?: any): Promise<{
        halaqah: {
            teacher: {
                isActive: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                fullName: string;
                phone: string | null;
                notes: string | null;
            };
        } & {
            name: string;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            teacherId: string;
        };
    } & {
        isActive: boolean;
        photoUrl: string | null;
        id: string;
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
    findAll(user: any, halaqahId?: string): Promise<({
        halaqah: {
            teacher: {
                isActive: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                fullName: string;
                phone: string | null;
                notes: string | null;
            };
        } & {
            name: string;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            teacherId: string;
        };
    } & {
        isActive: boolean;
        photoUrl: string | null;
        id: string;
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
                isActive: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                fullName: string;
                phone: string | null;
                notes: string | null;
            };
        } & {
            name: string;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            teacherId: string;
        };
        _count: {
            sessions: number;
            exams: number;
        };
        sessions: ({
            teacher: {
                isActive: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                fullName: string;
                phone: string | null;
                notes: string | null;
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
        })[];
        exams: ({
            teacher: {
                isActive: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                fullName: string;
                phone: string | null;
                notes: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            teacherId: string;
            halaqahId: string;
            examDate: Date;
            studentId: string;
            startPage: number | null;
            endPage: number | null;
            score: number;
            recommendation: import("@prisma/client").$Enums.Recommendation;
            examType: import("@prisma/client").$Enums.ExamType;
            title: string | null;
            periodStart: Date | null;
            periodEnd: Date | null;
            resultStatus: import("@prisma/client").$Enums.ExamResultStatus;
            startJuz: number | null;
            endJuz: number | null;
        })[];
    } & {
        isActive: boolean;
        photoUrl: string | null;
        id: string;
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
    update(id: string, updateStudentDto: UpdateStudentDto, file?: any): Promise<{
        halaqah: {
            name: string;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            teacherId: string;
        };
    } & {
        isActive: boolean;
        photoUrl: string | null;
        id: string;
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
        isActive: boolean;
        photoUrl: string | null;
        id: string;
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
