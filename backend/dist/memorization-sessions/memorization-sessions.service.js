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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemorizationSessionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let MemorizationSessionsService = class MemorizationSessionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(teacherId, dto) {
        if (dto.startPage && dto.endPage && dto.startPage > dto.endPage) {
            throw new common_1.BadRequestException('Start page cannot be greater than end page');
        }
        const student = await this.prisma.student.findUnique({
            where: { id: dto.studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${dto.studentId} not found`);
        }
        let totalPages = null;
        if (dto.startPage !== undefined && dto.endPage !== undefined) {
            totalPages = dto.endPage - dto.startPage + 1;
        }
        const session = await this.prisma.memorizationSession.create({
            data: {
                ...dto,
                teacherId,
                totalPages,
                sessionDate: new Date(dto.sessionDate),
            },
            include: {
                student: true,
                teacher: true,
            },
        });
        if (dto.sessionType === client_1.SessionType.ZIYADAH && dto.recommendation === 'CONTINUE') {
            await this.updateStudentProgress(dto.studentId);
        }
        return session;
    }
    async findAll() {
        return this.prisma.memorizationSession.findMany({
            include: {
                student: true,
                teacher: true,
                halaqah: true,
            },
            orderBy: {
                sessionDate: 'desc',
            },
        });
    }
    async findOne(id) {
        const session = await this.prisma.memorizationSession.findUnique({
            where: { id },
            include: {
                student: true,
                teacher: true,
                halaqah: true,
            },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${id} not found`);
        }
        return session;
    }
    async findByStudent(studentId) {
        return this.prisma.memorizationSession.findMany({
            where: { studentId },
            include: {
                teacher: true,
                halaqah: true,
            },
            orderBy: {
                sessionDate: 'desc',
            },
        });
    }
    async update(id, dto) {
        const oldSession = await this.findOne(id);
        if (dto.startPage !== undefined || dto.endPage !== undefined) {
            const startPage = dto.startPage ?? oldSession.startPage;
            const endPage = dto.endPage ?? oldSession.endPage;
            if (startPage && endPage && startPage > endPage) {
                throw new common_1.BadRequestException('Start page cannot be greater than end page');
            }
        }
        let totalPages = undefined;
        if (dto.startPage !== undefined || dto.endPage !== undefined) {
            const start = dto.startPage !== undefined ? dto.startPage : oldSession.startPage;
            const end = dto.endPage !== undefined ? dto.endPage : oldSession.endPage;
            if (start !== null && end !== null) {
                totalPages = end - start + 1;
            }
        }
        const updatedSession = await this.prisma.memorizationSession.update({
            where: { id },
            data: {
                ...dto,
                totalPages,
                sessionDate: dto.sessionDate ? new Date(dto.sessionDate) : undefined,
            },
            include: {
                student: true,
                teacher: true,
            },
        });
        const typeChanged = dto.sessionType && dto.sessionType !== oldSession.sessionType;
        const recommendationChanged = dto.recommendation && dto.recommendation !== oldSession.recommendation;
        const pagesChanged = dto.startPage !== undefined || dto.endPage !== undefined;
        if (typeChanged ||
            recommendationChanged ||
            pagesChanged ||
            oldSession.sessionType === client_1.SessionType.ZIYADAH) {
            await this.updateStudentProgress(updatedSession.studentId);
        }
        return updatedSession;
    }
    async remove(id) {
        const session = await this.findOne(id);
        const result = await this.prisma.memorizationSession.delete({
            where: { id },
        });
        if (session.sessionType === client_1.SessionType.ZIYADAH && session.recommendation === 'CONTINUE') {
            await this.updateStudentProgress(session.studentId);
        }
        return result;
    }
    async updateStudentProgress(studentId) {
        const sessions = await this.prisma.memorizationSession.findMany({
            where: {
                studentId,
                sessionType: client_1.SessionType.ZIYADAH,
                recommendation: 'CONTINUE',
            },
            orderBy: {
                sessionDate: 'asc',
            },
        });
        let totalPages = 0;
        let lastPage = 0;
        for (const s of sessions) {
            if (s.totalPages) {
                totalPages += s.totalPages;
            }
            if (s.endPage && s.endPage > lastPage) {
                lastPage = s.endPage;
            }
        }
        await this.prisma.student.update({
            where: { id: studentId },
            data: {
                totalMemorizedPages: totalPages,
                lastMemorizedPage: lastPage > 0 ? lastPage : null,
            },
        });
    }
};
exports.MemorizationSessionsService = MemorizationSessionsService;
exports.MemorizationSessionsService = MemorizationSessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MemorizationSessionsService);
//# sourceMappingURL=memorization-sessions.service.js.map