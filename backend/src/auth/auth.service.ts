import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const userExists = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (userExists) {
      throw new BadRequestException('User already exists');
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
      },
    });

    // If role is MUHAFFIZH, automatically create a Teacher profile
    if (user.role === 'MUHAFFIZH') {
      await this.prisma.teacher.create({
        data: {
          userId: user.id,
          fullName: user.name,
        },
      });
    }

    return this.signToken(user.id, user.email, user.role, user.name, null);
  }

  async login(dto: LoginDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user.id, user.email, user.role, user.name, null);
  }

  async signToken(userId: string, email: string, role: string, name: string, photoUrl?: string | null) {
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
}
