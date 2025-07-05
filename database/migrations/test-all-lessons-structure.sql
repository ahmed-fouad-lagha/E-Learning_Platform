-- Test to verify the structure is now correct for all French lessons
INSERT INTO public.lessons (id, title, title_ar, content, content_ar, order_num, duration, course_id) VALUES

-- Lesson 3 - Should now have proper Arabic content ending
('french-class-03', 'Racine and Psychological Tragedy', 'راسين والمأساة النفسية',
'English content ending with English BAC question',
'Arabic content ending with Arabic BAC question',
3, 60, 'french-classical-term-al'),

-- Lesson 4 - Should have proper structure
('french-class-04', 'Molière and Classical Comedy', 'موليير والكوميديا الكلاسيكية',
'English content ending with English BAC question',
'Arabic content ending with appropriate conclusion',
4, 60, 'french-classical-term-al');
