import { FileVisibility } from '@prisma/client';

export interface BuildStorageKeyInput {
  tenantId: string;
  module: string;
  entityId?: string;
  folder: string;
  originalName: string;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  key: string;
  expiresIn: number;
  bucket: string;
  visibility: FileVisibility;
}
