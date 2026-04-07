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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    prisma;
    jwt;
    usersService;
    constructor(prisma, jwt, usersService) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.usersService = usersService;
    }
    async register(dto) {
        const normalizedEmail = dto.email.trim().toLowerCase();
        const userExists = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: { id: true },
        });
        if (userExists) {
            throw new common_1.BadRequestException('User already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: normalizedEmail,
                passwordHash: hashedPassword,
                name: dto.name,
                role: dto.role,
            },
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                photoUrl: true,
            },
        });
        if (user.role === 'MUHAFFIZH') {
            await this.prisma.teacher.create({
                data: {
                    userId: user.id,
                    fullName: user.name,
                },
            });
        }
        const mappedUser = await this.usersService.getMe(user.id);
        return this.signToken(mappedUser.id, mappedUser.email, mappedUser.role, mappedUser.name, mappedUser.photoUrl);
    }
    async login(dto) {
        const normalizedEmail = dto.email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                photoUrl: true,
                passwordHash: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const mappedUser = await this.usersService.getMe(user.id);
        return this.signToken(mappedUser.id, mappedUser.email, mappedUser.role, mappedUser.name, mappedUser.photoUrl);
    }
    async signToken(userId, email, role, name, photoUrl) {
        const payload = { sub: userId, email, role, name };
        const secret = process.env.JWT_SECRET || 'secret';
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '7d',
            secret: secret,
        });
        return {
            access_token: token,
            user: {
                id: userId,
                email,
                role,
                name,
                photoUrl,
            }
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map