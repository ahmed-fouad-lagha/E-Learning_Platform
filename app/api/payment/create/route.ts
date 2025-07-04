import { NextRequest, NextResponse } from 'next/server';
import { createPaymentService } from '@/lib/payment';
import { z } from 'zod';

const createPaymentSchema = z.object({
  planType: z.enum(['premium', 'family', 'school']),
  duration: z.enum(['monthly', 'yearly']),
  customerEmail: z.string().email('البريد الإلكتروني غير صحيح'),
  customerPhone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  provider: z.enum(['baridimob', 'cib']).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planType, duration, customerEmail, customerPhone, provider } = createPaymentSchema.parse(body);

    const paymentService = createPaymentService(provider);
    
    // Generate unique order ID
    const orderId = `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate amount based on plan and duration
    const plans = {
      premium: { monthly: 250000, yearly: 2500000 }, // 2500 DZD monthly, 25000 yearly
      family: { monthly: 500000, yearly: 5000000 },   // 5000 DZD monthly, 50000 yearly
      school: { monthly: 1500000, yearly: 15000000 }  // 15000 DZD monthly, 150000 yearly
    };

    const amount = plans[planType][duration];
    
    const planNames = {
      premium: 'الاشتراك المميز',
      family: 'اشتراك العائلة',
      school: 'اشتراك المدرسة'
    };

    const durationNames = {
      monthly: 'شهري',
      yearly: 'سنوي'
    };

    const description = `${planNames[planType]} - ${durationNames[duration]}`;

    const result = await paymentService.createPayment({
      amount,
      currency: 'DZD',
      orderId,
      description,
      customerEmail,
      customerPhone,
      returnUrl: `${process.env.NEXTAUTH_URL}/payment/success?orderId=${orderId}`,
      cancelUrl: `${process.env.NEXTAUTH_URL}/payment/cancel?orderId=${orderId}`
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        paymentUrl: result.paymentUrl,
        transactionId: result.transactionId,
        orderId,
        amount: amount / 100, // Convert to DZD
        message: 'تم إنشاء رابط الدفع بنجاح'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'فشل في إنشاء رابط الدفع'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Payment creation error:', error);
    
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