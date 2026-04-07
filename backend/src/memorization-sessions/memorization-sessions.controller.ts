import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { MemorizationSessionsService } from './memorization-sessions.service';
import { CreateSessionDto, CreateSessionNoteDto, UpdateSessionDto } from './dto/session.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtGuard, RolesGuard)
@Controller('memorization-sessions')
export class MemorizationSessionsController {
  constructor(
    private readonly sessionsService: MemorizationSessionsService,
    private prismaService: PrismaService
  ) {}

  private async getTeacherByUser(user: any) {
    return this.prismaService.teacher.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
  }

  private async ensureSessionAccess(sessionId: string, user: any) {
    const session = await this.sessionsService.findOne(sessionId);

    if (user.role === UserRole.ADMIN) {
      return session;
    }

    const teacher = await this.getTeacherByUser(user);
    if (!teacher) {
      throw new UnauthorizedException('User is not a teacher');
    }

    if (session.teacherId !== teacher.id) {
      throw new UnauthorizedException('Anda tidak memiliki akses ke sesi ini');
    }

    return session;
  }

  @Roles(UserRole.ADMIN, UserRole.MUHAFFIZH)
  @Post()
  async create(@GetUser() user: any, @Body() createSessionDto: CreateSessionDto) {
    // Get teacher ID associated with user
    const teacher = await this.prismaService.teacher.findUnique({
      where: { userId: user.id }
    });

    if (!teacher && user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('User is not a teacher');
    }

    let teacherId = teacher?.id;

    // Admin bisa mencatat sesi walau tidak punya profil teacher.
    // Dalam kasus itu, gunakan teacher dari halaqah yang dipilih.
    if (!teacherId && user.role === UserRole.ADMIN) {
      const halaqah = await this.prismaService.halaqah.findUnique({
        where: { id: createSessionDto.halaqahId },
        select: { teacherId: true },
      });

      if (!halaqah) {
        throw new BadRequestException('Halaqah tidak ditemukan');
      }

      teacherId = halaqah.teacherId;
    }

    if (!teacherId) {
      throw new UnauthorizedException('User is not a teacher');
    }

    return this.sessionsService.create(teacherId, createSessionDto);
  }

  @Get()
  async findAll(@GetUser() user: any, @Query('studentId') studentId?: string, @Query('date') date?: string) {
    if (studentId && !date) {
      return this.sessionsService.findByStudent(studentId);
    }

    if (date && user.role === UserRole.ADMIN) {
      return this.sessionsService.findByDate(date, {
        studentId: studentId || undefined,
      });
    }

    if (user.role === UserRole.MUHAFFIZH) {
      const teacher = await this.prismaService.teacher.findUnique({
        where: { userId: user.id }
      });
      if (teacher) {
        if (date) {
          return this.sessionsService.findByDate(date, {
            studentId: studentId || undefined,
            teacherId: teacher.id,
          });
        }

        return this.sessionsService.findByTeacher(teacher.id, studentId || undefined);
      }
    }

    return this.sessionsService.findAll();
  }

  @Get(':id')
  async findOne(@GetUser() user: any, @Param('id') id: string) {
    await this.ensureSessionAccess(id, user);
    return this.sessionsService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.MUHAFFIZH)
  @Post(':id/notes')
  async createNote(@GetUser() user: any, @Param('id') id: string, @Body() dto: CreateSessionNoteDto) {
    await this.ensureSessionAccess(id, user);
    return this.sessionsService.createNote(id, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.MUHAFFIZH)
  @Patch(':id/notes/:noteId')
  async updateNote(
    @GetUser() user: any,
    @Param('id') id: string,
    @Param('noteId') noteId: string,
    @Body() dto: CreateSessionNoteDto,
  ) {
    await this.ensureSessionAccess(id, user);
    return this.sessionsService.updateNote(id, noteId, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.MUHAFFIZH)
  @Delete(':id/notes/:noteId')
  async removeNote(
    @GetUser() user: any,
    @Param('id') id: string,
    @Param('noteId') noteId: string,
  ) {
    await this.ensureSessionAccess(id, user);
    return this.sessionsService.removeNote(id, noteId);
  }

  @Roles(UserRole.ADMIN, UserRole.MUHAFFIZH)
  @Patch(':id')
  async update(@GetUser() user: any, @Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    await this.ensureSessionAccess(id, user);
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Roles(UserRole.ADMIN, UserRole.MUHAFFIZH)
  @Delete(':id')
  async remove(@GetUser() user: any, @Param('id') id: string) {
    if (user.role === UserRole.ADMIN) {
      return this.sessionsService.remove(id, user.role);
    }

    const teacher = await this.prismaService.teacher.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!teacher) {
      throw new UnauthorizedException('User is not a teacher');
    }

    return this.sessionsService.remove(id, user.role, teacher.id);
  }
}
