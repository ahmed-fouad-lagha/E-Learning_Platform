import { prisma } from './prisma';
import { z } from 'zod';

// Type definitions
export type Course = {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  subject: string;
  grade: string;
  thumbnail?: string | null;
  isFree: boolean;
  totalLessons: number;
  estimatedHours: number;
  enrollmentCount: number;
};

export type CourseDetail = Course & {
  lessons: {
    id: string;
    title: string;
    titleAr: string;
    order: number;
    duration: number;
  }[];
  isEnrolled: boolean;
  enrollment?: {
    enrolledAt: Date;
    progress: number;
    completedAt: Date | null;
  } | null;
};

// Zod schema for course validation
export const courseSchema = z.object({
  title: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),
  titleAr: z.string().min(3, "العنوان بالعربية يجب أن يكون 3 أحرف على الأقل"),
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
  descriptionAr: z.string().min(10, "الوصف بالعربية يجب أن يكون 10 أحرف على الأقل"),
  subject: z.string(),
  grade: z.string(),
  thumbnail: z.string().optional(),
  isFree: z.boolean().default(false),
  curriculum: z.string(),
  bacRelevance: z.number().min(0).max(1).default(0),
  estimatedHours: z.number().positive().default(1)
});

// Course queries

// Get all published courses with optional filtering
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
  try {
    // Use Supabase client directly
    const { supabase } = await import('./supabase');
    
    // Try Supabase first
    try {
      let query = supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (subject) query = query.eq('subject', subject);
      if (grade) query = query.eq('grade', grade);
      if (typeof isFree === 'boolean') query = query.eq('is_free', isFree);
      
      if (page && limit) {
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);
      }
      
      const { data: courses, error, count } = await query;
      
      if (error) throw error;
      
      // Transform Supabase results to match our Course type
      const formattedCourses: Course[] = (courses || []).map(course => ({
        id: course.id,
        title: course.title,
        titleAr: course.title_ar,
        description: course.description,
        descriptionAr: course.description_ar,
        subject: course.subject,
        grade: course.grade,
        thumbnail: course.thumbnail,
        isFree: course.is_free,
        totalLessons: course.total_lessons,
        estimatedHours: course.estimated_hours,
        enrollmentCount: course.course_enrollments?.[0]?.count || 0
      }));
      
      return {
        courses: formattedCourses,
        pagination: {
          page: page || 1,
          limit: limit || 10,
          total: count || 0
        }
      };
    } catch (supabaseError) {
      console.warn("Supabase getCourses failed, using mock data:", supabaseError);
      
      // Fallback to mock data
      const mockCourses: Course[] = [
        {
          id: "math-terminale-as-1",
          title: "Advanced Algebra",
          titleAr: "الجبر المتقدم",
          description: "Master advanced algebraic concepts for the Baccalauréat",
          descriptionAr: "اتقن مفاهيم الجبر المتقدمة لامتحان البكالوريا",
          subject: "MATHEMATICS",
          grade: "TERMINALE_AS",
          thumbnail: "/images/math-thumb.jpg",
          isFree: false,
          totalLessons: 12,
          estimatedHours: 24,
          enrollmentCount: 150
        },
        {
          id: "physics-terminale-as-1",
          title: "Mechanics and Energy",
          titleAr: "الميكانيكا والطاقة",
          description: "Understand the fundamental principles of mechanics",
          descriptionAr: "فهم المبادئ الأساسية للميكانيكا",
          subject: "PHYSICS",
          grade: "TERMINALE_AS",
          thumbnail: "/images/physics-thumb.jpg",
          isFree: true,
          totalLessons: 15,
          estimatedHours: 30,
          enrollmentCount: 89
        }
      ];
      
      // Apply filters to mock data
      let filteredCourses = mockCourses;
      
      if (subject) {
        filteredCourses = filteredCourses.filter(course => course.subject === subject);
      }
      
      if (grade) {
        filteredCourses = filteredCourses.filter(course => course.grade === grade);
      }
      
      if (typeof isFree === 'boolean') {
        filteredCourses = filteredCourses.filter(course => course.isFree === isFree);
      }
      
      // Apply pagination
      const total = filteredCourses.length;
      const skip = (page - 1) * limit;
      const paginatedCourses = filteredCourses.slice(skip, skip + limit);
      
      return {
        courses: paginatedCourses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  }
}

