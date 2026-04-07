import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
import { SessionNoteType, UserRole } from '@prisma/client';
import { StorageService } from '../storage/storage.service';
export declare class MemorizationSessionsService {
    private prisma;
    private storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    private mapStudentPhotoUrl;
    private isSessionNoteTableMissing;
    private isSessionNoteSchemaNotReady;
    private buildDateRange;
    private withDetailsInclude;
    private withBasicInclude;
    private findManyWithSafeInclude;
    private findUniqueWithSafeInclude;
    private withNoteSummary;
    create(teacherId: string, dto: CreateSessionDto): Promise<any>;
    findAll(): Promise<any[]>;
    findByDate(date: string, options?: {
        studentId?: string;
        teacherId?: string;
    }): Promise<any[]>;
    findOne(id: string): Promise<any>;
    findByStudent(studentId: string): Promise<any[]>;
    findByTeacher(teacherId: string, studentId?: string): Promise<any[]>;
    update(id: string, dto: UpdateSessionDto): Promise<any>;
    createNote(sessionId: string, dto: {
        noteType: SessionNoteType;
        page: number;
        line: number;
        description: string;
    }): Promise<any>;
    updateNote(sessionId: string, noteId: string, dto: {
        noteType?: SessionNoteType;
        page?: number;
        line?: number;
        description?: string;
    }): Promise<any>;
    removeNote(sessionId: string, noteId: string): Promise<any>;
    remove(id: string, requesterRole: UserRole, teacherId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        teacherId: string;
        halaqahId: string;
        sessionDate: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
        studentId: string;
        startPage: number | null;
        endPage: number | null;
        score: number;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        isApprovedForNextStep: boolean | null;
        totalPages: number | null;
    }>;
    private updateStudentProgress;
}
