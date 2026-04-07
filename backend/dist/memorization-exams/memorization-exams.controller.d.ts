import { MemorizationExamsService } from './memorization-exams.service';
import { CreateExamDto, CreateExamNoteDto, UpdateExamDto } from './dto/exam.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class MemorizationExamsController {
    private readonly examsService;
    private prismaService;
    constructor(examsService: MemorizationExamsService, prismaService: PrismaService);
    create(user: any, createExamDto: CreateExamDto): Promise<any>;
    findAll(user: any, studentId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateExamDto: UpdateExamDto): Promise<any>;
    createNote(user: any, id: string, dto: CreateExamNoteDto): Promise<any>;
    updateNote(user: any, id: string, noteId: string, dto: CreateExamNoteDto): Promise<any>;
    removeNote(user: any, id: string, noteId: string): Promise<any>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        teacherId: string;
        halaqahId: string;
        examDate: Date;
        studentId: string;
        startPage: number | null;
        endPage: number | null;
        score: number;
        recommendation: import("@prisma/client").$Enums.Recommendation;
        examType: import("@prisma/client").$Enums.ExamType;
        title: string | null;
        periodStart: Date | null;
        periodEnd: Date | null;
        resultStatus: import("@prisma/client").$Enums.ExamResultStatus;
        startJuz: number | null;
        endJuz: number | null;
    }>;
}
