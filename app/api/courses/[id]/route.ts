import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            progress: true
          }
        },
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        exams: {
          include: {
            _count: {
              select: {
                questions: true,
                submissions: true
              }
            }
          }
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true
          }
        }
      }
    });

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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date()
      },
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
      message: 'تم تحديث الدورة بنجاح'
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
  { params }: { params: { id: string } }
) {
  try {
    await prisma.course.delete({
      where: { id: params.id }
    });

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