-- Complete table recreation script
-- Use this if the lessons table has wrong structure

-- Drop and recreate lessons table with correct structure
DROP TABLE IF EXISTS public.lessons CASCADE;

CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    content TEXT NOT NULL,
    content_ar TEXT NOT NULL,
    video_url TEXT,
    audio_url TEXT,
    order_num INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    download_size INTEGER,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Create policies for lessons
CREATE POLICY "Anyone can view published lessons" ON public.lessons
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage lessons" ON public.lessons
    FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order_num ON public.lessons(course_id, order_num);

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'lessons' 
AND table_schema = 'public'
ORDER BY ordinal_position;
