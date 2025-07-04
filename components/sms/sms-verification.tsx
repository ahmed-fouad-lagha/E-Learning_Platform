'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const phoneSchema = z.object({
  phone: z.string().min(10, 'رقم الهاتف غير صحيح')
});

const codeSchema = z.object({
  code: z.string().length(6, 'رمز التحقق يجب أن يكون 6 أرقام')
});

type PhoneInput = z.infer<typeof phoneSchema>;
type CodeInput = z.infer<typeof codeSchema>;

interface SMSVerificationProps {
  onVerified: (phone: string) => void;
  initialPhone?: string;
}

export function SMSVerification({ onVerified, initialPhone = '' }: SMSVerificationProps) {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState(initialPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const phoneForm = useForm<PhoneInput>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: initialPhone }
  });

  const codeForm = useForm<CodeInput>({
    resolver: zodResolver(codeSchema)
  });

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Format as +213 XXX XXX XXX
    if (cleaned.startsWith('213')) {
      const number = cleaned.substring(3);
      if (number.length <= 3) return `+213 ${number}`;
      if (number.length <= 6) return `+213 ${number.slice(0, 3)} ${number.slice(3)}`;
      return `+213 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 9)}`;
    } else if (cleaned.startsWith('0')) {
      const number = cleaned.substring(1);
      if (number.length <= 3) return `+213 ${number}`;
      if (number.length <= 6) return `+213 ${number.slice(0, 3)} ${number.slice(3)}`;
      return `+213 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 9)}`;
    } else {
      if (cleaned.length <= 3) return `+213 ${cleaned}`;
      if (cleaned.length <= 6) return `+213 ${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
      return `+213 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}`;
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendCode = async (data: PhoneInput) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/sms/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send',
          phone: data.phone
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPhone(data.phone);
        setStep('code');
        startCountdown();
        toast({
          title: 'تم إرسال الرمز',
          description: 'تم إرسال رمز التحقق إلى هاتفك',
        });
      } else {
        toast({
          title: 'خطأ في إرسال الرمز',
          description: result.error || 'حدث خطأ غير متوقع',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ في الاتصال',
        description: 'تعذر الاتصال بالخادم',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (data: CodeInput) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/sms/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          code: data.code
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'تم التحقق بنجاح',
          description: 'تم التحقق من رقم هاتفك بنجاح',
        });
        onVerified(phone);
      } else {
        toast({
          title: 'رمز التحقق غير صحيح',
          description: result.error || 'يرجى التحقق من الرمز والمحاولة مرة أخرى',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ في التحقق',
        description: 'تعذر التحقق من الرمز',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/sms/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send',
          phone
        }),
      });

      const result = await response.json();

      if (result.success) {
        startCountdown();
        toast({
          title: 'تم إعادة الإرسال',
          description: 'تم إرسال رمز جديد إلى هاتفك',
        });
      } else {
        toast({
          title: 'خطأ في إعادة الإرسال',
          description: result.error || 'حدث خطأ غير متوقع',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ في الاتصال',
        description: 'تعذر إعادة إرسال الرمز',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'phone') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <CardTitle>تحقق من رقم الهاتف</CardTitle>
          <CardDescription>
            أدخل رقم هاتفك لإرسال رمز التحقق
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={phoneForm.handleSubmit(sendCode)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+213 555 123 456"
                {...phoneForm.register('phone')}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  e.target.value = formatted;
                  phoneForm.setValue('phone', formatted);
                }}
              />
              {phoneForm.formState.errors.phone && (
                <p className="text-sm text-red-600">
                  {phoneForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                'إرسال رمز التحقق'
              )}
            </Button>

            <p className="text-xs text-gray-600 text-center">
              سيتم إرسال رمز التحقق عبر الرسائل النصية إلى رقم هاتفك
            </p>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <CardTitle>أدخل رمز التحقق</CardTitle>
        <CardDescription>
          تم إرسال رمز مكون من 6 أرقام إلى {phone}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={codeForm.handleSubmit(verifyCode)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">رمز التحقق</Label>
            <Input
              id="code"
              type="text"
              placeholder="123456"
              maxLength={6}
              className="text-center text-2xl tracking-widest"
              {...codeForm.register('code')}
              onChange={(e) => {
                // Only allow numbers
                e.target.value = e.target.value.replace(/\D/g, '');
                codeForm.setValue('code', e.target.value);
              }}
            />
            {codeForm.formState.errors.code && (
              <p className="text-sm text-red-600">
                {codeForm.formState.errors.code.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              'تحقق من الرمز'
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={resendCode}
              disabled={countdown > 0 || isLoading}
              className="text-sm"
            >
              {countdown > 0 ? (
                `إعادة الإرسال خلال ${countdown} ثانية`
              ) : (
                'إعادة إرسال الرمز'
              )}
            </Button>
          </div>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep('phone')}
              className="text-sm text-gray-600"
            >
              تغيير رقم الهاتف
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}