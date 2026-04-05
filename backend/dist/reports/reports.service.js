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
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
                    include: { teacher: true }
                }
            }
        });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
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
            ...student,
            totalMemorizedPages: memorizationProgress._sum.totalPages ?? student.totalMemorizedPages,
            lastMemorizedPage: memorizationProgress._max.endPage ?? student.lastMemorizedPage,
        };
    }
    async getHalaqahReport(halaqahId) {
        const halaqah = await this.prisma.halaqah.findUnique({
            where: { id: halaqahId },
            include: {
                teacher: true,
                students: {
                    include: {
                        _count: {
                            select: { sessions: true }
                        }
                    }
                }
            }
        });
        if (!halaqah)
            throw new common_1.NotFoundException('Halaqah not found');
        return halaqah;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map