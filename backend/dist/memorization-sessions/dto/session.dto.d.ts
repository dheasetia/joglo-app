import { SessionType, Recommendation, SessionNoteType } from '@prisma/client';
export declare class CreateSessionDto {
    sessionDate: string;
    sessionType: SessionType;
    studentId: string;
    halaqahId: string;
    startPage?: number;
    endPage?: number;
    score?: number;
    notes?: string;
    recommendation?: Recommendation;
    isApprovedForNextStep?: boolean;
}
export declare class UpdateSessionDto {
    sessionDate?: string;
    sessionType?: SessionType;
    startPage?: number;
    endPage?: number;
    score?: number;
    notes?: string;
    recommendation?: Recommendation;
    isApprovedForNextStep?: boolean;
}
export declare class CreateSessionNoteDto {
    noteType: SessionNoteType;
    page: number;
    line: number;
    description: string;
}
