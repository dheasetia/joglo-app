import { Controller, Get, Param, UseGuards, Patch, Body, Delete, ForbiddenException } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { UpdateTeacherDto } from './dto/teacher.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtGuard)
@Controller('teachers')
export class TeachersController {
  constructor(
    private teachersService: TeachersService,
    private prismaService: PrismaService,
  ) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: any) {
    if (user.role === UserRole.MUHAFFIZH) {
      const teacher = await this.prismaService.teacher.findUnique({ where: { userId: user.id } });
      if (!teacher || teacher.id !== id) {
        throw new ForbiddenException('Anda tidak dapat mengakses data muhaffizh lain');
      }
    }

    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTeacherDto, @GetUser() user: any) {
    if (user.role === UserRole.MUHAFFIZH) {
      const teacher = await this.prismaService.teacher.findUnique({ where: { userId: user.id } });
      if (!teacher || teacher.id !== id) {
        throw new ForbiddenException('Anda tidak dapat mengubah data muhaffizh lain');
      }
    }

    return this.teachersService.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachersService.remove(id);
  }
}
