import api from './api';

export type FileVisibility = 'PUBLIC' | 'PRIVATE';

interface PresignedUploadPayload {
  fileName: string;
  contentType: string;
  module: string;
  folder: string;
  tenantId?: string;
  entityId?: string;
  size?: number;
  visibility?: FileVisibility;
}

interface SaveMetadataPayload {
  originalName: string;
  key: string;
  bucket: string;
  mimeType: string;
  size: number;
  visibility: FileVisibility;
  module: string;
  tenantId?: string;
  entityId?: string;
  studentId?: string;
}

export async function uploadFileToS3Direct(file: File, payload: PresignedUploadPayload) {
  const presignedRes = await api.post('/file-assets/presigned-upload-url', payload);
  const { uploadUrl, key, bucket, visibility } = presignedRes.data;

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    const errorBody = await uploadRes.text();
    throw new Error(`Upload file ke S3 gagal (${uploadRes.status}): ${errorBody || 'Unknown error'}`);
  }

  const metadataPayload: SaveMetadataPayload = {
    originalName: file.name,
    key,
    bucket,
    mimeType: file.type,
    size: file.size,
    visibility,
    module: payload.module,
    tenantId: payload.tenantId,
    entityId: payload.entityId,
  };

  const metadataRes = await api.post('/file-assets', metadataPayload);
  return metadataRes.data;
}

export async function getSignedDownloadUrl(fileAssetId: string, tenantId?: string) {
  const res = await api.get(`/file-assets/${fileAssetId}/signed-download-url`, {
    params: { tenantId },
  });
  return res.data;
}
