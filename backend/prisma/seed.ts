import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const saltRounds = 10;
  
  // 1. Create Default Admin User
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tahfidz.com' },
    update: {},
    create: {
      email: 'admin@tahfidz.com',
      name: 'Super Admin',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
  console.log('Admin user created:', admin.email);

  // 2. Create Default Muhaffizh User
  const muhaffizhPassword = await bcrypt.hash('muhaffizh123', saltRounds);
  const muhaffizhEmail = 'muhaffizh@tahfidz.com';
  const muhaffizhUser = await prisma.user.upsert({
    where: { email: muhaffizhEmail },
    update: {},
    create: {
      email: muhaffizhEmail,
      name: 'Ustadz Ahmad',
      passwordHash: muhaffizhPassword,
      role: UserRole.MUHAFFIZH,
      isActive: true,
    },
  });
  console.log('Muhaffizh user created:', muhaffizhUser.email);

  // Check if teacher profile exists for muhaffizhUser, if not create it
  const existingMuhaffizhTeacher = await prisma.teacher.findUnique({
    where: { userId: muhaffizhUser.id }
  });
  if (!existingMuhaffizhTeacher) {
    await prisma.teacher.create({
      data: {
        userId: muhaffizhUser.id,
        fullName: 'Ustadz Ahmad Fauzi',
        phone: '081234567890',
        isActive: true,
      }
    });
    console.log('  Teacher profile created for:', muhaffizhEmail);
  }

  // 3. Import Users from User.json
  const dbBackupPath = path.join(__dirname, '../../DBBackup');
  const usersJsonPath = path.join(dbBackupPath, 'User.json');
  if (fs.existsSync(usersJsonPath)) {
    const usersData = JSON.parse(fs.readFileSync(usersJsonPath, 'utf8'));
    console.log(`Importing ${usersData.length} users from User.json...`);
    
    for (const userData of usersData) {
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          name: userData.name,
          passwordHash: userData.passwordHash,
          role: userData.role as UserRole,
          isActive: userData.isActive,
          photoUrl: userData.photoUrl,
        },
        create: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          passwordHash: userData.passwordHash,
          role: userData.role as UserRole,
          isActive: userData.isActive,
          photoUrl: userData.photoUrl,
        },
      });
    }
    console.log('  Users imported successfully.');
  }

  // 4. Import Teachers from Teacher.json
  const teachersJsonPath = path.join(dbBackupPath, 'Teacher.json');
  if (fs.existsSync(teachersJsonPath)) {
    const teachersData = JSON.parse(fs.readFileSync(teachersJsonPath, 'utf8'));
    console.log(`Importing ${teachersData.length} teachers from Teacher.json...`);
    for (const teacherData of teachersData) {
      // Check if another teacher already uses this userId
      const conflictingTeacher = await prisma.teacher.findFirst({
        where: {
          userId: teacherData.userId,
          NOT: { id: teacherData.id }
        }
      });

      if (conflictingTeacher) {
        console.log(`  Conflict found for teacher ${teacherData.fullName} (userId: ${teacherData.userId}). Removing conflicting teacher ${conflictingTeacher.fullName}...`);
        await prisma.teacher.delete({ where: { id: conflictingTeacher.id } });
      }

      await prisma.teacher.upsert({
        where: { id: teacherData.id },
        update: {
          userId: teacherData.userId,
          fullName: teacherData.fullName,
          phone: teacherData.phone,
          notes: teacherData.notes,
          isActive: teacherData.isActive,
        },
        create: {
          id: teacherData.id,
          userId: teacherData.userId,
          fullName: teacherData.fullName,
          phone: teacherData.phone,
          notes: teacherData.notes,
          isActive: teacherData.isActive,
        },
      });
    }
    console.log('  Teachers imported successfully.');
  }

  // 5. Import Halaqahs from Halaqah.json
  const halaqahsJsonPath = path.join(dbBackupPath, 'Halaqah.json');
  if (fs.existsSync(halaqahsJsonPath)) {
    const halaqahsData = JSON.parse(fs.readFileSync(halaqahsJsonPath, 'utf8'));
    console.log(`Importing ${halaqahsData.length} halaqahs from Halaqah.json...`);
    for (const halaqahData of halaqahsData) {
      await prisma.halaqah.upsert({
        where: { id: halaqahData.id },
        update: {
          name: halaqahData.name,
          description: halaqahData.description,
          teacherId: halaqahData.teacherId,
          isActive: halaqahData.isActive,
        },
        create: {
          id: halaqahData.id,
          name: halaqahData.name,
          description: halaqahData.description,
          teacherId: halaqahData.teacherId,
          isActive: halaqahData.isActive,
        },
      });
    }
    console.log('  Halaqahs imported successfully.');
  }

  // 6. Import Students from Student.json
  const studentsJsonPath = path.join(dbBackupPath, 'Student.json');
  if (fs.existsSync(studentsJsonPath)) {
    const studentsData = JSON.parse(fs.readFileSync(studentsJsonPath, 'utf8'));
    console.log(`Importing ${studentsData.length} students from Student.json...`);
    for (const studentData of studentsData) {
      await prisma.student.upsert({
        where: { id: studentData.id },
        update: {
          nis: studentData.nis,
          fullName: studentData.fullName,
          gender: studentData.gender,
          level: studentData.level,
          className: studentData.className,
          halaqahId: studentData.halaqahId,
          isActive: studentData.isActive,
          currentJuz: studentData.currentJuz || 0,
          currentPage: studentData.currentPage,
          lastMemorizedPage: studentData.lastMemorizedPage,
          totalMemorizedPages: studentData.totalMemorizedPages || 0,
        },
        create: {
          id: studentData.id,
          nis: studentData.nis,
          fullName: studentData.fullName,
          gender: studentData.gender,
          level: studentData.level,
          className: studentData.className,
          halaqahId: studentData.halaqahId,
          isActive: studentData.isActive,
          currentJuz: studentData.currentJuz || 0,
          currentPage: studentData.currentPage,
          lastMemorizedPage: studentData.lastMemorizedPage,
          totalMemorizedPages: studentData.totalMemorizedPages || 0,
        },
      });
    }
    console.log('  Students imported successfully.');
  }

  // 7. Import MemorizationSessions from MemorizationSession.json
  const sessionsJsonPath = path.join(dbBackupPath, 'MemorizationSession.json');
  if (fs.existsSync(sessionsJsonPath)) {
    const sessionsData = JSON.parse(fs.readFileSync(sessionsJsonPath, 'utf8'));
    console.log(`Importing ${sessionsData.length} sessions from MemorizationSession.json...`);
    for (const sessionData of sessionsData) {
      await prisma.memorizationSession.upsert({
        where: { id: sessionData.id },
        update: {
          sessionDate: new Date(sessionData.sessionDate),
          sessionType: sessionData.sessionType,
          studentId: sessionData.studentId,
          teacherId: sessionData.teacherId,
          halaqahId: sessionData.halaqahId,
          startPage: sessionData.startPage,
          endPage: sessionData.endPage,
          totalPages: sessionData.totalPages,
          score: sessionData.score,
          notes: sessionData.notes,
          recommendation: sessionData.recommendation,
          isApprovedForNextStep: sessionData.isApprovedForNextStep,
        },
        create: {
          id: sessionData.id,
          sessionDate: new Date(sessionData.sessionDate),
          sessionType: sessionData.sessionType,
          studentId: sessionData.studentId,
          teacherId: sessionData.teacherId,
          halaqahId: sessionData.halaqahId,
          startPage: sessionData.startPage,
          endPage: sessionData.endPage,
          totalPages: sessionData.totalPages,
          score: sessionData.score,
          notes: sessionData.notes,
          recommendation: sessionData.recommendation,
          isApprovedForNextStep: sessionData.isApprovedForNextStep,
        },
      });
    }
    console.log('  Sessions imported successfully.');
  }

  // 8. Import MemorizationExams from MemorizationExam.json
  const examsJsonPath = path.join(dbBackupPath, 'MemorizationExam.json');
  if (fs.existsSync(examsJsonPath)) {
    const examsData = JSON.parse(fs.readFileSync(examsJsonPath, 'utf8'));
    console.log(`Importing ${examsData.length} exams from MemorizationExam.json...`);
    for (const examData of examsData) {
      await prisma.memorizationExam.upsert({
        where: { id: examData.id },
        update: {
          examDate: new Date(examData.examDate),
          examType: examData.examType,
          title: examData.title,
          studentId: examData.studentId,
          teacherId: examData.teacherId,
          halaqahId: examData.halaqahId,
          startPage: examData.startPage,
          endPage: examData.endPage,
          startJuz: examData.startJuz,
          endJuz: examData.endJuz,
          periodStart: examData.periodStart ? new Date(examData.periodStart) : null,
          periodEnd: examData.periodEnd ? new Date(examData.periodEnd) : null,
          score: examData.score,
          notes: examData.notes,
          recommendation: examData.recommendation,
          resultStatus: examData.resultStatus,
        },
        create: {
          id: examData.id,
          examDate: new Date(examData.examDate),
          examType: examData.examType,
          title: examData.title,
          studentId: examData.studentId,
          teacherId: examData.teacherId,
          halaqahId: examData.halaqahId,
          startPage: examData.startPage,
          endPage: examData.endPage,
          startJuz: examData.startJuz,
          endJuz: examData.endJuz,
          periodStart: examData.periodStart ? new Date(examData.periodStart) : null,
          periodEnd: examData.periodEnd ? new Date(examData.periodEnd) : null,
          score: examData.score,
          notes: examData.notes,
          recommendation: examData.recommendation,
          resultStatus: examData.resultStatus,
        },
      });
    }
    console.log('  Exams imported successfully.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
