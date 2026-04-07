import { MemorizationSessionsService } from './memorization-sessions.service';
import { CreateSessionDto, CreateSessionNoteDto, UpdateSessionDto } from './dto/session.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class MemorizationSessionsController {
    private readonly sessionsService;
    private prismaService;
    constructor(sessionsService: MemorizationSessionsService, prismaService: PrismaService);
    private getTeacherByUser;
    private ensureSessionAccess;
    create(user: any, createSessionDto: CreateSessionDto): Promise<any>;
    findAll(user: any, studentId?: string, date?: string): Promise<any[]>;
    findOne(user: any, id: string): Promise<any>;
    createNote(user: any, id: string, dto: CreateSessionNoteDto): Promise<any>;
    updateNote(user: any, id: string, noteId: string, dto: CreateSessionNoteDto): Promise<any>;
    removeNote(user: any, id: string, noteId: string): Promise<any>;
    update(user: any, id: string, updateSessionDto: UpdateSessionDto): Promise<any>;
    remove(user: any, id: string): Promise<{
        sessionDate: Date;
        id: string;
        sessionType: import("@prisma/client").$Enums.SessionType;
        studentId: string;
        teacherId: string;
        halaqahId: string;
        startPage: number | null;
        endPage: number | null;
        totalPages: number | null;
        score: number;
        notes: string | null;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
