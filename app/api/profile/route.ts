import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { profileUpdateSchema } from '@/lib/validations';
import { updateUserProfile, getUserStats } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }
    
    const stats = await getUserStats(currentUser.userId);
    
    return NextResponse.json({
      stats,
    });
    
  } catch (error) {
    console.error('Get profile stats error:', error);
    
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate input
    const validatedData = profileUpdateSchema.parse(body);
    
    // Update user profile
    const updatedUser = await updateUserProfile(currentUser.userId, {
      ...validatedData,
      dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : undefined,
    });
    
    // Return updated user data (without password)
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    return NextResponse.json({
      user: userWithoutPassword,
      message: 'تم تحديث الملف الشخصي بنجاح',
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}