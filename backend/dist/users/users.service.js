"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    isPrismaError(error) {
        return typeof error === 'object' && error !== null;
    }
    isMissingPhotoUrlColumnError(error) {
        if (!this.isPrismaError(error)) {
            return false;
        }
        if (error.code !== 'P2022') {
            return false;
        }
        const column = String(error.meta?.column ?? '');
        const message = String(error.message ?? '');
        const originalMessage = String(error.meta?.originalMessage ?? '');
        return (column.includes('photoUrl') ||
            message.includes('photoUrl') ||
            originalMessage.includes('photoUrl'));
    }
    async findAll() {
        try {
            return await this.prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    photoUrl: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (error) {
            if (!this.isMissingPhotoUrlColumnError(error)) {
                throw error;
            }
            const users = await this.prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            });
            return users.map((user) => ({ ...user, photoUrl: null }));
        }
    }
    async findOne(id) {
        let user = null;
        try {
            user = await this.prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    photoUrl: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                    passwordHash: true,
                    teacher: true,
                },
            });
        }
        catch (error) {
            if (!this.isMissingPhotoUrlColumnError(error)) {
                throw error;
            }
            const fallbackUser = await this.prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                    passwordHash: true,
                    teacher: true,
                },
            });
            user = fallbackUser ? { ...fallbackUser, photoUrl: null } : null;
        }
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { passwordHash: _passwordHash, ...safeUser } = user;
        return safeUser;
    }
    async getMe(userId) {
        return this.findOne(userId);
    }
    async create(dto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { id: true },
        });
        if (existing) {
            throw new common_1.BadRequestException('Email already in use');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        let user;
        try {
            user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    passwordHash,
                    name: dto.name,
                    role: dto.role,
                    isActive: dto.isActive ?? true,
                    photoUrl: dto.photoUrl,
                },
            });
        }
        catch (error) {
            if (!this.isMissingPhotoUrlColumnError(error)) {
                throw error;
            }
            user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    passwordHash,
                    name: dto.name,
                    role: dto.role,
                    isActive: dto.isActive ?? true,
                },
            });
        }
        if (user.role === 'MUHAFFIZH') {
            await this.prisma.teacher.create({
                data: { userId: user.id, fullName: user.name },
            });
        }
        return { id: user.id };
    }
    async update(id, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (dto.role === 'MUHAFFIZH') {
            const teacher = await this.prisma.teacher.findUnique({ where: { userId: id } });
            if (!teacher) {
                await this.prisma.teacher.create({ data: { userId: id, fullName: dto.name ?? user.name } });
            }
        }
        if (dto.email) {
            const existing = await this.prisma.user.findFirst({ where: { email: dto.email, id: { not: id } } });
            if (existing) {
                throw new common_1.BadRequestException('Email already in use');
            }
        }
        let updated;
        try {
            updated = await this.prisma.user.update({
                where: { id },
                data: {
                    email: dto.email,
                    name: dto.name,
                    role: dto.role,
                    isActive: dto.isActive,
                    photoUrl: dto.photoUrl,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    photoUrl: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                },
            });
        }
        catch (error) {
            if (!this.isMissingPhotoUrlColumnError(error)) {
                throw error;
            }
            const fallbackUpdated = await this.prisma.user.update({
                where: { id },
                data: {
                    email: dto.email,
                    name: dto.name,
                    role: dto.role,
                    isActive: dto.isActive,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                },
            });
            updated = { ...fallbackUpdated, photoUrl: null };
        }
        return updated;
    }
    async updatePassword(id, dto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const passwordHash = await bcrypt.hash(dto.password, 10);
        await this.prisma.user.update({ where: { id }, data: { passwordHash } });
        return { success: true };
    }
    async updateMyPassword(id, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true, passwordHash: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new common_1.BadRequestException('Password saat ini tidak sesuai');
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({ where: { id }, data: { passwordHash } });
        return { success: true };
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({ where: { id }, include: { teacher: true } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.teacher) {
            await this.prisma.teacher.delete({ where: { id: user.teacher.id } });
        }
        await this.prisma.user.delete({ where: { id } });
        return { success: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map