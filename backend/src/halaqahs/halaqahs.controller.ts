import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { HalaqahsService } from './halaqahs.service';
import { CreateHalaqahDto, UpdateHalaqahDto } from './dto/halaqah.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtGuard, RolesGuard)
@Controller('halaqahs')
export class HalaqahsController {
  constructor(
    private readonly halaqahsService: HalaqahsService,
    private prismaService: PrismaService
  ) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createHalaqahDto: CreateHalaqahDto) {
    return this.halaqahsService.create(createHalaqahDto);
  }

  @Get()
  async findAll(@GetUser() user: any) {
    if (user.role === UserRole.MUHAFFIZH) {
      const teacher = await this.prismaService.teacher.findUnique({
        where: { userId: user.id },
      });
      if (teacher) {
        return this.halaqahsService.findByTeacher(teacher.id);
      }
    }
    return this.halaqahsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.halaqahsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateHalaqahDto: UpdateHalaqahDto, @GetUser() user: any) {
    if (user.role === UserRole.MUHAFFIZH) {
      const teacher = await this.prismaService.teacher.findUnique({ where: { userId: user.id } });
      const halaqah = await this.prismaService.halaqah.findUnique({ where: { id } });

      if (!teacher || !halaqah || halaqah.teacherId !== teacher.id) {
        throw new ForbiddenException('Anda tidak dapat mengubah data halaqah ini');
      }

      updateHalaqahDto.teacherId = teacher.id;
    }

    return this.halaqahsService.update(id, updateHalaqahDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.halaqahsService.remove(id);
  }
}
