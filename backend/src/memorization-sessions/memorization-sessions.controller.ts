import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { MemorizationSessionsService } from './memorization-sessions.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
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
  async findAll(@GetUser() user: any, @Query('studentId') studentId?: string) {
    if (studentId) {
      return this.sessionsService.findByStudent(studentId);
    }

    if (user.role === UserRole.MUHAFFIZH) {
      const teacher = await this.prismaService.teacher.findUnique({
        where: { userId: user.id }
      });
      if (teacher) {
        return this.prismaService.memorizationSession.findMany({
          where: { teacherId: teacher.id },
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
    }

    return this.sessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.MUHAFFIZH)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
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
