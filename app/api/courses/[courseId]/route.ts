import { NextRequest, NextResponse } from 'next/server';
import { getCourseById } from '@/lib/courses';
import { getMockCourseById } from '@/lib/mock-data';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    let userId: string | undefined = undefined;
    
    // Extract user ID from authorization header using Supabase
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      try {
        // Initialize Supabase client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Verify the token and get user
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (!error && user) {
          userId = user.id;
        }
      } catch (error) {
        console.error('Error verifying user token:', error);
      }
    }

    try {
      // Try to get course from database first
      const course = await getCourseById(courseId, userId);
      
      if (course) {
        return NextResponse.json({
          success: true,
          data: course
        });
      }
    } catch (dbError) {
      console.warn('Database unavailable, using mock data:', dbError);
    }

    // Fallback to mock data
    const mockCourse = getMockCourseById(courseId, false);
    
    if (!mockCourse) {
      return NextResponse.json({
        success: false,
        error: 'الدورة غير موجودة'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: mockCourse,
      source: 'mock'
    });
  } catch (error) {
    console.error('Error fetching course details:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في جلب تفاصيل الدورة'
    }, { status: 500 });
  }
}
