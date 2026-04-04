export const STORAGE_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const STORAGE_ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx'] as const;

export const DEFAULT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const DEFAULT_PRESIGNED_UPLOAD_EXPIRES_IN = 300;
export const DEFAULT_PRESIGNED_DOWNLOAD_EXPIRES_IN = 300;
export const DEFAULT_TENANT_ID = 'default-tenant';