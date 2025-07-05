import { NextRequest, NextResponse } from 'next/server';
import { enrollUserInCourse } from '@/lib/courses';
import { getMockCourseById } from '@/lib/mock-data';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    // Extract course ID from params
    const { courseId } = await params;
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'يجب تسجيل الدخول للتسجيل في الدورة'
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
    
    try {
      // Try to enroll in the real database first
      const result = await enrollUserInCourse(user.id, courseId);
      
      return NextResponse.json({
        success: true,
        message: 'تم التسجيل في الدورة بنجاح',
        data: result
      });
    } catch (dbError) {
      console.warn('Database unavailable, simulating enrollment:', dbError);
      
      // Check if course exists in mock data
      const mockCourse = getMockCourseById(courseId);
      if (!mockCourse) {
        return NextResponse.json({
          success: false,
          error: 'الدورة غير موجودة'
        }, { status: 404 });
      }
      
      // Simulate successful enrollment
      return NextResponse.json({
        success: true,
        message: 'تم التسجيل في الدورة بنجاح (وضع التجربة)',
        data: {
          success: true,
          message: 'Enrollment successful',
          enrollment: {
            userId: user.id,
            courseId: courseId,
            enrolledAt: new Date().toISOString(),
            progress: 0
          }
        },
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في التسجيل في الدورة'
    }, { status: 500 });
  }
}
