import { FileVisibility } from '@prisma/client';
export declare class CreatePresignedUploadUrlDto {
    fileName: string;
    contentType: string;
    module: string;
    folder: string;
    tenantId?: string;
    entityId?: string;
    size?: number;
    visibility?: FileVisibility;
}
