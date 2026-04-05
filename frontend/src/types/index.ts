export enum UserRole {
  ADMIN = 'ADMIN',
  MUHAFFIZH = 'MUHAFFIZH',
}

export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Teacher {
  id: string;
  fullName: string;
  phone?: string;
  notes?: string;
  isActive: boolean;
  userId: string;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface Student {
  id: string;
  nis?: string;
  fullName: string;
  photoUrl?: string;
  gender: Gender;
  level?: string;
  className?: string;
  halaqahId: string;
  isActive: boolean;
  currentJuz: number;
  currentPage?: number;
  lastMemorizedPage?: number;
  totalMemorizedPages: number;
  halaqah?: Halaqah;
}

export interface Halaqah {
  id: string;
  name: string;
  description?: string;
  teacherId: string;
  isActive: boolean;
  teacher?: Teacher;
  _count?: {
    students: number;
  };
}

export enum SessionType {
  TAS_HIH = 'TAS_HIH',
  ZIYADAH = 'ZIYADAH',
  MURAJAAH_SHUGHRA = 'MURAJAAH_SHUGHRA',
  MURAJAAH_KUBRO = 'MURAJAAH_KUBRO',
}

export enum Recommendation {
  CONTINUE = 'CONTINUE',
  REPEAT = 'REPEAT',
}

export enum SessionNoteType {
  KESALAHAN = 'KESALAHAN',
  TEGURAN = 'TEGURAN',
  PERHATIAN = 'PERHATIAN',
}

export interface SessionNote {
  id: string;
  sessionId: string;
  noteType: SessionNoteType;
  page: number;
  line: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionNoteSummary {
  KESALAHAN: number;
  TEGURAN: number;
  PERHATIAN: number;
}

export interface ExamNote {
  id: string;
  examId: string;
  noteType: SessionNoteType;
  page: number;
  line: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamNoteSummary {
  KESALAHAN: number;
  TEGURAN: number;
  PERHATIAN: number;
}

export interface MemorizationSession {
  id: string;
  sessionDate: string;
  sessionType: SessionType;
  studentId: string;
  teacherId: string;
  halaqahId: string;
  startPage?: number;
  endPage?: number;
  totalPages?: number;
  score: number;
  notes?: string;
  recommendation: Recommendation;
  noteItems?: SessionNote[];
  noteSummary?: SessionNoteSummary;
  student?: Student;
  teacher?: Teacher;
  halaqah?: Halaqah;
}

export enum ExamType {
  WEEKLY = 'WEEKLY',
  JUZ_IYYAH = 'JUZ_IYYAH',
  FIVE_JUZ = 'FIVE_JUZ',
  FINAL_30_JUZ = 'FINAL_30_JUZ',
}

export enum ExamResultStatus {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
}

export interface MemorizationExam {
  id: string;
  examDate: string;
  examType: ExamType;
  title?: string;
  studentId: string;
  teacherId: string;
  halaqahId: string;
  startPage?: number;
  endPage?: number;
  periodStart?: string;
  periodEnd?: string;
  score: number;
  notes?: string;
  recommendation: Recommendation;
  resultStatus: ExamResultStatus;
  noteItems?: ExamNote[];
  noteSummary?: ExamNoteSummary;
  student?: Student;
  teacher?: Teacher;
  halaqah?: Halaqah;
}
