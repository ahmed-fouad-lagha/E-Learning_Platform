
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import LessonEditor from '@/components/content/lesson-editor';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';

interface LessonData {
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  objectives?: string;
  objectivesAr?: string;
  duration: number;
  order: number;
  videoUrl?: string;
  audioUrl?: string;
  attachedFiles: string[];
  isPublished: boolean;
  exercises?: string;
  exercisesAr?: string;
}

interface PageProps {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export default function EditLessonPage({ params }: PageProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<Partial<LessonData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setCourseId(resolvedParams.courseId);
      setLessonId(resolvedParams.lessonId);
    }
    getParams();
  }, [params]);

  useEffect(() => {
    if (courseId && lessonId) {
      fetchLessonData();
    }
  }, [courseId, lessonId]);

  const fetchLessonData = async () => {
    if (!courseId || !lessonId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`);
      const result = await response.json();

      if (result.success) {
        const lesson = result.data;
        setInitialData({
          title: lesson.title,
          titleAr: lesson.titleAr,
          content: lesson.content,
          contentAr: lesson.contentAr,
          objectives: lesson.objectives,
          objectivesAr: lesson.objectivesAr,
          duration: lesson.duration,
          order: lesson.order,
          videoUrl: lesson.videoUrl || '',
          audioUrl: lesson.audioUrl || '',
          attachedFiles: lesson.attachedFiles || [],
          isPublished: lesson.isPublished,
          exercises: lesson.exercises,
          exercisesAr: lesson.exercisesAr
        });
      } else {
        throw new Error(result.error || 'خطأ في جلب بيانات الدرس');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLesson = async (lessonData: LessonData) => {
    if (!courseId || !lessonId) {
      throw new Error('معرف الدورة أو الدرس غير صحيح');
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'خطأ في تحديث الدرس');
      }

      const result = await response.json();
      
      if (result.success) {
        // Redirect back to lessons page
        router.push(`/admin/courses/${courseId}/lessons`);
      } else {
        throw new Error(result.error || 'خطأ في تحديث الدرس');
      }
    } catch (error) {
      throw error; // Let LessonEditor handle the error display
    }
  };

  const handlePreviewLesson = (lessonData: LessonData) => {
    // Store lesson data in sessionStorage for preview
    sessionStorage.setItem('previewLesson', JSON.stringify(lessonData));
    // Open preview in new tab
    window.open(`/courses/${courseId}/lessons/${lessonId}`, '_blank');
  };

  // Show loading state
  if (authLoading || loading || !courseId || !lessonId) {
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
          onClick={() => router.push(`/admin/courses/${courseId}/lessons`)} 
          className="mt-4"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          العودة إلى الدروس
        </Button>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>الدرس غير موجود</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/admin/courses/${courseId}/lessons`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            العودة إلى الدروس
          </Button>
        </div>
      </div>

      <LessonEditor
        courseId={courseId}
        lessonId={lessonId}
        initialData={initialData}
        onSave={handleSaveLesson}
        onPreview={handlePreviewLesson}
      />
    </div>
  );
}
