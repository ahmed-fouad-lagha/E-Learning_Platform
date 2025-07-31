
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح لك بالوصول'
      }, { status: 401 });
    }

    const { lessonId } = await params;

    // Check if user has access to this lesson's course
    const { data: lessonData, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        id,
        course_id,
        courses!inner(id, is_published)
      `)
      .eq('id', lessonId)
      .single();

    if (lessonError || !lessonData) {
      return NextResponse.json({
        success: false,
        error: 'الدرس غير موجود'
      }, { status: 404 });
    }

    // Check access permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const isStaff = profile?.role && ['TEACHER', 'ADMIN'].includes(profile.role);
    let hasAccess = isStaff;

    // Check if student is enrolled in the course
    if (!hasAccess) {
      const { data: enrollment } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('course_id', lessonData.course_id)
        .single();

      hasAccess = !!enrollment;
    }

    if (!hasAccess) {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح لك بالوصول إلى ملفات هذا الدرس'
      }, { status: 403 });
    }

    // Get files for this lesson
    let query = supabase
      .from('file_uploads')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: false });

    // If not staff, only show public files or files they uploaded
    if (!isStaff) {
      query = query.or(`is_public.eq.true,uploaded_by.eq.${session.user.id}`);
    }

    const { data: files, error: filesError } = await query;

    if (filesError) {
      console.error('Files fetch error:', filesError);
      return NextResponse.json({
        success: false,
        error: 'خطأ في استرجاع الملفات'
      }, { status: 500 });
    }

    const formattedFiles = (files || []).map(file => ({
      id: file.id,
      originalName: file.original_name,
      fileName: file.file_name,
      mimeType: file.mime_type,
      fileSize: file.file_size,
      fileType: file.file_type,
      isPublic: file.is_public,
      uploadedAt: file.created_at
    }));

    return NextResponse.json({
      success: true,
      data: formattedFiles,
      message: 'تم استرجاع الملفات بنجاح'
    });

  } catch (error) {
    console.error('Lesson files API error:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في الخادم'
    }, { status: 500 });
  }
}
