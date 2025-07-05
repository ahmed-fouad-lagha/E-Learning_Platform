-- Test file to verify SQL syntax
BEGIN;

-- Test the structure of the lessons INSERT
INSERT INTO public.lessons (id, title, title_ar, content, content_ar, order_num, duration, course_id) VALUES
('test-01', 'Test Title', 'عنوان تجريبي', 'Test content', 'محتوى تجريبي', 1, 60, 'test-course');

-- Test the ON CONFLICT clause
INSERT INTO public.lessons (id, title, title_ar, content, content_ar, order_num, duration, course_id) VALUES
('test-01', 'Test Title Updated', 'عنوان تجريبي محدث', 'Test content updated', 'محتوى تجريبي محدث', 1, 60, 'test-course')
ON CONFLICT (id) DO UPDATE SET
title = EXCLUDED.title,
title_ar = EXCLUDED.title_ar,
content = EXCLUDED.content,
content_ar = EXCLUDED.content_ar,
order_num = EXCLUDED.order_num,
duration = EXCLUDED.duration,
updated_at = now();

ROLLBACK;
