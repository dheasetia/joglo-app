import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizePhotoUrl } from '../common/photo-url.util';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  private async mapPhotoUrl<T extends { photoUrl?: string | null }>(record: T): Promise<T> {
    const sanitizedPhoto = sanitizePhotoUrl(record.photoUrl);

    if (!sanitizedPhoto) {
      return {
        ...record,
        photoUrl: sanitizedPhoto,
      };
    }

    if (/^https?:\/\//i.test(sanitizedPhoto)) {
      return {
        ...record,
        photoUrl: sanitizedPhoto,
      };
    }

    try {
      const signed = await this.storageService.createPresignedDownloadUrl(sanitizedPhoto);
      return {
        ...record,
        photoUrl: signed.url,
      };
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      return {
        ...record,
        photoUrl: null,
      };
    }
  }

  async getStudentProgress(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        sessions: {
          orderBy: { sessionDate: 'desc' },
          take: 10,
        },
        exams: {
          orderBy: { examDate: 'desc' },
        },
        halaqah: {
          include: { 
            teacher: {
              include: {
                user: {
                  select: {
                    photoUrl: true
                  }
                }
              }
            } 
          }
        }
      }
    });

    if (!student) throw new NotFoundException('Student not found');

    const mappedStudent = await this.mapPhotoUrl(student);

    if (mappedStudent.halaqah?.teacher?.user) {
      mappedStudent.halaqah.teacher.user = await this.mapPhotoUrl(mappedStudent.halaqah.teacher.user);
    }

    const memorizationProgress = await this.prisma.memorizationSession.aggregate({
      where: {
        studentId,
        sessionType: SessionType.ZIYADAH,
        recommendation: 'CONTINUE',
      },
      _sum: {
        totalPages: true,
      },
      _max: {
        endPage: true,
      },
    });

    return {
      ...mappedStudent,
      totalMemorizedPages: memorizationProgress._sum.totalPages ?? student.totalMemorizedPages,
      lastMemorizedPage: memorizationProgress._max.endPage ?? student.lastMemorizedPage,
    };
  }

  async getHalaqahReport(halaqahId: string) {
    const halaqah = await this.prisma.halaqah.findUnique({
      where: { id: halaqahId },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                photoUrl: true
              }
            }
          }
        },
        students: {
          select: {
            id: true,
            fullName: true,
            nis: true,
            photoUrl: true,
            currentJuz: true,
            _count: {
              select: { sessions: true }
            }
          }
        }
      }
    });

    if (!halaqah) throw new NotFoundException('Halaqah not found');

    if (halaqah.teacher?.user) {
      halaqah.teacher.user = await this.mapPhotoUrl(halaqah.teacher.user);
    }

    if (halaqah.students) {
      halaqah.students = await Promise.all(
        halaqah.students.map((student) => this.mapPhotoUrl(student)),
      );
    }

    return halaqah;
  }
}
