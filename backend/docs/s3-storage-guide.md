### Daftar package yang perlu di-install
- `@aws-sdk/client-s3`
- `@aws-sdk/s3-request-presigner`

### Struktur module/file yang ditambahkan
- `src/storage/storage.module.ts`
- `src/storage/storage.service.ts`
- `src/storage/storage.constants.ts`
- `src/storage/storage.types.ts`
- `src/file-assets/file-assets.module.ts`
- `src/file-assets/file-assets.controller.ts`
- `src/file-assets/file-assets.service.ts`
- `src/file-assets/dto/create-presigned-upload-url.dto.ts`
- `src/file-assets/dto/create-file-asset.dto.ts`
- `src/file-assets/dto/generate-signed-download-url.dto.ts`
- `src/file-assets/guards/file-asset-tenant.guard.ts`
- `frontend/src/services/fileAssets.ts`

### Contoh integrasi React (presigned URL - direct upload)
```ts
import { uploadFileToS3Direct } from '../services/fileAssets';

async function handleUpload(file: File, studentId: string) {
  const fileAsset = await uploadFileToS3Direct(file, {
    fileName: file.name,
    contentType: file.type,
    module: 'students',
    folder: 'photos',
    entityId: studentId,
    tenantId: 'default-tenant',
    size: file.size,
    visibility: 'PRIVATE',
  });

  return fileAsset;
}
```

### Setup Amazon S3 singkat
- Buat bucket S3 (aktifkan `Block Public Access` default untuk data private).
- Buat IAM policy minimal: `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` pada bucket/path yang dibutuhkan.
- Buat IAM user/role untuk backend dan isi ENV:
  - `AWS_REGION`
  - `AWS_S3_BUCKET`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`

### Catatan deployment Render.com
- Simpan seluruh AWS ENV di Render Dashboard (`Environment`).
- Jangan mount local upload storage sebagai storage permanen.
- Jalankan migration saat deploy: `npx prisma migrate deploy`.
- Pastikan backend outbound access ke endpoint AWS region sesuai.

### Strategi migrasi dari local upload ke S3
1. Enumerasi file lama dari folder local `uploads/` + mapping entity terkait.
2. Upload satu per satu ke S3 dengan pola key baru (`tenants/{tenantId}/...`).
3. Simpan metadata ke tabel `FileAsset`.
4. Update referensi modul (mis. `photoUrl`) bertahap memakai data `FileAsset`.
5. Setelah verifikasi, hentikan endpoint local upload lama.
