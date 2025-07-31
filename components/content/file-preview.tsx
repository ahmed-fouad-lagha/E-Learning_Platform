
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Eye, 
  X, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Volume2,
  File 
} from 'lucide-react';

interface FilePreviewProps {
  fileId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  isPublic?: boolean;
}

const FileTypeIcon = ({ mimeType }: { mimeType: string }) => {
  if (mimeType.startsWith('video/')) return <Video className="h-4 w-4" />;
  if (mimeType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
  if (mimeType.startsWith('audio/')) return <Volume2 className="h-4 w-4" />;
  if (mimeType.includes('pdf') || mimeType.includes('document')) return <FileText className="h-4 w-4" />;
  return <File className="h-4 w-4" />;
};

export default function FilePreview({ 
  fileId, 
  fileName, 
  mimeType, 
  fileSize,
  isPublic = false 
}: FilePreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isPreviewable = () => {
    return (
      mimeType.startsWith('image/') ||
      mimeType.startsWith('video/') ||
      mimeType.startsWith('audio/') ||
      mimeType === 'application/pdf' ||
      mimeType.startsWith('text/')
    );
  };

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/files/${fileId}?download=true`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في تحميل الملف');
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في تحميل الملف');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPreview = () => {
    const fileUrl = `/api/files/${fileId}`;

    if (mimeType.startsWith('image/')) {
      return (
        <div className="flex justify-center">
          <img 
            src={fileUrl} 
            alt={fileName}
            className="max-w-full max-h-96 object-contain"
            onError={() => setError('فشل في تحميل الصورة')}
          />
        </div>
      );
    }

    if (mimeType.startsWith('video/')) {
      return (
        <video 
          controls 
          className="w-full max-h-96"
          onError={() => setError('فشل في تحميل الفيديو')}
        >
          <source src={fileUrl} type={mimeType} />
          متصفحك لا يدعم تشغيل الفيديو
        </video>
      );
    }

    if (mimeType.startsWith('audio/')) {
      return (
        <div className="p-8">
          <audio 
            controls 
            className="w-full"
            onError={() => setError('فشل في تحميل الملف الصوتي')}
          >
            <source src={fileUrl} type={mimeType} />
            متصفحك لا يدعم تشغيل الملفات الصوتية
          </audio>
        </div>
      );
    }

    if (mimeType === 'application/pdf') {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-96"
          title={fileName}
          onError={() => setError('فشل في تحميل ملف PDF')}
        />
      );
    }

    if (mimeType.startsWith('text/')) {
      return (
        <div className="p-4 bg-gray-50 rounded max-h-96 overflow-auto">
          <iframe
            src={fileUrl}
            className="w-full h-80 border-0"
            title={fileName}
            onError={() => setError('فشل في تحميل النص')}
          />
        </div>
      );
    }

    return (
      <div className="p-8 text-center text-gray-500">
        <FileText className="mx-auto h-16 w-16 mb-4" />
        <p>معاينة غير متاحة لهذا النوع من الملفات</p>
        <p className="text-sm mt-2">يمكنك تحميل الملف لعرضه</p>
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 flex-1">
        <FileTypeIcon mimeType={mimeType} />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{fileName}</p>
          <p className="text-xs text-gray-500">{formatFileSize(fileSize)}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {isPreviewable() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreviewOpen(true)}
            disabled={isLoading}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          disabled={isLoading}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{fileName}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreviewOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            renderPreview()
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              تحميل الملف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
