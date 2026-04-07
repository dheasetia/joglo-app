import { PrismaService } from '../prisma/prisma.service';
import { CreateHalaqahDto, UpdateHalaqahDto } from './dto/halaqah.dto';
import { StorageService } from '../storage/storage.service';
export declare class HalaqahsService {
    private prisma;
    private storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    private mapHalaqahPhoto;
    create(dto: CreateHalaqahDto): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    findByTeacher(teacherId: string): Promise<any[]>;
    update(id: string, dto: UpdateHalaqahDto): Promise<any>;
    remove(id: string): Promise<{
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        teacherId: string;
    }>;
}
