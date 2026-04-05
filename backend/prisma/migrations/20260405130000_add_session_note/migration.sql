-- CreateEnum
CREATE TYPE "SessionNoteType" AS ENUM ('KESALAHAN', 'TEGURAN', 'PERHATIAN');

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

-- CreateIndex
CREATE INDEX "SessionNote_sessionId_idx" ON "SessionNote"("sessionId");

-- CreateIndex
CREATE INDEX "SessionNote_noteType_idx" ON "SessionNote"("noteType");

-- AddForeignKey
ALTER TABLE "SessionNote" ADD CONSTRAINT "SessionNote_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "MemorizationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;