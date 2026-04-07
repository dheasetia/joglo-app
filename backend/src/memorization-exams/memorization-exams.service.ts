import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto, UpdateExamDto } from './dto/exam.dto';
import { ExamResultStatus, SessionNoteType, UserRole } from '@prisma/client';

@Injectable()
export class MemorizationExamsService {
  constructor(private prisma: PrismaService) {}

  private isExamNoteSchemaNotReady(error: unknown): boolean {
    if (!(error instanceof Error)) {
      return false;
    }

    const maybeCode = (error as { code?: string }).code;
    if (maybeCode !== 'P2021' && maybeCode !== 'P2022') {
      return false;
    }

    const message = (error.message || '').toLowerCase();
    return message.includes('examnote') || message.includes('noteitems');
  }

  private withNoteSummary<T extends { noteItems?: Array<{ noteType: SessionNoteType }> }>(exam: T) {
    const summary = {
      KESALAHAN: 0,
      TEGURAN: 0,
      PERHATIAN: 0,
    };

    for (const note of exam.noteItems || []) {
      summary[note.noteType] += 1;
    }

    return {
      ...exam,
      noteSummary: summary,
    };
  }

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

    let exam;
    try {
      exam = await this.prisma.memorizationExam.create({
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
          noteItems: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    } catch (error) {
      if (!this.isExamNoteSchemaNotReady(error)) {
        throw error;
      }

      exam = await this.prisma.memorizationExam.create({
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
    }

    if (exam.resultStatus === ExamResultStatus.PASSED && exam.endPage) {
      await this.prisma.student.update({
        where: { id: exam.studentId },
        data: { currentPage: exam.endPage }
      });
    }

    return this.withNoteSummary(exam);
  }

  async findAll() {
    let exams;
    try {
      exams = await this.prisma.memorizationExam.findMany({
        include: {
          student: true,
          teacher: true,
          halaqah: true,
          noteItems: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: {
          examDate: 'desc',
        },
      });
    } catch (error) {
      if (!this.isExamNoteSchemaNotReady(error)) {
        throw error;
      }

      exams = await this.prisma.memorizationExam.findMany({
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

    return exams.map((exam) => this.withNoteSummary(exam));
  }

  async findOne(id: string) {
    let exam;
    try {
      exam = await this.prisma.memorizationExam.findUnique({
        where: { id },
        include: {
          student: true,
          teacher: true,
          halaqah: true,
          noteItems: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    } catch (error) {
      if (!this.isExamNoteSchemaNotReady(error)) {
        throw error;
      }

      exam = await this.prisma.memorizationExam.findUnique({
        where: { id },
        include: {
          student: true,
          teacher: true,
          halaqah: true,
        },
      });
    }

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    return this.withNoteSummary(exam);
  }

  async findByStudent(studentId: string) {
    let exams;
    try {
      exams = await this.prisma.memorizationExam.findMany({
        where: { studentId },
        include: {
          teacher: true,
          halaqah: true,
          noteItems: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: {
          examDate: 'desc',
        },
      });
    } catch (error) {
      if (!this.isExamNoteSchemaNotReady(error)) {
        throw error;
      }

      exams = await this.prisma.memorizationExam.findMany({
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

    return exams.map((exam) => this.withNoteSummary(exam));
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

    let updatedExam;
    try {
      updatedExam = await this.prisma.memorizationExam.update({
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
          noteItems: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    } catch (error) {
      if (!this.isExamNoteSchemaNotReady(error)) {
        throw error;
      }

      updatedExam = await this.prisma.memorizationExam.update({
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
    }

    if (updatedExam.resultStatus === ExamResultStatus.PASSED && updatedExam.endPage) {
      await this.prisma.student.update({
        where: { id: updatedExam.studentId },
        data: { currentPage: updatedExam.endPage }
      });
    }

    return this.withNoteSummary(updatedExam);
  }

  async createNote(user: { id: string; role: UserRole }, examId: string, dto: { noteType: SessionNoteType; page: number; line: number; description: string }) {
    const exam = await this.prisma.memorizationExam.findUnique({
      where: { id: examId },
      include: {
        teacher: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${examId} not found`);
    }

    if (user.role !== UserRole.ADMIN && exam.teacher?.userId !== user.id) {
      throw new UnauthorizedException('Anda tidak memiliki akses untuk menambah catatan pada ujian ini');
    }

    if (exam.startPage && dto.page < exam.startPage) {
      throw new BadRequestException(`Halaman catatan (${dto.page}) tidak boleh kurang dari halaman mulai ujian (${exam.startPage}).`);
    }

    if (exam.endPage && dto.page > exam.endPage) {
      throw new BadRequestException(`Halaman catatan (${dto.page}) tidak boleh melebihi halaman akhir ujian (${exam.endPage}).`);
    }

    try {
      await this.prisma.examNote.create({
        data: {
          examId,
          noteType: dto.noteType,
          page: Number(dto.page),
          line: Number(dto.line),
          description: dto.description,
        },
      });
    } catch (error) {
      if (this.isExamNoteSchemaNotReady(error)) {
        throw new BadRequestException(
          'Fitur catatan ujian belum siap di database. Jalankan migrasi Prisma terbaru lalu coba simpan kembali.'
        );
      }

      throw error;
    }

    return this.findOne(examId);
  }

  async updateNote(user: { id: string; role: UserRole }, examId: string, noteId: string, dto: { noteType?: SessionNoteType; page?: number; line?: number; description?: string }) {
    const note = await this.prisma.examNote.findUnique({
      where: { id: noteId },
      include: {
        exam: {
          include: {
            teacher: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!note || note.examId !== examId) {
      throw new NotFoundException(`Catatan dengan ID ${noteId} tidak ditemukan di ujian ini.`);
    }

    if (user.role !== UserRole.ADMIN && note.exam.teacher?.userId !== user.id) {
      throw new UnauthorizedException('Anda tidak memiliki akses untuk mengubah catatan pada ujian ini');
    }

    if (dto.page !== undefined) {
      const exam = note.exam;
      if (exam.startPage && dto.page < exam.startPage) {
        throw new BadRequestException(`Halaman catatan (${dto.page}) tidak boleh kurang dari halaman mulai ujian (${exam.startPage}).`);
      }
      if (exam.endPage && dto.page > exam.endPage) {
        throw new BadRequestException(`Halaman catatan (${dto.page}) tidak boleh melebihi halaman akhir ujian (${exam.endPage}).`);
      }
    }

    await this.prisma.examNote.update({
      where: { id: noteId },
      data: {
        ...dto,
        page: dto.page !== undefined ? Number(dto.page) : undefined,
        line: dto.line !== undefined ? Number(dto.line) : undefined,
      },
    });

    return this.findOne(examId);
  }

  async removeNote(user: { id: string; role: UserRole }, examId: string, noteId: string) {
    const note = await this.prisma.examNote.findUnique({
      where: { id: noteId },
      include: {
        exam: {
          include: {
            teacher: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!note || note.examId !== examId) {
      throw new NotFoundException(`Catatan dengan ID ${noteId} tidak ditemukan di ujian ini.`);
    }

    if (user.role !== UserRole.ADMIN && note.exam.teacher?.userId !== user.id) {
      throw new UnauthorizedException('Anda tidak memiliki akses untuk menghapus catatan pada ujian ini');
    }

    await this.prisma.examNote.delete({
      where: { id: noteId },
    });

    return this.findOne(examId);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.memorizationExam.delete({
      where: { id },
    });
  }
}
