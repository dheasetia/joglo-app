import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.student.create({
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

    return student;
  }

  async findByHalaqah(halaqahId: string) {
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

    return this.prisma.student.update({
      where: { id },
      data: {
        ...dto,
        nis: dto.nis === undefined ? undefined : normalizedNis,
      },
      include: {
        halaqah: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.student.delete({
      where: { id },
    });
  }
}
