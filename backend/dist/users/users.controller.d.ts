import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateMyPasswordDto, UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { StorageService } from '../storage/storage.service';
export declare class UsersController {
    private usersService;
    private readonly storageService;
    constructor(usersService: UsersService, storageService: StorageService);
    private static readonly imageUploadOptions;
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
        } | null | undefined;
    }>;
    findAll(): Promise<{
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        photoUrl: string | null;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    create(dto: CreateUserDto, file?: any): Promise<{
        id: any;
    }>;
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
        } | null | undefined;
    }>;
    update(id: string, dto: UpdateUserDto, user: any, file?: any): Promise<any>;
    updateMyPassword(userId: string, dto: UpdateMyPasswordDto): Promise<{
        success: boolean;
    }>;
    updatePassword(id: string, dto: UpdatePasswordDto): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
