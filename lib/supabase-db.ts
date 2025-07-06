import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database operations using Supabase REST API

export interface Course {
  id: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  subject: string;
  grade: string;
  thumbnail?: string;
  is_free: boolean;
  total_lessons: number;
  estimated_hours: number;
  bac_relevance: number;
  course_enrollments?: { count: number }[];
}

export interface CourseDetail extends Course {
  lessons: Array<{
    id: string;
    title: string;
    title_ar: string;
    order_num: number;
    duration: number;
  }>;
  enrollmentCount: number;
  is_enrolled: boolean;
  enrollment?: {
    enrolled_at: string;
    progress: number;
    completed_at: string | null;
  } | null;
}

// Get courses with filtering
export async function getCoursesSupabase({
  subject,
  grade,
  isFree,
  page = 1,
  limit = 12,
}: {
  subject?: string;
  grade?: string;
  isFree?: boolean;
  page?: number;
  limit?: number;
}) {
  try {
    let query = supabaseAdmin
      .from('courses')
      .select(`
        id,
        title,
        title_ar,
        description,
        description_ar,
        subject,
        grade,
        thumbnail,
        is_free,
        total_lessons,
        estimated_hours,
        bac_relevance,
        course_enrollments(count)
      `)
      .eq('is_published', true)
      .order('bac_relevance', { ascending: false });

    if (subject) {
      query = query.eq('subject', subject);
    }

    if (grade) {
      query = query.eq('grade', grade);
    }

    if (typeof isFree === 'boolean') {
      query = query.eq('is_free', isFree);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: courses, error, count } = await query;

    if (error) {
      throw error;
    }

    // Transform data to match expected format
    const formattedCourses = courses?.map(course => ({
      ...course,
      enrollmentCount: course.course_enrollments?.[0]?.count || 0
    })) || [];

    return {
      courses: formattedCourses,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error('Failed to fetch courses');
  }
}

// Get course details by ID
export async function getCourseByIdSupabase(courseId: string, userId?: string): Promise<CourseDetail | null> {
  try {
    const { data: course, error } = await supabaseAdmin
      .from('courses')
      .select(`
        id,
        title,
        title_ar,
        description,
        description_ar,
        subject,
        grade,
        thumbnail,
        is_free,
        total_lessons,
        estimated_hours,
        bac_relevance,
        lessons(id, title, title_ar, order_num, duration),
        course_enrollments(count)
      `)
      .eq('id', courseId)
      .eq('is_published', true)
      .single();

    if (error || !course) {
      return null;
    }

    let enrollment = null;
    let isEnrolled = false;

    if (userId) {
      const { data: enrollmentData } = await supabaseAdmin
        .from('course_enrollments')
        .select('enrolled_at, progress, completed_at')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      if (enrollmentData) {
        isEnrolled = true;
        enrollment = enrollmentData;
      }
    }

    return {
      ...course,
      enrollmentCount: course.course_enrollments?.[0]?.count || 0,
      is_enrolled: isEnrolled,
      enrollment
    };
  } catch (error) {
    console.error('Error fetching course details:', error);
    throw new Error('Failed to fetch course details');
  }
}

// Enroll user in course
export async function enrollUserInCourseSupabase(userId: string, courseId: string) {
  try {
    // Check if course exists and is published
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id, is_free, is_published')
      .eq('id', courseId)
      .eq('is_published', true)
      .single();

    if (courseError || !course) {
      throw new Error('Course not found or not available');
    }

    // Check if user is already enrolled
    const { data: existingEnrollment } = await supabaseAdmin
      .from('course_enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (existingEnrollment) {
      return { success: true, message: 'Already enrolled', enrollment: existingEnrollment };
    }

    // Create enrollment
    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('course_enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        progress: 0
      })
      .select()
      .single();

    if (enrollmentError) {
      throw enrollmentError;
    }

    return {
      success: true,
      message: 'Enrollment successful',
      enrollment
    };
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw new Error('Failed to enroll in course');
  }
}

// Get user enrollments
export async function getUserEnrollmentsSupabase(userId: string) {
  try {
    const { data: enrollments, error } = await supabaseAdmin
      .from('course_enrollments')
      .select(`
        enrolled_at,
        progress,
        completed_at,
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
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false });

    if (error) {
      throw error;
    }

    return enrollments?.map(enrollment => {
      const course = enrollment.courses as any;
      return {
        id: course.id,
        title: course.title,
        titleAr: course.title_ar,
        thumbnail: course.thumbnail,
        subject: course.subject,
        grade: course.grade,
        totalLessons: course.total_lessons,
        progress: enrollment.progress,
        enrolledAt: enrollment.enrolled_at,
        completedAt: enrollment.completed_at,
        lastAccessedAt: enrollment.enrolled_at // Placeholder
      };
    }) || [];
  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    throw new Error('Failed to fetch enrollments');
  }
}
