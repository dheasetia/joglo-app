import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UnauthorizedException } from '@nestjs/common';
import { MemorizationExamsService } from './memorization-exams.service';
import { CreateExamDto, CreateExamNoteDto, UpdateExamDto } from './dto/exam.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtGuard, RolesGuard)
@Controller('memorization-exams')
export class MemorizationExamsController {
  constructor(
    private readonly examsService: MemorizationExamsService,
    private prismaService: PrismaService
  ) {}

  @Roles(UserRole.ADMIN, UserRole.MUHAFFIZH)
  @Post()
  async create(@GetUser() user: any, @Body() createExamDto: CreateExamDto) {
    const teacher = await this.prismaService.teacher.findUnique({
      where: { userId: user.id }
    });

    if (!teacher && user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('User is not a teacher');
    }

    const teacherId = teacher?.id || 'admin-teacher-placeholder';

    return this.examsService.create(teacherId, createExamDto);
  }

  @Get()
  async findAll(@GetUser() user: any, @Query('studentId') studentId?: string) {
    if (studentId) {
      return this.examsService.findByStudent(studentId);
    }

    if (user.role === UserRole.MUHAFFIZH) {
      const teacher = await this.prismaService.teacher.findUnique({
        where: { userId: user.id }
      });
      if (teacher) {
        const exams = await this.prismaService.memorizationExam.findMany({
          where: { teacherId: teacher.id },
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

        return exams.map((exam) => ({
          ...exam,
          noteSummary: {
            KESALAHAN: exam.noteItems.filter((n) => n.noteType === 'KESALAHAN').length,
            TEGURAN: exam.noteItems.filter((n) => n.noteType === 'TEGURAN').length,
            PERHATIAN: exam.noteItems.filter((n) => n.noteType === 'PERHATIAN').length,
          },
        }));
      }
    }

    return this.examsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.MUHAFFIZH)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(id, updateExamDto);
  }

  @Roles(UserRole.ADMIN, UserRole.MUHAFFIZH)
  @Post(':id/notes')
  createNote(@GetUser() user: any, @Param('id') id: string, @Body() dto: CreateExamNoteDto) {
    return this.examsService.createNote(user, id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examsService.remove(id);
  }
}
