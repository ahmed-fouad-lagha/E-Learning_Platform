import { NextRequest, NextResponse } from 'next/server';
import { getUserEnrollments } from '@/lib/courses';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'يجب تسجيل الدخول للوصول إلى الدورات المسجلة'
      }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Initialize Supabase client with the user's token
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verify the token and get user
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return NextResponse.json({
        success: false,
        error: 'جلسة غير صالحة'
      }, { status: 401 });
    }
    
    // Get user enrollments
    const enrollments = await getUserEnrollments(user.id);
    
    // Transform the enrollments to match the expected format in the frontend
    const enrolledCourses = enrollments.map((enrollment: any) => ({
      id: enrollment.id,
      title: enrollment.title,
      titleAr: enrollment.titleAr,
      thumbnail: enrollment.thumbnail,
      subject: enrollment.subject,
      grade: enrollment.grade,
      // These fields need proper data or defaults
      isFree: false, // We would need to join with the course table to get this info
      enrollmentCount: 0, // Same as above
      totalLessons: enrollment.totalLessons || 0,
      estimatedHours: 0, // Missing from the current data structure
      progress: enrollment.progress || 0,
      lastAccessedAt: enrollment.enrolledAt?.toISOString() || new Date().toISOString(),
      completedLessons: Math.round((enrollment.progress || 0) * (enrollment.totalLessons || 0) / 100),
    }));
    
    return NextResponse.json({
      success: true,
      data: enrolledCourses
    });
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في جلب الدورات المسجلة'
    }, { status: 500 });
  }
}
