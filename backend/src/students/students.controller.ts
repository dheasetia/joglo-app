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
import { memoryStorage } from 'multer';
import { StorageService } from '../storage/storage.service';

@UseGuards(JwtGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  private static readonly imageUploadOptions = {
    storage: memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  };

  @Post()
  @UseInterceptors(FileInterceptor('photo', StudentsController.imageUploadOptions))
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @GetUser() user: any,
    @UploadedFile() file?: any,
  ) {
    if (file) {
      const normalizedName = this.storageService.sanitizeFileName(file.originalname);
      this.storageService.validateUploadConstraints({
        originalName: normalizedName,
        contentType: file.mimetype,
        size: file.size,
      });

      const key = this.storageService.buildObjectKey({
        tenantId: 'default-tenant',
        module: 'students',
        folder: 'photos',
        originalName: normalizedName,
      });

      const uploaded = await this.storageService.uploadBuffer({
        key,
        contentType: file.mimetype,
        body: file.buffer,
      });

      createStudentDto.photoUrl = uploaded.key;
    }
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
        return this.studentsService.findByHalaqahIds(halaqahIds);
      }

      return [];
    }

    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo', StudentsController.imageUploadOptions))
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
    @UploadedFile() file?: any,
  ) {
    if (file) {
      const normalizedName = this.storageService.sanitizeFileName(file.originalname);
      this.storageService.validateUploadConstraints({
        originalName: normalizedName,
        contentType: file.mimetype,
        size: file.size,
      });

      const key = this.storageService.buildObjectKey({
        tenantId: 'default-tenant',
        module: 'students',
        entityId: id,
        folder: 'photos',
        originalName: normalizedName,
      });

      const uploaded = await this.storageService.uploadBuffer({
        key,
        contentType: file.mimetype,
        body: file.buffer,
      });

      updateStudentDto.photoUrl = uploaded.key;
    }

    return this.studentsService.update(id, updateStudentDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
