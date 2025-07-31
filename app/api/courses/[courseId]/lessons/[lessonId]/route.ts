
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateLessonSchema = z.object({
  title: z.string().min(1, 'عنوان الدرس مطلوب').optional(),
  titleAr: z.string().min(1, 'العنوان بالعربية مطلوب').optional(),
  content: z.string().min(1, 'محتوى الدرس مطلوب').optional(),
  contentAr: z.string().min(1, 'المحتوى بالعربية مطلوب').optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  audioUrl: z.string().url().optional().or(z.literal('')),
  duration: z.number().min(1, 'مدة الدرس مطلوبة').optional(),
  order: z.number().min(1, 'ترتيب الدرس مطلوب').optional(),
  downloadSize: z.number().optional(),
  offlineContent: z.string().optional(),
  attachedFiles: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  objectives: z.string().optional(),
  objectivesAr: z.string().optional(),
  exercises: z.string().optional(),
  exercisesAr: z.string().optional()
});

// GET - Fetch single lesson
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const { courseId, lessonId } = await params;

    // Authentication check
    const { supabase } = await import('@/lib/supabase');
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح لك بالوصول'
      }, { status: 401 });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { 
        id: lessonId,
        courseId: courseId
      },
      include: {
        progress: true,
        _count: {
          select: {
            progress: true
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json({
        success: false,
        error: 'الدرس غير موجود'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: lesson
    });

  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في جلب الدرس'
    }, { status: 500 });
  }
}

// PUT - Update lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const { courseId, lessonId } = await params;

    // Authentication check
    const { supabase } = await import('@/lib/supabase');
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
        error: 'يجب أن تكون مدرساً لتعديل الدروس'
      }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateLessonSchema.parse(body);

    // Check if lesson exists and belongs to the course
    const existingLesson = await prisma.lesson.findUnique({
      where: { 
        id: lessonId,
        courseId: courseId
      }
    });

    if (!existingLesson) {
      return NextResponse.json({
        success: false,
        error: 'الدرس غير موجود'
      }, { status: 404 });
    }

    // Update lesson
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...validatedData,
        updatedAt: new Date()
      },
      include: {
        progress: true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedLesson,
      message: 'تم تحديث الدرس بنجاح'
    });

  } catch (error) {
    console.error('Error updating lesson:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'بيانات غير صحيحة',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'خطأ في تحديث الدرس'
    }, { status: 500 });
  }
}

// DELETE - Delete lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const { courseId, lessonId } = await params;

    // Authentication check
    const { supabase } = await import('@/lib/supabase');
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
        error: 'يجب أن تكون مدرساً لحذف الدروس'
      }, { status: 403 });
    }

    // Check if lesson exists and belongs to the course
    const existingLesson = await prisma.lesson.findUnique({
      where: { 
        id: lessonId,
        courseId: courseId
      }
    });

    if (!existingLesson) {
      return NextResponse.json({
        success: false,
        error: 'الدرس غير موجود'
      }, { status: 404 });
    }

    // Delete lesson
    await prisma.lesson.delete({
      where: { id: lessonId }
    });

    // Update course total lessons count
    await prisma.course.update({
      where: { id: courseId },
      data: {
        totalLessons: {
          decrement: 1
        },
        estimatedHours: {
          decrement: Math.ceil(existingLesson.duration / 60)
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف الدرس بنجاح'
    });

  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في حذف الدرس'
    }, { status: 500 });
  }
}
