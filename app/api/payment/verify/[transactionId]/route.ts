import { NextRequest, NextResponse } from 'next/server';
import { createPaymentService } from '@/lib/payment';

export async function GET(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { transactionId } = params;

    if (!transactionId) {
      return NextResponse.json({
        success: false,
        error: 'معرف المعاملة مطلوب'
      }, { status: 400 });
    }

    const paymentService = createPaymentService();
    const result = await paymentService.verifyPayment(transactionId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        status: result.status,
        transactionId: result.transactionId,
        amount: result.amount / 100, // Convert to DZD
        fees: result.fees / 100,
        message: 'تم التحقق من الدفع بنجاح'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'فشل في التحقق من الدفع'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'خطأ في الخادم'
    }, { status: 500 });
  }
}