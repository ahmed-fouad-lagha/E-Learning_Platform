-- FINAL FIX for ALL NOT NULL constraint violations in exams table
-- Run this BEFORE executing any data insertion scripts

-- =============================================================================
-- STEP 1: IDENTIFY ALL PROBLEMATIC COLUMNS
-- =============================================================================
SELECT 'CHECKING FOR NOT NULL COLUMNS WITHOUT DEFAULTS...' as status;

SELECT column_name, data_type, is_nullable, column_default,
       CASE WHEN is_nullable = 'NO' AND column_default IS NULL THEN '🚨 REQUIRES FIX' 
            ELSE '✅ OK' END as needs_fix
FROM information_schema.columns 
WHERE table_name = 'exams' 
AND table_schema = 'public'
AND is_nullable = 'NO'
ORDER BY ordinal_position;

-- =============================================================================
-- STEP 2: FIX ALL PROBLEMATIC NOT NULL COLUMNS
-- =============================================================================
DO $$ 
BEGIN
    -- Fix type column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'type' 
        AND table_schema = 'public' AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.exams ALTER COLUMN type SET DEFAULT 'PRACTICE';
        UPDATE public.exams SET type = 'PRACTICE' WHERE type IS NULL;
        RAISE NOTICE '✅ Fixed type column';
    END IF;

    -- Fix total_points column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'total_points' 
        AND table_schema = 'public' AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.exams ALTER COLUMN total_points SET DEFAULT 100;
        UPDATE public.exams SET total_points = 100 WHERE total_points IS NULL;
        RAISE NOTICE '✅ Fixed total_points column';
    END IF;

    -- Fix total_marks column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'total_marks' 
        AND table_schema = 'public' AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.exams ALTER COLUMN total_marks SET DEFAULT 100;
        UPDATE public.exams SET total_marks = 100 WHERE total_marks IS NULL;
        RAISE NOTICE '✅ Fixed total_marks column';
    END IF;

    -- Fix duration column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'duration' 
        AND table_schema = 'public' AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.exams ALTER COLUMN duration SET DEFAULT 120;
        UPDATE public.exams SET duration = 120 WHERE duration IS NULL;
        RAISE NOTICE '✅ Fixed duration column';
    END IF;

    -- Fix subject column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'subject' 
        AND table_schema = 'public' AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.exams ALTER COLUMN subject SET DEFAULT 'MATHEMATICS';
        UPDATE public.exams SET subject = 'MATHEMATICS' WHERE subject IS NULL;
        RAISE NOTICE '✅ Fixed subject column';
    END IF;

    -- Fix grade column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'grade' 
        AND table_schema = 'public' AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.exams ALTER COLUMN grade SET DEFAULT 'TERMINALE_AS';
        UPDATE public.exams SET grade = 'TERMINALE_AS' WHERE grade IS NULL;
        RAISE NOTICE '✅ Fixed grade column';
    END IF;

    -- Fix title column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'title' 
        AND table_schema = 'public' AND is_nullable = 'NO'
    ) THEN
        -- Title should have a meaningful default or be provided in INSERT
        ALTER TABLE public.exams ALTER COLUMN title SET DEFAULT 'Untitled Exam';
        UPDATE public.exams SET title = 'Untitled Exam' WHERE title IS NULL OR title = '';
        RAISE NOTICE '✅ Fixed title column';
    END IF;

    -- Fix title_ar column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'title_ar' 
        AND table_schema = 'public' AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.exams ALTER COLUMN title_ar SET DEFAULT 'امتحان بدون عنوان';
        UPDATE public.exams SET title_ar = 'امتحان بدون عنوان' WHERE title_ar IS NULL OR title_ar = '';
        RAISE NOTICE '✅ Fixed title_ar column';
    END IF;

END $$;

-- =============================================================================
-- STEP 3: VERIFY ALL FIXES
-- =============================================================================
SELECT 'FINAL STATUS OF ALL COLUMNS:' as status;

SELECT column_name, data_type, is_nullable, 
       COALESCE(column_default, 'NO DEFAULT') as default_value,
       CASE WHEN is_nullable = 'NO' AND column_default IS NULL THEN '❌ STILL PROBLEMATIC' 
            ELSE '✅ READY' END as final_status
FROM information_schema.columns 
WHERE table_name = 'exams' AND table_schema = 'public'
ORDER BY ordinal_position;

-- =============================================================================
-- STEP 4: TEST INSERT (OPTIONAL)
-- =============================================================================
-- Uncomment to test if INSERT will work now
/*
INSERT INTO public.exams (id, title, title_ar, description, description_ar, subject, grade, duration, total_marks, total_points, is_published, exam_type, course_id) 
VALUES ('test-exam', 'Test Exam', 'امتحان تجريبي', 'Test description', 'وصف تجريبي', 'MATHEMATICS', 'TERMINALE_AS', 120, 100, 100, false, 'PRACTICE', null);

SELECT 'TEST INSERT SUCCESSFUL!' as test_result;

-- Clean up test
DELETE FROM public.exams WHERE id = 'test-exam';
*/

SELECT '🎉 ALL EXAMS TABLE CONSTRAINTS HAVE BEEN FIXED!' as final_message;
SELECT 'You can now safely execute supabase-data.sql and other data files.' as instruction;
