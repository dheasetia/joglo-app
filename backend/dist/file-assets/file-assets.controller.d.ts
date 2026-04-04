import { FileAssetsService } from './file-assets.service';
import { CreatePresignedUploadUrlDto } from './dto/create-presigned-upload-url.dto';
import { CreateFileAssetDto } from './dto/create-file-asset.dto';
import { GenerateSignedDownloadUrlDto } from './dto/generate-signed-download-url.dto';
export declare class FileAssetsController {
    private readonly fileAssetsService;
    constructor(fileAssetsService: FileAssetsService);
    createPresignedUploadUrl(dto: CreatePresignedUploadUrlDto, req: any): Promise<import("../storage/storage.types").PresignedUploadResult>;
    createMetadata(dto: CreateFileAssetDto, req: any): Promise<{
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
    createSignedDownloadUrl(id: string, query: GenerateSignedDownloadUrlDto, req: any): Promise<{
        url: string;
        expiresIn: number;
        fileId: string;
        key: string;
        visibility: import("@prisma/client").$Enums.FileVisibility;
    }>;
    remove(id: string, req: any): Promise<{
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
}
