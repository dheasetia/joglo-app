"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileAssetsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const storage_constants_1 = require("../storage/storage.constants");
let FileAssetsService = class FileAssetsService {
    prisma;
    storageService;
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    normalizeTenantId(tenantId) {
        return this.storageService.normalizeTenantId(tenantId || storage_constants_1.DEFAULT_TENANT_ID);
    }
    assertTenantAccess(user, tenantId) {
        if (user.role === client_1.UserRole.ADMIN) {
            return;
        }
        if (tenantId !== storage_constants_1.DEFAULT_TENANT_ID) {
            throw new common_1.ForbiddenException('Akses tenant ditolak.');
        }
    }
    async createPresignedUploadUrl(dto, requester) {
        const tenantId = this.normalizeTenantId(dto.tenantId);
        this.assertTenantAccess(requester, tenantId);
        const normalizedName = this.storageService.sanitizeFileName(dto.fileName);
        this.storageService.validateUploadConstraints({
            originalName: normalizedName,
            contentType: dto.contentType,
            size: dto.size,
        });
        const key = this.storageService.buildObjectKey({
            tenantId,
            module: dto.module,
            entityId: dto.entityId,
            folder: dto.folder,
            originalName: normalizedName,
        });
        return this.storageService.createPresignedUploadUrl({
            key,
            contentType: dto.contentType,
            visibility: dto.visibility || client_1.FileVisibility.PRIVATE,
        });
    }
    async saveMetadata(dto, requester) {
        const tenantId = this.normalizeTenantId(dto.tenantId);
        this.assertTenantAccess(requester, tenantId);
        this.storageService.validateUploadConstraints({
            originalName: dto.originalName,
            contentType: dto.mimeType,
            size: dto.size,
        });
        if (dto.studentId) {
            const student = await this.prisma.student.findUnique({ where: { id: dto.studentId } });
            if (!student) {
                throw new common_1.NotFoundException('Student tidak ditemukan.');
            }
        }
        return this.prisma.fileAsset.create({
            data: {
                tenantId,
                originalName: this.storageService.sanitizeFileName(dto.originalName),
                key: dto.key,
                bucket: dto.bucket,
                mimeType: dto.mimeType,
                size: dto.size,
                visibility: dto.visibility || client_1.FileVisibility.PRIVATE,
                module: dto.module,
                entityId: dto.entityId,
                uploadedBy: requester.id,
                studentId: dto.studentId,
            },
        });
    }
    async generateSignedDownloadUrl(id, tenantIdInput, requester) {
        const file = await this.prisma.fileAsset.findUnique({ where: { id } });
        if (!file || file.isDeleted) {
            throw new common_1.NotFoundException('File asset tidak ditemukan.');
        }
        const tenantId = this.normalizeTenantId(tenantIdInput || file.tenantId);
        this.assertTenantAccess(requester, tenantId);
        if (requester.role !== client_1.UserRole.ADMIN &&
            file.visibility === client_1.FileVisibility.PRIVATE &&
            file.uploadedBy !== requester.id) {
            throw new common_1.ForbiddenException('Tidak memiliki akses ke file private ini.');
        }
        const signed = await this.storageService.createPresignedDownloadUrl(file.key);
        return {
            fileId: file.id,
            key: file.key,
            visibility: file.visibility,
            ...signed,
        };
    }
    async remove(id, requester) {
        const file = await this.prisma.fileAsset.findUnique({ where: { id } });
        if (!file || file.isDeleted) {
            throw new common_1.NotFoundException('File asset tidak ditemukan.');
        }
        this.assertTenantAccess(requester, file.tenantId);
        if (requester.role !== client_1.UserRole.ADMIN && file.uploadedBy !== requester.id) {
            throw new common_1.ForbiddenException('Hanya uploader atau admin yang dapat menghapus file.');
        }
        await this.storageService.deleteObject(file.key);
        return this.prisma.fileAsset.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
};
exports.FileAssetsService = FileAssetsService;
exports.FileAssetsService = FileAssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], FileAssetsService);
//# sourceMappingURL=file-assets.service.js.map