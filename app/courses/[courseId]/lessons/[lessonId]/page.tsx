'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  PlayCircle, 
  PauseCircle, 
  Download, 
  BookOpen, 
  Clock, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Play,
  FileText,
  MessageCircle,
  List
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { FilePreview } from '@/components/content/file-preview'
import { LessonFiles } from '@/components/content/lesson-files'
import { useProgressTracking } from '@/hooks/use-progress-tracking'
import { toast } from 'sonner'
import RichTextEditor from '@/components/content/rich-text-editor';

interface Lesson {
  id: string
  title: string
  title_ar: string
  content: string
  content_ar: string
  order_num: number
  duration: number
  video_url?: string
  audio_url?: string
  course_id: string
}

interface Course {
  id: string
  title: string
  title_ar: string
  description: string
  description_ar: string
  thumbnail?: string
}

interface LessonFile {
  id: string
  original_name: string
  file_name: string
  mime_type: string
  file_size: number
  file_url: string
  file_type: string
  is_public: boolean
}

interface LessonProgress {
  id: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  progress_percentage: number
  time_spent_seconds: number
  video_progress_seconds?: number
  completed_at?: string
}

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
  const { user, session } = useAuth()
  const router = useRouter();

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [files, setFiles] = useState<LessonFile[]>([])
  const [lessonProgress, setLessonProgress] = useState<LessonProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [startTime, setStartTime] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null)
  const progressUpdateRef = useRef<NodeJS.Timeout>()

  const {
    markLessonViewed,
    markLessonCompleted,
    updateVideoProgress,
    getLessonProgress
  } = useProgressTracking()

  useEffect(() => {
    if (session && courseId && lessonId) {
      loadLessonData()
      loadLessonProgress()
      setStartTime(Date.now())

      // Mark lesson as viewed when page loads
      markLessonViewed(lessonId, courseId)
    }
  }, [session, courseId, lessonId])

  // Auto-save progress periodically
  useEffect(() => {
    if (videoRef.current && isPlaying && lesson) {
      progressUpdateRef.current = setInterval(() => {
        const video = videoRef.current
        if (video && !video.paused) {
          const currentProgress = (video.currentTime / video.duration) * 100
          if (currentProgress > 0) {
            updateVideoProgress(lessonId, courseId, video.currentTime, video.duration)
          }
        }
      }, 10000) // Update every 10 seconds

      return () => {
        if (progressUpdateRef.current) {
          clearInterval(progressUpdateRef.current)
        }
      }
    }
  }, [isPlaying, lesson, lessonId, courseId, updateVideoProgress])

  // Save progress when component unmounts
  useEffect(() => {
    return () => {
      if (startTime > 0) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000)
        if (timeSpent > 10) { // Only save if spent more than 10 seconds
          markLessonViewed(lessonId, courseId)
        }
      }
    }
  }, [startTime, lessonId, courseId, markLessonViewed])

  const loadLessonData = async () => {
    try {
      setIsLoading(true);
      // Load lesson details
      // const lessonResponse = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
      //   headers: {
      //     'Authorization': `Bearer ${session?.access_token}`
      //   }
      // })

      // if (lessonResponse.ok) {
      //   const lessonData = await lessonResponse.json()
      //   setLesson(lessonData.data.lesson)
      //   setCourse(lessonData.data.course)
      // }

      // // Load lesson files
      // const filesResponse = await fetch(`/api/lessons/${lessonId}/files`, {
      //   headers: {
      //     'Authorization': `Bearer ${session?.access_token}`
      //   }
      // })

      // if (filesResponse.ok) {
      //   const filesData = await filesResponse.json()
      //   setFiles(filesData.data || [])
      // }
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

    } catch (error) {
      console.error('Error loading lesson:', error)
      setError('فشل في تحميل الدرس');
    } finally {
      setIsLoading(false);
    }
  }

  const loadLessonProgress = async () => {
    try {
      const progressData = await getLessonProgress(courseId, lessonId)
      if (progressData && progressData.length > 0) {
        setLessonProgress(progressData[0])
        setIsCompleted(progressData[0].status === 'COMPLETED')

        // Restore video progress if available
        if (progressData[0].video_progress_seconds && videoRef.current) {
          videoRef.current.currentTime = progressData[0].video_progress_seconds
        }
      }
    } catch (error) {
      console.error('Error loading lesson progress:', error)
    }
  }

  const handleMarkComplete = async () => {
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      const result = await markLessonCompleted(lessonId, courseId, timeSpent)

      if (result) {
        setIsCompleted(true)
        setLessonProgress(prev => ({
          ...prev!,
          status: 'COMPLETED',
          progress_percentage: 100,
          completed_at: new Date().toISOString()
        }))
        toast.success('تم إنجاز الدرس بنجاح! 🎉')
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error)
      toast.error('خطأ في حفظ التقدم')
    }
  }

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link 
                href={`/courses/${courseId}`}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowRight className="h-5 w-5 ml-2" />
                العودة للدورة
              </Link>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              {lessonProgress && (
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Badge variant={isCompleted ? "default" : lessonProgress.status === 'IN_PROGRESS' ? "secondary" : "outline"}>
                    {isCompleted ? (
                      <>
                        <CheckCircle className="h-3 w-3 ml-1" />
                        مكتمل
                      </>
                    ) : lessonProgress.status === 'IN_PROGRESS' ? (
                      'جاري التعلم'
                    ) : (
                      'لم يبدأ'
                    )}
                  </Badge>
                  {!isCompleted && lessonProgress.progress_percentage > 0 && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Progress value={lessonProgress.progress_percentage} className="w-20 h-2" />
                      <span className="text-xs text-gray-600">
                        {Math.round(lessonProgress.progress_percentage)}%
                      </span>
                    </div>
                  )}
                </div>
              )}
              {/* <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{lesson.duration} دقيقة</span>
              </div> */}
            </div>
          </div>

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
              onClick={() => {}}
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
            <div className="prose prose-lg max-w-none" dir="rtl">
                {/* <div dangerouslySetInnerHTML={{ __html: lesson.content_ar || lesson.content }} /> */}
              </div>

              {!isCompleted && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-800">هل أنهيت هذا الدرس؟</h4>
                      <p className="text-sm text-green-600 mt-1">
                        قم بوضع علامة كمكتمل لتتبع تقدمك والانتقال للدرس التالي
                      </p>
                    </div>
                    <Button 
                      onClick={handleMarkComplete}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 ml-2" />
                      إنهاء الدرس
                    </Button>
                  </div>
                </div>
              )}

              {isCompleted && (
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-600 ml-2" />
                    <div>
                      <h4 className="font-medium text-blue-800">تم إنجاز الدرس! 🎉</h4>
                      <p className="text-sm text-blue-600 mt-1">
                        أحسنت! يمكنك الآن الانتقال للدرس التالي أو مراجعة المحتوى
                      </p>
                    </div>
                  </div>
                </div>
              )}

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