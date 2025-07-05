-- Fix for missing order_num column in lessons table
-- Run this in Supabase SQL Editor if you get the "order_num does not exist" error

-- Check if the column exists first
DO $$ 
BEGIN
    -- Try to add the column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'lessons' 
        AND column_name = 'order_num'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lessons ADD COLUMN order_num INTEGER NOT NULL DEFAULT 1;
        RAISE NOTICE 'Added order_num column to lessons table';
    ELSE
        RAISE NOTICE 'order_num column already exists in lessons table';
    END IF;
END $$;

-- Also check for other potentially missing columns
DO $$ 
BEGIN
    -- Check for video_url column
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'lessons' 
        AND column_name = 'video_url'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lessons ADD COLUMN video_url TEXT;
        RAISE NOTICE 'Added video_url column to lessons table';
    END IF;

    -- Check for audio_url column
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'lessons' 
        AND column_name = 'audio_url'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lessons ADD COLUMN audio_url TEXT;
        RAISE NOTICE 'Added audio_url column to lessons table';
    END IF;

    -- Check for download_size column
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'lessons' 
        AND column_name = 'download_size'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lessons ADD COLUMN download_size INTEGER;
        RAISE NOTICE 'Added download_size column to lessons table';
    END IF;
END $$;

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'lessons' 
AND table_schema = 'public'
ORDER BY ordinal_position;
