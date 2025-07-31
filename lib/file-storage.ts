
import { Client } from '@replit/object-storage';

// Initialize Replit Object Storage client
const storage = new Client();

export interface FileUploadResult {
  success: boolean;
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  error?: string;
}

export interface FileMetadata {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  courseId?: string;
  lessonId?: string;
  fileType: 'video' | 'document' | 'image' | 'audio' | 'other';
}

// Allowed file types for different content
export const ALLOWED_FILE_TYPES = {
  video: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  audio: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg']
};

export const MAX_FILE_SIZES = {
  video: 500 * 1024 * 1024, // 500MB
  document: 50 * 1024 * 1024, // 50MB
  image: 10 * 1024 * 1024, // 10MB
  audio: 100 * 1024 * 1024 // 100MB
};

export function getFileType(mimeType: string): 'video' | 'document' | 'image' | 'audio' | 'other' {
  for (const [type, mimes] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (mimes.includes(mimeType)) {
      return type as 'video' | 'document' | 'image' | 'audio';
    }
  }
  return 'other';
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const fileType = getFileType(file.type);
  
  if (fileType === 'other') {
    return { valid: false, error: 'نوع الملف غير مدعوم' };
  }
  
  const maxSize = MAX_FILE_SIZES[fileType];
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `حجم الملف كبير جداً. الحد الأقصى: ${Math.round(maxSize / (1024 * 1024))}MB` 
    };
  }
  
  return { valid: true };
}

export async function uploadFile(
  file: File, 
  userId: string, 
  options?: { courseId?: string; lessonId?: string }
): Promise<FileUploadResult> {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        fileId: '',
        fileName: '',
        fileUrl: '',
        fileSize: 0,
        mimeType: '',
        error: validation.error
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}_${timestamp}.${fileExtension}`;
    const fileId = `file_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;

    // Upload to Replit Object Storage
    const buffer = await file.arrayBuffer();
    await storage.uploadFromBytes(fileName, new Uint8Array(buffer));

    // Create file URL (assuming Replit Object Storage provides URLs)
    const fileUrl = `https://objectstorage.replit.com/${fileName}`;

    // Store metadata in database
    const { supabase } = await import('./supabase');
    const { error: dbError } = await supabase
      .from('file_uploads')
      .insert([{
        id: fileId,
        original_name: file.name,
        file_name: fileName,
        mime_type: file.type,
        file_size: file.size,
        uploaded_by: userId,
        course_id: options?.courseId,
        lesson_id: options?.lessonId,
        file_type: getFileType(file.type),
        file_url: fileUrl
      }]);

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway, file is uploaded
    }

    return {
      success: true,
      fileId,
      fileName,
      fileUrl,
      fileSize: file.size,
      mimeType: file.type
    };

  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      fileId: '',
      fileName: '',
      fileUrl: '',
      fileSize: 0,
      mimeType: '',
      error: 'خطأ في رفع الملف'
    };
  }
}

export async function deleteFile(fileId: string, userId: string): Promise<boolean> {
  try {
    const { supabase } = await import('./supabase');
    
    // Get file info
    const { data: fileData, error: fetchError } = await supabase
      .from('file_uploads')
      .select('file_name, uploaded_by')
      .eq('id', fileId)
      .single();

    if (fetchError || !fileData) {
      return false;
    }

    // Check ownership (or admin permissions)
    if (fileData.uploaded_by !== userId) {
      // TODO: Add admin check here
      return false;
    }

    // Delete from Object Storage
    await storage.delete(fileData.file_name);

    // Delete from database
    const { error: deleteError } = await supabase
      .from('file_uploads')
      .delete()
      .eq('id', fileId);

    return !deleteError;

  } catch (error) {
    console.error('File deletion error:', error);
    return false;
  }
}

export async function getFilesByLesson(lessonId: string): Promise<FileMetadata[]> {
  try {
    const { supabase } = await import('./supabase');
    
    const { data, error } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(file => ({
      id: file.id,
      originalName: file.original_name,
      fileName: file.file_name,
      mimeType: file.mime_type,
      fileSize: file.file_size,
      uploadedBy: file.uploaded_by,
      uploadedAt: new Date(file.uploaded_at),
      courseId: file.course_id,
      lessonId: file.lesson_id,
      fileType: file.file_type
    }));

  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
}
