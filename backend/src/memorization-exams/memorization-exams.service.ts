import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto, UpdateExamDto } from './dto/exam.dto';
import { ExamResultStatus } from '@prisma/client';

@Injectable()
export class MemorizationExamsService {
  constructor(private prisma: PrismaService) {}

  async create(teacherId: string, dto: CreateExamDto) {
    if (dto.startPage > dto.endPage) {
      throw new BadRequestException('Start page cannot be greater than end page');
    }

    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${dto.studentId} not found`);
    }

    const exam = await this.prisma.memorizationExam.create({
      data: {
        ...dto,
        teacherId,
        examDate: new Date(dto.examDate),
        periodStart: dto.periodStart ? new Date(dto.periodStart) : undefined,
        periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : undefined,
      },
      include: {
        student: true,
        teacher: true,
      },
    });

    if (exam.resultStatus === ExamResultStatus.PASSED && exam.endPage) {
      await this.prisma.student.update({
        where: { id: exam.studentId },
        data: { currentPage: exam.endPage }
      });
    }

    return exam;
  }

  async findAll() {
    return this.prisma.memorizationExam.findMany({
      include: {
        student: true,
        teacher: true,
        halaqah: true,
      },
      orderBy: {
        examDate: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const exam = await this.prisma.memorizationExam.findUnique({
      where: { id },
      include: {
        student: true,
        teacher: true,
        halaqah: true,
      },
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    return exam;
  }

  async findByStudent(studentId: string) {
    return this.prisma.memorizationExam.findMany({
      where: { studentId },
      include: {
        teacher: true,
        halaqah: true,
      },
      orderBy: {
        examDate: 'desc',
      },
    });
  }

  async update(id: string, dto: UpdateExamDto) {
    const oldExam = await this.findOne(id);

    if (dto.startPage !== undefined || dto.endPage !== undefined) {
      const start = dto.startPage ?? oldExam.startPage;
      const end = dto.endPage ?? oldExam.endPage;
      if (start !== null && end !== null && start > end) {
        throw new BadRequestException('Start page cannot be greater than end page');
      }
    }

    const updatedExam = await this.prisma.memorizationExam.update({
      where: { id },
      data: {
        ...dto,
        examDate: dto.examDate ? new Date(dto.examDate) : undefined,
        periodStart: dto.periodStart ? new Date(dto.periodStart) : undefined,
        periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : undefined,
      },
      include: {
        student: true,
        teacher: true,
      },
    });

    if (updatedExam.resultStatus === ExamResultStatus.PASSED && updatedExam.endPage) {
      await this.prisma.student.update({
        where: { id: updatedExam.studentId },
        data: { currentPage: updatedExam.endPage }
      });
    }

    return updatedExam;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.memorizationExam.delete({
      where: { id },
    });
  }
}
