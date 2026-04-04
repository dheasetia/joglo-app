import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { FileVisibility } from '@prisma/client';
import {
  DEFAULT_MAX_FILE_SIZE_BYTES,
  DEFAULT_PRESIGNED_DOWNLOAD_EXPIRES_IN,
  DEFAULT_PRESIGNED_UPLOAD_EXPIRES_IN,
  DEFAULT_TENANT_ID,
  STORAGE_ALLOWED_EXTENSIONS,
  STORAGE_ALLOWED_MIME_TYPES,
} from './storage.constants';
import { BuildStorageKeyInput, PresignedUploadResult } from './storage.types';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly maxFileSize: number;
  private readonly uploadExpiresIn: number;
  private readonly downloadExpiresIn: number;
  private readonly allowedMimeTypes = new Set<string>(STORAGE_ALLOWED_MIME_TYPES);
  private readonly allowedExtensions = new Set<string>(STORAGE_ALLOWED_EXTENSIONS);

  constructor() {
    this.region = process.env.AWS_REGION || 'ap-southeast-1';
    this.bucket = process.env.AWS_S3_BUCKET || '';
    this.maxFileSize = Number(process.env.STORAGE_MAX_FILE_SIZE_BYTES || DEFAULT_MAX_FILE_SIZE_BYTES);
    this.uploadExpiresIn = Number(
      process.env.AWS_S3_UPLOAD_URL_EXPIRES_IN || DEFAULT_PRESIGNED_UPLOAD_EXPIRES_IN,
    );
    this.downloadExpiresIn = Number(
      process.env.AWS_S3_DOWNLOAD_URL_EXPIRES_IN || DEFAULT_PRESIGNED_DOWNLOAD_EXPIRES_IN,
    );

    if (!this.bucket) {
      throw new InternalServerErrorException('AWS_S3_BUCKET belum dikonfigurasi.');
    }

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  getBucketName(): string {
    return this.bucket;
  }

  normalizeTenantId(tenantId?: string): string {
    const cleaned = (tenantId || '').trim();
    return cleaned || DEFAULT_TENANT_ID;
  }

  private buildTenantPrefix(tenantId?: string): string {
    const normalizedTenantId = this.normalizeTenantId(tenantId);
    if (normalizedTenantId === DEFAULT_TENANT_ID) {
      return '';
    }

    return `tenants/${normalizedTenantId}/`;
  }

  sanitizeFileName(originalName: string): string {
    return originalName
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 120);
  }

  private extractExtension(originalName: string): string {
    return extname(originalName).replace('.', '').toLowerCase();
  }

  validateUploadConstraints(params: {
    originalName: string;
    contentType: string;
    size?: number;
  }): void {
    const { originalName, contentType, size } = params;
    const extension = this.extractExtension(originalName);

    if (!extension || !this.allowedExtensions.has(extension)) {
      throw new BadRequestException('Ekstensi file tidak diizinkan.');
    }

    if (!this.allowedMimeTypes.has(contentType)) {
      throw new BadRequestException('MIME type file tidak diizinkan.');
    }

    if (typeof size === 'number' && size > this.maxFileSize) {
      throw new BadRequestException(
        `Ukuran file melebihi batas maksimum ${this.maxFileSize} bytes.`,
      );
    }
  }

  buildObjectKey(input: BuildStorageKeyInput): string {
    const timestamp = Date.now();
    const extension = this.extractExtension(input.originalName);
    const normalizedModule = input.module.trim().toLowerCase();
    const normalizedFolder = input.folder.trim().toLowerCase();
    const tenantPrefix = this.buildTenantPrefix(input.tenantId);
    const entityPart = input.entityId ? `${input.entityId.trim()}/` : '';

    return `${tenantPrefix}${normalizedModule}/${entityPart}${normalizedFolder}/${timestamp}-${randomUUID()}.${extension}`;
  }

  async createPresignedUploadUrl(params: {
    key: string;
    contentType: string;
    visibility: FileVisibility;
  }): Promise<PresignedUploadResult> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: params.key,
      ContentType: params.contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.uploadExpiresIn,
    });

    return {
      uploadUrl,
      key: params.key,
      expiresIn: this.uploadExpiresIn,
      bucket: this.bucket,
      visibility: params.visibility,
    };
  }

  async createPresignedDownloadUrl(key: string): Promise<{ url: string; expiresIn: number }> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.downloadExpiresIn,
    });

    return { url, expiresIn: this.downloadExpiresIn };
  }

  getPublicObjectUrl(key: string): string {
    const baseUrl = (process.env.AWS_S3_PUBLIC_BASE_URL || '').trim().replace(/\/$/, '');
    if (baseUrl) {
      return `${baseUrl}/${key}`;
    }

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async uploadBuffer(params: {
    key: string;
    contentType: string;
    body: Buffer;
  }): Promise<{ key: string; bucket: string; publicUrl: string }> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType,
      }),
    );

    return {
      key: params.key,
      bucket: this.bucket,
      publicUrl: this.getPublicObjectUrl(params.key),
    };
  }

  async deleteObject(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
