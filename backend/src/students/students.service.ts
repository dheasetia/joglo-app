import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    // Check if halaqah exists
    const halaqah = await this.prisma.halaqah.findUnique({
      where: { id: dto.halaqahId },
    });

    if (!halaqah) {
      throw new NotFoundException(`Halaqah with ID ${dto.halaqahId} not found`);
    }

    // Check unique NIS if provided
    if (dto.nis) {
      const existing = await this.prisma.student.findUnique({
        where: { nis: dto.nis },
      });
      if (existing) {
        throw new ConflictException(`Student with NIS ${dto.nis} already exists`);
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
    await this.findOne(id);

    return this.prisma.student.update({
      where: { id },
      data: dto,
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
