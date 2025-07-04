'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentForm } from '@/components/payment/payment-form';
import { CheckCircle, Star, Users, Building, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'family' | 'school'>('premium');
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'yearly'>('monthly');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const plans = {
    premium: {
      name: 'الاشتراك المميز',
      icon: Star,
      monthly: 2500,
      yearly: 25000,
      popular: true,
      description: 'مثالي للطلاب الجادين في التحضير للبكالوريا',
      features: [
        'الوصول لجميع الدروس والمواد',
        'امتحانات تجريبية لا محدودة',
        'تحليلات متقدمة للأداء',
        'دعم فني 24/7',
        'تحميل للاستخدام دون انترنت',
        'مجموعات دراسة خاصة',
        'تتبع التقدم المفصل',
        'توصيات شخصية بالذكاء الاصطناعي'
      ]
    },
    family: {
      name: 'اشتراك العائلة',
      icon: Users,
      monthly: 5000,
      yearly: 50000,
      popular: false,
      description: 'للعائلات التي لديها أكثر من طالب واحد',
      features: [
        'جميع ميزات الاشتراك المميز',
        'حتى 4 حسابات طلاب',
        'لوحة تحكم الأولياء',
        'تقارير تقدم العائلة',
        'إشعارات للأولياء',
        'إدارة وقت الدراسة',
        'مراقبة الأنشطة',
        'دعم عائلي مخصص'
      ]
    },
    school: {
      name: 'اشتراك المدرسة',
      icon: Building,
      monthly: 15000,
      yearly: 150000,
      popular: false,
      description: 'للمدارس والمؤسسات التعليمية',
      features: [
        'حسابات لا محدودة للطلاب',
        'لوحة تحكم المعلمين',
        'تقارير مؤسسية مفصلة',
        'تدريب المعلمين',
        'دعم تقني مخصص',
        'تخصيص المحتوى',
        'إدارة الفصول الدراسية',
        'تكامل مع أنظمة المدرسة'
      ]
    }
  };

  const getYearlyDiscount = (planType: keyof typeof plans) => {
    const plan = plans[planType];
    return Math.round((1 - (plan.yearly / (plan.monthly * 12))) * 100);
  };

  const handleSelectPlan = (planType: 'premium' | 'family' | 'school', duration: 'monthly' | 'yearly') => {
    setSelectedPlan(planType);
    setSelectedDuration(duration);
    setShowPaymentForm(true);
  };

  if (showPaymentForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              onClick={() => setShowPaymentForm(false)}
              className="mb-4"
            >
              ← العودة إلى الخطط
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              إتمام الاشتراك
            </h1>
            <p className="text-lg text-gray-600">
              أكمل بياناتك لتفعيل اشتراكك في منصة التعلم الجزائرية
            </p>
          </div>
          
          <PaymentForm 
            selectedPlan={selectedPlan} 
            selectedDuration={selectedDuration} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            خطط الاشتراك
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            اختر الخطة المناسبة لك وابدأ رحلتك نحو النجاح في البكالوريا
          </p>
          
          {/* Duration Toggle */}
          <Tabs defaultValue="monthly" className="w-full max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">شهري</TabsTrigger>
              <TabsTrigger value="yearly">
                سنوي
                <Badge className="mr-2 bg-green-100 text-green-800 text-xs">
                  وفر حتى 17%
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="monthly" className="mt-8">
              <PricingCards duration="monthly" onSelectPlan={handleSelectPlan} />
            </TabsContent>
            
            <TabsContent value="yearly" className="mt-8">
              <PricingCards duration="yearly" onSelectPlan={handleSelectPlan} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">مقارنة الميزات</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-4 font-semibold">الميزة</th>
                  <th className="text-center p-4 font-semibold">مجاني</th>
                  <th className="text-center p-4 font-semibold">مميز</th>
                  <th className="text-center p-4 font-semibold">عائلة</th>
                  <th className="text-center p-4 font-semibold">مدرسة</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'الوصول للدروس الأساسية', free: '10 دروس', premium: 'جميع الدروس', family: 'جميع الدروس', school: 'جميع الدروس' },
                  { feature: 'الامتحانات التجريبية', free: '1 شهرياً', premium: 'لا محدود', family: 'لا محدود', school: 'لا محدود' },
                  { feature: 'التحميل للاستخدام دون انترنت', free: '❌', premium: '✅', family: '✅', school: '✅' },
                  { feature: 'الدعم الفني', free: 'المجتمع', premium: '24/7', family: '24/7', school: 'مخصص' },
                  { feature: 'عدد الحسابات', free: '1', premium: '1', family: '4', school: 'لا محدود' },
                  { feature: 'لوحة تحكم الأولياء', free: '❌', premium: '❌', family: '✅', school: '✅' },
                  { feature: 'تقارير مفصلة', free: 'أساسية', premium: 'متقدمة', family: 'عائلية', school: 'مؤسسية' }
                ].map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-center text-gray-600">{row.free}</td>
                    <td className="p-4 text-center text-emerald-600">{row.premium}</td>
                    <td className="p-4 text-center text-blue-600">{row.family}</td>
                    <td className="p-4 text-center text-purple-600">{row.school}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">الأسئلة الشائعة</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: 'هل يمكنني إلغاء الاشتراك في أي وقت؟',
                answer: 'نعم، يمكنك إلغاء اشتراكك في أي وقت من لوحة التحكم. لن يتم تجديد الاشتراك تلقائياً بعد الإلغاء.'
              },
              {
                question: 'هل هناك ضمان استرداد المال؟',
                answer: 'نعم، نوفر ضمان استرداد المال خلال 30 يوماً من تاريخ الاشتراك إذا لم تكن راضياً عن الخدمة.'
              },
              {
                question: 'هل يمكنني تغيير خطة الاشتراك؟',
                answer: 'نعم، يمكنك ترقية أو تخفيض خطة اشتراكك في أي وقت. سيتم احتساب الفرق في السعر.'
              },
              {
                question: 'هل المحتوى متوافق مع منهاج الديوان الوطني؟',
                answer: 'نعم، جميع المحتوى متوافق 100% مع منهاج الديوان الوطني للامتحانات والمسابقات (ONEC).'
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingCards({ 
  duration, 
  onSelectPlan 
}: { 
  duration: 'monthly' | 'yearly';
  onSelectPlan: (plan: 'premium' | 'family' | 'school', duration: 'monthly' | 'yearly') => void;
}) {
  const plans = {
    premium: {
      name: 'الاشتراك المميز',
      icon: Star,
      monthly: 2500,
      yearly: 25000,
      popular: true,
      description: 'مثالي للطلاب الجادين في التحضير للبكالوريا',
      features: [
        'الوصول لجميع الدروس والمواد',
        'امتحانات تجريبية لا محدودة',
        'تحليلات متقدمة للأداء',
        'دعم فني 24/7',
        'تحميل للاستخدام دون انترنت',
        'مجموعات دراسة خاصة'
      ]
    },
    family: {
      name: 'اشتراك العائلة',
      icon: Users,
      monthly: 5000,
      yearly: 50000,
      popular: false,
      description: 'للعائلات التي لديها أكثر من طالب واحد',
      features: [
        'جميع ميزات الاشتراك المميز',
        'حتى 4 حسابات طلاب',
        'لوحة تحكم الأولياء',
        'تقارير تقدم العائلة',
        'إشعارات للأولياء',
        'إدارة وقت الدراسة'
      ]
    },
    school: {
      name: 'اشتراك المدرسة',
      icon: Building,
      monthly: 15000,
      yearly: 150000,
      popular: false,
      description: 'للمدارس والمؤسسات التعليمية',
      features: [
        'حسابات لا محدودة للطلاب',
        'لوحة تحكم المعلمين',
        'تقارير مؤسسية مفصلة',
        'تدريب المعلمين',
        'دعم تقني مخصص',
        'تخصيص المحتوى'
      ]
    }
  };

  const getYearlyDiscount = (planType: keyof typeof plans) => {
    const plan = plans[planType];
    return Math.round((1 - (plan.yearly / (plan.monthly * 12))) * 100);
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {Object.entries(plans).map(([key, plan]) => {
        const planKey = key as keyof typeof plans;
        const price = plan[duration];
        const yearlyDiscount = duration === 'yearly' ? getYearlyDiscount(planKey) : 0;
        const Icon = plan.icon;

        return (
          <Card 
            key={key} 
            className={`relative ${plan.popular ? 'border-emerald-500 border-2' : ''} hover:shadow-lg transition-shadow`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-emerald-600 text-white px-4 py-1">
                  الأكثر شعبية
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  plan.popular ? 'bg-emerald-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    plan.popular ? 'text-emerald-600' : 'text-gray-600'
                  }`} />
                </div>
              </div>
              
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm">{plan.description}</CardDescription>
              
              <div className="mt-4">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-3xl font-bold text-emerald-600">
                    {price.toLocaleString()}
                  </span>
                  <span className="text-gray-600">دج</span>
                  <span className="text-sm text-gray-500">
                    / {duration === 'monthly' ? 'شهر' : 'سنة'}
                  </span>
                </div>
                
                {duration === 'yearly' && yearlyDiscount > 0 && (
                  <div className="mt-2">
                    <Badge className="bg-green-100 text-green-800">
                      وفر {yearlyDiscount}%
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      ({Math.round(price / 12).toLocaleString()} دج شهرياً)
                    </p>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
                onClick={() => onSelectPlan(planKey, duration)}
              >
                اختر هذه الخطة
                <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}