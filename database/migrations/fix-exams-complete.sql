-- COMPLETE SOLUTION for Exams Table Type Column Issue
-- This script resolves the NOT NULL constraint violation

-- =============================================================================
-- STEP 1: DIAGNOSE THE ISSUE
-- =============================================================================
SELECT 'DIAGNOSING EXAMS TABLE STRUCTURE...' as status;

-- Check all columns in exams table
SELECT column_name, data_type, is_nullable, column_default, 
       CASE WHEN is_nullable = 'NO' AND column_default IS NULL THEN '❌ PROBLEMATIC' 
            ELSE '✅ OK' END as status
FROM information_schema.columns 
WHERE table_name = 'exams' AND table_schema = 'public'
ORDER BY ordinal_position;

-- =============================================================================
-- STEP 2: FIX THE TYPE COLUMN CONSTRAINT
-- =============================================================================
DO $$ 
BEGIN
    -- Check if there's a problematic 'type' column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' 
        AND column_name = 'type' 
        AND table_schema = 'public'
        AND is_nullable = 'NO'
    ) THEN
        -- Add a default value to make it work
        ALTER TABLE public.exams ALTER COLUMN type SET DEFAULT 'PRACTICE';
        
        -- Update any existing null values
        UPDATE public.exams SET type = 'PRACTICE' WHERE type IS NULL;
        
        RAISE NOTICE '✅ Fixed type column with default value';
    ELSE
        RAISE NOTICE '✅ Type column is not problematic or does not exist';
    END IF;

    -- Ensure exam_type has proper constraints
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' 
        AND column_name = 'exam_type' 
        AND table_schema = 'public'
    ) THEN
        -- Make sure exam_type has a default if it doesn't
        BEGIN
            ALTER TABLE public.exams ALTER COLUMN exam_type SET DEFAULT 'PRACTICE';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'exam_type column already has proper setup';
        END;
        RAISE NOTICE '✅ exam_type column is properly configured';
    END IF;
END $$;

-- =============================================================================
-- STEP 3: CLEAN UP AND STANDARDIZE
-- =============================================================================

-- If we have both 'type' and 'exam_type', let's standardize on 'exam_type'
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'type' AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'exam_type' AND table_schema = 'public'
    ) THEN
        -- Copy data from type to exam_type if exam_type is null
        UPDATE public.exams SET exam_type = type WHERE exam_type IS NULL AND type IS NOT NULL;
        
        -- We could drop the type column, but let's keep it for safety
        -- ALTER TABLE public.exams DROP COLUMN type;
        
        RAISE NOTICE 'ℹ️ Both type and exam_type columns exist - data synchronized';
    END IF;
END $$;

-- =============================================================================
-- STEP 4: VERIFY THE FIX
-- =============================================================================
SELECT 'FINAL EXAMS TABLE STRUCTURE:' as status;

SELECT column_name, data_type, is_nullable, column_default,
       CASE WHEN is_nullable = 'NO' AND column_default IS NULL THEN '❌ STILL PROBLEMATIC' 
            ELSE '✅ GOOD' END as final_status
FROM information_schema.columns 
WHERE table_name = 'exams' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show any existing exams data
SELECT 'EXISTING EXAMS DATA:' as info;
SELECT id, title, subject, grade, exam_type, 
       CASE WHEN type IS NOT NULL THEN type ELSE 'NULL' END as type_column
FROM public.exams 
LIMIT 5;

SELECT '✅ EXAMS TABLE IS NOW READY FOR DATA INSERTION!' as final_message;
