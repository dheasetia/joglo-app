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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileAssetsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const file_assets_service_1 = require("./file-assets.service");
const create_presigned_upload_url_dto_1 = require("./dto/create-presigned-upload-url.dto");
const create_file_asset_dto_1 = require("./dto/create-file-asset.dto");
const generate_signed_download_url_dto_1 = require("./dto/generate-signed-download-url.dto");
const file_asset_tenant_guard_1 = require("./guards/file-asset-tenant.guard");
let FileAssetsController = class FileAssetsController {
    fileAssetsService;
    constructor(fileAssetsService) {
        this.fileAssetsService = fileAssetsService;
    }
    createPresignedUploadUrl(dto, req) {
        return this.fileAssetsService.createPresignedUploadUrl(dto, req.user);
    }
    createMetadata(dto, req) {
        return this.fileAssetsService.saveMetadata(dto, req.user);
    }
    createSignedDownloadUrl(id, query, req) {
        return this.fileAssetsService.generateSignedDownloadUrl(id, query.tenantId, req.user);
    }
    remove(id, req) {
        return this.fileAssetsService.remove(id, req.user);
    }
};
exports.FileAssetsController = FileAssetsController;
__decorate([
    (0, common_1.Post)('presigned-upload-url'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_presigned_upload_url_dto_1.CreatePresignedUploadUrlDto, Object]),
    __metadata("design:returntype", void 0)
], FileAssetsController.prototype, "createPresignedUploadUrl", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_file_asset_dto_1.CreateFileAssetDto, Object]),
    __metadata("design:returntype", void 0)
], FileAssetsController.prototype, "createMetadata", null);
__decorate([
    (0, common_1.Get)(':id/signed-download-url'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, generate_signed_download_url_dto_1.GenerateSignedDownloadUrlDto, Object]),
    __metadata("design:returntype", void 0)
], FileAssetsController.prototype, "createSignedDownloadUrl", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FileAssetsController.prototype, "remove", null);
exports.FileAssetsController = FileAssetsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, file_asset_tenant_guard_1.FileAssetTenantGuard),
    (0, common_1.Controller)('file-assets'),
    __metadata("design:paramtypes", [file_assets_service_1.FileAssetsService])
], FileAssetsController);
//# sourceMappingURL=file-assets.controller.js.map