
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import LessonList from '@/components/content/lesson-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, BookOpen, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  subject: string;
  grade: string;
  totalLessons: number;
  isPublished: boolean;
}

interface Lesson {
  id: string;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  order: number;
  duration: number;
  videoUrl?: string;
  audioUrl?: string;
  isPublished: boolean;
  attachedFiles?: string[];
  _count: {
    progress: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default function CourseLessonsPage({ params }: PageProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setCourseId(resolvedParams.courseId);
    }
    getParams();
  }, [params]);

  useEffect(() => {
    if (courseId) {
      fetchCourseAndLessons();
    }
  }, [courseId]);

  const fetchCourseAndLessons = async () => {
    if (!courseId) return;
    
    setLoading(true);
    setError(null);

    try {
      // Fetch course details
      const courseResponse = await fetch(`/api/courses/${courseId}`);
      const courseResult = await courseResponse.json();

      if (!courseResult.success) {
        throw new Error(courseResult.error || 'خطأ في جلب تفاصيل الدورة');
      }

      setCourse(courseResult.data);

      // Fetch lessons
      const lessonsResponse = await fetch(`/api/courses/${courseId}/lessons`);
      const lessonsResult = await lessonsResponse.json();

      if (lessonsResult.success) {
        setLessons(lessonsResult.data || []);
      } else {
        throw new Error(lessonsResult.error || 'خطأ في جلب الدروس');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (authLoading || loading || !courseId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check authentication and permissions
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            يجب تسجيل الدخول للوصول إلى هذه الصفحة
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          onClick={() => router.push('/admin/courses')} 
          className="mt-4"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          العودة إلى الدورات
        </Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>الدورة غير موجودة</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/admin/courses/${courseId}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              العودة إلى الدورة
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{course.titleAr}</h1>
              <p className="text-gray-600">{course.title}</p>
            </div>
          </div>
          <Link href={`/admin/courses/${courseId}/lessons/create`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              إضافة درس جديد
            </Button>
          </Link>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">إجمالي الدروس</p>
                  <p className="text-2xl font-bold">{lessons.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <BookOpen className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">الدروس المنشورة</p>
                  <p className="text-2xl font-bold">
                    {lessons.filter(l => l.isPublished).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <BookOpen className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">المسودات</p>
                  <p className="text-2xl font-bold">
                    {lessons.filter(l => !l.isPublished).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <BookOpen className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">إجمالي المدة</p>
                  <p className="text-2xl font-bold">
                    {Math.ceil(lessons.reduce((acc, l) => acc + l.duration, 0) / 60)}س
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Information */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات الدورة</CardTitle>
            <CardDescription>تفاصيل الدورة والإعدادات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">الموضوع</p>
                <p className="text-gray-600">{course.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium">المستوى</p>
                <p className="text-gray-600">{course.grade}</p>
              </div>
              <div>
                <p className="text-sm font-medium">حالة النشر</p>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                  course.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {course.isPublished ? 'منشورة' : 'مسودة'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">عدد الدروس المسجل</p>
                <p className="text-gray-600">{course.totalLessons}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons List */}
        <LessonList 
          courseId={courseId}
          lessons={lessons}
          onLessonUpdate={fetchCourseAndLessons}
        />
      </div>
    </div>
  );
}
