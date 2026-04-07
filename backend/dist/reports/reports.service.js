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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const photo_url_util_1 = require("../common/photo-url.util");
const storage_service_1 = require("../storage/storage.service");
let ReportsService = class ReportsService {
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
        try {
            const signed = await this.storageService.createPresignedDownloadUrl(sanitizedPhoto);
            return {
                ...record,
                photoUrl: signed.url,
            };
        }
        catch (error) {
            console.error('Error generating presigned URL:', error);
            return {
                ...record,
                photoUrl: null,
            };
        }
    }
    async getStudentProgress(studentId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                sessions: {
                    orderBy: { sessionDate: 'desc' },
                    take: 10,
                },
                exams: {
                    orderBy: { examDate: 'desc' },
                },
                halaqah: {
                    include: {
                        teacher: {
                            include: {
                                user: {
                                    select: {
                                        photoUrl: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        const mappedStudent = await this.mapPhotoUrl(student);
        if (mappedStudent.halaqah?.teacher?.user) {
            mappedStudent.halaqah.teacher.user = await this.mapPhotoUrl(mappedStudent.halaqah.teacher.user);
        }
        const memorizationProgress = await this.prisma.memorizationSession.aggregate({
            where: {
                studentId,
                sessionType: client_1.SessionType.ZIYADAH,
                recommendation: 'CONTINUE',
            },
            _sum: {
                totalPages: true,
            },
            _max: {
                endPage: true,
            },
        });
        return {
            ...mappedStudent,
            totalMemorizedPages: memorizationProgress._sum.totalPages ?? student.totalMemorizedPages,
            lastMemorizedPage: memorizationProgress._max.endPage ?? student.lastMemorizedPage,
        };
    }
    async getHalaqahReport(halaqahId) {
        const halaqah = await this.prisma.halaqah.findUnique({
            where: { id: halaqahId },
            include: {
                teacher: {
                    include: {
                        user: {
                            select: {
                                photoUrl: true
                            }
                        }
                    }
                },
                students: {
                    select: {
                        id: true,
                        fullName: true,
                        nis: true,
                        photoUrl: true,
                        currentJuz: true,
                        _count: {
                            select: { sessions: true }
                        }
                    }
                }
            }
        });
        if (!halaqah)
            throw new common_1.NotFoundException('Halaqah not found');
        if (halaqah.teacher?.user) {
            halaqah.teacher.user = await this.mapPhotoUrl(halaqah.teacher.user);
        }
        if (halaqah.students) {
            halaqah.students = await Promise.all(halaqah.students.map((student) => this.mapPhotoUrl(student)));
        }
        return halaqah;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map