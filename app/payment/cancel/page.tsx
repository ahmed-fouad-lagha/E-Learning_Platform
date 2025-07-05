'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowRight, Loader2 } from 'lucide-react';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            تم إلغاء الدفع
          </CardTitle>
          <CardDescription className="text-lg">
            لم تكتمل عملية الدفع. لا تقلق، لم يتم خصم أي مبلغ من حسابك.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {orderId && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-600">رقم الطلب:</span>
                <span className="font-mono text-sm">{orderId}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">ماذا يمكنك فعله الآن؟</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                المحاولة مرة أخرى باستخدام طريقة دفع مختلفة
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                التواصل مع خدمة العملاء للحصول على المساعدة
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                استكشاف المحتوى المجاني المتاح
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => router.push('/pricing')}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              المحاولة مرة أخرى
              <ArrowRight className="mr-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              استكشاف المحتوى المجاني
            </Button>
            
            <Button 
              variant="ghost"
              onClick={() => router.push('/')}
              className="w-full"
            >
              العودة إلى الصفحة الرئيسية
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600 mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="font-semibold mb-2">هل تحتاج مساعدة؟</p>
            <p>تواصل معنا عبر:</p>
            <p>واتساب: +213 XXX XXX XXX</p>
            <p>البريد الإلكتروني: support@elearning-dz.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
              <p>جاري التحميل...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}