import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth';
import { getUserByEmail, db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    
    // Find user by email or phone
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: validatedData.emailOrPhone },
          { phone: validatedData.emailOrPhone },
        ],
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(validatedData.password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }
    
    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'الحساب معطل. يرجى التواصل مع الدعم الفني' },
        { status: 403 }
      );
    }
    
    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    
    // Create JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    
    // Set cookie
    setAuthCookie(token);
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'تم تسجيل الدخول بنجاح',
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
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