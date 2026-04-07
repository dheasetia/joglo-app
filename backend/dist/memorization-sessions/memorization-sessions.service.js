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
const storage_service_1 = require("../storage/storage.service");
const photo_url_util_1 = require("../common/photo-url.util");
let MemorizationSessionsService = class MemorizationSessionsService {
    prisma;
    storageService;
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async mapStudentPhotoUrl(session) {
        if (session?.student?.photoUrl) {
            const sanitizedPhoto = (0, photo_url_util_1.sanitizePhotoUrl)(session.student.photoUrl);
            if (sanitizedPhoto && !/^https?:\/\//i.test(sanitizedPhoto)) {
                try {
                    const signed = await this.storageService.createPresignedDownloadUrl(sanitizedPhoto);
                    session.student.photoUrl = signed.url;
                }
                catch (error) {
                    console.error('Error generating presigned URL for session student:', error);
                    session.student.photoUrl = null;
                }
            }
            else {
                session.student.photoUrl = sanitizedPhoto;
            }
        }
        return session;
    }
    isSessionNoteTableMissing(error) {
        const err = error;
        const message = err?.message ?? '';
        return err?.code === 'P2021' && (message.includes('SessionNote') ||
            message.includes('session_notes') ||
            message.includes('noteItems'));
    }
    isSessionNoteSchemaNotReady(error) {
        const err = error;
        const message = `${err?.message ?? ''} ${err?.meta?.message ?? ''}`;
        if (this.isSessionNoteTableMissing(error)) {
            return true;
        }
        return ((err?.code === 'P2022' && (message.includes('SessionNote') ||
            message.includes('noteType') ||
            message.includes('sessionId'))) ||
            (err?.code === 'P2010' && (message.includes('SessionNoteType') ||
                message.includes('does not exist'))));
    }
    buildDateRange(date) {
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) {
            throw new common_1.BadRequestException('Format tanggal tidak valid');
        }
        const start = new Date(parsedDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(parsedDate);
        end.setHours(23, 59, 59, 999);
        return { start, end };
    }
    withDetailsInclude() {
        return {
            student: true,
            teacher: true,
            halaqah: true,
            noteItems: {
                orderBy: { createdAt: 'desc' },
            },
        };
    }
    withBasicInclude() {
        return {
            student: true,
            teacher: true,
            halaqah: true,
        };
    }
    async findManyWithSafeInclude(args) {
        try {
            return await this.prisma.memorizationSession.findMany({
                ...args,
                include: this.withDetailsInclude(),
            });
        }
        catch (error) {
            if (!this.isSessionNoteTableMissing(error)) {
                throw error;
            }
            return this.prisma.memorizationSession.findMany({
                ...args,
                include: this.withBasicInclude(),
            });
        }
    }
    async findUniqueWithSafeInclude(id) {
        try {
            return await this.prisma.memorizationSession.findUnique({
                where: { id },
                include: this.withDetailsInclude(),
            });
        }
        catch (error) {
            if (!this.isSessionNoteTableMissing(error)) {
                throw error;
            }
            return this.prisma.memorizationSession.findUnique({
                where: { id },
                include: this.withBasicInclude(),
            });
        }
    }
    withNoteSummary(session) {
        const summary = {
            KESALAHAN: 0,
            TEGURAN: 0,
            PERHATIAN: 0,
        };
        session.noteItems?.forEach((item) => {
            summary[item.noteType] += 1;
        });
        return {
            ...session,
            noteSummary: summary,
        };
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
        let session;
        try {
            session = await this.prisma.memorizationSession.create({
                data: {
                    ...dto,
                    teacherId,
                    totalPages,
                    score: dto.score ?? 80,
                    recommendation: dto.recommendation ?? client_1.Recommendation.CONTINUE,
                    sessionDate: new Date(dto.sessionDate),
                },
                include: this.withDetailsInclude(),
            });
        }
        catch (error) {
            if (!this.isSessionNoteTableMissing(error)) {
                throw error;
            }
            session = await this.prisma.memorizationSession.create({
                data: {
                    ...dto,
                    teacherId,
                    totalPages,
                    score: dto.score ?? 80,
                    recommendation: dto.recommendation ?? client_1.Recommendation.CONTINUE,
                    sessionDate: new Date(dto.sessionDate),
                },
                include: this.withBasicInclude(),
            });
        }
        const recommendation = dto.recommendation ?? client_1.Recommendation.CONTINUE;
        if (dto.sessionType === client_1.SessionType.ZIYADAH && recommendation === client_1.Recommendation.CONTINUE) {
            await this.updateStudentProgress(dto.studentId);
        }
        const sessionWithSummary = this.withNoteSummary(session);
        return this.mapStudentPhotoUrl(sessionWithSummary);
    }
    async findAll() {
        return this.findManyWithSafeInclude({
            orderBy: {
                sessionDate: 'desc',
            },
        }).then((items) => Promise.all(items.map((item) => this.mapStudentPhotoUrl(this.withNoteSummary(item)))));
    }
    async findByDate(date, options) {
        const { start, end } = this.buildDateRange(date);
        return this.findManyWithSafeInclude({
            where: {
                studentId: options?.studentId,
                teacherId: options?.teacherId,
                sessionDate: {
                    gte: start,
                    lte: end,
                },
            },
            orderBy: [
                {
                    sessionDate: 'desc',
                },
                {
                    createdAt: 'desc',
                },
            ],
        }).then((items) => Promise.all(items.map((item) => this.mapStudentPhotoUrl(this.withNoteSummary(item)))));
    }
    async findOne(id) {
        const session = await this.findUniqueWithSafeInclude(id);
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${id} not found`);
        }
        const sessionWithSummary = this.withNoteSummary(session);
        return this.mapStudentPhotoUrl(sessionWithSummary);
    }
    async findByStudent(studentId) {
        return this.findManyWithSafeInclude({
            where: { studentId },
            orderBy: {
                sessionDate: 'desc',
            },
        }).then((items) => Promise.all(items.map((item) => this.mapStudentPhotoUrl(this.withNoteSummary(item)))));
    }
    async findByTeacher(teacherId, studentId) {
        return this.findManyWithSafeInclude({
            where: {
                teacherId,
                studentId: studentId || undefined,
            },
            orderBy: {
                sessionDate: 'desc',
            },
        }).then((items) => Promise.all(items.map((item) => this.mapStudentPhotoUrl(this.withNoteSummary(item)))));
    }
    async update(id, dto) {
        const oldSession = await this.findUniqueWithSafeInclude(id);
        if (!oldSession) {
            throw new common_1.NotFoundException(`Session with ID ${id} not found`);
        }
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
        let updatedSession;
        try {
            updatedSession = await this.prisma.memorizationSession.update({
                where: { id },
                data: {
                    ...dto,
                    totalPages,
                    sessionDate: dto.sessionDate ? new Date(dto.sessionDate) : undefined,
                },
                include: this.withDetailsInclude(),
            });
        }
        catch (error) {
            if (!this.isSessionNoteTableMissing(error)) {
                throw error;
            }
            updatedSession = await this.prisma.memorizationSession.update({
                where: { id },
                data: {
                    ...dto,
                    totalPages,
                    sessionDate: dto.sessionDate ? new Date(dto.sessionDate) : undefined,
                },
                include: this.withBasicInclude(),
            });
        }
        const typeChanged = dto.sessionType && dto.sessionType !== oldSession.sessionType;
        const recommendationChanged = dto.recommendation && dto.recommendation !== oldSession.recommendation;
        const pagesChanged = dto.startPage !== undefined || dto.endPage !== undefined;
        if (typeChanged ||
            recommendationChanged ||
            pagesChanged ||
            oldSession.sessionType === client_1.SessionType.ZIYADAH) {
            await this.updateStudentProgress(updatedSession.studentId);
        }
        const sessionWithSummary = this.withNoteSummary(updatedSession);
        return this.mapStudentPhotoUrl(sessionWithSummary);
    }
    async createNote(sessionId, dto) {
        const session = await this.prisma.memorizationSession.findUnique({
            where: { id: sessionId },
            select: {
                id: true,
                startPage: true,
                endPage: true,
            },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${sessionId} not found`);
        }
        if (session.startPage && dto.page < session.startPage) {
            throw new common_1.BadRequestException('Halaman catatan tidak boleh kurang dari halaman mulai sesi.');
        }
        if (session.endPage && dto.page > session.endPage) {
            throw new common_1.BadRequestException('Halaman catatan tidak boleh melebihi halaman akhir sesi.');
        }
        try {
            await this.prisma.sessionNote.create({
                data: {
                    sessionId,
                    noteType: dto.noteType,
                    page: dto.page,
                    line: dto.line,
                    description: dto.description,
                },
            });
        }
        catch (error) {
            if (this.isSessionNoteSchemaNotReady(error)) {
                throw new common_1.BadRequestException('Fitur catatan sesi belum siap di database. Jalankan migrasi Prisma terbaru lalu coba simpan kembali.');
            }
            throw error;
        }
        return this.findOne(sessionId);
    }
    async updateNote(sessionId, noteId, dto) {
        const note = await this.prisma.sessionNote.findUnique({
            where: { id: noteId },
        });
        if (!note || note.sessionId !== sessionId) {
            throw new common_1.NotFoundException(`Catatan dengan ID ${noteId} tidak ditemukan di sesi ini.`);
        }
        if (dto.page !== undefined) {
            const session = await this.prisma.memorizationSession.findUnique({
                where: { id: sessionId },
                select: { startPage: true, endPage: true },
            });
            if (session) {
                if (session.startPage && dto.page < session.startPage) {
                    throw new common_1.BadRequestException('Halaman catatan tidak boleh kurang dari halaman mulai sesi.');
                }
                if (session.endPage && dto.page > session.endPage) {
                    throw new common_1.BadRequestException('Halaman catatan tidak boleh melebihi halaman akhir sesi.');
                }
            }
        }
        await this.prisma.sessionNote.update({
            where: { id: noteId },
            data: dto,
        });
        return this.findOne(sessionId);
    }
    async removeNote(sessionId, noteId) {
        const note = await this.prisma.sessionNote.findUnique({
            where: { id: noteId },
        });
        if (!note || note.sessionId !== sessionId) {
            throw new common_1.NotFoundException(`Catatan dengan ID ${noteId} tidak ditemukan di sesi ini.`);
        }
        await this.prisma.sessionNote.delete({
            where: { id: noteId },
        });
        return this.findOne(sessionId);
    }
    async remove(id, requesterRole, teacherId) {
        const session = await this.findOne(id);
        if (requesterRole === client_1.UserRole.MUHAFFIZH && session.teacherId !== teacherId) {
            throw new common_1.ForbiddenException('Anda hanya dapat menghapus sesi milik halaqah Anda.');
        }
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], MemorizationSessionsService);
//# sourceMappingURL=memorization-sessions.service.js.map