import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
import { Recommendation, SessionNoteType, SessionType, UserRole } from '@prisma/client';
import { StorageService } from '../storage/storage.service';
import { sanitizePhotoUrl } from '../common/photo-url.util';

@Injectable()
export class MemorizationSessionsService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  private async mapStudentPhotoUrl(session: any) {
    if (session?.student?.photoUrl) {
      const sanitizedPhoto = sanitizePhotoUrl(session.student.photoUrl);
      if (sanitizedPhoto && !/^https?:\/\//i.test(sanitizedPhoto)) {
        try {
          const signed = await this.storageService.createPresignedDownloadUrl(sanitizedPhoto);
          session.student.photoUrl = signed.url;
        } catch (error) {
          console.error('Error generating presigned URL for session student:', error);
          session.student.photoUrl = null;
        }
      } else {
        session.student.photoUrl = sanitizedPhoto;
      }
    }
    return session;
  }

  private isSessionNoteTableMissing(error: unknown) {
    const err = error as { code?: string; message?: string };
    const message = err?.message ?? '';

    return err?.code === 'P2021' && (
      message.includes('SessionNote') ||
      message.includes('session_notes') ||
      message.includes('noteItems')
    );
  }

  private isSessionNoteSchemaNotReady(error: unknown) {
    const err = error as { code?: string; message?: string; meta?: { message?: string } };
    const message = `${err?.message ?? ''} ${err?.meta?.message ?? ''}`;

    if (this.isSessionNoteTableMissing(error)) {
      return true;
    }

    return (
      (err?.code === 'P2022' && (
        message.includes('SessionNote') ||
        message.includes('noteType') ||
        message.includes('sessionId')
      )) ||
      (err?.code === 'P2010' && (
        message.includes('SessionNoteType') ||
        message.includes('does not exist')
      ))
    );
  }

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

  private withDetailsInclude() {
    return {
      student: true,
      teacher: true,
      halaqah: true,
      noteItems: {
        orderBy: { createdAt: 'desc' as const },
      },
    };
  }

  private withBasicInclude() {
    return {
      student: true,
      teacher: true,
      halaqah: true,
    };
  }

  private async findManyWithSafeInclude(args: {
    where?: Record<string, unknown>;
    orderBy?: Record<string, unknown> | Array<Record<string, unknown>>;
  }) {
    try {
      return await this.prisma.memorizationSession.findMany({
        ...args,
        include: this.withDetailsInclude(),
      });
    } catch (error) {
      if (!this.isSessionNoteTableMissing(error)) {
        throw error;
      }

      return this.prisma.memorizationSession.findMany({
        ...args,
        include: this.withBasicInclude(),
      });
    }
  }

  private async findUniqueWithSafeInclude(id: string) {
    try {
      return await this.prisma.memorizationSession.findUnique({
        where: { id },
        include: this.withDetailsInclude(),
      });
    } catch (error) {
      if (!this.isSessionNoteTableMissing(error)) {
        throw error;
      }

      return this.prisma.memorizationSession.findUnique({
        where: { id },
        include: this.withBasicInclude(),
      });
    }
  }

  private withNoteSummary<T extends Record<string, unknown>>(
    session: T & { noteItems?: Array<{ noteType: SessionNoteType }> },
  ): T & {
    noteSummary: {
      KESALAHAN: number;
      TEGURAN: number;
      PERHATIAN: number;
    };
  } {
    const summary = {
      KESALAHAN: 0,
      TEGURAN: 0,
      PERHATIAN: 0,
    };

    session.noteItems?.forEach((item) => {
      summary[item.noteType] += 1;
    });

    return {
      ...session,
      noteSummary: summary,
    };
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

    let session;
    try {
      session = await this.prisma.memorizationSession.create({
        data: {
          ...dto,
          teacherId,
          totalPages,
          score: dto.score ?? 80,
          recommendation: dto.recommendation ?? Recommendation.CONTINUE,
          sessionDate: new Date(dto.sessionDate),
        },
        include: this.withDetailsInclude(),
      });
    } catch (error) {
      if (!this.isSessionNoteTableMissing(error)) {
        throw error;
      }

      session = await this.prisma.memorizationSession.create({
        data: {
          ...dto,
          teacherId,
          totalPages,
          score: dto.score ?? 80,
          recommendation: dto.recommendation ?? Recommendation.CONTINUE,
          sessionDate: new Date(dto.sessionDate),
        },
        include: this.withBasicInclude(),
      });
    }

    // Update student progress if it's a ZIYADAH session and recommendation is CONTINUE
    const recommendation = dto.recommendation ?? Recommendation.CONTINUE;
    if (dto.sessionType === SessionType.ZIYADAH && recommendation === Recommendation.CONTINUE) {
      await this.updateStudentProgress(dto.studentId);
    }

    const sessionWithSummary = this.withNoteSummary(session);
    return this.mapStudentPhotoUrl(sessionWithSummary);
  }

  async findAll() {
    return this.findManyWithSafeInclude({
      orderBy: {
        sessionDate: 'desc',
      },
    }).then((items) => Promise.all(items.map((item) => this.mapStudentPhotoUrl(this.withNoteSummary(item)))));
  }

  async findByDate(
    date: string,
    options?: {
      studentId?: string;
      teacherId?: string;
    }
  ) {
    const { start, end } = this.buildDateRange(date);

    return this.findManyWithSafeInclude({
      where: {
        studentId: options?.studentId,
        teacherId: options?.teacherId,
        sessionDate: {
          gte: start,
          lte: end,
        },
      },
      orderBy: [
        {
          sessionDate: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    }).then((items) => Promise.all(items.map((item) => this.mapStudentPhotoUrl(this.withNoteSummary(item)))));
  }

  async findOne(id: string) {
    const session = await this.findUniqueWithSafeInclude(id);

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    const sessionWithSummary = this.withNoteSummary(session);
    return this.mapStudentPhotoUrl(sessionWithSummary);
  }

  async findByStudent(studentId: string) {
    return this.findManyWithSafeInclude({
      where: { studentId },
      orderBy: {
        sessionDate: 'desc',
      },
    }).then((items) => Promise.all(items.map((item) => this.mapStudentPhotoUrl(this.withNoteSummary(item)))));
  }

  async findByTeacher(teacherId: string, studentId?: string) {
    return this.findManyWithSafeInclude({
      where: {
        teacherId,
        studentId: studentId || undefined,
      },
      orderBy: {
        sessionDate: 'desc',
      },
    }).then((items) => Promise.all(items.map((item) => this.mapStudentPhotoUrl(this.withNoteSummary(item)))));
  }

  async update(id: string, dto: UpdateSessionDto) {
    const oldSession = await this.findUniqueWithSafeInclude(id);

    if (!oldSession) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

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

    let updatedSession;
    try {
      updatedSession = await this.prisma.memorizationSession.update({
        where: { id },
        data: {
          ...dto,
          totalPages,
          sessionDate: dto.sessionDate ? new Date(dto.sessionDate) : undefined,
        },
        include: this.withDetailsInclude(),
      });
    } catch (error) {
      if (!this.isSessionNoteTableMissing(error)) {
        throw error;
      }

      updatedSession = await this.prisma.memorizationSession.update({
        where: { id },
        data: {
          ...dto,
          totalPages,
          sessionDate: dto.sessionDate ? new Date(dto.sessionDate) : undefined,
        },
        include: this.withBasicInclude(),
      });
    }

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

    const sessionWithSummary = this.withNoteSummary(updatedSession);
    return this.mapStudentPhotoUrl(sessionWithSummary);
  }

  async createNote(sessionId: string, dto: { noteType: SessionNoteType; page: number; line: number; description: string }) {
    const session = await this.prisma.memorizationSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        startPage: true,
        endPage: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (session.startPage && dto.page < session.startPage) {
      throw new BadRequestException('Halaman catatan tidak boleh kurang dari halaman mulai sesi.');
    }

    if (session.endPage && dto.page > session.endPage) {
      throw new BadRequestException('Halaman catatan tidak boleh melebihi halaman akhir sesi.');
    }

    try {
      await this.prisma.sessionNote.create({
        data: {
          sessionId,
          noteType: dto.noteType,
          page: dto.page,
          line: dto.line,
          description: dto.description,
        },
      });
    } catch (error) {
      if (this.isSessionNoteSchemaNotReady(error)) {
        throw new BadRequestException(
          'Fitur catatan sesi belum siap di database. Jalankan migrasi Prisma terbaru lalu coba simpan kembali.'
        );
      }

      throw error;
    }

    return this.findOne(sessionId);
  }

  async updateNote(sessionId: string, noteId: string, dto: { noteType?: SessionNoteType; page?: number; line?: number; description?: string }) {
    const note = await this.prisma.sessionNote.findUnique({
      where: { id: noteId },
    });

    if (!note || note.sessionId !== sessionId) {
      throw new NotFoundException(`Catatan dengan ID ${noteId} tidak ditemukan di sesi ini.`);
    }

    if (dto.page !== undefined) {
      const session = await this.prisma.memorizationSession.findUnique({
        where: { id: sessionId },
        select: { startPage: true, endPage: true },
      });

      if (session) {
        if (session.startPage && dto.page < session.startPage) {
          throw new BadRequestException('Halaman catatan tidak boleh kurang dari halaman mulai sesi.');
        }
        if (session.endPage && dto.page > session.endPage) {
          throw new BadRequestException('Halaman catatan tidak boleh melebihi halaman akhir sesi.');
        }
      }
    }

    await this.prisma.sessionNote.update({
      where: { id: noteId },
      data: dto,
    });

    return this.findOne(sessionId);
  }

  async removeNote(sessionId: string, noteId: string) {
    const note = await this.prisma.sessionNote.findUnique({
      where: { id: noteId },
    });

    if (!note || note.sessionId !== sessionId) {
      throw new NotFoundException(`Catatan dengan ID ${noteId} tidak ditemukan di sesi ini.`);
    }

    await this.prisma.sessionNote.delete({
      where: { id: noteId },
    });

    return this.findOne(sessionId);
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
