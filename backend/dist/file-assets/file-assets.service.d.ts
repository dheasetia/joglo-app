import { FileAsset, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreatePresignedUploadUrlDto } from './dto/create-presigned-upload-url.dto';
import { CreateFileAssetDto } from './dto/create-file-asset.dto';
export declare class FileAssetsService {
    private readonly prisma;
    private readonly storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    private normalizeTenantId;
    private assertTenantAccess;
    createPresignedUploadUrl(dto: CreatePresignedUploadUrlDto, requester: {
        id: string;
        role: UserRole;
    }): Promise<import("../storage/storage.types").PresignedUploadResult>;
    saveMetadata(dto: CreateFileAssetDto, requester: {
        id: string;
        role: UserRole;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalName: string;
        size: number;
        key: string;
        visibility: import("@prisma/client").$Enums.FileVisibility;
        bucket: string;
        studentId: string | null;
        module: string;
        tenantId: string;
        entityId: string | null;
        mimeType: string;
        isDeleted: boolean;
        uploadedBy: string;
    }>;
    generateSignedDownloadUrl(id: string, tenantIdInput: string | undefined, requester: {
        id: string;
        role: UserRole;
    }): Promise<{
        url: string;
        expiresIn: number;
        fileId: string;
        key: string;
        visibility: import("@prisma/client").$Enums.FileVisibility;
    }>;
    remove(id: string, requester: {
        id: string;
        role: UserRole;
    }): Promise<FileAsset>;
}
