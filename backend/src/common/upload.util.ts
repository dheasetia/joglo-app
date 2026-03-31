import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as fs from 'node:fs';
import * as path from 'node:path';

const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

type UploadedFile = { mimetype: string; originalname: string; filename: string };

export const imageUploadOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads');
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req: any, file: UploadedFile, cb: any) => {
    if (!imageMimeTypes.includes(file.mimetype)) {
      return cb(new BadRequestException('File harus berupa gambar (jpg, jpeg, png, webp)'), false);
    }
    cb(null, true);
  },
};

export const toPublicUploadPath = (file?: UploadedFile) => {
  if (!file) {
    return undefined;
  }
  return `/uploads/${file.filename}`;
};
