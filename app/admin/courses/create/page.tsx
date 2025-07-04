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
  titleAr: z.string().min(1, 'العنوان بالعربية مطلوب'),
  description: z.string().min(1, 'وصف الدورة مطلوب'),
  descriptionAr: z.string().min(1, 'الوصف بالعربية مطلوب'),
  subject: z.string().min(1, 'المادة مطلوبة'),
  grade: z.string().min(1, 'المستوى مطلوب'),
  difficulty: z.string().min(1, 'مستوى الصعوبة مطلوب'),
  curriculum: z.string().min(1, 'رمز المنهاج مطلوب'),
  bacRelevance: z.number().min(0).max(1),
  estimatedHours: z.number().min(1, 'عدد الساعات مطلوب'),
  isFree: z.boolean(),
  isPublished: z.boolean()
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
      isFree: false,
      isPublished: false,
      bacRelevance: 0.5,
      estimatedHours: 1
    }
  });

  const watchIsFree = watch('isFree');

  const subjects = [
    { value: 'MATHEMATICS', label: 'الرياضيات' },
    { value: 'PHYSICS', label: 'الفيزياء' },
    { value: 'CHEMISTRY', label: 'الكيمياء' },
    { value: 'BIOLOGY', label: 'علوم الطبيعة والحياة' },
    { value: 'ARABIC_LITERATURE', label: 'اللغة العربية وآدابها' },
    { value: 'FRENCH', label: 'اللغة الفرنسية' },
    { value: 'ENGLISH', label: 'اللغة الإنجليزية' },
    { value: 'PHILOSOPHY', label: 'الفلسفة' },
    { value: 'HISTORY', label: 'التاريخ' },
    { value: 'GEOGRAPHY', label: 'الجغرافيا' },
    { value: 'ISLAMIC_STUDIES', label: 'التربية الإسلامية' },
    { value: 'ECONOMICS', label: 'الاقتصاد' },
    { value: 'ACCOUNTING', label: 'المحاسبة' },
    { value: 'COMPUTER_SCIENCE', label: 'الإعلام الآلي' }
  ];

  const grades = [
    { value: 'PREMIERE_AS', label: 'الأولى ثانوي علوم' },
    { value: 'PREMIERE_AL', label: 'الأولى ثانوي آداب' },
    { value: 'DEUXIEME_AS', label: 'الثانية ثانوي علوم' },
    { value: 'DEUXIEME_AL', label: 'الثانية ثانوي آداب' },
    { value: 'TERMINALE_AS', label: 'الثالثة ثانوي علوم تجريبية' },
    { value: 'TERMINALE_AL', label: 'الثالثة ثانوي آداب وفلسفة' },
    { value: 'TERMINALE_TM', label: 'الثالثة ثانوي تقني رياضي' },
    { value: 'TERMINALE_GE', label: 'الثالثة ثانوي تسيير واقتصاد' }
  ];

  const difficulties = [
    { value: 'BEGINNER', label: 'مبتدئ' },
    { value: 'INTERMEDIATE', label: 'متوسط' },
    { value: 'ADVANCED', label: 'متقدم' },
    { value: 'BAC_LEVEL', label: 'مستوى البكالوريا' }
  ];

  const onSubmit = async (data: CourseInput) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'تم إنشاء الدورة بنجاح',
          description: 'يمكنك الآن إضافة الدروس والمحتوى',
        });

        router.push(`/admin/courses/${result.data.id}`);
      } else {
        toast({
          title: 'خطأ في إنشاء الدورة',
          description: result.error || 'حدث خطأ غير متوقع',
          variant: 'destructive',
        });
      }
      
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان الدورة (بالإنجليزية)</Label>
                  <Input
                    id="title"
                    placeholder="Mathematics - Exponential Functions"
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="titleAr">عنوان الدورة (بالعربية)</Label>
                  <Input
                    id="titleAr"
                    placeholder="الرياضيات - الدوال الأسية"
                    {...register('titleAr')}
                  />
                  {errors.titleAr && (
                    <p className="text-sm text-red-600">{errors.titleAr.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">وصف الدورة (بالإنجليزية)</Label>
                  <Textarea
                    id="description"
                    placeholder="Comprehensive study of exponential and logarithmic functions..."
                    rows={4}
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionAr">وصف الدورة (بالعربية)</Label>
                  <Textarea
                    id="descriptionAr"
                    placeholder="دراسة شاملة للدوال الأسية واللوغاريتمية..."
                    rows={4}
                    {...register('descriptionAr')}
                  />
                  {errors.descriptionAr && (
                    <p className="text-sm text-red-600">{errors.descriptionAr.message}</p>
                  )}
                </div>
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
                  <Label htmlFor="difficulty">مستوى الصعوبة</Label>
                  <Select onValueChange={(value) => setValue('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty.value} value={difficulty.value}>
                          {difficulty.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.difficulty && (
                    <p className="text-sm text-red-600">{errors.difficulty.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="curriculum">رمز المنهاج (ONEC)</Label>
                  <Input
                    id="curriculum"
                    placeholder="MATH_3AS_01"
                    {...register('curriculum')}
                  />
                  {errors.curriculum && (
                    <p className="text-sm text-red-600">{errors.curriculum.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bacRelevance">صلة بامتحان البكالوريا (0-1)</Label>
                  <Input
                    id="bacRelevance"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    placeholder="0.8"
                    {...register('bacRelevance', { valueAsNumber: true })}
                  />
                  {errors.bacRelevance && (
                    <p className="text-sm text-red-600">{errors.bacRelevance.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedHours">عدد الساعات المقدرة</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    min="1"
                    placeholder="25"
                    {...register('estimatedHours', { valueAsNumber: true })}
                  />
                  {errors.estimatedHours && (
                    <p className="text-sm text-red-600">{errors.estimatedHours.message}</p>
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
                  <Label htmlFor="isFree">دورة مجانية</Label>
                  <p className="text-sm text-gray-600">
                    جعل الدورة متاحة مجاناً لجميع الطلاب
                  </p>
                </div>
                <Switch
                  id="isFree"
                  onCheckedChange={(checked) => setValue('isFree', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublished">نشر الدورة</Label>
                  <p className="text-sm text-gray-600">
                    جعل الدورة مرئية للطلاب في المنصة
                  </p>
                </div>
                <Switch
                  id="isPublished"
                  onCheckedChange={(checked) => setValue('isPublished', checked)}
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