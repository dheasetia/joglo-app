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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const roles_guard_1 = require("../auth/guard/roles.guard");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const client_1 = require("@prisma/client");
const get_user_decorator_1 = require("../auth/decorator/get-user.decorator");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const storage_service_1 = require("../storage/storage.service");
let UsersController = class UsersController {
    usersService;
    storageService;
    constructor(usersService, storageService) {
        this.usersService = usersService;
        this.storageService = storageService;
    }
    static imageUploadOptions = {
        storage: (0, multer_1.memoryStorage)(),
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    };
    getMe(userId) {
        return this.usersService.getMe(userId);
    }
    findAll() {
        return this.usersService.findAll();
    }
    async create(dto, file) {
        if (file) {
            const normalizedName = this.storageService.sanitizeFileName(file.originalname);
            this.storageService.validateUploadConstraints({
                originalName: normalizedName,
                contentType: file.mimetype,
                size: file.size,
            });
            const key = this.storageService.buildObjectKey({
                tenantId: 'default-tenant',
                module: 'users',
                folder: 'avatars',
                originalName: normalizedName,
            });
            const uploaded = await this.storageService.uploadBuffer({
                key,
                contentType: file.mimetype,
                body: file.buffer,
            });
            dto.photoUrl = uploaded.key;
        }
        return this.usersService.create(dto);
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    async update(id, dto, user, file) {
        if (user.role !== client_1.UserRole.ADMIN && user.id !== id) {
            throw new common_1.ForbiddenException('Anda tidak dapat mengubah data pengguna lain');
        }
        if (file) {
            const normalizedName = this.storageService.sanitizeFileName(file.originalname);
            this.storageService.validateUploadConstraints({
                originalName: normalizedName,
                contentType: file.mimetype,
                size: file.size,
            });
            const key = this.storageService.buildObjectKey({
                tenantId: 'default-tenant',
                module: 'users',
                entityId: id,
                folder: 'avatars',
                originalName: normalizedName,
            });
            const uploaded = await this.storageService.uploadBuffer({
                key,
                contentType: file.mimetype,
                body: file.buffer,
            });
            dto.photoUrl = uploaded.key;
        }
        return this.usersService.update(id, dto);
    }
    updateMyPassword(userId, dto) {
        return this.usersService.updateMyPassword(userId, dto);
    }
    updatePassword(id, dto) {
        return this.usersService.updatePassword(id, dto);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMe", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', UsersController.imageUploadOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', UsersController.imageUploadOptions)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('me/password'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateMyPasswordDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMyPassword", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Patch)(':id/password'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updatePassword", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        storage_service_1.StorageService])
], UsersController);
//# sourceMappingURL=users.controller.js.map