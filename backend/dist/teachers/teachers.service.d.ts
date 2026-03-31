import { PrismaService } from '../prisma/prisma.service';
import { UpdateTeacherDto } from './dto/teacher.dto';
export declare class TeachersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        user: {
            email: string;
            isActive: boolean;
        };
        _count: {
            halaqahs: number;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        phone: string | null;
        notes: string | null;
        userId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            email: string;
            isActive: boolean;
        };
        halaqahs: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            teacherId: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        phone: string | null;
        notes: string | null;
        userId: string;
    }>;
    update(id: string, dto: UpdateTeacherDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        phone: string | null;
        notes: string | null;
        userId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        phone: string | null;
        notes: string | null;
        userId: string;
    }>;
}
