-- Comprehensive fix for all missing columns in database tables
-- Run this in Supabase SQL Editor to ensure all tables have correct structure

-- =============================================================================
-- FIX LESSONS TABLE
-- =============================================================================
DO $$ 
BEGIN
    -- Add order_num column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lessons' AND column_name = 'order_num' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lessons ADD COLUMN order_num INTEGER NOT NULL DEFAULT 1;
        RAISE NOTICE 'Added order_num column to lessons table';
    END IF;

    -- Add video_url column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lessons' AND column_name = 'video_url' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lessons ADD COLUMN video_url TEXT;
        RAISE NOTICE 'Added video_url column to lessons table';
    END IF;

    -- Add audio_url column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lessons' AND column_name = 'audio_url' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lessons ADD COLUMN audio_url TEXT;
        RAISE NOTICE 'Added audio_url column to lessons table';
    END IF;

    -- Add download_size column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lessons' AND column_name = 'download_size' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lessons ADD COLUMN download_size INTEGER;
        RAISE NOTICE 'Added download_size column to lessons table';
    END IF;
END $$;

-- =============================================================================
-- FIX EXAMS TABLE
-- =============================================================================
DO $$ 
BEGIN
    -- Add total_marks column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'total_marks' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.exams ADD COLUMN total_marks INTEGER NOT NULL DEFAULT 100;
        RAISE NOTICE 'Added total_marks column to exams table';
    END IF;

    -- Add duration column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'duration' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.exams ADD COLUMN duration INTEGER NOT NULL DEFAULT 120;
        RAISE NOTICE 'Added duration column to exams table';
    END IF;

    -- Add exam_type column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'exam_type' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.exams ADD COLUMN exam_type TEXT DEFAULT 'PRACTICE' CHECK (exam_type IN ('PRACTICE', 'BAC_SIMULATION', 'QUIZ', 'MOCK_EXAM'));
        RAISE NOTICE 'Added exam_type column to exams table';
    END IF;

    -- Add course_id column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'course_id' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.exams ADD COLUMN course_id TEXT REFERENCES public.courses(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added course_id column to exams table';
    END IF;
END $$;

-- =============================================================================
-- FIX COURSES TABLE
-- =============================================================================
DO $$ 
BEGIN
    -- Add bac_relevance column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'bac_relevance' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.courses ADD COLUMN bac_relevance DECIMAL(3,2) DEFAULT 0 CHECK (bac_relevance >= 0 AND bac_relevance <= 1);
        RAISE NOTICE 'Added bac_relevance column to courses table';
    END IF;

    -- Add total_lessons column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'total_lessons' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.courses ADD COLUMN total_lessons INTEGER DEFAULT 0;
        RAISE NOTICE 'Added total_lessons column to courses table';
    END IF;

    -- Add estimated_hours column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'estimated_hours' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.courses ADD COLUMN estimated_hours INTEGER DEFAULT 0;
        RAISE NOTICE 'Added estimated_hours column to courses table';
    END IF;

    -- Add curriculum column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'curriculum' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.courses ADD COLUMN curriculum TEXT NOT NULL DEFAULT 'DZ-BAC-2025';
        RAISE NOTICE 'Added curriculum column to courses table';
    END IF;
END $$;

-- =============================================================================
-- VERIFY TABLE STRUCTURES
-- =============================================================================

-- Check lessons table structure
SELECT 'LESSONS TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'lessons' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check exams table structure  
SELECT 'EXAMS TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'exams' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check courses table structure
SELECT 'COURSES TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'courses' AND table_schema = 'public'
ORDER BY ordinal_position;

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================
SELECT '✅ All table structures have been fixed and verified!' as status;
