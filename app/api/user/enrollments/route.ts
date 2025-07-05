import { NextRequest, NextResponse } from 'next/server';
import { getUserEnrollments } from '@/lib/courses';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'يجب تسجيل الدخول لعرض الدورات المسجلة'
      }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Initialize Supabase client with the user's token
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verify the token and get user
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return NextResponse.json({
        success: false,
        error: 'جلسة غير صالحة'
      }, { status: 401 });
    }
    
    // Get the user's course enrollments
    const enrollments = await getUserEnrollments(user.id);
    
    return NextResponse.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في جلب الدورات المسجلة'
    }, { status: 500 });
  }
}
