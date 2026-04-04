"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TENANT_ID = exports.DEFAULT_PRESIGNED_DOWNLOAD_EXPIRES_IN = exports.DEFAULT_PRESIGNED_UPLOAD_EXPIRES_IN = exports.DEFAULT_MAX_FILE_SIZE_BYTES = exports.STORAGE_ALLOWED_EXTENSIONS = exports.STORAGE_ALLOWED_MIME_TYPES = void 0;
exports.STORAGE_ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
exports.STORAGE_ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx'];
exports.DEFAULT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
exports.DEFAULT_PRESIGNED_UPLOAD_EXPIRES_IN = 300;
exports.DEFAULT_PRESIGNED_DOWNLOAD_EXPIRES_IN = 300;
exports.DEFAULT_TENANT_ID = 'default-tenant';
//# sourceMappingURL=storage.constants.js.map