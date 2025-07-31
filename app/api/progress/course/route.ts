
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح بالوصول'
      }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'جلسة غير صالحة'
      }, { status: 401 });
    }
    
    const url = new URL(request.url);
    const courseId = url.searchParams.get('courseId');
    
    if (courseId) {
      // Get specific course progress
      const { data: progress, error } = await supabase
        .from('course_progress')
        .select(`
          *,
          course:courses(id, title, title_ar, thumbnail, total_lessons)
        `)
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Not found is ok
        console.error('Error fetching course progress:', error);
        return NextResponse.json({
          success: false,
          error: 'خطأ في جلب تقدم الدورة'
        }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        data: progress
      });
      
    } else {
      // Get all course progress for user
      const { data: progress, error } = await supabase
        .from('course_progress')
        .select(`
          *,
          course:courses(id, title, title_ar, thumbnail, total_lessons, subject, grade)
        `)
        .eq('user_id', user.id)
        .order('last_activity_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching course progress:', error);
        return NextResponse.json({
          success: false,
          error: 'خطأ في جلب التقدم'
        }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        data: progress
      });
    }
    
  } catch (error) {
    console.error('Error in course progress API:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في الخادم'
    }, { status: 500 });
  }
}
