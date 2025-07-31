// File storage utilities that work in both Replit and Vercel environments
import { createClient } from '@/lib/supabase'

// Check if we're in Replit environment
const isReplitEnvironment = process.env.REPL_ID !== undefined

// Dynamically import Replit object storage only if available
let ReplitObjectStorage: any = null
if (isReplitEnvironment && typeof require !== 'undefined') {
  try {
    ReplitObjectStorage = require('@replit/object-storage')
  } catch (error) {
    console.log('Replit object storage not available, using Supabase storage')
  }
}

export interface UploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

export async function uploadFile(
  file: File,
  folder: string = 'uploads'
): Promise<UploadResult> {
  try {
    // Use Replit object storage if available
    if (ReplitObjectStorage) {
      return await uploadToReplit(file, folder)
    }

    // Fallback to Supabase storage
    return await uploadToSupabase(file, folder)
  } catch (error) {
    console.error('File upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

async function uploadToReplit(file: File, folder: string): Promise<UploadResult> {
  const fileName = `${folder}/${Date.now()}-${file.name}`
  const buffer = await file.arrayBuffer()

  // Initialize Replit Object Storage client
  const storage = new ReplitObjectStorage.Client();

  await storage.uploadFromBytes(fileName, new Uint8Array(buffer));

  return {
    success: true,
    url: `/api/files/${encodeURIComponent(fileName)}`,
    path: fileName
  }
}

async function uploadToSupabase(file: File, folder: string): Promise<UploadResult> {
  const supabase = createClient()
  const fileName = `${folder}/${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from('files')
    .upload(fileName, file)

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('files')
    .getPublicUrl(fileName)

  return {
    success: true,
    url: urlData.publicUrl,
    path: fileName
  }
}

export async function getFile(filePath: string): Promise<ArrayBuffer | null> {
  try {
    // Use Replit object storage if available
    if (ReplitObjectStorage) {

      // Initialize Replit Object Storage client
      const storage = new ReplitObjectStorage.Client();

      const data = await storage.read(filePath)
      return data ? data.buffer : null
    }

    // Fallback to Supabase storage
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from('files')
      .download(filePath)

    if (error || !data) {
      return null
    }

    return await data.arrayBuffer()
  } catch (error) {
    console.error('File retrieval error:', error)
    return null
  }
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    // Use Replit object storage if available
    if (ReplitObjectStorage) {
      // Initialize Replit Object Storage client
      const storage = new ReplitObjectStorage.Client();
      await storage.delete(filePath)
      return true
    }

    // Fallback to Supabase storage
    const supabase = createClient()
    const { error } = await supabase.storage
      .from('files')
      .remove([filePath])

    return !error
  } catch (error) {
    console.error('File deletion error:', error)
    return false
  }
}

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