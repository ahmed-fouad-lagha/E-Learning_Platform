
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FileUpload from './file-upload';
import { Save, Eye, Upload, BookOpen, Target, Brain } from 'lucide-react';

interface LessonEditorProps {
  courseId: string;
  lessonId?: string;
  initialData?: Partial<LessonData>;
  onSave: (data: LessonData) => Promise<void>;
  onPreview?: (data: LessonData) => void;
}

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

export default function LessonEditor({
  courseId,
  lessonId,
  initialData,
  onSave,
  onPreview
}: LessonEditorProps) {
  const [lessonData, setLessonData] = useState<LessonData>({
    title: '',
    titleAr: '',
    content: '',
    contentAr: '',
    objectives: '',
    objectivesAr: '',
    duration: 60,
    order: 1,
    videoUrl: '',
    audioUrl: '',
    attachedFiles: [],
    isPublished: false,
    exercises: '',
    exercisesAr: '',
    ...initialData
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof LessonData, value: any) => {
    setLessonData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUploaded = (file: any) => {
    setLessonData(prev => ({
      ...prev,
      attachedFiles: [...prev.attachedFiles, file.fileId]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      // Validation
      if (!lessonData.title.trim() || !lessonData.titleAr.trim()) {
        throw new Error('عنوان الدرس مطلوب بالعربية والإنجليزية');
      }

      if (!lessonData.content.trim() || !lessonData.contentAr.trim()) {
        throw new Error('محتوى الدرس مطلوب بالعربية والإنجليزية');
      }

      await onSave(lessonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في حفظ الدرس');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(lessonData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {lessonId ? 'تعديل الدرس' : 'إنشاء درس جديد'}
          </h1>
          <p className="text-gray-600">
            إنشاء وإدارة محتوى الدرس التعليمي
          </p>
        </div>
        <div className="flex gap-2">
          {onPreview && (
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              معاينة
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'جاري الحفظ...' : 'حفظ الدرس'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">
            <BookOpen className="h-4 w-4 mr-2" />
            المعلومات الأساسية
          </TabsTrigger>
          <TabsTrigger value="content">
            <Upload className="h-4 w-4 mr-2" />
            المحتوى والملفات
          </TabsTrigger>
          <TabsTrigger value="objectives">
            <Target className="h-4 w-4 mr-2" />
            الأهداف
          </TabsTrigger>
          <TabsTrigger value="exercises">
            <Brain className="h-4 w-4 mr-2" />
            التمارين
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية</CardTitle>
              <CardDescription>
                معلومات الدرس الأساسية والإعدادات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">العنوان (إنجليزي)</Label>
                  <Input
                    id="title"
                    value={lessonData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Lesson title in English"
                  />
                </div>
                <div>
                  <Label htmlFor="titleAr">العنوان (عربي)</Label>
                  <Input
                    id="titleAr"
                    value={lessonData.titleAr}
                    onChange={(e) => handleInputChange('titleAr', e.target.value)}
                    placeholder="عنوان الدرس بالعربية"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">مدة الدرس (دقيقة)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={lessonData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 60)}
                    min="1"
                    max="300"
                  />
                </div>
                <div>
                  <Label htmlFor="order">ترتيب الدرس</Label>
                  <Input
                    id="order"
                    type="number"
                    value={lessonData.order}
                    onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="isPublished"
                    checked={lessonData.isPublished}
                    onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
                  />
                  <Label htmlFor="isPublished">نشر الدرس</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="videoUrl">رابط الفيديو (اختياري)</Label>
                  <Input
                    id="videoUrl"
                    value={lessonData.videoUrl}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <Label htmlFor="audioUrl">رابط الصوت (اختياري)</Label>
                  <Input
                    id="audioUrl"
                    value={lessonData.audioUrl}
                    onChange={(e) => handleInputChange('audioUrl', e.target.value)}
                    placeholder="https://soundcloud.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>محتوى الدرس</CardTitle>
                <CardDescription>
                  المحتوى النصي للدرس بالعربية والإنجليزية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="content">المحتوى (إنجليزي)</Label>
                  <Textarea
                    id="content"
                    value={lessonData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Lesson content in English..."
                    rows={8}
                  />
                </div>
                <div>
                  <Label htmlFor="contentAr">المحتوى (عربي)</Label>
                  <Textarea
                    id="contentAr"
                    value={lessonData.contentAr}
                    onChange={(e) => handleInputChange('contentAr', e.target.value)}
                    placeholder="محتوى الدرس بالعربية..."
                    rows={8}
                    dir="rtl"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>رفع الملفات</CardTitle>
                <CardDescription>
                  رفع ملفات الدرس (فيديوهات، مستندات، صور)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileUploaded={handleFileUploaded}
                  courseId={courseId}
                  lessonId={lessonId}
                  multiple={true}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="objectives">
          <Card>
            <CardHeader>
              <CardTitle>أهداف الدرس</CardTitle>
              <CardDescription>
                الأهداف التعليمية التي سيحققها الطلاب
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="objectives">الأهداف (إنجليزي)</Label>
                <Textarea
                  id="objectives"
                  value={lessonData.objectives}
                  onChange={(e) => handleInputChange('objectives', e.target.value)}
                  placeholder="Learning objectives in English..."
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="objectivesAr">الأهداف (عربي)</Label>
                <Textarea
                  id="objectivesAr"
                  value={lessonData.objectivesAr}
                  onChange={(e) => handleInputChange('objectivesAr', e.target.value)}
                  placeholder="الأهداف التعليمية بالعربية..."
                  rows={6}
                  dir="rtl"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises">
          <Card>
            <CardHeader>
              <CardTitle>تمارين الدرس</CardTitle>
              <CardDescription>
                التمارين والأنشطة التفاعلية (تنسيق JSON)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="exercises">التمارين (إنجليزي)</Label>
                <Textarea
                  id="exercises"
                  value={lessonData.exercises}
                  onChange={(e) => handleInputChange('exercises', e.target.value)}
                  placeholder='{"questions": [{"question": "What is...?", "type": "multiple_choice", "options": ["A", "B", "C"], "correct": 0}]}'
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="exercisesAr">التمارين (عربي)</Label>
                <Textarea
                  id="exercisesAr"
                  value={lessonData.exercisesAr}
                  onChange={(e) => handleInputChange('exercisesAr', e.target.value)}
                  placeholder='{"questions": [{"question": "ما هو...؟", "type": "multiple_choice", "options": ["أ", "ب", "ج"], "correct": 0}]}'
                  rows={6}
                  dir="rtl"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
