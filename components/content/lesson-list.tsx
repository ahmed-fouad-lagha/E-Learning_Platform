
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Plus,
  Eye,
  Clock,
  Video,
  FileText,
  Users,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

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

interface LessonListProps {
  courseId: string;
  lessons: Lesson[];
  onLessonUpdate: () => void;
}

export default function LessonList({ courseId, lessons, onLessonUpdate }: LessonListProps) {
  const [sortedLessons, setSortedLessons] = useState<Lesson[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSortedLessons([...lessons].sort((a, b) => a.order - b.order));
  }, [lessons]);

  const handleDeleteLesson = async (lessonId: string) => {
    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        onLessonUpdate();
        setDeleteDialogOpen(false);
        setLessonToDelete(null);
      } else {
        throw new Error(result.error || 'خطأ في حذف الدرس');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في حذف الدرس');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteDialog = (lessonId: string) => {
    setLessonToDelete(lessonId);
    setDeleteDialogOpen(true);
  };

  const moveLessonOrder = async (lessonId: string, direction: 'up' | 'down') => {
    const currentLesson = sortedLessons.find(l => l.id === lessonId);
    if (!currentLesson) return;

    const newOrder = direction === 'up' ? currentLesson.order - 1 : currentLesson.order + 1;
    
    // Check if valid move
    if (newOrder < 1 || newOrder > sortedLessons.length) return;

    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
      });

      if (response.ok) {
        onLessonUpdate();
      }
    } catch (err) {
      setError('خطأ في تغيير ترتيب الدرس');
    }
  };

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.videoUrl) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  if (sortedLessons.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">لا توجد دروس بعد</h3>
          <p className="text-gray-600 mb-4">ابدأ بإنشاء أول درس لهذه الدورة</p>
          <Link href={`/admin/courses/${courseId}/lessons/create`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              إنشاء درس جديد
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">دروس الدورة</h2>
          <p className="text-gray-600">{sortedLessons.length} درس</p>
        </div>
        <Link href={`/admin/courses/${courseId}/lessons/create`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إضافة درس جديد
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {sortedLessons.map((lesson, index) => (
          <Card key={lesson.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse flex-1">
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveLessonOrder(lesson.id, 'up')}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveLessonOrder(lesson.id, 'down')}
                      disabled={index === sortedLessons.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0">
                    {getLessonIcon(lesson)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 space-x-reverse mb-1">
                      <span className="text-sm font-medium text-gray-500">#{lesson.order}</span>
                      <h3 className="font-medium truncate">{lesson.titleAr}</h3>
                      <Badge variant={lesson.isPublished ? 'default' : 'secondary'} className="text-xs">
                        {lesson.isPublished ? 'منشور' : 'مسودة'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate">{lesson.title}</p>
                    
                    <div className="flex items-center space-x-4 space-x-reverse mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Clock className="h-3 w-3" />
                        <span>{lesson.duration} دقيقة</span>
                      </div>
                      {lesson._count.progress > 0 && (
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Users className="h-3 w-3" />
                          <span>{lesson._count.progress} طالب</span>
                        </div>
                      )}
                      {lesson.attachedFiles && lesson.attachedFiles.length > 0 && (
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <FileText className="h-3 w-3" />
                          <span>{lesson.attachedFiles.length} ملف</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/courses/${courseId}/lessons/${lesson.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        معاينة
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/courses/${courseId}/lessons/${lesson.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        تعديل
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => openDeleteDialog(lesson.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذا الدرس؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => lessonToDelete && handleDeleteLesson(lessonToDelete)}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'جاري الحذف...' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
