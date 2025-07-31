
import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/file-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح لك بالوصول'
      }, { status: 401 });
    }

    // Check if user is teacher or admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || !['TEACHER', 'ADMIN'].includes(profile.role)) {
      return NextResponse.json({
        success: false,
        error: 'يجب أن تكون مدرساً لرفع الملفات'
      }, { status: 403 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const courseId = formData.get('courseId') as string;
    const lessonId = formData.get('lessonId') as string;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'لم يتم اختيار ملف'
      }, { status: 400 });
    }

    // Upload file
    const result = await uploadFile(file, session.user.id, {
      courseId: courseId || undefined,
      lessonId: lessonId || undefined
    });

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || 'خطأ في رفع الملف'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        fileId: result.fileId,
        fileName: result.fileName,
        fileUrl: result.fileUrl,
        fileSize: result.fileSize,
        mimeType: result.mimeType
      },
      message: 'تم رفع الملف بنجاح'
    });

  } catch (error) {
    console.error('File upload API error:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في الخادم'
    }, { status: 500 });
  }
}
