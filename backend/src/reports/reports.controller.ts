import { Controller, Get, Param, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtGuard)
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private prisma: PrismaService
  ) {}

  @Get('student/:id')
  async getStudentProgress(@GetUser() user: any, @Param('id') id: string) {
    if (user.role === UserRole.MUHAFFIZH) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId: user.id }
      });
      const student = await this.prisma.student.findUnique({
        where: { id },
        include: { halaqah: true }
      });
      
      if (teacher && student && student.halaqah.teacherId !== teacher.id) {
        throw new UnauthorizedException('Anda tidak memiliki akses ke data santri ini.');
      }
    }
    return this.reportsService.getStudentProgress(id);
  }

  @Get('halaqah/:id')
  async getHalaqahReport(@GetUser() user: any, @Param('id') id: string) {
    if (user.role === UserRole.MUHAFFIZH) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId: user.id }
      });
      const halaqah = await this.prisma.halaqah.findUnique({
        where: { id }
      });

      if (teacher && halaqah && halaqah.teacherId !== teacher.id) {
        throw new UnauthorizedException('Anda tidak memiliki akses ke data halaqah ini.');
      }
    }
    return this.reportsService.getHalaqahReport(id);
  }
}
