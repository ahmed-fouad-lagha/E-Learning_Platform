'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Smartphone, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const paymentSchema = z.object({
  planType: z.enum(['premium', 'family', 'school']),
  duration: z.enum(['monthly', 'yearly']),
  customerEmail: z.string().email('البريد الإلكتروني غير صحيح'),
  customerPhone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  provider: z.enum(['baridimob', 'cib']).default('baridimob')
});

type PaymentInput = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  selectedPlan?: 'premium' | 'family' | 'school';
  selectedDuration?: 'monthly' | 'yearly';
}

export function PaymentForm({ selectedPlan = 'premium', selectedDuration = 'monthly' }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      planType: selectedPlan,
      duration: selectedDuration,
      provider: 'baridimob'
    }
  });

  const watchedValues = watch();

  const plans = {
    premium: { 
      name: 'الاشتراك المميز',
      monthly: 2500, 
      yearly: 25000,
      features: ['جميع الدروس', 'امتحانات لا محدودة', 'دعم فني', 'تحميل للاستخدام دون انترنت']
    },
    family: { 
      name: 'اشتراك العائلة',
      monthly: 5000, 
      yearly: 50000,
      features: ['حتى 4 طلاب', 'جميع ميزات الاشتراك المميز', 'لوحة تحكم الأولياء', 'تقارير مفصلة']
    },
    school: { 
      name: 'اشتراك المدرسة',
      monthly: 15000, 
      yearly: 150000,
      features: ['طلاب لا محدودون', 'لوحة تحكم المعلمين', 'تقارير مؤسسية', 'دعم مخصص']
    }
  };

  const currentPlan = plans[watchedValues.planType];
  const currentPrice = currentPlan[watchedValues.duration];
  const yearlyDiscount = watchedValues.duration === 'yearly' ? Math.round((1 - (currentPlan.yearly / (currentPlan.monthly * 12))) * 100) : 0;

  const onSubmit = async (data: PaymentInput) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'تم إنشاء رابط الدفع',
          description: 'سيتم توجيهك إلى صفحة الدفع...',
        });

        // Redirect to payment URL
        window.location.href = result.paymentUrl;
      } else {
        toast({
          title: 'خطأ في إنشاء الدفع',
          description: result.error || 'حدث خطأ غير متوقع',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ في الاتصال',
        description: 'تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" dir="rtl">
      {/* Plan Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{currentPlan.name}</span>
            {yearlyDiscount > 0 && (
              <Badge className="bg-green-100 text-green-800">
                وفر {yearlyDiscount}%
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-600">
                {currentPrice.toLocaleString()} دج
              </span>
              <span className="text-gray-600">
                / {watchedValues.duration === 'monthly' ? 'شهر' : 'سنة'}
              </span>
            </div>
            {watchedValues.duration === 'yearly' && (
              <p className="text-sm text-gray-500 mt-1">
                ({Math.round(currentPrice / 12).toLocaleString()} دج شهرياً)
              </p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {currentPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات الدفع</CardTitle>
          <CardDescription>
            أدخل بياناتك لإتمام عملية الاشتراك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Plan Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="planType">نوع الاشتراك</Label>
                <Select onValueChange={(value) => setValue('planType', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الاشتراك" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">الاشتراك المميز</SelectItem>
                    <SelectItem value="family">اشتراك العائلة</SelectItem>
                    <SelectItem value="school">اشتراك المدرسة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">مدة الاشتراك</Label>
                <Select onValueChange={(value) => setValue('duration', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مدة الاشتراك" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">شهري</SelectItem>
                    <SelectItem value="yearly">سنوي (وفر {yearlyDiscount}%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="example@email.com"
                  {...register('customerEmail')}
                />
                {errors.customerEmail && (
                  <p className="text-sm text-red-600">{errors.customerEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">رقم الهاتف</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  placeholder="+213 555 123 456"
                  {...register('customerPhone')}
                />
                {errors.customerPhone && (
                  <p className="text-sm text-red-600">{errors.customerPhone.message}</p>
                )}
              </div>
            </div>

            {/* Payment Provider */}
            <div className="space-y-2">
              <Label htmlFor="provider">طريقة الدفع</Label>
              <Select onValueChange={(value) => setValue('provider', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baridimob">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span>بريدي موب (BaridiMob)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cib">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>بطاقة CIB</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>الاشتراك:</span>
                <span>{currentPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span>المدة:</span>
                <span>{watchedValues.duration === 'monthly' ? 'شهري' : 'سنوي'}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>المجموع:</span>
                <span>{currentPrice.toLocaleString()} دج</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  ادفع {currentPrice.toLocaleString()} دج
                </>
              )}
            </Button>

            <p className="text-xs text-gray-600 text-center">
              بالنقر على "ادفع" فإنك توافق على شروط الخدمة وسياسة الخصوصية.
              سيتم تجديد اشتراكك تلقائياً ما لم تقم بإلغائه.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}