import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Helper functions for common database operations
export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
    include: {
      enrollments: {
        include: {
          course: true,
        },
      },
      examResults: {
        include: {
          exam: true,
        },
        orderBy: {
          completedAt: 'desc',
        },
        take: 5,
      },
      achievements: {
        orderBy: {
          earnedAt: 'desc',
        },
      },
      notifications: {
        where: {
          isRead: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
    },
  });
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          course: true,
        },
      },
      examResults: {
        include: {
          exam: true,
        },
        orderBy: {
          completedAt: 'desc',
        },
        take: 5,
      },
      achievements: {
        orderBy: {
          earnedAt: 'desc',
        },
      },
      notifications: {
        where: {
          isRead: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
    },
  });
}

export async function createUser(data: {
  email: string;
  phone?: string;
  password: string;
  name: string;
  role?: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
  grade?: string;
  wilaya?: string;
  school?: string;
  parentPhone?: string;
}) {
  return db.user.create({
    data: {
      ...data,
      role: data.role || 'STUDENT',
    },
  });
}

export async function updateUserProfile(userId: string, data: {
  name?: string;
  phone?: string;
  avatar?: string;
  grade?: string;
  wilaya?: string;
  school?: string;
  parentPhone?: string;
  dateOfBirth?: Date;
}) {
  return db.user.update({
    where: { id: userId },
    data,
  });
}

export async function getUserStats(userId: string) {
  const [enrollmentCount, completedCourses, examResults, studyTime] = await Promise.all([
    db.enrollment.count({
      where: { userId },
    }),
    db.enrollment.count({
      where: {
        userId,
        progress: 100,
      },
    }),
    db.examResult.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: 10,
    }),
    db.studySession.aggregate({
      where: { userId },
      _sum: {
        duration: true,
      },
    }),
  ]);

  const averageScore = examResults.length > 0
    ? examResults.reduce((sum, result) => sum + result.percentage, 0) / examResults.length
    : 0;

  return {
    totalCourses: enrollmentCount,
    completedCourses,
    totalStudyTime: studyTime._sum.duration || 0,
    averageScore: Math.round(averageScore),
    recentExams: examResults,
  };
}