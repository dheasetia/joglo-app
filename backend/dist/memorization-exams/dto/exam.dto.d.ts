import { ExamType, Recommendation, ExamResultStatus, SessionNoteType } from '@prisma/client';
export declare class CreateExamDto {
    examDate: string;
    examType: ExamType;
    title?: string;
    studentId: string;
    halaqahId: string;
    startPage: number;
    endPage: number;
    periodStart?: string;
    periodEnd?: string;
    score: number;
    notes?: string;
    recommendation: Recommendation;
    resultStatus: ExamResultStatus;
}
export declare class UpdateExamDto {
    examDate?: string;
    examType?: ExamType;
    title?: string;
    startPage?: number;
    endPage?: number;
    periodStart?: string;
    periodEnd?: string;
    score?: number;
    notes?: string;
    recommendation?: Recommendation;
    resultStatus?: ExamResultStatus;
}
export declare class CreateExamNoteDto {
    noteType: SessionNoteType;
    page: number;
    line: number;
    description: string;
}
