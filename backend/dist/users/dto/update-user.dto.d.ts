import { UserRole } from '@prisma/client';
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    role?: UserRole;
    isActive?: boolean;
    photoUrl?: string;
}
export declare class UpdatePasswordDto {
    password: string;
}
export declare class UpdateMyPasswordDto {
    currentPassword?: string;
    newPassword: string;
}
