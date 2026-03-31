import {
  Body,
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Patch,
  Delete,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateMyPasswordDto, UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions, toPublicUploadPath } from '../common/upload.util';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getMe(@GetUser('id') userId: string) {
    return this.usersService.getMe(userId);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('photo', imageUploadOptions))
  create(@Body() dto: CreateUserDto, @UploadedFile() file?: any) {
    dto.photoUrl = toPublicUploadPath(file) ?? dto.photoUrl;
    return this.usersService.create(dto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo', imageUploadOptions))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @GetUser() user: any,
    @UploadedFile() file?: any,
  ) {
    if (user.role !== UserRole.ADMIN && user.id !== id) {
      throw new ForbiddenException('Anda tidak dapat mengubah data pengguna lain');
    }
    dto.photoUrl = toPublicUploadPath(file) ?? dto.photoUrl;
    return this.usersService.update(id, dto);
  }

  @Patch('me/password')
  updateMyPassword(@GetUser('id') userId: string, @Body() dto: UpdateMyPasswordDto) {
    return this.usersService.updateMyPassword(userId, dto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id/password')
  updatePassword(@Param('id') id: string, @Body() dto: UpdatePasswordDto) {
    return this.usersService.updatePassword(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
