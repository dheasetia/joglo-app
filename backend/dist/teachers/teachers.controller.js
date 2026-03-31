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
exports.TeachersController = void 0;
const common_1 = require("@nestjs/common");
const teachers_service_1 = require("./teachers.service");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const roles_guard_1 = require("../auth/guard/roles.guard");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const client_1 = require("@prisma/client");
const teacher_dto_1 = require("./dto/teacher.dto");
const get_user_decorator_1 = require("../auth/decorator/get-user.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
let TeachersController = class TeachersController {
    teachersService;
    prismaService;
    constructor(teachersService, prismaService) {
        this.teachersService = teachersService;
        this.prismaService = prismaService;
    }
    findAll() {
        return this.teachersService.findAll();
    }
    async findOne(id, user) {
        if (user.role === client_1.UserRole.MUHAFFIZH) {
            const teacher = await this.prismaService.teacher.findUnique({ where: { userId: user.id } });
            if (!teacher || teacher.id !== id) {
                throw new common_1.ForbiddenException('Anda tidak dapat mengakses data muhaffizh lain');
            }
        }
        return this.teachersService.findOne(id);
    }
    async update(id, dto, user) {
        if (user.role === client_1.UserRole.MUHAFFIZH) {
            const teacher = await this.prismaService.teacher.findUnique({ where: { userId: user.id } });
            if (!teacher || teacher.id !== id) {
                throw new common_1.ForbiddenException('Anda tidak dapat mengubah data muhaffizh lain');
            }
        }
        return this.teachersService.update(id, dto);
    }
    remove(id) {
        return this.teachersService.remove(id);
    }
};
exports.TeachersController = TeachersController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TeachersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, teacher_dto_1.UpdateTeacherDto, Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeachersController.prototype, "remove", null);
exports.TeachersController = TeachersController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('teachers'),
    __metadata("design:paramtypes", [teachers_service_1.TeachersService,
        prisma_service_1.PrismaService])
], TeachersController);
//# sourceMappingURL=teachers.controller.js.map