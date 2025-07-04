import { NextRequest, NextResponse } from 'next/server';
import { createSMSService } from '@/lib/sms';
import { z } from 'zod';

const verifyCodeSchema = z.object({
  phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  code: z.string().length(6, 'رمز التحقق يجب أن يكون 6 أرقام')
});

// In-memory store for verification codes (use Redis in production)
const verificationCodes = new Map<string, { code: string; expires: number; attempts: number }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.action === 'send') {
      // Send verification code
      const { phone } = z.object({ phone: z.string() }).parse(body);
      
      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store code with 5-minute expiry
      verificationCodes.set(phone, {
        code,
        expires: Date.now() + 5 * 60 * 1000, // 5 minutes
        attempts: 0
      });

      const smsService = createSMSService();
      const result = await smsService.sendVerificationCode(phone, code);

      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'تم إرسال رمز التحقق إلى هاتفك'
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'فشل في إرسال رمز التحقق'
        }, { status: 400 });
      }
    } else {
      // Verify code
      const { phone, code } = verifyCodeSchema.parse(body);
      
      const stored = verificationCodes.get(phone);
      
      if (!stored) {
        return NextResponse.json({
          success: false,
          error: 'لم يتم العثور على رمز التحقق'
        }, { status: 400 });
      }

      if (Date.now() > stored.expires) {
        verificationCodes.delete(phone);
        return NextResponse.json({
          success: false,
          error: 'انتهت صلاحية رمز التحقق'
        }, { status: 400 });
      }

      if (stored.attempts >= 3) {
        verificationCodes.delete(phone);
        return NextResponse.json({
          success: false,
          error: 'تم تجاوز عدد المحاولات المسموح'
        }, { status: 400 });
      }

      if (stored.code !== code) {
        stored.attempts++;
        return NextResponse.json({
          success: false,
          error: 'رمز التحقق غير صحيح'
        }, { status: 400 });
      }

      // Code is correct
      verificationCodes.delete(phone);
      
      return NextResponse.json({
        success: true,
        message: 'تم التحقق من الهاتف بنجاح'
      });
    }

  } catch (error) {
    console.error('SMS verification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'بيانات غير صحيحة',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'خطأ في الخادم'
    }, { status: 500 });
  }
}