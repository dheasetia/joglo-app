import { FileVisibility } from '@prisma/client';
export declare class CreateFileAssetDto {
    originalName: string;
    key: string;
    bucket: string;
    mimeType: string;
    size: number;
    visibility?: FileVisibility;
    module: string;
    entityId?: string;
    tenantId?: string;
    studentId?: string;
}
