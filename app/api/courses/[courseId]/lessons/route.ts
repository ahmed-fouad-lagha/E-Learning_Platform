import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createLessonSchema = z.object({
  title: z.string().min(1, 'عنوان الدرس مطلوب'),
  titleAr: z.string().min(1, 'العنوان بالعربية مطلوب'),
  content: z.string().min(1, 'محتوى الدرس مطلوب'),
  contentAr: z.string().min(1, 'المحتوى بالعربية مطلوب'),
  videoUrl: z.string().url().optional(),
  audioUrl: z.string().url().optional(),
  duration: z.number().min(1, 'مدة الدرس مطلوبة'),
  order: z.number().min(1, 'ترتيب الدرس مطلوب'),
  downloadSize: z.number().optional(),
  offlineContent: z.string().optional(),
  attachedFiles: z.array(z.string()).optional(), // Array of file IDs
  isPublished: z.boolean().default(false),
  objectives: z.string().optional(),
  objectivesAr: z.string().optional(),
  exercises: z.string().optional(), // JSON string with exercises
  exercisesAr: z.string().optional()
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        progress: true,
        _count: {
          select: {
            progress: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: lessons
    });

  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في جلب الدروس'
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
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
        error: 'يجب أن تكون مدرساً لإنشاء الدروس'
      }, { status: 403 });
    }

    const { courseId } = await params;
    const body = await request.json();
    const validatedData = createLessonSchema.parse(body);

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json({
        success: false,
        error: 'الدورة غير موجودة'
      }, { status: 404 });
    }

    const lesson = await prisma.lesson.create({
      data: {
        ...validatedData,
        courseId
      },
      include: {
        progress: true
      }
    });

    // Update course total lessons count
    await prisma.course.update({
      where: { id: courseId },
      data: {
        totalLessons: {
          increment: 1
        },
        estimatedHours: {
          increment: Math.ceil(validatedData.duration / 60)
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: lesson,
      message: 'تم إنشاء الدرس بنجاح'
    });

  } catch (error) {
    console.error('Error creating lesson:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'بيانات غير صحيحة',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'خطأ في إنشاء الدرس'
    }, { status: 500 });
  }
}
