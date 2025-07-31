
-- File uploads table for content management
CREATE TABLE IF NOT EXISTS public.file_uploads (
    id TEXT PRIMARY KEY,
    original_name TEXT NOT NULL,
    file_name TEXT NOT NULL UNIQUE,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
    file_type TEXT NOT NULL CHECK (file_type IN ('video', 'document', 'image', 'audio', 'other')),
    is_public BOOLEAN DEFAULT false,
    upload_status TEXT DEFAULT 'completed' CHECK (upload_status IN ('uploading', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_file_uploads_lesson_id ON public.file_uploads(lesson_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_course_id ON public.file_uploads(course_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_uploaded_by ON public.file_uploads(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_file_uploads_file_type ON public.file_uploads(file_type);

-- Enable RLS
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view files they uploaded" ON public.file_uploads
    FOR SELECT USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can view public files" ON public.file_uploads
    FOR SELECT USING (is_public = true);

CREATE POLICY "Teachers can view files in their courses" ON public.file_uploads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() 
            AND p.role IN ('TEACHER', 'ADMIN')
        )
    );

CREATE POLICY "Users can upload files" ON public.file_uploads
    FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own files" ON public.file_uploads
    FOR UPDATE USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own files" ON public.file_uploads
    FOR DELETE USING (auth.uid() = uploaded_by);

-- Trigger for updated_at
CREATE TRIGGER update_file_uploads_updated_at 
    BEFORE UPDATE ON public.file_uploads
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
