import { ExamType, Recommendation, ExamResultStatus } from '@prisma/client';
export declare class CreateExamDto {
    examDate: string;
    examType: ExamType;
    title?: string;
    studentId: string;
    halaqahId: string;
    startPage?: number;
    endPage?: number;
    startJuz?: number;
    endJuz?: number;
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
    startJuz?: number;
    endJuz?: number;
    periodStart?: string;
    periodEnd?: string;
    score?: number;
    notes?: string;
    recommendation?: Recommendation;
    resultStatus?: ExamResultStatus;
}
