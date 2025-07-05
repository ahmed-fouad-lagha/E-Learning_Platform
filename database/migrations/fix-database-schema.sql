-- Complete database schema fix and column standardization
-- This script will add ALL missing columns and handle naming inconsistencies

-- =============================================================================
-- EXAMS TABLE - Add all missing columns
-- =============================================================================
DO $$ 
BEGIN
    -- Add total_marks column (standard name)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'total_marks' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.exams ADD COLUMN total_marks INTEGER NOT NULL DEFAULT 100;
        RAISE NOTICE 'Added total_marks column to exams table';
    END IF;

    -- Add total_points column (alternative name used in curriculum-exams.sql)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'total_points' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.exams ADD COLUMN total_points INTEGER DEFAULT 100;
        RAISE NOTICE 'Added total_points column to exams table';
    END IF;

    -- Add difficulty column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'difficulty' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.exams ADD COLUMN difficulty TEXT DEFAULT 'BAC_LEVEL' CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'BAC_LEVEL'));
        RAISE NOTICE 'Added difficulty column to exams table';
    END IF;

    -- Add instructions column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'instructions' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.exams ADD COLUMN instructions TEXT;
        RAISE NOTICE 'Added instructions column to exams table';
    END IF;

    -- Add instructions_ar column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'instructions_ar' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.exams ADD COLUMN instructions_ar TEXT;
        RAISE NOTICE 'Added instructions_ar column to exams table';
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
        ALTER TABLE public.exams ADD COLUMN exam_type TEXT DEFAULT 'PRACTICE' CHECK (exam_type IN ('PRACTICE', 'BAC_SIMULATION', 'QUIZ', 'MOCK_EXAM', 'FINAL_EXAM'));
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
-- LESSONS TABLE - Add all missing columns
-- =============================================================================
DO $$ 
BEGIN
    -- Add order_num column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lessons' AND column_name = 'order_num' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lessons ADD COLUMN order_num INTEGER NOT NULL DEFAULT 1;
        RAISE NOTICE 'Added order_num column to lessons table';
    END IF;

    -- Add video_url column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lessons' AND column_name = 'video_url' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lessons ADD COLUMN video_url TEXT;
        RAISE NOTICE 'Added video_url column to lessons table';
    END IF;

    -- Add audio_url column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lessons' AND column_name = 'audio_url' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lessons ADD COLUMN audio_url TEXT;
        RAISE NOTICE 'Added audio_url column to lessons table';
    END IF;

    -- Add download_size column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lessons' AND column_name = 'download_size' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lessons ADD COLUMN download_size INTEGER;
        RAISE NOTICE 'Added download_size column to lessons table';
    END IF;

    -- Add learning_objectives column (used in lesson files)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lessons' AND column_name = 'learning_objectives' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lessons ADD COLUMN learning_objectives TEXT;
        RAISE NOTICE 'Added learning_objectives column to lessons table';
    END IF;

    -- Add learning_objectives_ar column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lessons' AND column_name = 'learning_objectives_ar' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lessons ADD COLUMN learning_objectives_ar TEXT;
        RAISE NOTICE 'Added learning_objectives_ar column to lessons table';
    END IF;

    -- Add difficulty column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lessons' AND column_name = 'difficulty' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lessons ADD COLUMN difficulty TEXT DEFAULT 'INTERMEDIATE' CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'BAC_LEVEL'));
        RAISE NOTICE 'Added difficulty column to lessons table';
    END IF;
END $$;

-- =============================================================================
-- COURSES TABLE - Add missing columns
-- =============================================================================
DO $$ 
BEGIN
    -- Add bac_relevance column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'bac_relevance' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.courses ADD COLUMN bac_relevance DECIMAL(3,2) DEFAULT 0 CHECK (bac_relevance >= 0 AND bac_relevance <= 1);
        RAISE NOTICE 'Added bac_relevance column to courses table';
    END IF;

    -- Add total_lessons column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'total_lessons' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.courses ADD COLUMN total_lessons INTEGER DEFAULT 0;
        RAISE NOTICE 'Added total_lessons column to courses table';
    END IF;

    -- Add estimated_hours column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'estimated_hours' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.courses ADD COLUMN estimated_hours INTEGER DEFAULT 0;
        RAISE NOTICE 'Added estimated_hours column to courses table';
    END IF;

    -- Add curriculum column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'curriculum' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.courses ADD COLUMN curriculum TEXT NOT NULL DEFAULT 'DZ-BAC-2025';
        RAISE NOTICE 'Added curriculum column to courses table';
    END IF;
END $$;

-- =============================================================================
-- VERIFY ALL TABLE STRUCTURES
-- =============================================================================
SELECT '🔍 FINAL TABLE STRUCTURES:' as status;

SELECT 'COURSES TABLE:' as table_name;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'courses' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'LESSONS TABLE:' as table_name;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'lessons' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'EXAMS TABLE:' as table_name;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'exams' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '✅ ALL DATABASE TABLES ARE NOW READY FOR DATA INSERTION!' as final_status;
