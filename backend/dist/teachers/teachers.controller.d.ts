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
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string;
        phone: string | null;
        notes: string | null;
    })[]>;
    findOne(id: string, user: any): Promise<{
        user: {
            email: string;
            isActive: boolean;
        };
        halaqahs: {
            name: string;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            teacherId: string;
        }[];
    } & {
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string;
        phone: string | null;
        notes: string | null;
    }>;
    update(id: string, dto: UpdateTeacherDto, user: any): Promise<{
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string;
        phone: string | null;
        notes: string | null;
    }>;
    remove(id: string): Promise<{
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string;
        phone: string | null;
        notes: string | null;
    }>;
}
