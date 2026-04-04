"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileAssetTenantGuard = void 0;
const common_1 = require("@nestjs/common");
const storage_constants_1 = require("../../storage/storage.constants");
let FileAssetTenantGuard = class FileAssetTenantGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const tenantId = request.body?.tenantId || request.query?.tenantId || storage_constants_1.DEFAULT_TENANT_ID;
        if (!user) {
            throw new common_1.ForbiddenException('User tidak terautentikasi.');
        }
        if (user.role === 'ADMIN') {
            return true;
        }
        if (tenantId !== storage_constants_1.DEFAULT_TENANT_ID) {
            throw new common_1.ForbiddenException('Akses tenant ditolak.');
        }
        return true;
    }
};
exports.FileAssetTenantGuard = FileAssetTenantGuard;
exports.FileAssetTenantGuard = FileAssetTenantGuard = __decorate([
    (0, common_1.Injectable)()
], FileAssetTenantGuard);
//# sourceMappingURL=file-asset-tenant.guard.js.map