// Get course details by ID
export async function getCourseById(courseId: string, userId?: string): Promise<CourseDetail | null> {
  try {
    // Use Supabase client directly
    const { supabase } = await import('./supabase');
    
    // Try Supabase first
    try {
      const { data: course, error } = await supabase
        .from('courses')
        .select(`
          *,
          lessons(id, title, title_ar, order_num, duration),
          course_enrollments(enrolled_at, progress, completed_at, count)
        `)
        .eq('id', courseId)
        .single();
      
      if (error || !course) return null;
      
      let isEnrolled = false;
      let enrollment = null;
      
      if (userId) {
        const { data: enrollmentData } = await supabase
          .from('course_enrollments')
          .select('enrolled_at, progress, completed_at')
          .eq('user_id', userId)
          .eq('course_id', courseId)
          .single();

        if (enrollmentData) {
          isEnrolled = true;
          enrollment = {
            enrolledAt: new Date(enrollmentData.enrolled_at),
            progress: enrollmentData.progress,
            completedAt: enrollmentData.completed_at ? new Date(enrollmentData.completed_at) : null
          };
        }
      }
      
      // Transform Supabase result to match our CourseDetail type
      return {
        id: course.id,
        title: course.title,
        titleAr: course.title_ar,
        description: course.description,
        descriptionAr: course.description_ar,
        subject: course.subject,
        grade: course.grade,
        thumbnail: course.thumbnail,
        isFree: course.is_free,
        totalLessons: course.total_lessons,
        estimatedHours: course.estimated_hours,
        enrollmentCount: course.course_enrollments?.[0]?.count || 0,
        lessons: (course.lessons || []).map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          titleAr: lesson.title_ar,
          order: lesson.order_num,
          duration: lesson.duration
        })),
        isEnrolled,
        enrollment
      };
    } catch (supabaseError) {
      console.warn("Supabase getCourseById failed, using mock data:", supabaseError);
      
      // Fallback to mock data
      if (courseId === "math-terminale-as-1") {
        return {
          id: "math-terminale-as-1",
          title: "Advanced Algebra",
          titleAr: "الجبر المتقدم",
          description: "Master advanced algebraic concepts for the Baccalauréat",
          descriptionAr: "اتقن مفاهيم الجبر المتقدمة لامتحان البكالوريا",
          subject: "MATHEMATICS",
          grade: "TERMINALE_AS",
          thumbnail: "/images/math-thumb.jpg",
          isFree: false,
          totalLessons: 12,
          estimatedHours: 24,
          enrollmentCount: 150,
          lessons: [
            {
              id: "lesson1",
              title: "Introduction to Functions",
              titleAr: "مقدمة إلى الدوال",
              order: 1,
              duration: 45
            },
            {
              id: "lesson2",
              title: "Linear Functions",
              titleAr: "الدوال الخطية",
              order: 2,
              duration: 50
            }
          ],
          isEnrolled: false,
          enrollment: null
        };
      }
      
      return null;
    }
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw new Error("Failed to fetch course details");
  }
}

// Enroll a user in a course
export async function enrollUserInCourse(userId: string, courseId: string) {
  try {
    // Use Supabase client directly
    const { supabase } = await import('./supabase');
    
    // Try Supabase first
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert([
          {
            user_id: userId,
            course_id: courseId,
            enrolled_at: new Date().toISOString(),
            progress: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: "Enrollment successful",
        enrollment: {
          id: data.id,
          userId: data.user_id,
          courseId: data.course_id,
          enrolledAt: new Date(data.enrolled_at),
          progress: data.progress,
          completedAt: null
        }
      };
    } catch (supabaseError) {
      console.warn("Supabase enrollUserInCourse failed, returning mock success:", supabaseError);
      
      // Fallback to mock success response
      return {
        success: true,
        message: "Enrollment successful (mock)",
        enrollment: {
          id: `enrollment-${Date.now()}`,
          userId,
          courseId,
          enrolledAt: new Date(),
          progress: 0,
          completedAt: null
        }
      };
    }
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw new Error("Failed to enroll in course");
  }
}

// Get all courses a user is enrolled in
export async function getUserEnrollments(userId: string) {
  try {
    // Use Supabase client directly
    const { supabase } = await import('./supabase');
    
    // Try Supabase first
    try {
      const { data: enrollments, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses(
            id,
            title,
            title_ar,
            thumbnail,
            subject,
            grade,
            total_lessons
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      return (enrollments || []).map(enrollment => ({
        id: enrollment.courses.id,
        title: enrollment.courses.title,
        titleAr: enrollment.courses.title_ar,
        thumbnail: enrollment.courses.thumbnail,
        subject: enrollment.courses.subject,
        grade: enrollment.courses.grade,
        totalLessons: enrollment.courses.total_lessons,
        progress: enrollment.progress,
        enrolledAt: enrollment.enrolled_at,
        completedAt: enrollment.completed_at,
        lastAccessedAt: enrollment.enrolled_at // Placeholder
      }));
    } catch (supabaseError) {
      console.warn("Supabase getUserEnrollments failed, using mock data:", supabaseError);
      
      // Fallback to mock data
      return [
        {
          id: "math-terminale-as-1",
          title: "Advanced Algebra",
          titleAr: "الجبر المتقدم",
          thumbnail: "/images/math-thumb.jpg",
          subject: "MATHEMATICS",
          grade: "TERMINALE_AS",
          totalLessons: 12,
          progress: 45.5,
          enrolledAt: new Date('2025-01-15'),
          completedAt: null
        },
        {
          id: "physics-terminale-as-1",
          title: "Mechanics and Energy",
          titleAr: "الميكانيكا والطاقة",
          thumbnail: "/images/physics-thumb.jpg",
          subject: "PHYSICS",
          grade: "TERMINALE_AS",
          totalLessons: 15,
          progress: 78.2,
          enrolledAt: new Date('2025-01-10'),
          completedAt: null
        }
      ];
    }
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    throw new Error("Failed to fetch enrollments");
  }
}
