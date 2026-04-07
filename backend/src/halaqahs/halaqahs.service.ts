import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHalaqahDto, UpdateHalaqahDto } from './dto/halaqah.dto';
import { StorageService } from '../storage/storage.service';
import { sanitizePhotoUrl } from '../common/photo-url.util';

@Injectable()
export class HalaqahsService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  private async mapHalaqahPhoto(halaqah: any) {
    if (halaqah.teacher?.user) {
      const sanitized = sanitizePhotoUrl(halaqah.teacher.user.photoUrl);
      if (!sanitized) {
        halaqah.teacher.user.photoUrl = null;
      } else if (/^https?:\/\//i.test(sanitized)) {
        halaqah.teacher.user.photoUrl = sanitized;
      } else {
        const signed = await this.storageService.createPresignedDownloadUrl(sanitized);
        halaqah.teacher.user.photoUrl = signed.url;
      }
    }
    return halaqah;
  }

  async create(dto: CreateHalaqahDto) {
    // Check if teacher exists
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: dto.teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${dto.teacherId} not found`);
    }

    // Check unique constraint (teacherId, name)
    const existing = await this.prisma.halaqah.findUnique({
      where: {
        teacherId_name: {
          teacherId: dto.teacherId,
          name: dto.name,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Halaqah with name ${dto.name} already exists for this teacher`);
    }

    const halaqah = await this.prisma.halaqah.create({
      data: dto,
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                photoUrl: true,
              },
            },
          },
        },
      },
    });

    return this.mapHalaqahPhoto(halaqah);
  }

  async findAll() {
    const halaqahs = await this.prisma.halaqah.findMany({
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                photoUrl: true,
              },
            },
          },
        },
        _count: {
          select: { students: true },
        },
      },
    });

    return Promise.all(halaqahs.map(h => this.mapHalaqahPhoto(h)));
  }

  async findOne(id: string) {
    const halaqah = await this.prisma.halaqah.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                photoUrl: true,
              },
            },
          },
        },
        students: true,
      },
    });

    if (!halaqah) {
      throw new NotFoundException(`Halaqah with ID ${id} not found`);
    }

    return this.mapHalaqahPhoto(halaqah);
  }

  async findByTeacher(teacherId: string) {
    const halaqahs = await this.prisma.halaqah.findMany({
      where: { teacherId },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                photoUrl: true,
              },
            },
          },
        },
        _count: {
          select: { students: true },
        },
      },
    });

    return Promise.all(halaqahs.map(h => this.mapHalaqahPhoto(h)));
  }

  async update(id: string, dto: UpdateHalaqahDto) {
    await this.findOne(id);

    const updated = await this.prisma.halaqah.update({
      where: { id },
      data: dto,
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                photoUrl: true,
              },
            },
          },
        },
      },
    });

    return this.mapHalaqahPhoto(updated);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.halaqah.delete({
      where: { id },
    });
  }
}
