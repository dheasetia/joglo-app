import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getStudentProgress(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        sessions: {
          orderBy: { sessionDate: 'desc' },
          take: 10,
        },
        exams: {
          orderBy: { examDate: 'desc' },
        },
        halaqah: {
          include: { teacher: true }
        }
      }
    });

    if (!student) throw new NotFoundException('Student not found');

    return student;
  }

  async getHalaqahReport(halaqahId: string) {
    const halaqah = await this.prisma.halaqah.findUnique({
      where: { id: halaqahId },
      include: {
        teacher: true,
        students: {
          include: {
            _count: {
              select: { sessions: true }
            }
          }
        }
      }
    });

    if (!halaqah) throw new NotFoundException('Halaqah not found');

    return halaqah;
  }
}
