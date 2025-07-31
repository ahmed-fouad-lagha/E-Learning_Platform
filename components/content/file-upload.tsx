
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Upload, File, Video, Image, FileText, Volume2 } from 'lucide-react';

interface FileUploadProps {
  onFileUploaded: (file: UploadedFile) => void;
  courseId?: string;
  lessonId?: string;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
}

interface UploadedFile {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

const FileTypeIcon = ({ mimeType }: { mimeType: string }) => {
  if (mimeType.startsWith('video/')) return <Video className="h-4 w-4" />;
  if (mimeType.startsWith('image/')) return <Image className="h-4 w-4" />;
  if (mimeType.startsWith('audio/')) return <Volume2 className="h-4 w-4" />;
  if (mimeType.includes('pdf') || mimeType.includes('document')) return <FileText className="h-4 w-4" />;
  return <File className="h-4 w-4" />;
};

export default function FileUpload({
  onFileUploaded,
  courseId,
  lessonId,
  acceptedFileTypes = ['video/*', 'image/*', 'application/pdf', '.doc', '.docx'],
  maxFileSize = 500 * 1024 * 1024, // 500MB
  multiple = false
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (courseId) formData.append('courseId', courseId);
      if (lessonId) formData.append('lessonId', lessonId);

      // Simulate progress (since we can't get real progress from fetch)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'خطأ في رفع الملف');
      }

      const result = await response.json();
      
      if (result.success) {
        const uploadedFile = result.data;
        setUploadedFiles(prev => [...prev, uploadedFile]);
        onFileUploaded(uploadedFile);
      } else {
        throw new Error(result.error || 'خطأ في رفع الملف');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في رفع الملف');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      await uploadFile(file);
      if (!multiple) break; // Only upload one file if multiple is false
    }
  }, [courseId, lessonId, multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: maxFileSize,
    multiple,
    disabled: uploading
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.fileId !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">اسحب الملفات هنا...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  اسحب الملفات هنا أو انقر للاختيار
                </p>
                <p className="text-sm text-gray-500">
                  الحد الأقصى: {formatFileSize(maxFileSize)}
                </p>
              </div>
            )}
          </div>

          {uploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="mb-2" />
              <p className="text-sm text-gray-600 text-center">
                جاري رفع الملف... {uploadProgress}%
              </p>
            </div>
          )}

          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">الملفات المرفوعة:</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.fileId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <FileTypeIcon mimeType={file.mimeType} />
                    <div>
                      <p className="font-medium text-sm">{file.fileName}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.fileSize)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.fileId)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
