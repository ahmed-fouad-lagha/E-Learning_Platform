-- Test just the corrected first lesson to verify syntax
BEGIN;

INSERT INTO public.lessons (id, title, title_ar, content, content_ar, order_num, duration, course_id) VALUES
('french-class-01', 'Introduction to French Classical Literature', 'مقدمة في الأدب الفرنسي الكلاسيكي',
'**Learning Objectives:**
- Understand the historical context of French Classical literature (17th century)
- Identify key characteristics of Classical literary style
- Recognize major themes and philosophical ideas

**Content:**
French Classical literature (1660-1715) represents the pinnacle of French artistic achievement during the reign of Louis XIV.',

'**أهداف التعلم:**
- فهم السياق التاريخي للأدب الفرنسي الكلاسيكي (القرن السابع عشر)
- تحديد الخصائص الرئيسية للأسلوب الأدبي الكلاسيكي

**السياق التاريخي:**
خلق عهد لويس الرابع عشر (ملك الشمس) ثقافة مركزية متمركزة في فرساي. خدم الأدب لتمجيد الملكية بينما استكشف الموضوعات الإنسانية العالمية.',
1, 60, 'french-classical-term-al');

ROLLBACK;
