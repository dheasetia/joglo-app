import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { sanitizePhotoUrl } from '../common/photo-url.util';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class StudentsService {
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

  private normalizeOptionalString(value?: string) {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  async create(dto: CreateStudentDto) {
    const normalizedNis = this.normalizeOptionalString(dto.nis);

    // Check if halaqah exists
    const halaqah = await this.prisma.halaqah.findUnique({
      where: { id: dto.halaqahId },
    });

    if (!halaqah) {
      throw new NotFoundException(`Halaqah with ID ${dto.halaqahId} not found`);
    }

    // Check unique NIS if provided
    if (normalizedNis) {
      const existing = await this.prisma.student.findUnique({
        where: { nis: normalizedNis },
      });
      if (existing) {
        throw new ConflictException(`Student with NIS ${normalizedNis} already exists`);
      }
    }

    const student = await this.prisma.student.create({
      data: {
        ...dto,
        nis: normalizedNis,
      },
      include: {
        halaqah: {
          include: {
            teacher: true,
          },
        },
      },
    });

    return this.mapPhotoUrl(student);
  }

  async findAll() {
    const students = await this.prisma.student.findMany({
      include: {
        halaqah: {
          include: {
            teacher: true,
          },
        },
      },
    });

    return Promise.all(students.map((student) => this.mapPhotoUrl(student)));
  }

  async findOne(id: string) {
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
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return this.mapPhotoUrl(student);
  }

  async findByHalaqah(halaqahId: string) {
    const students = await this.prisma.student.findMany({
      where: { halaqahId },
      include: {
        halaqah: {
          include: {
            teacher: true,
          },
        },
      },
    });

    return Promise.all(students.map((student) => this.mapPhotoUrl(student)));
  }

  async findByHalaqahIds(halaqahIds: string[]) {
    const students = await this.prisma.student.findMany({
      where: {
        halaqahId: {
          in: halaqahIds,
        },
      },
      include: {
        halaqah: {
          include: {
            teacher: true,
          },
        },
      },
    });

    return Promise.all(students.map((student) => this.mapPhotoUrl(student)));
  }

  async update(id: string, dto: UpdateStudentDto) {
    const existingStudent = await this.findOne(id);
    const normalizedNis = this.normalizeOptionalString(dto.nis);

    if (normalizedNis && normalizedNis !== existingStudent.nis) {
      const studentWithSameNis = await this.prisma.student.findUnique({
        where: { nis: normalizedNis },
      });

      if (studentWithSameNis) {
        throw new ConflictException(`Student with NIS ${normalizedNis} already exists`);
      }
    }

    const student = await this.prisma.student.update({
      where: { id },
      data: {
        ...dto,
        nis: dto.nis === undefined ? undefined : normalizedNis,
      },
      include: {
        halaqah: true,
      },
    });

    return this.mapPhotoUrl(student);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.student.delete({
      where: { id },
    });
  }
}
