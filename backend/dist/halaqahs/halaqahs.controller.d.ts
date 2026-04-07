import { HalaqahsService } from './halaqahs.service';
import { CreateHalaqahDto, UpdateHalaqahDto } from './dto/halaqah.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class HalaqahsController {
    private readonly halaqahsService;
    private prismaService;
    constructor(halaqahsService: HalaqahsService, prismaService: PrismaService);
    create(createHalaqahDto: CreateHalaqahDto): Promise<any>;
    findAll(user: any): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateHalaqahDto: UpdateHalaqahDto, user: any): Promise<any>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
    }>;
}
