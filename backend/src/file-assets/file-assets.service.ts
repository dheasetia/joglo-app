import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FileAsset, FileVisibility, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { DEFAULT_TENANT_ID } from '../storage/storage.constants';
import { CreatePresignedUploadUrlDto } from './dto/create-presigned-upload-url.dto';
import { CreateFileAssetDto } from './dto/create-file-asset.dto';

@Injectable()
export class FileAssetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  private normalizeTenantId(tenantId?: string): string {
    return this.storageService.normalizeTenantId(tenantId || DEFAULT_TENANT_ID);
  }

  private assertTenantAccess(user: { role: UserRole }, tenantId: string): void {
    if (user.role === UserRole.ADMIN) {
      return;
    }

    if (tenantId !== DEFAULT_TENANT_ID) {
      throw new ForbiddenException('Akses tenant ditolak.');
    }
  }

  async createPresignedUploadUrl(
    dto: CreatePresignedUploadUrlDto,
    requester: { id: string; role: UserRole },
  ) {
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
      visibility: dto.visibility || FileVisibility.PRIVATE,
    });
  }

  async saveMetadata(dto: CreateFileAssetDto, requester: { id: string; role: UserRole }) {
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
        throw new NotFoundException('Student tidak ditemukan.');
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
        visibility: dto.visibility || FileVisibility.PRIVATE,
        module: dto.module,
        entityId: dto.entityId,
        uploadedBy: requester.id,
        studentId: dto.studentId,
      },
    });
  }

  async generateSignedDownloadUrl(
    id: string,
    tenantIdInput: string | undefined,
    requester: { id: string; role: UserRole },
  ) {
    const file = await this.prisma.fileAsset.findUnique({ where: { id } });
    if (!file || file.isDeleted) {
      throw new NotFoundException('File asset tidak ditemukan.');
    }

    const tenantId = this.normalizeTenantId(tenantIdInput || file.tenantId);
    this.assertTenantAccess(requester, tenantId);

    if (
      requester.role !== UserRole.ADMIN &&
      file.visibility === FileVisibility.PRIVATE &&
      file.uploadedBy !== requester.id
    ) {
      throw new ForbiddenException('Tidak memiliki akses ke file private ini.');
    }

    const signed = await this.storageService.createPresignedDownloadUrl(file.key);

    return {
      fileId: file.id,
      key: file.key,
      visibility: file.visibility,
      ...signed,
    };
  }

  async remove(id: string, requester: { id: string; role: UserRole }): Promise<FileAsset> {
    const file = await this.prisma.fileAsset.findUnique({ where: { id } });
    if (!file || file.isDeleted) {
      throw new NotFoundException('File asset tidak ditemukan.');
    }

    this.assertTenantAccess(requester, file.tenantId);
    if (requester.role !== UserRole.ADMIN && file.uploadedBy !== requester.id) {
      throw new ForbiddenException('Hanya uploader atau admin yang dapat menghapus file.');
    }

    await this.storageService.deleteObject(file.key);

    return this.prisma.fileAsset.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
