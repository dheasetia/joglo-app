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
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const storage_constants_1 = require("./storage.constants");
let StorageService = class StorageService {
    s3Client;
    bucket;
    region;
    maxFileSize;
    uploadExpiresIn;
    downloadExpiresIn;
    allowedMimeTypes = new Set(storage_constants_1.STORAGE_ALLOWED_MIME_TYPES);
    allowedExtensions = new Set(storage_constants_1.STORAGE_ALLOWED_EXTENSIONS);
    constructor() {
        this.region = process.env.AWS_REGION || 'ap-southeast-1';
        this.bucket = process.env.AWS_S3_BUCKET || '';
        this.maxFileSize = Number(process.env.STORAGE_MAX_FILE_SIZE_BYTES || storage_constants_1.DEFAULT_MAX_FILE_SIZE_BYTES);
        this.uploadExpiresIn = Number(process.env.AWS_S3_UPLOAD_URL_EXPIRES_IN || storage_constants_1.DEFAULT_PRESIGNED_UPLOAD_EXPIRES_IN);
        this.downloadExpiresIn = Number(process.env.AWS_S3_DOWNLOAD_URL_EXPIRES_IN || storage_constants_1.DEFAULT_PRESIGNED_DOWNLOAD_EXPIRES_IN);
        if (!this.bucket) {
            throw new common_1.InternalServerErrorException('AWS_S3_BUCKET belum dikonfigurasi.');
        }
        this.s3Client = new client_s3_1.S3Client({
            region: this.region,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });
    }
    getBucketName() {
        return this.bucket;
    }
    normalizeTenantId(tenantId) {
        const cleaned = (tenantId || '').trim();
        return cleaned || storage_constants_1.DEFAULT_TENANT_ID;
    }
    buildTenantPrefix(tenantId) {
        const normalizedTenantId = this.normalizeTenantId(tenantId);
        if (normalizedTenantId === storage_constants_1.DEFAULT_TENANT_ID) {
            return '';
        }
        return `tenants/${normalizedTenantId}/`;
    }
    sanitizeFileName(originalName) {
        return originalName
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9._-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 120);
    }
    extractExtension(originalName) {
        return (0, node_path_1.extname)(originalName).replace('.', '').toLowerCase();
    }
    validateUploadConstraints(params) {
        const { originalName, contentType, size } = params;
        const extension = this.extractExtension(originalName);
        if (!extension || !this.allowedExtensions.has(extension)) {
            throw new common_1.BadRequestException('Ekstensi file tidak diizinkan.');
        }
        if (!this.allowedMimeTypes.has(contentType)) {
            throw new common_1.BadRequestException('MIME type file tidak diizinkan.');
        }
        if (typeof size === 'number' && size > this.maxFileSize) {
            throw new common_1.BadRequestException(`Ukuran file melebihi batas maksimum ${this.maxFileSize} bytes.`);
        }
    }
    buildObjectKey(input) {
        const timestamp = Date.now();
        const extension = this.extractExtension(input.originalName);
        const normalizedModule = input.module.trim().toLowerCase();
        const normalizedFolder = input.folder.trim().toLowerCase();
        const tenantPrefix = this.buildTenantPrefix(input.tenantId);
        const entityPart = input.entityId ? `${input.entityId.trim()}/` : '';
        return `${tenantPrefix}${normalizedModule}/${entityPart}${normalizedFolder}/${timestamp}-${(0, node_crypto_1.randomUUID)()}.${extension}`;
    }
    async createPresignedUploadUrl(params) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: params.key,
            ContentType: params.contentType,
        });
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
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
    async createPresignedDownloadUrl(key) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
            expiresIn: this.downloadExpiresIn,
        });
        return { url, expiresIn: this.downloadExpiresIn };
    }
    getPublicObjectUrl(key) {
        const baseUrl = (process.env.AWS_S3_PUBLIC_BASE_URL || '').trim().replace(/\/$/, '');
        if (baseUrl) {
            return `${baseUrl}/${key}`;
        }
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    }
    async uploadBuffer(params) {
        await this.s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: params.key,
            Body: params.body,
            ContentType: params.contentType,
        }));
        return {
            key: params.key,
            bucket: this.bucket,
            publicUrl: this.getPublicObjectUrl(params.key),
        };
    }
    async deleteObject(key) {
        await this.s3Client.send(new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        }));
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StorageService);
//# sourceMappingURL=storage.service.js.map