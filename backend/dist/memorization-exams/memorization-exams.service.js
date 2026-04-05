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
exports.MemorizationExamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let MemorizationExamsService = class MemorizationExamsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(teacherId, dto) {
        if (dto.startPage > dto.endPage) {
            throw new common_1.BadRequestException('Start page cannot be greater than end page');
        }
        const student = await this.prisma.student.findUnique({
            where: { id: dto.studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${dto.studentId} not found`);
        }
        const exam = await this.prisma.memorizationExam.create({
            data: {
                ...dto,
                teacherId,
                examDate: new Date(dto.examDate),
                periodStart: dto.periodStart ? new Date(dto.periodStart) : undefined,
                periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : undefined,
            },
            include: {
                student: true,
                teacher: true,
            },
        });
        if (exam.resultStatus === client_1.ExamResultStatus.PASSED && exam.endPage) {
            await this.prisma.student.update({
                where: { id: exam.studentId },
                data: { currentPage: exam.endPage }
            });
        }
        return exam;
    }
    async findAll() {
        return this.prisma.memorizationExam.findMany({
            include: {
                student: true,
                teacher: true,
                halaqah: true,
            },
            orderBy: {
                examDate: 'desc',
            },
        });
    }
    async findOne(id) {
        const exam = await this.prisma.memorizationExam.findUnique({
            where: { id },
            include: {
                student: true,
                teacher: true,
                halaqah: true,
            },
        });
        if (!exam) {
            throw new common_1.NotFoundException(`Exam with ID ${id} not found`);
        }
        return exam;
    }
    async findByStudent(studentId) {
        return this.prisma.memorizationExam.findMany({
            where: { studentId },
            include: {
                teacher: true,
                halaqah: true,
            },
            orderBy: {
                examDate: 'desc',
            },
        });
    }
    async update(id, dto) {
        const oldExam = await this.findOne(id);
        if (dto.startPage !== undefined || dto.endPage !== undefined) {
            const start = dto.startPage ?? oldExam.startPage;
            const end = dto.endPage ?? oldExam.endPage;
            if (start !== null && end !== null && start > end) {
                throw new common_1.BadRequestException('Start page cannot be greater than end page');
            }
        }
        const updatedExam = await this.prisma.memorizationExam.update({
            where: { id },
            data: {
                ...dto,
                examDate: dto.examDate ? new Date(dto.examDate) : undefined,
                periodStart: dto.periodStart ? new Date(dto.periodStart) : undefined,
                periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : undefined,
            },
            include: {
                student: true,
                teacher: true,
            },
        });
        if (updatedExam.resultStatus === client_1.ExamResultStatus.PASSED && updatedExam.endPage) {
            await this.prisma.student.update({
                where: { id: updatedExam.studentId },
                data: { currentPage: updatedExam.endPage }
            });
        }
        return updatedExam;
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.memorizationExam.delete({
            where: { id },
        });
    }
};
exports.MemorizationExamsService = MemorizationExamsService;
exports.MemorizationExamsService = MemorizationExamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MemorizationExamsService);
//# sourceMappingURL=memorization-exams.service.js.map