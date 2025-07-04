import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createExamSchema = z.object({
  title: z.string().min(1, 'عنوان الامتحان مطلوب'),
  titleAr: z.string().min(1, 'العنوان بالعربية مطلوب'),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  type: z.enum(['PRACTICE', 'ASSESSMENT', 'BAC_SIMULATION', 'FINAL_EXAM']),
  subject: z.enum([
    'MATHEMATICS', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ARABIC_LITERATURE',
    'FRENCH', 'ENGLISH', 'HISTORY', 'GEOGRAPHY', 'PHILOSOPHY',
    'ISLAMIC_STUDIES', 'ECONOMICS', 'ACCOUNTING', 'COMPUTER_SCIENCE'
  ]),
  grade: z.enum([
    'PREMIERE_AS', 'PREMIERE_AL', 'DEUXIEME_AS', 'DEUXIEME_AL',
    'TERMINALE_AS', 'TERMINALE_AL', 'TERMINALE_TM', 'TERMINALE_GE'
  ]),
  duration: z.number().min(1, 'مدة الامتحان مطلوبة'),
  totalPoints: z.number().min(1, 'مجموع النقاط مطلوب'),
  passScore: z.number().min(1, 'درجة النجاح مطلوبة'),
  isBacSimulation: z.boolean().default(false),
  bacYear: z.number().optional(),
  bacSession: z.enum(['JUIN', 'SEPTEMBRE']).optional(),
  courseId: z.string().optional(),
  isPublished: z.boolean().default(false)
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const subject = searchParams.get('subject');
    const grade = searchParams.get('grade');
    const isBacSimulation = searchParams.get('isBacSimulation');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true
    };

    if (type && type !== 'all') {
      where.type = type;
    }

    if (subject && subject !== 'all') {
      where.subject = subject;
    }

    if (grade && grade !== 'all') {
      where.grade = grade;
    }

    if (isBacSimulation === 'true') {
      where.isBacSimulation = true;
    }

    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              titleAr: true
            }
          },
          _count: {
            select: {
              questions: true,
              submissions: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.exam.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        exams,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في جلب الامتحانات'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createExamSchema.parse(body);

    const exam = await prisma.exam.create({
      data: validatedData,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            titleAr: true
          }
        },
        _count: {
          select: {
            questions: true,
            submissions: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: exam,
      message: 'تم إنشاء الامتحان بنجاح'
    });

  } catch (error) {
    console.error('Error creating exam:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'بيانات غير صحيحة',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'خطأ في إنشاء الامتحان'
    }, { status: 500 });
  }
}