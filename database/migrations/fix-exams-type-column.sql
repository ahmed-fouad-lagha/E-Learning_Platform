-- Fix for exams table type column constraint
-- Run this BEFORE executing supabase-data.sql

-- Check current exams table structure
SELECT 'CURRENT EXAMS TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable, column_default, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'exams' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Fix type column constraint if it exists and is problematic
DO $$ 
BEGIN
    -- Check if there's a type column that's NOT NULL without default
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' 
        AND column_name = 'type' 
        AND table_schema = 'public'
        AND is_nullable = 'NO'
        AND column_default IS NULL
    ) THEN
        -- Option 1: Add a default value to the type column
        ALTER TABLE public.exams ALTER COLUMN type SET DEFAULT 'PRACTICE';
        RAISE NOTICE 'Added default value to type column';
        
        -- Option 2: Or make it nullable (if appropriate)
        -- ALTER TABLE public.exams ALTER COLUMN type DROP NOT NULL;
        -- RAISE NOTICE 'Made type column nullable';
    END IF;

    -- If type column doesn't exist but exam_type does, we're good
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' 
        AND column_name = 'type' 
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' 
        AND column_name = 'exam_type' 
        AND table_schema = 'public'
    ) THEN
        RAISE NOTICE 'Using exam_type column instead of type - this is correct';
    END IF;
END $$;

-- Show the final structure
SELECT 'FIXED EXAMS TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'exams' AND table_schema = 'public'
ORDER BY ordinal_position;
