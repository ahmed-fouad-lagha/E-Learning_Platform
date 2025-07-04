import { NextRequest, NextResponse } from 'next/server';
import { createSMSService } from '@/lib/sms';
import { z } from 'zod';

const sendSMSSchema = z.object({
  to: z.string().min(10, 'رقم الهاتف غير صحيح'),
  message: z.string().min(1, 'الرسالة مطلوبة'),
  type: z.enum(['verification', 'notification', 'reminder']).default('notification')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message, type } = sendSMSSchema.parse(body);

    const smsService = createSMSService();
    const result = await smsService.sendSMS({ to, message, type });

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: 'تم إرسال الرسالة بنجاح'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'فشل في إرسال الرسالة'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('SMS API error:', error);
    
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