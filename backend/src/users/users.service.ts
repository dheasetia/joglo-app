import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateMyPasswordDto, UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { sanitizePhotoUrl } from '../common/photo-url.util';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  private async mapPhotoUrl<T extends { photoUrl?: string | null }>(record: T): Promise<T> {
    const sanitizedPhoto = sanitizePhotoUrl(record.photoUrl);

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

  private isPrismaError(error: unknown): error is {
    code?: string;
    message?: string;
    meta?: { column?: string; originalMessage?: string };
  } {
    return typeof error === 'object' && error !== null;
  }

  private isMissingPhotoUrlColumnError(error: unknown) {
    if (!this.isPrismaError(error)) {
      return false;
    }

    if (error.code !== 'P2022') {
      return false;
    }

    const column = String(error.meta?.column ?? '');
    const message = String(error.message ?? '');
    const originalMessage = String(error.meta?.originalMessage ?? '');

    return (
      column.includes('photoUrl') ||
      message.includes('photoUrl') ||
      originalMessage.includes('photoUrl')
    );
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
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

      return Promise.all(users.map((user) => this.mapPhotoUrl(user)));
    } catch (error) {
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

  async findOne(id: string) {
    let user: {
      id: string;
      email: string;
      name: string;
      photoUrl: string | null;
      role: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      passwordHash?: string;
      teacher?: {
        id: string;
        userId: string;
        fullName: string;
        phone: string | null;
        notes: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
      } | null;
    } | null = null;

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
    } catch (error) {
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
      throw new NotFoundException('User not found');
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return this.mapPhotoUrl(safeUser);
  }

  async getMe(userId: string) {
    return this.findOne(userId);
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });
    if (existing) {
      throw new BadRequestException('Email already in use');
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
    } catch (error) {
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

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    // If role is changed to MUHAFFIZH and teacher profile doesn't exist, create it
    if (dto.role === 'MUHAFFIZH') {
      const teacher = await this.prisma.teacher.findUnique({ where: { userId: id } });
      if (!teacher) {
        await this.prisma.teacher.create({ data: { userId: id, fullName: dto.name ?? user.name } });
      }
    }

    // If role changed from MUHAFFIZH to ADMIN, optionally we could keep teacher profile; we won't delete to preserve data.

    if (dto.email) {
      const existing = await this.prisma.user.findFirst({ where: { email: dto.email, id: { not: id } } });
      if (existing) {
        throw new BadRequestException('Email already in use');
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
    } catch (error) {
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

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    await this.prisma.user.update({ where: { id }, data: { passwordHash } });
    return { success: true };
  }

  async updateMyPassword(id: string, dto: UpdateMyPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, passwordHash: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Password saat ini tidak sesuai');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({ where: { id }, data: { passwordHash } });
    return { success: true };
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, include: { teacher: true } });
    if (!user) throw new NotFoundException('User not found');
    // We use cascade delete from Teacher->User? In schema, Teacher has user relation with onDelete: Cascade (from Teacher to User). Deleting User will delete Teacher? No, relation is Teacher.user with onDelete: Cascade, so deleting User may be restricted. We will delete Teacher first if exists.
    if (user.teacher) {
      await this.prisma.teacher.delete({ where: { id: user.teacher.id } });
    }
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }
}
