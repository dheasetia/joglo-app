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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const students_service_1 = require("./students.service");
const student_dto_1 = require("./dto/student.dto");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const roles_guard_1 = require("../auth/guard/roles.guard");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const client_1 = require("@prisma/client");
const get_user_decorator_1 = require("../auth/decorator/get-user.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
const platform_express_1 = require("@nestjs/platform-express");
const upload_util_1 = require("../common/upload.util");
let StudentsController = class StudentsController {
    studentsService;
    prismaService;
    constructor(studentsService, prismaService) {
        this.studentsService = studentsService;
        this.prismaService = prismaService;
    }
    async create(createStudentDto, user, file) {
        createStudentDto.photoUrl = (0, upload_util_1.toPublicUploadPath)(file) ?? createStudentDto.photoUrl;
        if (user.role === client_1.UserRole.MUHAFFIZH) {
            const teacher = await this.prismaService.teacher.findUnique({ where: { userId: user.id } });
            const halaqah = await this.prismaService.halaqah.findUnique({ where: { id: createStudentDto.halaqahId } });
            if (!teacher || !halaqah || halaqah.teacherId !== teacher.id) {
                throw new common_1.ForbiddenException('Anda tidak dapat menambah santri di halaqah ini');
            }
        }
        return this.studentsService.create(createStudentDto);
    }
    async findAll(user, halaqahId) {
        if (halaqahId) {
            return this.studentsService.findByHalaqah(halaqahId);
        }
        if (user.role === client_1.UserRole.MUHAFFIZH) {
            const teacher = await this.prismaService.teacher.findUnique({
                where: { userId: user.id },
            });
            if (teacher) {
                const halaqahs = await this.prismaService.halaqah.findMany({
                    where: { teacherId: teacher.id },
                    select: { id: true },
                });
                const halaqahIds = halaqahs.map((h) => h.id);
                return this.prismaService.student.findMany({
                    where: { halaqahId: { in: halaqahIds } },
                    include: {
                        halaqah: {
                            include: {
                                teacher: true,
                            },
                        },
                    },
                });
            }
        }
        return this.studentsService.findAll();
    }
    findOne(id) {
        return this.studentsService.findOne(id);
    }
    update(id, updateStudentDto, file) {
        updateStudentDto.photoUrl = (0, upload_util_1.toPublicUploadPath)(file) ?? updateStudentDto.photoUrl;
        return this.studentsService.update(id, updateStudentDto);
    }
    remove(id) {
        return this.studentsService.remove(id);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', upload_util_1.imageUploadOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [student_dto_1.CreateStudentDto, Object, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('halaqahId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', upload_util_1.imageUploadOptions)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, student_dto_1.UpdateStudentDto, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "remove", null);
exports.StudentsController = StudentsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('students'),
    __metadata("design:paramtypes", [students_service_1.StudentsService,
        prisma_service_1.PrismaService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map