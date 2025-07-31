'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const subjects = [
  { value: 'MATHEMATICS', label: 'الرياضيات' },
  { value: 'PHYSICS', label: 'الفيزياء' },
  { value: 'CHEMISTRY', label: 'الكيمياء' },
  { value: 'BIOLOGY', label: 'علوم الحياة والأرض' },
  { value: 'ARABIC_LITERATURE', label: 'الأدب العربي' },
  { value: 'FRENCH', label: 'اللغة الفرنسية' },
  { value: 'ENGLISH', label: 'اللغة الإنجليزية' },
  { value: 'HISTORY', label: 'التاريخ' },
  { value: 'GEOGRAPHY', label: 'الجغرافيا' },
  { value: 'PHILOSOPHY', label: 'الفلسفة' },
  { value: 'ISLAMIC_STUDIES', label: 'العلوم الإسلامية' },
  { value: 'ECONOMICS', label: 'الاقتصاد' },
  { value: 'ACCOUNTING', label: 'المحاسبة' },
  { value: 'COMPUTER_SCIENCE', label: 'علوم الكمبيوتر' }
];

const grades = [
  { value: 'PREMIERE_AS', label: 'الأولى ثانوي علوم' },
  { value: 'PREMIERE_AL', label: 'الأولى ثانوي آداب' },
  { value: 'DEUXIEME_AS', label: 'الثانية ثانوي علوم' },
  { value: 'DEUXIEME_AL', label: 'الثانية ثانوي آداب' },
  { value: 'TERMINALE_AS', label: 'الثالثة ثانوي علوم' },
  { value: 'TERMINALE_AL', label: 'الثالثة ثانوي آداب' },
  { value: 'TERMINALE_TM', label: 'الثالثة ثانوي رياضيات' },
  { value: 'TERMINALE_GE', label: 'الثالثة ثانوي اقتصاد' }
];

interface FormData {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  subject: string;
  grade: string;
  curriculum: string;
  estimatedHours: number;
  isFree: boolean;
  isPublished: boolean;
  thumbnail: string;
}

export default function CreateCoursePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    subject: '',
    grade: '',
    curriculum: '',
    estimatedHours: 1,
    isFree: false,
    isPublished: false,
    thumbnail: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/admin/courses/${result.data.id}`);
      } else {
        setError(result.error || 'خطأ في إنشاء الدورة');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <Link
          href="/admin/courses"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة إلى الدورات
        </Link>
        <h1 className="text-3xl font-bold" dir="rtl">إنشاء دورة جديدة</h1>
        <p className="text-gray-600 mt-2" dir="rtl">
          أنشئ دورة تعليمية جديدة للطلاب
        </p>
      </div>

      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle dir="rtl">معلومات أساسية</CardTitle>
            <CardDescription dir="rtl">
              أدخل المعلومات الأساسية للدورة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="titleAr" dir="rtl">العنوان بالعربية *</Label>
                <Input
                  id="titleAr"
                  value={formData.titleAr}
                  onChange={(e) => handleInputChange('titleAr', e.target.value)}
                  required
                  dir="rtl"
                  placeholder="أدخل عنوان الدورة بالعربية"
                />
              </div>
              <div>
                <Label htmlFor="title">English Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  placeholder="Enter course title in English"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="descriptionAr" dir="rtl">الوصف بالعربية *</Label>
                <Textarea
                  id="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                  required
                  dir="rtl"
                  placeholder="أدخل وصف الدورة بالعربية"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="description">English Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  placeholder="Enter course description in English"
                  rows={4}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label dir="rtl">المادة *</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => handleInputChange('subject', value)}
                  required
                >
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
              </div>

              <div>
                <Label dir="rtl">المستوى *</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value) => handleInputChange('grade', value)}
                  required
                >
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
              </div>

              <div>
                <Label htmlFor="estimatedHours" dir="rtl">عدد الساعات المقدرة</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  min="1"
                  value={formData.estimatedHours}
                  onChange={(e) => handleInputChange('estimatedHours', parseInt(e.target.value) || 1)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="curriculum" dir="rtl">رمز المنهاج *</Label>
              <Input
                id="curriculum"
                value={formData.curriculum}
                onChange={(e) => handleInputChange('curriculum', e.target.value)}
                required
                dir="rtl"
                placeholder="مثال: MATH-3AS-2024"
              />
            </div>

            <div>
              <Label htmlFor="thumbnail" dir="rtl">رابط الصورة المصغرة</Label>
              <Input
                id="thumbnail"
                type="url"
                value={formData.thumbnail}
                onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle dir="rtl">إعدادات الدورة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div dir="rtl">
                <Label htmlFor="isFree">دورة مجانية</Label>
                <p className="text-sm text-gray-600">
                  هل هذه الدورة متاحة مجاناً للجميع؟
                </p>
              </div>
              <Switch
                id="isFree"
                checked={formData.isFree}
                onCheckedChange={(checked) => handleInputChange('isFree', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div dir="rtl">
                <Label htmlFor="isPublished">نشر الدورة</Label>
                <p className="text-sm text-gray-600">
                  هل تريد نشر الدورة فوراً؟
                </p>
              </div>
              <Switch
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              "جاري الحفظ..."
            ) : (
              <>
                <Save className="ml-2 h-4 w-4" />
                إنشاء الدورة
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}