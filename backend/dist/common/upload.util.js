"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicUploadPath = exports.imageUploadOptions = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
exports.imageUploadOptions = {
    storage: (0, multer_1.diskStorage)({
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
    fileFilter: (_req, file, cb) => {
        if (!imageMimeTypes.includes(file.mimetype)) {
            return cb(new common_1.BadRequestException('File harus berupa gambar (jpg, jpeg, png, webp)'), false);
        }
        cb(null, true);
    },
};
const toPublicUploadPath = (file) => {
    if (!file) {
        return undefined;
    }
    return `/uploads/${file.filename}`;
};
exports.toPublicUploadPath = toPublicUploadPath;
//# sourceMappingURL=upload.util.js.map