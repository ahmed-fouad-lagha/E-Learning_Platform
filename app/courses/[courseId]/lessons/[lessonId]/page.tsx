'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  FileText,
  MessageCircle,
  List,
  CheckCircle
} from 'lucide-react';
import RichTextEditor from '@/components/content/rich-text-editor';
import LessonFiles from '@/components/content/lesson-files';

interface LessonDetail {
  id: string;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  order: number;
  videoUrl: string | null;
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  courseId: string;
  nextLessonId: string | null;
  prevLessonId: string | null;
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams() as { courseId: string; lessonId: string };
  const { user } = useAuth();
  const router = useRouter();

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fetch lesson details
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setIsLoading(true);

        // Mock API call (replace with actual API)
        // const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`);

        // Mock data for demonstration
        const mockLesson: LessonDetail = {
          id: lessonId,
          title: "Introduction to Algebra",
          titleAr: "مقدمة في الجبر",
          content: "This lesson covers the basics of algebraic expressions...",
          contentAr: "يغطي هذا الدرس أساسيات التعبيرات الجبرية وحل المعادلات البسيطة. سنتعلم كيفية التعامل مع المتغيرات والثوابت وإجراء العمليات الأساسية عليها.\n\nالموضوعات التي سنغطيها:\n1. ما هو الجبر وأهميته\n2. المتغيرات والثوابت\n3. التعبيرات الجبرية\n4. حل المعادلات من الدرجة الأولى\n5. تطبيقات عملية",
          order: 1,
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          attachments: [
            {
              id: "att1",
              name: "ملخص الدرس - الجبر",
              url: "#",
              type: "pdf"
            },
            {
              id: "att2",
              name: "تمارين إضافية",
              url: "#",
              type: "pdf"
            }
          ],
          courseId: courseId,
          nextLessonId: "lesson2",
          prevLessonId: null
        };

        setLesson(mockLesson);

        // Simulate progress
        setProgress(33);
      } catch (err) {
        console.error('Failed to fetch lesson:', err);
        setError('فشل في تحميل الدرس');
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId && lessonId) {
      fetchLesson();
    }
  }, [courseId, lessonId]);

  // Mark lesson as completed
  const markAsCompleted = async () => {
    try {
      // Mock API call
      // await fetch(`/api/courses/${courseId}/lessons/${lessonId}/complete`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${user?.id}`
      //   }
      // });

      // Update progress (mock)
      setProgress(100);

      // Show success message
      alert('تم تسجيل الدرس كمكتمل');

    } catch (err) {
      console.error('Failed to mark lesson as completed:', err);
    }
  };

  // Navigation between lessons
  const navigateToLesson = (targetLessonId: string | null) => {
    if (targetLessonId) {
      router.push(`/courses/${courseId}/lessons/${targetLessonId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">جاري تحميل الدرس...</p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">عذراً، حدث خطأ</h2>
        <p className="text-muted-foreground mb-6">{error || 'لم يتم العثور على الدرس المطلوب'}</p>
        <Button onClick={() => router.push(`/courses/${courseId}`)}>
          العودة إلى صفحة الدورة
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-30 py-4 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/courses/${courseId}`)}
            >
              <ChevronLeft className="mr-1" size={16} />
              العودة للدورة
            </Button>

            <div className="hidden md:block mx-4 h-6 w-px bg-border"></div>

            <div className="hidden md:block">
              <h2 className="font-medium">{lesson.titleAr}</h2>
              <p className="text-xs text-muted-foreground">{lesson.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToLesson(lesson.prevLessonId)}
                disabled={!lesson.prevLessonId}
              >
                <ChevronRight className="ml-1" size={16} />
                الدرس السابق
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToLesson(lesson.nextLessonId)}
                disabled={!lesson.nextLessonId}
              >
                الدرس التالي
                <ChevronLeft className="mr-1" size={16} />
              </Button>
            </div>

            <Button 
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <List size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b p-4">
          <h2 className="font-medium mb-2">{lesson.titleAr}</h2>
          <p className="text-xs text-muted-foreground mb-4">{lesson.title}</p>

          <div className="flex items-center justify-between gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToLesson(lesson.prevLessonId)}
              disabled={!lesson.prevLessonId}
              className="w-1/2"
            >
              <ChevronRight className="ml-1" size={16} />
              الدرس السابق
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToLesson(lesson.nextLessonId)}
              disabled={!lesson.nextLessonId}
              className="w-1/2"
            >
              الدرس التالي
              <ChevronLeft className="mr-1" size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="bg-background">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2">
            <Progress value={progress} className="h-2 flex-1" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {progress}% مكتمل
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-right" dir="rtl">
          {lesson.titleAr}
        </h1>
        <h2 className="text-xl text-muted-foreground mb-6">
          {lesson.title}
        </h2>

        <Tabs defaultValue="video" className="mt-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="video">الفيديو</TabsTrigger>
            <TabsTrigger value="content">المحتوى</TabsTrigger>
            <TabsTrigger value="resources">الموارد</TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="mt-6">
            {lesson.videoUrl ? (
              <div className="aspect-video w-full mb-6">
                <iframe 
                  src={lesson.videoUrl}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title={lesson.title}
                ></iframe>
              </div>
            ) : (
              <div className="aspect-video w-full mb-6 bg-muted flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <Play size={48} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">لا يوجد فيديو لهذا الدرس</p>
                </div>
              </div>
            )}

            <Button
              onClick={markAsCompleted}
              className="mx-auto block"
              disabled={progress === 100}
            >
              <CheckCircle className="mr-2" size={16} />
              {progress === 100 ? 'تم إكمال هذا الدرس' : 'تسجيل كمكتمل'}
            </Button>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            {/* Lesson Content */}
          <Card>
            <CardHeader>
              <CardTitle>محتوى الدرس</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                content={lesson?.contentAr || lesson?.content || 'لا يوجد محتوى متاح'}
                onChange={() => {}} // Read-only
                editable={false}
              />
            </CardContent>
          </Card>

          {/* Lesson Files */}
          <LessonFiles lessonId={lessonId} />
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <h3 className="text-xl font-bold mb-4">مرفقات الدرس</h3>
            <div className="space-y-3">
              {lesson.attachments.map((attachment) => (
                <div 
                  key={attachment.id}
                  className="flex items-center p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <FileText size={20} className="text-primary mr-3" />
                  <div className="flex-1">
                    <p className="font-medium">{attachment.name}</p>
                    <p className="text-xs text-muted-foreground">{attachment.type.toUpperCase()}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={attachment.url} download target="_blank">
                      تحميل
                    </a>
                  </Button>
                </div>
              ))}

              {lesson.attachments.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  لا توجد مرفقات لهذا الدرس
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer navigation */}
      <footer className="bg-card border-t py-4 px-4">
        <div className="container mx-auto flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigateToLesson(lesson.prevLessonId)}
            disabled={!lesson.prevLessonId}
          >
            <ChevronRight className="ml-1" size={16} />
            الدرس السابق
          </Button>

          <Button
            onClick={() => navigateToLesson(lesson.nextLessonId)}
            disabled={!lesson.nextLessonId}
          >
            الدرس التالي
            <ChevronLeft className="mr-1" size={16} />
          </Button>
        </div>
      </footer>
    </div>
  );
}