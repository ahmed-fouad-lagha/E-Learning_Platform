'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText } from 'lucide-react';
import FilePreview from './file-preview';

interface LessonFile {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  fileType: string;
  isPublic: boolean;
  uploadedAt: string;
}

interface LessonFilesProps {
  lessonId: string;
  canManage?: boolean;
}

function LessonFiles({ lessonId, canManage = false }: LessonFilesProps) {
  const [files, setFiles] = useState<LessonFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, [lessonId]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/lessons/${lessonId}/files`);
      const data = await response.json();

      if (data.success) {
        setFiles(data.data || []);
      } else {
        setError(data.error || 'فشل في تحميل الملفات');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>جاري تحميل الملفات...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (files.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            ملفات الدرس
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            لا توجد ملفات مرفقة مع هذا الدرس
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          ملفات الدرس ({files.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {files.map((file) => (
            <div key={file.id} className="p-3 border rounded-lg">
              <FilePreview
                fileId={file.id}
                fileName={file.originalName}
                mimeType={file.mimeType}
                fileSize={file.fileSize}
                isPublic={file.isPublic}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default LessonFiles
export { LessonFiles }