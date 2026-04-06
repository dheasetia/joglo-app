-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MUHAFFIZH');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('TAS_HIH', 'ZIYADAH', 'MURAJAAH_SHUGHRA', 'MURAJAAH_KUBRO');

-- CreateEnum
CREATE TYPE "SessionNoteType" AS ENUM ('KESALAHAN', 'TEGURAN', 'PERHATIAN');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('WEEKLY', 'JUZ_IYYAH', 'FIVE_JUZ', 'FINAL_30_JUZ');

-- CreateEnum
CREATE TYPE "Recommendation" AS ENUM ('CONTINUE', 'REPEAT');

-- CreateEnum
CREATE TYPE "ExamResultStatus" AS ENUM ('PASSED', 'FAILED');

-- CreateEnum
CREATE TYPE "FileVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "photoUrl" TEXT,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Halaqah" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "teacherId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Halaqah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "nis" TEXT,
    "fullName" TEXT NOT NULL,
    "photoUrl" TEXT,
    "gender" "Gender" NOT NULL,
    "level" TEXT,
    "className" TEXT,
    "halaqahId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "currentJuz" INTEGER NOT NULL DEFAULT 0,
    "currentPage" INTEGER,
    "lastMemorizedPage" INTEGER,
    "totalMemorizedPages" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemorizationSession" (
    "id" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL,
    "sessionType" "SessionType" NOT NULL,
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "halaqahId" TEXT NOT NULL,
    "startPage" INTEGER,
    "endPage" INTEGER,
    "totalPages" INTEGER,
    "score" INTEGER NOT NULL,
    "notes" TEXT,
    "recommendation" "Recommendation" NOT NULL,
    "isApprovedForNextStep" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemorizationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionNote" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "noteType" "SessionNoteType" NOT NULL,
    "page" INTEGER NOT NULL,
    "line" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemorizationExam" (
    "id" TEXT NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "examType" "ExamType" NOT NULL,
    "title" TEXT,
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "halaqahId" TEXT NOT NULL,
    "startPage" INTEGER,
    "endPage" INTEGER,
    "startJuz" INTEGER,
    "endJuz" INTEGER,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "score" INTEGER NOT NULL,
    "notes" TEXT,
    "recommendation" "Recommendation" NOT NULL,
    "resultStatus" "ExamResultStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemorizationExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamNote" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "noteType" "SessionNoteType" NOT NULL,
    "page" INTEGER NOT NULL,
    "line" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileAsset" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "visibility" "FileVisibility" NOT NULL DEFAULT 'PRIVATE',
    "module" TEXT NOT NULL,
    "entityId" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "studentId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- CreateIndex
CREATE INDEX "Teacher_fullName_idx" ON "Teacher"("fullName");

-- CreateIndex
CREATE INDEX "Teacher_isActive_idx" ON "Teacher"("isActive");

-- CreateIndex
CREATE INDEX "Halaqah_teacherId_idx" ON "Halaqah"("teacherId");

-- CreateIndex
CREATE INDEX "Halaqah_isActive_idx" ON "Halaqah"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Halaqah_teacherId_name_key" ON "Halaqah"("teacherId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Student_nis_key" ON "Student"("nis");

-- CreateIndex
CREATE INDEX "Student_halaqahId_idx" ON "Student"("halaqahId");

-- CreateIndex
CREATE INDEX "Student_fullName_idx" ON "Student"("fullName");

-- CreateIndex
CREATE INDEX "Student_isActive_idx" ON "Student"("isActive");

-- CreateIndex
CREATE INDEX "Student_currentJuz_idx" ON "Student"("currentJuz");

-- CreateIndex
CREATE INDEX "MemorizationSession_studentId_idx" ON "MemorizationSession"("studentId");

-- CreateIndex
CREATE INDEX "MemorizationSession_teacherId_idx" ON "MemorizationSession"("teacherId");

-- CreateIndex
CREATE INDEX "MemorizationSession_halaqahId_idx" ON "MemorizationSession"("halaqahId");

-- CreateIndex
CREATE INDEX "MemorizationSession_sessionDate_idx" ON "MemorizationSession"("sessionDate");

-- CreateIndex
CREATE INDEX "MemorizationSession_sessionType_idx" ON "MemorizationSession"("sessionType");

-- CreateIndex
CREATE INDEX "SessionNote_sessionId_idx" ON "SessionNote"("sessionId");

-- CreateIndex
CREATE INDEX "SessionNote_noteType_idx" ON "SessionNote"("noteType");

-- CreateIndex
CREATE INDEX "MemorizationExam_studentId_idx" ON "MemorizationExam"("studentId");

-- CreateIndex
CREATE INDEX "MemorizationExam_teacherId_idx" ON "MemorizationExam"("teacherId");

-- CreateIndex
CREATE INDEX "MemorizationExam_halaqahId_idx" ON "MemorizationExam"("halaqahId");

-- CreateIndex
CREATE INDEX "MemorizationExam_examDate_idx" ON "MemorizationExam"("examDate");

-- CreateIndex
CREATE INDEX "MemorizationExam_examType_idx" ON "MemorizationExam"("examType");

-- CreateIndex
CREATE INDEX "ExamNote_examId_idx" ON "ExamNote"("examId");

-- CreateIndex
CREATE INDEX "ExamNote_noteType_idx" ON "ExamNote"("noteType");

-- CreateIndex
CREATE UNIQUE INDEX "FileAsset_key_key" ON "FileAsset"("key");

-- CreateIndex
CREATE INDEX "FileAsset_tenantId_idx" ON "FileAsset"("tenantId");

-- CreateIndex
CREATE INDEX "FileAsset_module_idx" ON "FileAsset"("module");

-- CreateIndex
CREATE INDEX "FileAsset_entityId_idx" ON "FileAsset"("entityId");

-- CreateIndex
CREATE INDEX "FileAsset_uploadedBy_idx" ON "FileAsset"("uploadedBy");

-- CreateIndex
CREATE INDEX "FileAsset_studentId_idx" ON "FileAsset"("studentId");

-- CreateIndex
CREATE INDEX "FileAsset_visibility_idx" ON "FileAsset"("visibility");

-- CreateIndex
CREATE INDEX "FileAsset_isDeleted_idx" ON "FileAsset"("isDeleted");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Halaqah" ADD CONSTRAINT "Halaqah_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_halaqahId_fkey" FOREIGN KEY ("halaqahId") REFERENCES "Halaqah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemorizationSession" ADD CONSTRAINT "MemorizationSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemorizationSession" ADD CONSTRAINT "MemorizationSession_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemorizationSession" ADD CONSTRAINT "MemorizationSession_halaqahId_fkey" FOREIGN KEY ("halaqahId") REFERENCES "Halaqah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionNote" ADD CONSTRAINT "SessionNote_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "MemorizationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemorizationExam" ADD CONSTRAINT "MemorizationExam_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemorizationExam" ADD CONSTRAINT "MemorizationExam_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemorizationExam" ADD CONSTRAINT "MemorizationExam_halaqahId_fkey" FOREIGN KEY ("halaqahId") REFERENCES "Halaqah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamNote" ADD CONSTRAINT "ExamNote_examId_fkey" FOREIGN KEY ("examId") REFERENCES "MemorizationExam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
