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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const photo_url_util_1 = require("../common/photo-url.util");
const storage_service_1 = require("../storage/storage.service");
let StudentsService = class StudentsService {
    prisma;
    storageService;
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async mapPhotoUrl(record) {
        const sanitizedPhoto = (0, photo_url_util_1.sanitizePhotoUrl)(record.photoUrl);
        if (!sanitizedPhoto) {
            return {
                ...record,
                photoUrl: sanitizedPhoto,
            };
        }
        if (/^https?:\/\//i.test(sanitizedPhoto)) {
            return {
                ...record,
                photoUrl: sanitizedPhoto,
            };
        }
        const signed = await this.storageService.createPresignedDownloadUrl(sanitizedPhoto);
        return {
            ...record,
            photoUrl: signed.url,
        };
    }
    normalizeOptionalString(value) {
        if (typeof value !== 'string') {
            return undefined;
        }
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }
    async create(dto) {
        const normalizedNis = this.normalizeOptionalString(dto.nis);
        const halaqah = await this.prisma.halaqah.findUnique({
            where: { id: dto.halaqahId },
        });
        if (!halaqah) {
            throw new common_1.NotFoundException(`Halaqah with ID ${dto.halaqahId} not found`);
        }
        if (normalizedNis) {
            const existing = await this.prisma.student.findUnique({
                where: { nis: normalizedNis },
            });
            if (existing) {
                throw new common_1.ConflictException(`Student with NIS ${normalizedNis} already exists`);
            }
        }
        const student = await this.prisma.student.create({
            data: {
                ...dto,
                nis: normalizedNis,
            },
            include: {
                halaqah: {
                    include: {
                        teacher: true,
                    },
                },
            },
        });
        return this.mapPhotoUrl(student);
    }
    async findAll() {
        const students = await this.prisma.student.findMany({
            orderBy: { fullName: 'asc' },
            include: {
                halaqah: {
                    include: {
                        teacher: true,
                    },
                },
            },
        });
        return Promise.all(students.map((student) => this.mapPhotoUrl(student)));
    }
    async findOne(id) {
        const student = await this.prisma.student.findUnique({
            where: { id },
            include: {
                halaqah: {
                    include: {
                        teacher: true,
                    },
                },
                sessions: {
                    orderBy: { sessionDate: 'desc' },
                    take: 10,
                    include: {
                        teacher: true,
                    },
                },
                exams: {
                    orderBy: { examDate: 'desc' },
                    take: 5,
                    include: {
                        teacher: true,
                    },
                },
                _count: {
                    select: {
                        sessions: true,
                        exams: true,
                    },
                },
            },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${id} not found`);
        }
        return this.mapPhotoUrl(student);
    }
    async findByHalaqah(halaqahId) {
        const students = await this.prisma.student.findMany({
            where: { halaqahId },
            orderBy: { fullName: 'asc' },
            include: {
                halaqah: {
                    include: {
                        teacher: true,
                    },
                },
            },
        });
        return Promise.all(students.map((student) => this.mapPhotoUrl(student)));
    }
    async findByHalaqahIds(halaqahIds) {
        const students = await this.prisma.student.findMany({
            where: {
                halaqahId: {
                    in: halaqahIds,
                },
            },
            orderBy: { fullName: 'asc' },
            include: {
                halaqah: {
                    include: {
                        teacher: true,
                    },
                },
            },
        });
        return Promise.all(students.map((student) => this.mapPhotoUrl(student)));
    }
    async update(id, dto) {
        const existingStudent = await this.findOne(id);
        const normalizedNis = this.normalizeOptionalString(dto.nis);
        if (normalizedNis && normalizedNis !== existingStudent.nis) {
            const studentWithSameNis = await this.prisma.student.findUnique({
                where: { nis: normalizedNis },
            });
            if (studentWithSameNis) {
                throw new common_1.ConflictException(`Student with NIS ${normalizedNis} already exists`);
            }
        }
        const student = await this.prisma.student.update({
            where: { id },
            data: {
                ...dto,
                nis: dto.nis === undefined ? undefined : normalizedNis,
            },
            include: {
                halaqah: true,
            },
        });
        return this.mapPhotoUrl(student);
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.student.delete({
            where: { id },
        });
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], StudentsService);
//# sourceMappingURL=students.service.js.map