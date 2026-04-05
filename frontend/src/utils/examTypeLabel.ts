import { ExamType } from '../types';

const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  [ExamType.WEEKLY]: 'Pekanan',
  [ExamType.JUZ_IYYAH]: "Juz'iyyah",
  [ExamType.FIVE_JUZ]: 'Kelipatan 5 juz',
  [ExamType.FINAL_30_JUZ]: 'Ujian Akhir 30 Juz',
};

export const getExamTypeLabel = (examType: ExamType | string | null | undefined): string => {
  if (!examType) return '-';
  return EXAM_TYPE_LABELS[examType as ExamType] ?? examType;
};
