// Mock course data for testing enrollment flow
export interface MockCourse {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  subject: string;
  grade: string;
  thumbnail?: string;
  isFree: boolean;
  totalLessons: number;
  estimatedHours: number;
  enrollmentCount: number;
  isEnrolled?: boolean;
  lessons: Array<{
    id: string;
    title: string;
    titleAr: string;
    order: number;
    duration: number;
  }>;
}

export const mockCourses: MockCourse[] = [
  {
    id: 'math-bac-2025',
    title: 'Mathematics BAC 2025 Preparation',
    titleAr: 'تحضير الرياضيات بكالوريا 2025',
    description: 'Complete mathematics course for BAC 2025 preparation with practice exams and detailed explanations.',
    descriptionAr: 'دورة شاملة في الرياضيات للتحضير لبكالوريا 2025 مع امتحانات تطبيقية وشروحات مفصلة.',
    subject: 'MATHEMATICS',
    grade: 'TERMINALE_AS',
    thumbnail: '/images/math-course.jpg',
    isFree: true,
    totalLessons: 15,
    estimatedHours: 45,
    enrollmentCount: 234,
    isEnrolled: false,
    lessons: [
      {
        id: 'math-lesson-1',
        title: 'Functions and Derivatives',
        titleAr: 'الدوال والمشتقات',
        order: 1,
        duration: 60
      },
      {
        id: 'math-lesson-2',
        title: 'Integrals',
        titleAr: 'التكاملات',
        order: 2,
        duration: 90
      },
      {
        id: 'math-lesson-3',
        title: 'Complex Numbers',
        titleAr: 'الأعداد المركبة',
        order: 3,
        duration: 75
      }
    ]
  },
  {
    id: 'physics-bac-2025',
    title: 'Physics BAC 2025 Preparation',
    titleAr: 'تحضير الفيزياء بكالوريا 2025',
    description: 'Comprehensive physics course covering mechanics, electricity, and modern physics for BAC 2025.',
    descriptionAr: 'دورة شاملة في الفيزياء تغطي الميكانيك والكهرباء والفيزياء الحديثة لبكالوريا 2025.',
    subject: 'PHYSICS',
    grade: 'TERMINALE_AS',
    thumbnail: '/images/physics-course.jpg',
    isFree: false,
    totalLessons: 20,
    estimatedHours: 60,
    enrollmentCount: 189,
    isEnrolled: false,
    lessons: [
      {
        id: 'physics-lesson-1',
        title: 'Mechanics',
        titleAr: 'الميكانيك',
        order: 1,
        duration: 90
      },
      {
        id: 'physics-lesson-2',
        title: 'Electricity and Magnetism',
        titleAr: 'الكهرباء والمغناطيسية',
        order: 2,
        duration: 105
      }
    ]
  },
  {
    id: 'arabic-literature-bac',
    title: 'Arabic Literature BAC Preparation',
    titleAr: 'تحضير الأدب العربي للبكالوريا',
    description: 'Master Arabic literature with classic texts, poetry analysis, and writing techniques.',
    descriptionAr: 'إتقان الأدب العربي مع النصوص الكلاسيكية وتحليل الشعر وتقنيات الكتابة.',
    subject: 'ARABIC_LITERATURE',
    grade: 'TERMINALE_AL',
    thumbnail: '/images/arabic-course.jpg',
    isFree: true,
    totalLessons: 12,
    estimatedHours: 36,
    enrollmentCount: 156,
    isEnrolled: false,
    lessons: [
      {
        id: 'arabic-lesson-1',
        title: 'Classical Poetry',
        titleAr: 'الشعر الكلاسيكي',
        order: 1,
        duration: 80
      }
    ]
  }
];

export const mockEnrolledCourses = [
  {
    ...mockCourses[0],
    isEnrolled: true,
    progress: 65,
    enrolledAt: new Date('2025-01-15'),
    lastAccessedAt: new Date().toISOString(),
    completedLessons: 9
  }
];

// Helper functions for mock data
export function getMockCourses(filters?: {
  subject?: string;
  grade?: string;
  isFree?: boolean;
  page?: number;
  limit?: number;
}) {
  let filteredCourses = [...mockCourses];

  if (filters?.subject && filters.subject !== 'all') {
    filteredCourses = filteredCourses.filter(course => course.subject === filters.subject);
  }

  if (filters?.grade && filters.grade !== 'all') {
    filteredCourses = filteredCourses.filter(course => course.grade === filters.grade);
  }

  if (typeof filters?.isFree === 'boolean') {
    filteredCourses = filteredCourses.filter(course => course.isFree === filters.isFree);
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 12;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    courses: filteredCourses.slice(start, end),
    pagination: {
      page,
      limit,
      total: filteredCourses.length,
      totalPages: Math.ceil(filteredCourses.length / limit)
    }
  };
}

export function getMockCourseById(courseId: string, isEnrolled = false) {
  const course = mockCourses.find(c => c.id === courseId);
  if (!course) return null;

  return {
    ...course,
    isEnrolled,
    enrollment: isEnrolled ? {
      enrolledAt: new Date('2025-01-15'),
      progress: 65,
      completedAt: null
    } : null
  };
}
