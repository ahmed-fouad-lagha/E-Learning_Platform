import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { createUser, getUserByEmail } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await getUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'المستخدم موجود بالفعل' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);
    
    // Create user
    const user = await createUser({
      email: validatedData.email,
      phone: validatedData.phone,
      password: hashedPassword,
      name: validatedData.name,
      role: validatedData.role,
      grade: validatedData.grade,
      wilaya: validatedData.wilaya,
      school: validatedData.school,
      parentPhone: validatedData.parentPhone,
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
      message: 'تم إنشاء الحساب بنجاح',
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
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