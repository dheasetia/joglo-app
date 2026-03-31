import { Controller, Get, UseGuards, UnauthorizedException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private prismaService: PrismaService
  ) {}

  @Get('stats')
  async getStats(@GetUser() user: any) {
    if (user.role === UserRole.ADMIN) {
      return this.dashboardService.getAdminStats();
    } else if (user.role === UserRole.MUHAFFIZH) {
      const teacher = await this.prismaService.teacher.findUnique({
        where: { userId: user.id }
      });
      if (!teacher) throw new UnauthorizedException('Teacher profile not found');
      return this.dashboardService.getTeacherStats(teacher.id);
    }
    throw new UnauthorizedException('Invalid role');
  }
}
