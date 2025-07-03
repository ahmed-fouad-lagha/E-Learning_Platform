'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onSuccess?: (user: any) => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'حدث خطأ في تسجيل الدخول');
      }

      toast({
        title: 'نجح تسجيل الدخول',
        description: result.message,
      });

      if (onSuccess) {
        onSuccess(result.user);
      }

      // Redirect to dashboard
      window.location.href = '/dashboard';

    } catch (error) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          تسجيل الدخول
        </CardTitle>
        <CardDescription>
          أدخل بياناتك للوصول إلى حسابك
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailOrPhone">البريد الإلكتروني أو رقم الهاتف</Label>
            <div className="relative">
              <Input
                id="emailOrPhone"
                type="text"
                placeholder="example@email.com أو 0555123456"
                className="pl-10 rtl:pr-10 rtl:pl-3"
                {...register('emailOrPhone')}
              />
              <div className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            {errors.emailOrPhone && (
              <p className="text-sm text-red-600">{errors.emailOrPhone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="أدخل كلمة المرور"
                className="pl-10 rtl:pr-10 rtl:pl-3"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 rtl:space-x-reverse">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm text-gray-600">تذكرني</span>
            </label>
            <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700">
              نسيت كلمة المرور؟
            </a>
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4 animate-spin" />
                جاري تسجيل الدخول...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </Button>

          {onSwitchToRegister && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                ليس لديك حساب؟{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  إنشاء حساب جديد
                </button>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}