import { TeachersService } from './teachers.service';
import { UpdateTeacherDto } from './dto/teacher.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class TeachersController {
    private teachersService;
    private prismaService;
    constructor(teachersService: TeachersService, prismaService: PrismaService);
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
    findOne(id: string, user: any): Promise<{
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
    update(id: string, dto: UpdateTeacherDto, user: any): Promise<{
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
