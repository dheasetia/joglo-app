import { PrismaService } from '../prisma/prisma.service';
import { CreateHalaqahDto, UpdateHalaqahDto } from './dto/halaqah.dto';
export declare class HalaqahsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateHalaqahDto): Promise<{
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
        _count: {
            students: number;
        };
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        teacherId: string;
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
        students: {
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
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        teacherId: string;
    }>;
    findByTeacher(teacherId: string): Promise<({
        _count: {
            students: number;
        };
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        teacherId: string;
    })[]>;
    update(id: string, dto: UpdateHalaqahDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        teacherId: string;
    }>;
}
