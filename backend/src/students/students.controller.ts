import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions, toPublicUploadPath } from '../common/upload.util';

@UseGuards(JwtGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private prismaService: PrismaService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', imageUploadOptions))
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @GetUser() user: any,
    @UploadedFile() file?: any,
  ) {
    createStudentDto.photoUrl = toPublicUploadPath(file) ?? createStudentDto.photoUrl;
    if (user.role === UserRole.MUHAFFIZH) {
      const teacher = await this.prismaService.teacher.findUnique({ where: { userId: user.id } });
      const halaqah = await this.prismaService.halaqah.findUnique({ where: { id: createStudentDto.halaqahId } });

      if (!teacher || !halaqah || halaqah.teacherId !== teacher.id) {
        throw new ForbiddenException('Anda tidak dapat menambah santri di halaqah ini');
      }
    }

    return this.studentsService.create(createStudentDto);
  }

  @Get()
  async findAll(@GetUser() user: any, @Query('halaqahId') halaqahId?: string) {
    if (halaqahId) {
      return this.studentsService.findByHalaqah(halaqahId);
    }

    if (user.role === UserRole.MUHAFFIZH) {
      const teacher = await this.prismaService.teacher.findUnique({
        where: { userId: user.id },
      });
      if (teacher) {
        const halaqahs = await this.prismaService.halaqah.findMany({
          where: { teacherId: teacher.id },
          select: { id: true },
        });
        const halaqahIds = halaqahs.map((h) => h.id);
        return this.prismaService.student.findMany({
          where: { halaqahId: { in: halaqahIds } },
          include: {
            halaqah: {
              include: {
                teacher: true,
              },
            },
          },
        });
      }
    }

    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo', imageUploadOptions))
  update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
    @UploadedFile() file?: any,
  ) {
    updateStudentDto.photoUrl = toPublicUploadPath(file) ?? updateStudentDto.photoUrl;
    return this.studentsService.update(id, updateStudentDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
