import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHalaqahDto, UpdateHalaqahDto } from './dto/halaqah.dto';

@Injectable()
export class HalaqahsService {
  constructor(private prisma: PrismaService) {}

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

  async findOne(id: string) {
    const halaqah = await this.prisma.halaqah.findUnique({
      where: { id },
      include: {
        teacher: true,
        students: true,
      },
    });

    if (!halaqah) {
      throw new NotFoundException(`Halaqah with ID ${id} not found`);
    }

    return halaqah;
  }

  async findByTeacher(teacherId: string) {
    return this.prisma.halaqah.findMany({
      where: { teacherId },
      include: {
        _count: {
          select: { students: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateHalaqahDto) {
    const halaqah = await this.findOne(id);

    return this.prisma.halaqah.update({
      where: { id },
      data: dto,
      include: {
        teacher: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.halaqah.delete({
      where: { id },
    });
  }
}
