import { FileVisibility } from '@prisma/client';
import { BuildStorageKeyInput, PresignedUploadResult } from './storage.types';
export declare class StorageService {
    private readonly s3Client;
    private readonly bucket;
    private readonly region;
    private readonly maxFileSize;
    private readonly uploadExpiresIn;
    private readonly downloadExpiresIn;
    private readonly allowedMimeTypes;
    private readonly allowedExtensions;
    constructor();
    getBucketName(): string;
    normalizeTenantId(tenantId?: string): string;
    private buildTenantPrefix;
    sanitizeFileName(originalName: string): string;
    private extractExtension;
    validateUploadConstraints(params: {
        originalName: string;
        contentType: string;
        size?: number;
    }): void;
    buildObjectKey(input: BuildStorageKeyInput): string;
    createPresignedUploadUrl(params: {
        key: string;
        contentType: string;
        visibility: FileVisibility;
    }): Promise<PresignedUploadResult>;
    createPresignedDownloadUrl(key: string): Promise<{
        url: string;
        expiresIn: number;
    }>;
    getPublicObjectUrl(key: string): string;
    uploadBuffer(params: {
        key: string;
        contentType: string;
        body: Buffer;
    }): Promise<{
        key: string;
        bucket: string;
        publicUrl: string;
    }>;
    deleteObject(key: string): Promise<void>;
}
