
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
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
    
    const body = await request.json();
    const { lessonId, courseId, status, progressPercentage, timeSpentSeconds, videoProgressSeconds } = body;
    
    // Validate required fields
    if (!lessonId || !courseId) {
      return NextResponse.json({
        success: false,
        error: 'معرف الدرس ومعرف الدورة مطلوبان'
      }, { status: 400 });
    }
    
    // Verify lesson exists and belongs to course
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id, course_id')
      .eq('id', lessonId)
      .eq('course_id', courseId)
      .single();
    
    if (lessonError || !lesson) {
      return NextResponse.json({
        success: false,
        error: 'الدرس غير موجود'
      }, { status: 404 });
    }
    
    // Verify user is enrolled in the course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();
    
    if (enrollmentError || !enrollment) {
      return NextResponse.json({
        success: false,
        error: 'غير مسجل في هذه الدورة'
      }, { status: 403 });
    }
    
    // Prepare progress data
    const progressData: any = {
      user_id: user.id,
      lesson_id: lessonId,
      course_id: courseId,
      last_accessed_at: new Date().toISOString()
    };
    
    if (status) progressData.status = status;
    if (progressPercentage !== undefined) progressData.progress_percentage = progressPercentage;
    if (timeSpentSeconds !== undefined) progressData.time_spent_seconds = timeSpentSeconds;
    if (videoProgressSeconds !== undefined) progressData.video_progress_seconds = videoProgressSeconds;
    
    // Set completion timestamp if lesson is completed
    if (status === 'COMPLETED') {
      progressData.completed_at = new Date().toISOString();
      if (!progressData.first_accessed_at) {
        progressData.first_accessed_at = new Date().toISOString();
      }
    }
    
    // Set first access time if this is first interaction
    if (status === 'IN_PROGRESS' && !progressData.first_accessed_at) {
      progressData.first_accessed_at = new Date().toISOString();
    }
    
    // Upsert lesson progress
    const { data: progress, error: progressError } = await supabase
      .from('lesson_progress')
      .upsert(progressData, {
        onConflict: 'user_id,lesson_id'
      })
      .select()
      .single();
    
    if (progressError) {
      console.error('Error updating lesson progress:', progressError);
      return NextResponse.json({
        success: false,
        error: 'خطأ في تحديث التقدم'
      }, { status: 500 });
    }
    
    // Update learning streak if lesson completed
    if (status === 'COMPLETED') {
      await supabase.rpc('update_learning_streak', { user_uuid: user.id });
    }
    
    return NextResponse.json({
      success: true,
      data: progress
    });
    
  } catch (error) {
    console.error('Error in lesson progress API:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في الخادم'
    }, { status: 500 });
  }
}

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
    const lessonId = url.searchParams.get('lessonId');
    
    let query = supabase
      .from('lesson_progress')
      .select(`
        *,
        lesson:lessons(id, title, title_ar, order_num)
      `)
      .eq('user_id', user.id);
    
    if (courseId) {
      query = query.eq('course_id', courseId);
    }
    
    if (lessonId) {
      query = query.eq('lesson_id', lessonId);
    }
    
    const { data: progress, error } = await query.order('last_accessed_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching lesson progress:', error);
      return NextResponse.json({
        success: false,
        error: 'خطأ في جلب التقدم'
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data: progress
    });
    
  } catch (error) {
    console.error('Error in lesson progress GET API:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في الخادم'
    }, { status: 500 });
  }
}
