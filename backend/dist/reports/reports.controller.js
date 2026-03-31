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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const get_user_decorator_1 = require("../auth/decorator/get-user.decorator");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsController = class ReportsController {
    reportsService;
    prisma;
    constructor(reportsService, prisma) {
        this.reportsService = reportsService;
        this.prisma = prisma;
    }
    async getStudentProgress(user, id) {
        if (user.role === client_1.UserRole.MUHAFFIZH) {
            const teacher = await this.prisma.teacher.findUnique({
                where: { userId: user.id }
            });
            const student = await this.prisma.student.findUnique({
                where: { id },
                include: { halaqah: true }
            });
            if (teacher && student && student.halaqah.teacherId !== teacher.id) {
                throw new common_1.UnauthorizedException('Anda tidak memiliki akses ke data santri ini.');
            }
        }
        return this.reportsService.getStudentProgress(id);
    }
    async getHalaqahReport(user, id) {
        if (user.role === client_1.UserRole.MUHAFFIZH) {
            const teacher = await this.prisma.teacher.findUnique({
                where: { userId: user.id }
            });
            const halaqah = await this.prisma.halaqah.findUnique({
                where: { id }
            });
            if (teacher && halaqah && halaqah.teacherId !== teacher.id) {
                throw new common_1.UnauthorizedException('Anda tidak memiliki akses ke data halaqah ini.');
            }
        }
        return this.reportsService.getHalaqahReport(id);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('student/:id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getStudentProgress", null);
__decorate([
    (0, common_1.Get)('halaqah/:id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getHalaqahReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService,
        prisma_service_1.PrismaService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map