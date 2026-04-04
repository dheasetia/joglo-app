"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileAssetsModule = void 0;
const common_1 = require("@nestjs/common");
const file_assets_controller_1 = require("./file-assets.controller");
const file_assets_service_1 = require("./file-assets.service");
const storage_module_1 = require("../storage/storage.module");
const file_asset_tenant_guard_1 = require("./guards/file-asset-tenant.guard");
let FileAssetsModule = class FileAssetsModule {
};
exports.FileAssetsModule = FileAssetsModule;
exports.FileAssetsModule = FileAssetsModule = __decorate([
    (0, common_1.Module)({
        imports: [storage_module_1.StorageModule],
        controllers: [file_assets_controller_1.FileAssetsController],
        providers: [file_assets_service_1.FileAssetsService, file_asset_tenant_guard_1.FileAssetTenantGuard],
    })
], FileAssetsModule);
//# sourceMappingURL=file-assets.module.js.map