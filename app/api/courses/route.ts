import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createCourseSchema = z.object({
  title: z.string().min(1, 'عنوان الدورة مطلوب'),
  titleAr: z.string().min(1, 'العنوان بالعربية مطلوب'),
  description: z.string().min(1, 'وصف الدورة مطلوب'),
  descriptionAr: z.string().min(1, 'الوصف بالعربية مطلوب'),
  subject: z.enum([
    'MATHEMATICS', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ARABIC_LITERATURE',
    'FRENCH', 'ENGLISH', 'HISTORY', 'GEOGRAPHY', 'PHILOSOPHY',
    'ISLAMIC_STUDIES', 'ECONOMICS', 'ACCOUNTING', 'COMPUTER_SCIENCE'
  ]),
  grade: z.enum([
    'PREMIERE_AS', 'PREMIERE_AL', 'DEUXIEME_AS', 'DEUXIEME_AL',
    'TERMINALE_AS', 'TERMINALE_AL', 'TERMINALE_TM', 'TERMINALE_GE'
  ]),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'BAC_LEVEL']).default('BEGINNER'),
  curriculum: z.string().min(1, 'رمز المنهاج مطلوب'),
  bacRelevance: z.number().min(0).max(1).default(0),
  estimatedHours: z.number().min(1, 'عدد الساعات مطلوب'),
  isFree: z.boolean().default(false),
  isPublished: z.boolean().default(false)
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const grade = searchParams.get('grade');
    const difficulty = searchParams.get('difficulty');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true
    };

    if (subject && subject !== 'all') {
      where.subject = subject;
    }

    if (grade && grade !== 'all') {
      where.grade = grade;
    }

    if (difficulty && difficulty !== 'all') {
      where.difficulty = difficulty;
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          _count: {
            select: {
              enrollments: true,
              lessons: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.course.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        courses,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في جلب الدورات'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCourseSchema.parse(body);

    const course = await prisma.course.create({
      data: validatedData,
      include: {
        _count: {
          select: {
            enrollments: true,
            lessons: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: course,
      message: 'تم إنشاء الدورة بنجاح'
    });

  } catch (error) {
    console.error('Error creating course:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'بيانات غير صحيحة',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'خطأ في إنشاء الدورة'
    }, { status: 500 });
  }
}