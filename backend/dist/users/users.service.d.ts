import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateMyPasswordDto, UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { StorageService } from '../storage/storage.service';
export declare class UsersService {
    private prisma;
    private readonly storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    private mapPhotoUrl;
    private isPrismaError;
    private isMissingPhotoUrlColumnError;
    findAll(): Promise<{
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        photoUrl: string | null;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        photoUrl: string | null;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        teacher?: {
            id: string;
            userId: string;
            fullName: string;
            phone: string | null;
            notes: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        photoUrl: string | null;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        teacher?: {
            id: string;
            userId: string;
            fullName: string;
            phone: string | null;
            notes: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    }>;
    create(dto: CreateUserDto): Promise<{
        id: any;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<any>;
    updatePassword(id: string, dto: UpdatePasswordDto): Promise<{
        success: boolean;
    }>;
    updateMyPassword(id: string, dto: UpdateMyPasswordDto): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
