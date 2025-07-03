'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, User, Mail, Phone, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().optional(),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
  role: z.enum(['STUDENT', 'TEACHER', 'PARENT']).default('STUDENT'),
  grade: z.string().optional(),
  wilaya: z.string().optional(),
  school: z.string().optional(),
  parentPhone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'يجب الموافقة على الشروط والأحكام',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

type RegisterInput = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const grades = [
  { value: 'PREMIERE_AS', label: 'الأولى ثانوي علوم' },
  { value: 'PREMIERE_AL', label: 'الأولى ثانوي آداب' },
  { value: 'DEUXIEME_AS', label: 'الثانية ثانوي علوم' },
  { value: 'DEUXIEME_AL', label: 'الثانية ثانوي آداب' },
  { value: 'TERMINALE_AS', label: 'الثالثة ثانوي علوم تجريبية' },
  { value: 'TERMINALE_AL', label: 'الثالثة ثانوي آداب وفلسفة' },
  { value: 'TERMINALE_AM', label: 'الثالثة ثانوي رياضيات' },
  { value: 'TERMINALE_ATM', label: 'الثالثة ثانوي تقني رياضي' },
  { value: 'TERMINALE_AGE', label: 'الثالثة ثانوي تسيير واقتصاد' },
  { value: 'TERMINALE_ALL', label: 'الثالثة ثانوي لغات أجنبية' },
];

const wilayas = [
  { value: 'ALGIERS', label: 'الجزائر' },
  { value: 'ORAN', label: 'وهران' },
  { value: 'CONSTANTINE', label: 'قسنطينة' },
  { value: 'ANNABA', label: 'عنابة' },
  { value: 'BLIDA', label: 'البليدة' },
  { value: 'BATNA', label: 'باتنة' },
  { value: 'SETIF', label: 'سطيف' },
  { value: 'TIZI_OUZOU', label: 'تيزي وزو' },
  { value: 'BEJAIA', label: 'بجاية' },
  { value: 'TLEMCEN', label: 'تلمسان' },
];

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'STUDENT',
    },
  });

  const watchRole = watch('role');

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    
    try {
      await signUp(data.email, data.password, data);
      
      toast({
        title: 'تم إنشاء الحساب بنجاح',
        description: 'مرحباً بك في منصة التعلم الجزائرية',
      });

      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      toast({
        title: 'خطأ في إنشاء الحساب',
        description: error.message === 'User already registered'
          ? 'المستخدم موجود بالفعل'
          : 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          إنشاء حساب جديد
        </CardTitle>
        <CardDescription>
          انضم إلى منصة التعلم الإلكتروني الجزائرية
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  className="pl-10 rtl:pr-10 rtl:pl-3"
                  {...register('name')}
                />
                <User className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  className="pl-10 rtl:pr-10 rtl:pl-3"
                  {...register('email')}
                />
                <Mail className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0555123456"
                  className="pl-10 rtl:pr-10 rtl:pl-3"
                  {...register('phone')}
                />
                <Phone className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">نوع الحساب</Label>
              <Select onValueChange={(value) => setValue('role', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الحساب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">طالب</SelectItem>
                  <SelectItem value="TEACHER">أستاذ</SelectItem>
                  <SelectItem value="PARENT">ولي أمر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Student-specific fields */}
          {watchRole === 'STUDENT' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">المستوى الدراسي</Label>
                <Select onValueChange={(value) => setValue('grade', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المستوى الدراسي" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade.value} value={grade.value}>
                        {grade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wilaya">الولاية</Label>
                <Select onValueChange={(value) => setValue('wilaya', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الولاية" />
                  </SelectTrigger>
                  <SelectContent>
                    {wilayas.map((wilaya) => (
                      <SelectItem key={wilaya.value} value={wilaya.value}>
                        {wilaya.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="school">اسم المؤسسة التعليمية</Label>
                <div className="relative">
                  <Input
                    id="school"
                    type="text"
                    placeholder="ثانوية الأمير عبد القادر"
                    className="pl-10 rtl:pr-10 rtl:pl-3"
                    {...register('school')}
                  />
                  <School className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="parentPhone">رقم هاتف ولي الأمر (اختياري)</Label>
                <div className="relative">
                  <Input
                    id="parentPhone"
                    type="tel"
                    placeholder="0555987654"
                    className="pl-10 rtl:pr-10 rtl:pl-3"
                    {...register('parentPhone')}
                  />
                  <Phone className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {/* Password fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="أعد إدخال كلمة المرور"
                  className="pl-10 rtl:pr-10 rtl:pl-3"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Terms and conditions */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Checkbox
              id="agreeToTerms"
              {...register('agreeToTerms')}
            />
            <Label htmlFor="agreeToTerms" className="text-sm">
              أوافق على{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-700">
                الشروط والأحكام
              </a>{' '}
              و{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-700">
                سياسة الخصوصية
              </a>
            </Label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4 animate-spin" />
                جاري إنشاء الحساب...
              </>
            ) : (
              'إنشاء الحساب'
            )}
          </Button>

          {onSwitchToLogin && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  تسجيل الدخول
                </button>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}