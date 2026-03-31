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
exports.HalaqahsController = void 0;
const common_1 = require("@nestjs/common");
const halaqahs_service_1 = require("./halaqahs.service");
const halaqah_dto_1 = require("./dto/halaqah.dto");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const roles_guard_1 = require("../auth/guard/roles.guard");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const client_1 = require("@prisma/client");
const get_user_decorator_1 = require("../auth/decorator/get-user.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
let HalaqahsController = class HalaqahsController {
    halaqahsService;
    prismaService;
    constructor(halaqahsService, prismaService) {
        this.halaqahsService = halaqahsService;
        this.prismaService = prismaService;
    }
    create(createHalaqahDto) {
        return this.halaqahsService.create(createHalaqahDto);
    }
    async findAll(user) {
        if (user.role === client_1.UserRole.MUHAFFIZH) {
            const teacher = await this.prismaService.teacher.findUnique({
                where: { userId: user.id },
            });
            if (teacher) {
                return this.halaqahsService.findByTeacher(teacher.id);
            }
        }
        return this.halaqahsService.findAll();
    }
    findOne(id) {
        return this.halaqahsService.findOne(id);
    }
    async update(id, updateHalaqahDto, user) {
        if (user.role === client_1.UserRole.MUHAFFIZH) {
            const teacher = await this.prismaService.teacher.findUnique({ where: { userId: user.id } });
            const halaqah = await this.prismaService.halaqah.findUnique({ where: { id } });
            if (!teacher || !halaqah || halaqah.teacherId !== teacher.id) {
                throw new common_1.ForbiddenException('Anda tidak dapat mengubah data halaqah ini');
            }
            updateHalaqahDto.teacherId = teacher.id;
        }
        return this.halaqahsService.update(id, updateHalaqahDto);
    }
    remove(id) {
        return this.halaqahsService.remove(id);
    }
};
exports.HalaqahsController = HalaqahsController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [halaqah_dto_1.CreateHalaqahDto]),
    __metadata("design:returntype", void 0)
], HalaqahsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HalaqahsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HalaqahsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, halaqah_dto_1.UpdateHalaqahDto, Object]),
    __metadata("design:returntype", Promise)
], HalaqahsController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HalaqahsController.prototype, "remove", null);
exports.HalaqahsController = HalaqahsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('halaqahs'),
    __metadata("design:paramtypes", [halaqahs_service_1.HalaqahsService,
        prisma_service_1.PrismaService])
], HalaqahsController);
//# sourceMappingURL=halaqahs.controller.js.map