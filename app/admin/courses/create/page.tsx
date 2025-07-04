'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye } from 'lucide-react';

const courseSchema = z.object({
  title: z.string().min(1, 'عنوان الدورة مطلوب'),
  description: z.string().min(1, 'وصف الدورة مطلوب'),
  subject: z.string().min(1, 'المادة مطلوبة'),
  grade: z.string().min(1, 'المستوى مطلوب'),
  level: z.string().min(1, 'مستوى الصعوبة مطلوب'),
  duration_hours: z.number().min(1, 'مدة الدورة مطلوبة'),
  price: z.number().min(0, 'السعر يجب أن يكون صفر أو أكثر'),
  is_free: z.boolean(),
  is_published: z.boolean()
});

type CourseInput = z.infer<typeof courseSchema>;

export default function CreateCourse() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      is_free: false,
      is_published: false,
      price: 0,
      duration_hours: 1
    }
  });

  const watchIsFree = watch('is_free');

  const subjects = [
    { value: 'MATHEMATICS', label: 'الرياضيات' },
    { value: 'PHYSICS', label: 'الفيزياء' },
    { value: 'CHEMISTRY', label: 'الكيمياء' },
    { value: 'BIOLOGY', label: 'علوم الطبيعة والحياة' },
    { value: 'LITERATURE', label: 'اللغة العربية وآدابها' },
    { value: 'FRENCH', label: 'اللغة الفرنسية' },
    { value: 'ENGLISH', label: 'اللغة الإنجليزية' },
    { value: 'PHILOSOPHY', label: 'الفلسفة' },
    { value: 'HISTORY', label: 'التاريخ والجغرافيا' },
    { value: 'ISLAMIC', label: 'التربية الإسلامية' }
  ];

  const grades = [
    { value: 'PREMIERE_AS', label: 'الأولى ثانوي علوم' },
    { value: 'PREMIERE_AL', label: 'الأولى ثانوي آداب' },
    { value: 'DEUXIEME_AS', label: 'الثانية ثانوي علوم' },
    { value: 'DEUXIEME_AL', label: 'الثانية ثانوي آداب' },
    { value: 'TERMINALE_AS', label: 'الثالثة ثانوي علوم تجريبية' },
    { value: 'TERMINALE_AL', label: 'الثالثة ثانوي آداب وفلسفة' },
    { value: 'TERMINALE_AM', label: 'الثالثة ثانوي رياضيات' },
    { value: 'TERMINALE_ATM', label: 'الثالثة ثانوي تقني رياضي' },
    { value: 'TERMINALE_AGE', label: 'الثالثة ثانوي تسيير واقتصاد' }
  ];

  const levels = [
    { value: 'BEGINNER', label: 'مبتدئ' },
    { value: 'INTERMEDIATE', label: 'متوسط' },
    { value: 'ADVANCED', label: 'متقدم' }
  ];

  const onSubmit = async (data: CourseInput) => {
    setIsLoading(true);
    
    try {
      // Here you would make an API call to create the course
      console.log('Creating course:', data);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'تم إنشاء الدورة بنجاح',
        description: 'يمكنك الآن إضافة الوحدات والدروس',
      });

      // Redirect to course management or edit page
      router.push('/admin/courses');
      
    } catch (error) {
      toast({
        title: 'خطأ في إنشاء الدورة',
        description: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mr-4 rtl:ml-4 rtl:mr-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">
                إنشاء دورة جديدة
              </h1>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                معاينة
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية</CardTitle>
              <CardDescription>
                أدخل المعلومات الأساسية للدورة التعليمية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الدورة</Label>
                <Input
                  id="title"
                  placeholder="مثال: الرياضيات - الدوال الأسية واللوغاريتمية"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف الدورة</Label>
                <Textarea
                  id="description"
                  placeholder="وصف شامل للدورة ومحتواها وأهدافها التعليمية..."
                  rows={4}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">المادة</Label>
                  <Select onValueChange={(value) => setValue('subject', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المادة" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.value} value={subject.value}>
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subject && (
                    <p className="text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">المستوى الدراسي</Label>
                  <Select onValueChange={(value) => setValue('grade', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.grade && (
                    <p className="text-sm text-red-600">{errors.grade.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">مستوى الصعوبة</Label>
                  <Select onValueChange={(value) => setValue('level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.level && (
                    <p className="text-sm text-red-600">{errors.level.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration_hours">مدة الدورة (بالساعات)</Label>
                  <Input
                    id="duration_hours"
                    type="number"
                    min="1"
                    placeholder="25"
                    {...register('duration_hours', { valueAsNumber: true })}
                  />
                  {errors.duration_hours && (
                    <p className="text-sm text-red-600">{errors.duration_hours.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">السعر (بالدينار الجزائري)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    placeholder="0"
                    disabled={watchIsFree}
                    {...register('price', { valueAsNumber: true })}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الدورة</CardTitle>
              <CardDescription>
                تحديد إعدادات النشر والوصول للدورة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_free">دورة مجانية</Label>
                  <p className="text-sm text-gray-600">
                    جعل الدورة متاحة مجاناً لجميع الطلاب
                  </p>
                </div>
                <Switch
                  id="is_free"
                  onCheckedChange={(checked) => {
                    setValue('is_free', checked);
                    if (checked) setValue('price', 0);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_published">نشر الدورة</Label>
                  <p className="text-sm text-gray-600">
                    جعل الدورة مرئية للطلاب في المنصة
                  </p>
                </div>
                <Switch
                  id="is_published"
                  onCheckedChange={(checked) => setValue('is_published', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 rtl:space-x-reverse">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 rtl:ml-2 rtl:mr-0"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  إنشاء الدورة
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}