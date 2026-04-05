import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
import { SessionType, UserRole } from '@prisma/client';

@Injectable()
export class MemorizationSessionsService {
  constructor(private prisma: PrismaService) {}

  private buildDateRange(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Format tanggal tidak valid');
    }

    const start = new Date(parsedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(parsedDate);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  async create(teacherId: string, dto: CreateSessionDto) {
    if (dto.startPage && dto.endPage && dto.startPage > dto.endPage) {
      throw new BadRequestException('Start page cannot be greater than end page');
    }

    // Check if student exists
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${dto.studentId} not found`);
    }

    // Calculate total pages if startPage and endPage are provided
    let totalPages: number | null = null;
    if (dto.startPage !== undefined && dto.endPage !== undefined) {
      totalPages = dto.endPage - dto.startPage + 1;
    }

    const session = await this.prisma.memorizationSession.create({
      data: {
        ...dto,
        teacherId,
        totalPages,
        sessionDate: new Date(dto.sessionDate),
      },
      include: {
        student: true,
        teacher: true,
      },
    });

    // Update student progress if it's a ZIYADAH session and recommendation is CONTINUE
    if (dto.sessionType === SessionType.ZIYADAH && dto.recommendation === 'CONTINUE') {
      await this.updateStudentProgress(dto.studentId);
    }

    return session;
  }

  async findAll() {
    return this.prisma.memorizationSession.findMany({
      include: {
        student: true,
        teacher: true,
        halaqah: true,
      },
      orderBy: {
        sessionDate: 'desc',
      },
    });
  }

  async findByDate(
    date: string,
    options?: {
      studentId?: string;
      teacherId?: string;
    }
  ) {
    const { start, end } = this.buildDateRange(date);

    return this.prisma.memorizationSession.findMany({
      where: {
        studentId: options?.studentId,
        teacherId: options?.teacherId,
        sessionDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        student: true,
        teacher: true,
        halaqah: true,
      },
      orderBy: [
        {
          sessionDate: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.memorizationSession.findUnique({
      where: { id },
      include: {
        student: true,
        teacher: true,
        halaqah: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return session;
  }

  async findByStudent(studentId: string) {
    return this.prisma.memorizationSession.findMany({
      where: { studentId },
      include: {
        teacher: true,
        halaqah: true,
      },
      orderBy: {
        sessionDate: 'desc',
      },
    });
  }

  async update(id: string, dto: UpdateSessionDto) {
    const oldSession = await this.findOne(id);

    if (dto.startPage !== undefined || dto.endPage !== undefined) {
      const startPage = dto.startPage ?? oldSession.startPage;
      const endPage = dto.endPage ?? oldSession.endPage;
      if (startPage && endPage && startPage > endPage) {
        throw new BadRequestException('Start page cannot be greater than end page');
      }
    }

    // Calculate total pages if startPage and endPage are provided
    let totalPages: number | undefined = undefined;
    if (dto.startPage !== undefined || dto.endPage !== undefined) {
      const start = dto.startPage !== undefined ? dto.startPage : oldSession.startPage;
      const end = dto.endPage !== undefined ? dto.endPage : oldSession.endPage;
      if (start !== null && end !== null) {
        totalPages = end - start + 1;
      }
    }

    const updatedSession = await this.prisma.memorizationSession.update({
      where: { id },
      data: {
        ...dto,
        totalPages,
        sessionDate: dto.sessionDate ? new Date(dto.sessionDate) : undefined,
      },
      include: {
        student: true,
        teacher: true,
      },
    });

    // Recalculate student progress if relevant fields changed
    const typeChanged = dto.sessionType && dto.sessionType !== oldSession.sessionType;
    const recommendationChanged = dto.recommendation && dto.recommendation !== oldSession.recommendation;
    const pagesChanged = dto.startPage !== undefined || dto.endPage !== undefined;

    if (
      typeChanged || 
      recommendationChanged || 
      pagesChanged || 
      oldSession.sessionType === SessionType.ZIYADAH
    ) {
      await this.updateStudentProgress(updatedSession.studentId);
    }

    return updatedSession;
  }

  async remove(id: string, requesterRole: UserRole, teacherId?: string) {
    const session = await this.findOne(id);

    if (requesterRole === UserRole.MUHAFFIZH && session.teacherId !== teacherId) {
      throw new ForbiddenException('Anda hanya dapat menghapus sesi milik halaqah Anda.');
    }

    const result = await this.prisma.memorizationSession.delete({
      where: { id },
    });

    if (session.sessionType === SessionType.ZIYADAH && session.recommendation === 'CONTINUE') {
      await this.updateStudentProgress(session.studentId);
    }

    return result;
  }

  private async updateStudentProgress(studentId: string) {
    // Get all approved ZIYADAH sessions for this student
    const sessions = await this.prisma.memorizationSession.findMany({
      where: {
        studentId,
        sessionType: SessionType.ZIYADAH,
        recommendation: 'CONTINUE',
      },
      orderBy: {
        sessionDate: 'asc',
      },
    });

    let totalPages = 0;
    let lastPage = 0;

    for (const s of sessions) {
      if (s.totalPages) {
        totalPages += s.totalPages;
      }
      if (s.endPage && s.endPage > lastPage) {
        lastPage = s.endPage;
      }
    }

    await this.prisma.student.update({
      where: { id: studentId },
      data: {
        totalMemorizedPages: totalPages,
        lastMemorizedPage: lastPage > 0 ? lastPage : null,
      },
    });
  }
}
