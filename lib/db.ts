// Database client utilities for working with Prisma
import { prisma } from './prisma';

// Course-related utilities
export async function getCourses({ 
  subject, 
  grade,
  isFree,
  page = 1,
  limit = 10,
}: { 
  subject?: string;
  grade?: string;
  isFree?: boolean;
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;
  
  const where: any = {
    isPublished: true,
  };
  
  if (subject) {
    where.subject = subject;
  }
  
  if (grade) {
    where.grade = grade;
  }
  
  if (typeof isFree === 'boolean') {
    where.isFree = isFree;
  }

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        titleAr: true,
        description: true,
        descriptionAr: true,
        thumbnail: true,
        subject: true,
        grade: true,
        isFree: true,
        totalLessons: true,
        estimatedHours: true,
        bacRelevance: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: {
        bacRelevance: 'desc'
      }
    }),
    prisma.course.count({ where })
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    courses,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
}

// Course detail
export async function getCourseById(id: string, userId?: string) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: {
          order: 'asc'
        },
        select: {
          id: true,
          title: true,
          titleAr: true,
          videoUrl: true,
          duration: true,
          order: true
        }
      },
      _count: {
        select: {
          enrollments: true
        }
      }
    }
  });

  if (!course) {
    return null;
  }

  let enrollment = null;
  if (userId) {
    enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: id
        }
      },
      select: {
        enrolledAt: true,
        progress: true,
        completedAt: true
      }
    });
  }

  return {
    ...course,
    isEnrolled: !!enrollment,
    enrollment
  };
}

// Enrollment
export async function enrollInCourse(userId: string, courseId: string) {
  // Check if user is already enrolled
  const existingEnrollment = await prisma.courseEnrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId
      }
    }
  });

  if (existingEnrollment) {
    return existingEnrollment;
  }

  // Create new enrollment
  return prisma.courseEnrollment.create({
    data: {
      userId,
      courseId,
    }
  });
}

// Update learning progress
export async function updateLessonProgress(userId: string, lessonId: string, data: {
  completed?: boolean;
  timeSpent?: number;
  score?: number;
}) {
  // First get the lesson to get the courseId
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { courseId: true }
  });

  if (!lesson) {
    throw new Error('Lesson not found');
  }

  // Upsert progress record
  const progress = await prisma.learningProgress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId
      }
    },
    update: {
      ...data,
      timeSpent: data.timeSpent ? {
        increment: data.timeSpent
      } : undefined
    },
    create: {
      userId,
      lessonId,
      courseId: lesson.courseId,
      ...data
    }
  });

  // Update course enrollment progress
  await updateCourseProgress(userId, lesson.courseId);

  return progress;
}

// Calculate and update overall course progress
async function updateCourseProgress(userId: string, courseId: string) {
  // Get all lessons for the course
  const totalLessons = await prisma.lesson.count({
    where: { courseId }
  });

  // Get completed lessons
  const completedLessons = await prisma.learningProgress.count({
    where: {
      userId,
      courseId,
      completed: true
    }
  });

  // Calculate progress percentage
  const progressPercentage = totalLessons > 0 
    ? (completedLessons / totalLessons) * 100 
    : 0;

  // Update enrollment
  return prisma.courseEnrollment.update({
    where: {
      userId_courseId: {
        userId,
        courseId
      }
    },
    data: {
      progress: progressPercentage,
      completedAt: progressPercentage === 100 ? new Date() : null
    }
  });
}
