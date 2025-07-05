'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Play, 
  FileText, 
  HelpCircle,
  Users,
  Clock,
  BookOpen,
  Video,
  Download
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  level: string;
  duration_hours: number;
  is_published: boolean;
  instructor_name: string;
  student_count: number;
  units: Unit[];
}

interface Unit {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  lesson_type: string;
  duration_minutes: number;
  is_published: boolean;
}

export default function CourseDetails() {
  const { courseId } = useParams() as { courseId: string };
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCourse: Course = {
        id: courseId,
        title: 'الرياضيات - الدوال الأسية واللوغاريتمية',
        description: 'دراسة شاملة للدوال الأسية واللوغاريتمية مع تطبيقات عملية وحلول مفصلة للتمارين',
        subject: 'MATHEMATICS',
        grade: 'TERMINALE_AS',
        level: 'ADVANCED',
        duration_hours: 25,
        is_published: true,
        instructor_name: 'د. أحمد بن محمد',
        student_count: 145,
        units: [
          {
            id: '1',
            title: 'مقدمة في الدوال الأسية',
            description: 'التعريف والخصائص الأساسية',
            order_index: 1,
            lessons: [
              {
                id: '1',
                title: 'تعريف الدالة الأسية',
                lesson_type: 'VIDEO',
                duration_minutes: 45,
                is_published: true
              },
              {
                id: '2',
                title: 'خصائص الدالة الأسية',
                lesson_type: 'VIDEO',
                duration_minutes: 50,
                is_published: true
              },
              {
                id: '3',
                title: 'تمارين تطبيقية',
                lesson_type: 'DOCUMENT',
                duration_minutes: 30,
                is_published: true
              },
              {
                id: '4',
                title: 'اختبار الوحدة الأولى',
                lesson_type: 'QUIZ',
                duration_minutes: 20,
                is_published: true
              }
            ]
          },
          {
            id: '2',
            title: 'الدوال اللوغاريتمية',
            description: 'دراسة الدوال اللوغاريتمية وتطبيقاتها',
            order_index: 2,
            lessons: [
              {
                id: '5',
                title: 'تعريف الدالة اللوغاريتمية',
                lesson_type: 'VIDEO',
                duration_minutes: 40,
                is_published: false
              },
              {
                id: '6',
                title: 'خصائص اللوغاريتم',
                lesson_type: 'VIDEO',
                duration_minutes: 55,
                is_published: false
              }
            ]
          }
        ]
      };
      setCourse(mockCourse);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="h-4 w-4" />;
      case 'DOCUMENT':
        return <FileText className="h-4 w-4" />;
      case 'QUIZ':
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getLessonTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'VIDEO': 'فيديو',
      'DOCUMENT': 'مستند',
      'QUIZ': 'اختبار',
      'TEXT': 'نص'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">الدورة غير موجودة</h2>
          <p className="text-gray-600 mb-4">لم يتم العثور على الدورة المطلوبة</p>
          <Button onClick={() => router.back()}>العودة</Button>
        </div>
      </div>
    );
  }

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
                تفاصيل الدورة
              </h1>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                إضافة وحدة
              </Button>
              <Button 
                onClick={() => router.push(`/admin/courses/${course.id}/edit`)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Edit className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                تعديل الدورة
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Overview */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {course.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {course.description}
              </p>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Badge variant={course.is_published ? 'default' : 'secondary'}>
                  {course.is_published ? 'منشور' : 'مسودة'}
                </Badge>
                <span className="text-sm text-gray-600">
                  المدرس: {course.instructor_name}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="mr-4 rtl:ml-4 rtl:mr-0">
                    <p className="text-2xl font-bold">{course.student_count}</p>
                    <p className="text-sm text-gray-600">طالب مسجل</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-green-600" />
                  <div className="mr-4 rtl:ml-4 rtl:mr-0">
                    <p className="text-2xl font-bold">{course.duration_hours}</p>
                    <p className="text-sm text-gray-600">ساعة</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                  <div className="mr-4 rtl:ml-4 rtl:mr-0">
                    <p className="text-2xl font-bold">{course.units.length}</p>
                    <p className="text-sm text-gray-600">وحدة</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Play className="h-8 w-8 text-orange-600" />
                  <div className="mr-4 rtl:ml-4 rtl:mr-0">
                    <p className="text-2xl font-bold">
                      {course.units.reduce((total, unit) => total + unit.lessons.length, 0)}
                    </p>
                    <p className="text-sm text-gray-600">درس</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">المحتوى</TabsTrigger>
            <TabsTrigger value="students">الطلاب</TabsTrigger>
            <TabsTrigger value="analytics">الإحصائيات</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {course.units.map((unit) => (
              <Card key={unit.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        الوحدة {unit.order_index}: {unit.title}
                      </CardTitle>
                      <CardDescription>{unit.description}</CardDescription>
                    </div>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                        إضافة درس
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {unit.lessons.map((lesson, index) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                            {getLessonIcon(lesson.lesson_type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{lesson.title}</h4>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                              <Badge variant="outline" className="text-xs">
                                {getLessonTypeLabel(lesson.lesson_type)}
                              </Badge>
                              <span>{lesson.duration_minutes} دقيقة</span>
                              <Badge variant={lesson.is_published ? 'default' : 'secondary'} className="text-xs">
                                {lesson.is_published ? 'منشور' : 'مسودة'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {course.units.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد وحدات</h3>
                  <p className="text-gray-600 mb-4">ابدأ بإضافة وحدات للدورة</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    إضافة وحدة جديدة
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>الطلاب المسجلين</CardTitle>
                <CardDescription>
                  قائمة بجميع الطلاب المسجلين في هذه الدورة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 py-8">
                  سيتم عرض قائمة الطلاب هنا
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الدورة</CardTitle>
                <CardDescription>
                  تحليلات مفصلة حول أداء الدورة والطلاب
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 py-8">
                  سيتم عرض الإحصائيات والتحليلات هنا
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
