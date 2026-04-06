import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto, UpdateExamDto } from './dto/exam.dto';
import { SessionNoteType, UserRole } from '@prisma/client';
export declare class MemorizationExamsService {
    private prisma;
    constructor(prisma: PrismaService);
    private isExamNoteSchemaNotReady;
    private withNoteSummary;
    create(teacherId: string, dto: CreateExamDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    findByStudent(studentId: string): Promise<any>;
    update(id: string, dto: UpdateExamDto): Promise<any>;
    createNote(user: {
        id: string;
        role: UserRole;
    }, examId: string, dto: {
        noteType: SessionNoteType;
        page: number;
        line: number;
        description: string;
    }): Promise<any>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        teacherId: string;
        halaqahId: string;
        studentId: string;
        startPage: number | null;
        endPage: number | null;
        score: number;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        examDate: Date;
        examType: import("@prisma/client").$Enums.ExamType;
        title: string | null;
        periodStart: Date | null;
        periodEnd: Date | null;
        resultStatus: import("@prisma/client").$Enums.ExamResultStatus;
        startJuz: number | null;
        endJuz: number | null;
    }>;
}
