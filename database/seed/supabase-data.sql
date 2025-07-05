-- Sample Data for E-Learning Platform
-- Execute this AFTER running supabase-schema.sql

-- Insert sample courses
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, thumbnail, is_published, is_free, curriculum, bac_relevance, total_lessons, estimated_hours) VALUES
('math-bac-2025', 'Mathematics BAC 2025 Preparation', 'تحضير الرياضيات بكالوريا 2025', 'Complete mathematics course for BAC 2025 preparation with practice exams and detailed explanations.', 'دورة شاملة في الرياضيات للتحضير لبكالوريا 2025 مع امتحانات تطبيقية وشروحات مفصلة.', 'MATHEMATICS', 'TERMINALE_AS', 'BAC_LEVEL', '/images/math-course.jpg', true, true, 'DZ-BAC-MATH-2025', 0.95, 15, 45),
('physics-bac-2025', 'Physics BAC 2025 Preparation', 'تحضير الفيزياء بكالوريا 2025', 'Comprehensive physics course covering mechanics, electricity, and modern physics for BAC 2025.', 'دورة شاملة في الفيزياء تغطي الميكانيك والكهرباء والفيزياء الحديثة لبكالوريا 2025.', 'PHYSICS', 'TERMINALE_AS', 'BAC_LEVEL', '/images/physics-course.jpg', true, false, 'DZ-BAC-PHYS-2025', 0.90, 20, 60),
('arabic-literature-bac', 'Arabic Literature BAC Preparation', 'تحضير الأدب العربي للبكالوريا', 'Master Arabic literature with classic texts, poetry analysis, and writing techniques.', 'إتقان الأدب العربي مع النصوص الكلاسيكية وتحليل الشعر وتقنيات الكتابة.', 'ARABIC_LITERATURE', 'TERMINALE_AL', 'BAC_LEVEL', '/images/arabic-course.jpg', true, true, 'DZ-BAC-ARAB-2025', 0.85, 12, 36)
ON CONFLICT (id) DO UPDATE SET
title = EXCLUDED.title,
title_ar = EXCLUDED.title_ar,
description = EXCLUDED.description,
description_ar = EXCLUDED.description_ar,
updated_at = now();

-- Insert sample lessons
INSERT INTO public.lessons (id, title, title_ar, content, content_ar, order_num, duration, course_id) VALUES
-- Math course lessons
('math-lesson-1', 'Functions and Derivatives', 'الدوال والمشتقات', 'Comprehensive coverage of functions and their derivatives for BAC preparation.', 'تغطية شاملة للدوال ومشتقاتها للتحضير للبكالوريا.', 1, 60, 'math-bac-2025'),
('math-lesson-2', 'Integrals', 'التكاملات', 'Deep dive into integral calculus with practical applications.', 'دراسة عميقة لحساب التكامل مع التطبيقات العملية.', 2, 90, 'math-bac-2025'),
('math-lesson-3', 'Complex Numbers', 'الأعداد المركبة', 'Understanding complex numbers and their applications in mathematics.', 'فهم الأعداد المركبة وتطبيقاتها في الرياضيات.', 3, 75, 'math-bac-2025'),

-- Physics course lessons
('physics-lesson-1', 'Mechanics', 'الميكانيك', 'Introduction to classical mechanics and motion analysis.', 'مقدمة في الميكانيك الكلاسيكي وتحليل الحركة.', 1, 90, 'physics-bac-2025'),
('physics-lesson-2', 'Electricity and Magnetism', 'الكهرباء والمغناطيسية', 'Electromagnetic theory and practical applications.', 'نظرية الكهرومغناطيسية والتطبيقات العملية.', 2, 105, 'physics-bac-2025'),

-- Arabic course lessons
('arabic-lesson-1', 'Classical Poetry', 'الشعر الكلاسيكي', 'Analysis of classical Arabic poetry and literary techniques.', 'تحليل الشعر العربي الكلاسيكي والتقنيات الأدبية.', 1, 80, 'arabic-literature-bac')
ON CONFLICT (id) DO UPDATE SET
title = EXCLUDED.title,
title_ar = EXCLUDED.title_ar,
content = EXCLUDED.content,
content_ar = EXCLUDED.content_ar,
updated_at = now();

-- Insert sample exam
INSERT INTO public.exams (id, title, title_ar, description, description_ar, subject, grade, duration, total_marks, total_points, pass_score, is_published, exam_type, course_id) VALUES
('math-bac-practice-1', 'Mathematics BAC Practice Exam 1', 'امتحان الرياضيات التطبيقي للبكالوريا 1', 'Practice exam based on previous BAC mathematics papers', 'امتحان تطبيقي مبني على أوراق الرياضيات السابقة للبكالوريا', 'MATHEMATICS', 'TERMINALE_AS', 180, 20, 20, 10, true, 'BAC_SIMULATION', 'math-bac-2025')
ON CONFLICT (id) DO UPDATE SET
title = EXCLUDED.title,
title_ar = EXCLUDED.title_ar,
description = EXCLUDED.description,
description_ar = EXCLUDED.description_ar,
updated_at = now();

-- Update course lesson counts
UPDATE public.courses SET total_lessons = (
    SELECT COUNT(*) FROM public.lessons WHERE course_id = courses.id
) WHERE id IN ('math-bac-2025', 'physics-bac-2025', 'arabic-literature-bac');
