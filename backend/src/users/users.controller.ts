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
import { memoryStorage } from 'multer';
import { StorageService } from '../storage/storage.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  private static readonly imageUploadOptions = {
    storage: memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  };

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
  @UseInterceptors(FileInterceptor('photo', UsersController.imageUploadOptions))
  async create(@Body() dto: CreateUserDto, @UploadedFile() file?: any) {
    if (file) {
      const normalizedName = this.storageService.sanitizeFileName(file.originalname);
      this.storageService.validateUploadConstraints({
        originalName: normalizedName,
        contentType: file.mimetype,
        size: file.size,
      });

      const key = this.storageService.buildObjectKey({
        tenantId: 'default-tenant',
        module: 'users',
        folder: 'avatars',
        originalName: normalizedName,
      });

      const uploaded = await this.storageService.uploadBuffer({
        key,
        contentType: file.mimetype,
        body: file.buffer,
      });

      dto.photoUrl = uploaded.key;
    }
    return this.usersService.create(dto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo', UsersController.imageUploadOptions))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @GetUser() user: any,
    @UploadedFile() file?: any,
  ) {
    if (user.role !== UserRole.ADMIN && user.id !== id) {
      throw new ForbiddenException('Anda tidak dapat mengubah data pengguna lain');
    }
    if (file) {
      const normalizedName = this.storageService.sanitizeFileName(file.originalname);
      this.storageService.validateUploadConstraints({
        originalName: normalizedName,
        contentType: file.mimetype,
        size: file.size,
      });

      const key = this.storageService.buildObjectKey({
        tenantId: 'default-tenant',
        module: 'users',
        entityId: id,
        folder: 'avatars',
        originalName: normalizedName,
      });

      const uploaded = await this.storageService.uploadBuffer({
        key,
        contentType: file.mimetype,
        body: file.buffer,
      });

      dto.photoUrl = uploaded.key;
    }
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
