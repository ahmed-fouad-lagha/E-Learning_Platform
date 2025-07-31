
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Client } from '@replit/object-storage';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const storage = new Client();

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
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

    const fileId = params.fileId;

    // Get file metadata from database
    const { data: fileData, error: fileError } = await supabase
      .from('file_uploads')
      .select(`
        *,
        lessons!inner(
          course_id,
          courses!inner(id)
        )
      `)
      .eq('id', fileId)
      .single();

    if (fileError || !fileData) {
      return NextResponse.json({
        success: false,
        error: 'الملف غير موجود'
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
    if (!hasAccess && fileData.lessons?.course_id) {
      const { data: enrollment } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('course_id', fileData.lessons.course_id)
        .single();

      hasAccess = !!enrollment;
    }

    // Check if file is public
    if (!hasAccess && fileData.is_public) {
      hasAccess = true;
    }

    if (!hasAccess) {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح لك بالوصول إلى هذا الملف'
      }, { status: 403 });
    }

    // Get download parameter
    const url = new URL(request.url);
    const download = url.searchParams.get('download') === 'true';

    try {
      // Download file from Object Storage
      const fileBuffer = await storage.downloadAsBytes(fileData.file_name);
      
      // Set appropriate headers
      const headers = new Headers();
      headers.set('Content-Type', fileData.mime_type);
      headers.set('Content-Length', fileData.file_size.toString());
      
      if (download) {
        headers.set('Content-Disposition', `attachment; filename="${fileData.original_name}"`);
      } else {
        // For preview, set inline disposition
        headers.set('Content-Disposition', `inline; filename="${fileData.original_name}"`);
      }

      return new NextResponse(fileBuffer, {
        status: 200,
        headers
      });

    } catch (storageError) {
      console.error('File retrieval error:', storageError);
      return NextResponse.json({
        success: false,
        error: 'خطأ في استرجاع الملف'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('File access API error:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في الخادم'
    }, { status: 500 });
  }
}
