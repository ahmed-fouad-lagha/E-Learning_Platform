
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import LessonEditor from '@/components/content/lesson-editor';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default function CreateLessonPage({ params }: PageProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [courseId, setCourseId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setCourseId(resolvedParams.courseId);
    }
    getParams();
  }, [params]);

  // Show loading state
  if (loading || !courseId) {
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

  const handleSaveLesson = async (lessonData: any) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'خطأ في إنشاء الدرس');
      }

      const result = await response.json();
      
      if (result.success) {
        // Redirect to course lessons page
        router.push(`/admin/courses/${courseId}/lessons`);
      } else {
        throw new Error(result.error || 'خطأ في إنشاء الدرس');
      }
    } catch (error) {
      throw error; // Let LessonEditor handle the error display
    }
  };

  const handlePreviewLesson = (lessonData: any) => {
    // Store lesson data in sessionStorage for preview
    sessionStorage.setItem('previewLesson', JSON.stringify(lessonData));
    // Open preview in new tab
    window.open(`/admin/courses/${courseId}/lessons/preview`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LessonEditor
        courseId={courseId}
        onSave={handleSaveLesson}
        onPreview={handlePreviewLesson}
      />
    </div>
  );
}
