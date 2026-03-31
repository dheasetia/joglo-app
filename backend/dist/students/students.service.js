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
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const halaqah = await this.prisma.halaqah.findUnique({
            where: { id: dto.halaqahId },
        });
        if (!halaqah) {
            throw new common_1.NotFoundException(`Halaqah with ID ${dto.halaqahId} not found`);
        }
        if (dto.nis) {
            const existing = await this.prisma.student.findUnique({
                where: { nis: dto.nis },
            });
            if (existing) {
                throw new common_1.ConflictException(`Student with NIS ${dto.nis} already exists`);
            }
        }
        return this.prisma.student.create({
            data: dto,
            include: {
                halaqah: {
                    include: {
                        teacher: true,
                    },
                },
            },
        });
    }
    async findAll() {
        return this.prisma.student.findMany({
            include: {
                halaqah: {
                    include: {
                        teacher: true,
                    },
                },
            },
        });
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
        return student;
    }
    async findByHalaqah(halaqahId) {
        return this.prisma.student.findMany({
            where: { halaqahId },
            include: {
                halaqah: {
                    include: {
                        teacher: true,
                    },
                },
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.student.update({
            where: { id },
            data: dto,
            include: {
                halaqah: true,
            },
        });
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map