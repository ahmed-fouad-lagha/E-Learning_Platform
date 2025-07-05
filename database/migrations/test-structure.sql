-- ================================================================
-- FINAL TEST FOR curriculum-lessons-part3.sql
-- This file tests the exact structure that should work in Supabase
-- ================================================================

-- Test 1: Verify INSERT statement structure
INSERT INTO public.lessons (id, title, title_ar, content, content_ar, order_num, duration, course_id) VALUES

-- Test 2: Sample lesson with exact 8-field structure
('test-lesson-01', 'Test Title', 'عنوان اختبار',
'This is English content for testing.',
'هذا محتوى عربي للاختبار.',
1, 30, 'test-course-id'),

-- Test 3: Another lesson to test multi-entry structure  
('test-lesson-02', 'Test Title 2', 'عنوان اختبار 2',
'This is more English content for testing.',
'هذا محتوى عربي آخر للاختبار.',
2, 45, 'test-course-id')

-- Test 4: ON CONFLICT clause
ON CONFLICT (id) DO UPDATE SET
title = EXCLUDED.title,
title_ar = EXCLUDED.title_ar,
content = EXCLUDED.content,
content_ar = EXCLUDED.content_ar,
order_num = EXCLUDED.order_num,
duration = EXCLUDED.duration,
updated_at = now();
