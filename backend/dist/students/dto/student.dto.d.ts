import { Gender } from '@prisma/client';
export declare class CreateStudentDto {
    nis?: string;
    fullName: string;
    photoUrl?: string;
    gender: Gender;
    level?: string;
    className?: string;
    halaqahId: string;
}
export declare class UpdateStudentDto {
    nis?: string;
    fullName?: string;
    photoUrl?: string;
    gender?: Gender;
    level?: string;
    className?: string;
    halaqahId?: string;
    isActive?: boolean;
    currentJuz?: number;
    currentPage?: number;
    lastMemorizedPage?: number;
    totalMemorizedPages?: number;
}
