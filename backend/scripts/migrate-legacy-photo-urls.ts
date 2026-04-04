import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LEGACY_PATTERNS = ['/uploads/%', 'uploads/%', 'http://localhost:3000/uploads/%'];

async function main() {
  const [studentResult, userResult] = await Promise.all([
    prisma.student.updateMany({
      where: {
        OR: LEGACY_PATTERNS.map((pattern) => ({
          photoUrl: {
            startsWith: pattern.replace('%', ''),
          },
        })),
      },
      data: {
        photoUrl: null,
      },
    }),
    prisma.user.updateMany({
      where: {
        OR: LEGACY_PATTERNS.map((pattern) => ({
          photoUrl: {
            startsWith: pattern.replace('%', ''),
          },
        })),
      },
      data: {
        photoUrl: null,
      },
    }),
  ]);

  console.log(`Students updated: ${studentResult.count}`);
  console.log(`Users updated: ${userResult.count}`);
}

main()
  .catch((error) => {
    console.error('Failed to migrate legacy photoUrl records:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
