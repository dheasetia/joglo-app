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
exports.MemorizationExamsController = void 0;
const common_1 = require("@nestjs/common");
const memorization_exams_service_1 = require("./memorization-exams.service");
const exam_dto_1 = require("./dto/exam.dto");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const roles_guard_1 = require("../auth/guard/roles.guard");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const client_1 = require("@prisma/client");
const get_user_decorator_1 = require("../auth/decorator/get-user.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
let MemorizationExamsController = class MemorizationExamsController {
    examsService;
    prismaService;
    constructor(examsService, prismaService) {
        this.examsService = examsService;
        this.prismaService = prismaService;
    }
    async create(user, createExamDto) {
        const teacher = await this.prismaService.teacher.findUnique({
            where: { userId: user.id }
        });
        if (!teacher && user.role !== client_1.UserRole.ADMIN) {
            throw new common_1.UnauthorizedException('User is not a teacher');
        }
        const teacherId = teacher?.id || 'admin-teacher-placeholder';
        return this.examsService.create(teacherId, createExamDto);
    }
    async findAll(user, studentId) {
        if (studentId) {
            return this.examsService.findByStudent(studentId);
        }
        if (user.role === client_1.UserRole.MUHAFFIZH) {
            const teacher = await this.prismaService.teacher.findUnique({
                where: { userId: user.id }
            });
            if (teacher) {
                const exams = await this.prismaService.memorizationExam.findMany({
                    where: { teacherId: teacher.id },
                    include: {
                        student: true,
                        teacher: true,
                        halaqah: true,
                        noteItems: {
                            orderBy: { createdAt: 'asc' },
                        },
                    },
                    orderBy: {
                        examDate: 'desc',
                    },
                });
                return exams.map((exam) => ({
                    ...exam,
                    noteSummary: {
                        KESALAHAN: exam.noteItems.filter((n) => n.noteType === 'KESALAHAN').length,
                        TEGURAN: exam.noteItems.filter((n) => n.noteType === 'TEGURAN').length,
                        PERHATIAN: exam.noteItems.filter((n) => n.noteType === 'PERHATIAN').length,
                    },
                }));
            }
        }
        return this.examsService.findAll();
    }
    findOne(id) {
        return this.examsService.findOne(id);
    }
    update(id, updateExamDto) {
        return this.examsService.update(id, updateExamDto);
    }
    createNote(user, id, dto) {
        return this.examsService.createNote(user, id, dto);
    }
    updateNote(user, id, noteId, dto) {
        return this.examsService.updateNote(user, id, noteId, dto);
    }
    removeNote(user, id, noteId) {
        return this.examsService.removeNote(user, id, noteId);
    }
    remove(id) {
        return this.examsService.remove(id);
    }
};
exports.MemorizationExamsController = MemorizationExamsController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MUHAFFIZH),
    (0, common_1.Post)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, exam_dto_1.CreateExamDto]),
    __metadata("design:returntype", Promise)
], MemorizationExamsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MemorizationExamsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemorizationExamsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MUHAFFIZH),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, exam_dto_1.UpdateExamDto]),
    __metadata("design:returntype", void 0)
], MemorizationExamsController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MUHAFFIZH),
    (0, common_1.Post)(':id/notes'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, exam_dto_1.CreateExamNoteDto]),
    __metadata("design:returntype", void 0)
], MemorizationExamsController.prototype, "createNote", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MUHAFFIZH),
    (0, common_1.Patch)(':id/notes/:noteId'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('noteId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, exam_dto_1.CreateExamNoteDto]),
    __metadata("design:returntype", void 0)
], MemorizationExamsController.prototype, "updateNote", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MUHAFFIZH),
    (0, common_1.Delete)(':id/notes/:noteId'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('noteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], MemorizationExamsController.prototype, "removeNote", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemorizationExamsController.prototype, "remove", null);
exports.MemorizationExamsController = MemorizationExamsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('memorization-exams'),
    __metadata("design:paramtypes", [memorization_exams_service_1.MemorizationExamsService,
        prisma_service_1.PrismaService])
], MemorizationExamsController);
//# sourceMappingURL=memorization-exams.controller.js.map