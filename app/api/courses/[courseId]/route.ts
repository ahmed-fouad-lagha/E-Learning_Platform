import { NextRequest, NextResponse } from 'next/server';
import { getCourseById } from '@/lib/courses';
import { supabase } from '@/lib/supabase-client';
import { z } from 'zod';

// Schema for course updates
const updateCourseSchema = z.object({
  title: z.string().optional(),
  titleAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  subject: z.enum([
    'MATHEMATICS', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ARABIC_LITERATURE',
    'FRENCH', 'ENGLISH', 'HISTORY', 'GEOGRAPHY', 'PHILOSOPHY',
    'ISLAMIC_STUDIES', 'ECONOMICS', 'ACCOUNTING', 'COMPUTER_SCIENCE'
  ]).optional(),
  grade: z.enum([
    'PREMIERE_AS', 'PREMIERE_AL', 'DEUXIEME_AS', 'DEUXIEME_AL',
    'TERMINALE_AS', 'TERMINALE_AL', 'TERMINALE_TM', 'TERMINALE_GE'
  ]).optional(),
  isFree: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  estimatedHours: z.number().optional(),
  thumbnail: z.string().optional()
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params

    // Get user ID from auth header for enrollment check
    const authHeader = request.headers.get('authorization');
    let userId: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      // Extract user ID from session (you'll need to implement this)
      // For now, we'll skip user-specific data
    }

    const course = await getCourseById(courseId, userId);

    if (!course) {
      return NextResponse.json({
        success: false,
        error: 'الدورة غير موجودة'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في جلب تفاصيل الدورة'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const body = await request.json();

    // Validate input
    const validationResult = updateCourseSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        errors: validationResult.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const updateData = validationResult.data;

    // Convert camelCase to snake_case for database
    const dbUpdateData: any = {};
    if (updateData.title) dbUpdateData.title = updateData.title;
    if (updateData.titleAr) dbUpdateData.title_ar = updateData.titleAr;
    if (updateData.description) dbUpdateData.description = updateData.description;
    if (updateData.descriptionAr) dbUpdateData.description_ar = updateData.descriptionAr;
    if (updateData.subject) dbUpdateData.subject = updateData.subject;
    if (updateData.grade) dbUpdateData.grade = updateData.grade;
    if (typeof updateData.isFree === 'boolean') dbUpdateData.is_free = updateData.isFree;
    if (typeof updateData.isPublished === 'boolean') dbUpdateData.is_published = updateData.isPublished;
    if (updateData.estimatedHours) dbUpdateData.estimated_hours = updateData.estimatedHours;
    if (updateData.thumbnail) dbUpdateData.thumbnail = updateData.thumbnail;

    dbUpdateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('courses')
      .update(dbUpdateData)
      .eq('id', courseId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({
        success: false,
        error: 'خطأ في تحديث الدورة'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        title: data.title,
        titleAr: data.title_ar,
        description: data.description,
        descriptionAr: data.description_ar,
        subject: data.subject,
        grade: data.grade,
        isFree: data.is_free,
        isPublished: data.is_published,
        estimatedHours: data.estimated_hours,
        thumbnail: data.thumbnail
      }
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في تحديث الدورة'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    // TODO: Add authorization check - only course instructor or admin can delete

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({
        success: false,
        error: 'خطأ في حذف الدورة'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف الدورة بنجاح'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في حذف الدورة'
    }, { status: 500 });
  }
}