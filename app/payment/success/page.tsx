'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface PaymentVerification {
  success: boolean;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionId: string;
  amount: number;
  fees: number;
  error?: string;
}

export default function PaymentSuccessPage() {
  const [verification, setVerification] = useState<PaymentVerification | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');

  useEffect(() => {
    if (transactionId) {
      verifyPayment(transactionId);
    } else {
      setLoading(false);
    }
  }, [transactionId]);

  const verifyPayment = async (txId: string) => {
    try {
      const response = await fetch(`/api/payment/verify/${txId}`);
      const result = await response.json();
      setVerification(result);
    } catch (error) {
      console.error('Payment verification failed:', error);
      setVerification({
        success: false,
        status: 'failed',
        transactionId: txId,
        amount: 0,
        fees: 0,
        error: 'فشل في التحقق من الدفع'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />;
    
    if (!verification?.success || verification.status === 'failed') {
      return <AlertCircle className="h-16 w-16 text-red-600" />;
    }
    
    if (verification.status === 'completed') {
      return <CheckCircle className="h-16 w-16 text-green-600" />;
    }
    
    return <Loader2 className="h-16 w-16 text-yellow-600 animate-spin" />;
  };

  const getStatusMessage = () => {
    if (loading) return 'جاري التحقق من الدفع...';
    
    if (!verification?.success) {
      return verification?.error || 'فشل في التحقق من الدفع';
    }
    
    switch (verification.status) {
      case 'completed':
        return 'تم الدفع بنجاح! مرحباً بك في منصة التعلم الجزائرية';
      case 'pending':
        return 'الدفع قيد المعالجة. سيتم تفعيل اشتراكك قريباً';
      case 'failed':
        return 'فشل في عملية الدفع. يرجى المحاولة مرة أخرى';
      case 'cancelled':
        return 'تم إلغاء عملية الدفع';
      default:
        return 'حالة الدفع غير معروفة';
    }
  };

  const getStatusColor = () => {
    if (loading) return 'text-blue-600';
    
    if (!verification?.success || verification.status === 'failed') {
      return 'text-red-600';
    }
    
    if (verification.status === 'completed') {
      return 'text-green-600';
    }
    
    return 'text-yellow-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className={`text-2xl font-bold ${getStatusColor()}`}>
            {verification?.status === 'completed' ? 'تم الدفع بنجاح!' : 'حالة الدفع'}
          </CardTitle>
          <CardDescription className="text-lg">
            {getStatusMessage()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {verification && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">رقم المعاملة:</span>
                <span className="font-mono text-sm">{verification.transactionId}</span>
              </div>
              
              {verification.amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">المبلغ:</span>
                  <span className="font-semibold">{verification.amount.toLocaleString()} دج</span>
                </div>
              )}
              
              {verification.fees > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">الرسوم:</span>
                  <span className="text-sm">{verification.fees.toLocaleString()} دج</span>
                </div>
              )}
              
              {orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">رقم الطلب:</span>
                  <span className="font-mono text-sm">{orderId}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {verification?.status === 'completed' && (
              <Button 
                onClick={() => router.push('/dashboard')}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                الذهاب إلى لوحة التحكم
              </Button>
            )}
            
            {verification?.status === 'failed' && (
              <Button 
                onClick={() => router.push('/pricing')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                المحاولة مرة أخرى
              </Button>
            )}
            
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              العودة إلى الصفحة الرئيسية
            </Button>
          </div>

          {verification?.status === 'completed' && (
            <div className="text-center text-sm text-gray-600 mt-4">
              <p>سيتم إرسال تأكيد الاشتراك عبر الرسائل النصية والبريد الإلكتروني</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}