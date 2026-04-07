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
exports.MemorizationSessionsController = void 0;
const common_1 = require("@nestjs/common");
const memorization_sessions_service_1 = require("./memorization-sessions.service");
const session_dto_1 = require("./dto/session.dto");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const roles_guard_1 = require("../auth/guard/roles.guard");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const client_1 = require("@prisma/client");
const get_user_decorator_1 = require("../auth/decorator/get-user.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
let MemorizationSessionsController = class MemorizationSessionsController {
    sessionsService;
    prismaService;
    constructor(sessionsService, prismaService) {
        this.sessionsService = sessionsService;
        this.prismaService = prismaService;
    }
    async getTeacherByUser(user) {
        return this.prismaService.teacher.findUnique({
            where: { userId: user.id },
            select: { id: true },
        });
    }
    async ensureSessionAccess(sessionId, user) {
        const session = await this.sessionsService.findOne(sessionId);
        if (user.role === client_1.UserRole.ADMIN) {
            return session;
        }
        const teacher = await this.getTeacherByUser(user);
        if (!teacher) {
            throw new common_1.UnauthorizedException('User is not a teacher');
        }
        if (session.teacherId !== teacher.id) {
            throw new common_1.UnauthorizedException('Anda tidak memiliki akses ke sesi ini');
        }
        return session;
    }
    async create(user, createSessionDto) {
        const teacher = await this.prismaService.teacher.findUnique({
            where: { userId: user.id }
        });
        if (!teacher && user.role !== client_1.UserRole.ADMIN) {
            throw new common_1.UnauthorizedException('User is not a teacher');
        }
        let teacherId = teacher?.id;
        if (!teacherId && user.role === client_1.UserRole.ADMIN) {
            const halaqah = await this.prismaService.halaqah.findUnique({
                where: { id: createSessionDto.halaqahId },
                select: { teacherId: true },
            });
            if (!halaqah) {
                throw new common_1.BadRequestException('Halaqah tidak ditemukan');
            }
            teacherId = halaqah.teacherId;
        }
        if (!teacherId) {
            throw new common_1.UnauthorizedException('User is not a teacher');
        }
        return this.sessionsService.create(teacherId, createSessionDto);
    }
    async findAll(user, studentId, date) {
        if (studentId && !date) {
            return this.sessionsService.findByStudent(studentId);
        }
        if (date && user.role === client_1.UserRole.ADMIN) {
            return this.sessionsService.findByDate(date, {
                studentId: studentId || undefined,
            });
        }
        if (user.role === client_1.UserRole.MUHAFFIZH) {
            const teacher = await this.prismaService.teacher.findUnique({
                where: { userId: user.id }
            });
            if (teacher) {
                if (date) {
                    return this.sessionsService.findByDate(date, {
                        studentId: studentId || undefined,
                        teacherId: teacher.id,
                    });
                }
                return this.sessionsService.findByTeacher(teacher.id, studentId || undefined);
            }
        }
        return this.sessionsService.findAll();
    }
    async findOne(user, id) {
        await this.ensureSessionAccess(id, user);
        return this.sessionsService.findOne(id);
    }
    async createNote(user, id, dto) {
        await this.ensureSessionAccess(id, user);
        return this.sessionsService.createNote(id, dto);
    }
    async updateNote(user, id, noteId, dto) {
        await this.ensureSessionAccess(id, user);
        return this.sessionsService.updateNote(id, noteId, dto);
    }
    async removeNote(user, id, noteId) {
        await this.ensureSessionAccess(id, user);
        return this.sessionsService.removeNote(id, noteId);
    }
    async update(user, id, updateSessionDto) {
        await this.ensureSessionAccess(id, user);
        return this.sessionsService.update(id, updateSessionDto);
    }
    async remove(user, id) {
        if (user.role === client_1.UserRole.ADMIN) {
            return this.sessionsService.remove(id, user.role);
        }
        const teacher = await this.prismaService.teacher.findUnique({
            where: { userId: user.id },
            select: { id: true },
        });
        if (!teacher) {
            throw new common_1.UnauthorizedException('User is not a teacher');
        }
        return this.sessionsService.remove(id, user.role, teacher.id);
    }
};
exports.MemorizationSessionsController = MemorizationSessionsController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MUHAFFIZH),
    (0, common_1.Post)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_dto_1.CreateSessionDto]),
    __metadata("design:returntype", Promise)
], MemorizationSessionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('studentId')),
    __param(2, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MemorizationSessionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MemorizationSessionsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MUHAFFIZH),
    (0, common_1.Post)(':id/notes'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, session_dto_1.CreateSessionNoteDto]),
    __metadata("design:returntype", Promise)
], MemorizationSessionsController.prototype, "createNote", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MUHAFFIZH),
    (0, common_1.Patch)(':id/notes/:noteId'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('noteId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, session_dto_1.CreateSessionNoteDto]),
    __metadata("design:returntype", Promise)
], MemorizationSessionsController.prototype, "updateNote", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MUHAFFIZH),
    (0, common_1.Delete)(':id/notes/:noteId'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('noteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MemorizationSessionsController.prototype, "removeNote", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MUHAFFIZH),
    (0, common_1.Patch)(':id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, session_dto_1.UpdateSessionDto]),
    __metadata("design:returntype", Promise)
], MemorizationSessionsController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MUHAFFIZH),
    (0, common_1.Delete)(':id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MemorizationSessionsController.prototype, "remove", null);
exports.MemorizationSessionsController = MemorizationSessionsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('memorization-sessions'),
    __metadata("design:paramtypes", [memorization_sessions_service_1.MemorizationSessionsService,
        prisma_service_1.PrismaService])
], MemorizationSessionsController);
//# sourceMappingURL=memorization-sessions.controller.js.map