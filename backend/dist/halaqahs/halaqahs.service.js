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
exports.HalaqahsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HalaqahsService = class HalaqahsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { id: dto.teacherId },
        });
        if (!teacher) {
            throw new common_1.NotFoundException(`Teacher with ID ${dto.teacherId} not found`);
        }
        const existing = await this.prisma.halaqah.findUnique({
            where: {
                teacherId_name: {
                    teacherId: dto.teacherId,
                    name: dto.name,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Halaqah with name ${dto.name} already exists for this teacher`);
        }
        return this.prisma.halaqah.create({
            data: dto,
            include: {
                teacher: true,
            },
        });
    }
    async findAll() {
        return this.prisma.halaqah.findMany({
            include: {
                teacher: true,
                _count: {
                    select: { students: true },
                },
            },
        });
    }
    async findOne(id) {
        const halaqah = await this.prisma.halaqah.findUnique({
            where: { id },
            include: {
                teacher: true,
                students: true,
            },
        });
        if (!halaqah) {
            throw new common_1.NotFoundException(`Halaqah with ID ${id} not found`);
        }
        return halaqah;
    }
    async findByTeacher(teacherId) {
        return this.prisma.halaqah.findMany({
            where: { teacherId },
            include: {
                _count: {
                    select: { students: true },
                },
            },
        });
    }
    async update(id, dto) {
        const halaqah = await this.findOne(id);
        return this.prisma.halaqah.update({
            where: { id },
            data: dto,
            include: {
                teacher: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.halaqah.delete({
            where: { id },
        });
    }
};
exports.HalaqahsService = HalaqahsService;
exports.HalaqahsService = HalaqahsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HalaqahsService);
//# sourceMappingURL=halaqahs.service.js.map