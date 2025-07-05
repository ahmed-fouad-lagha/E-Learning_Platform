-- Quick fix for the unterminated string in curriculum-lessons-part3.sql
-- Apply this fix to the problematic lesson entry

-- The issue is in the Computer Science lesson where the Arabic content string is not properly terminated
-- Here's the corrected version:

-- Find the lesson with id 'computer-science-intro-term-as' and replace its content_ar field
UPDATE public.lessons 
SET content_ar = '**أهداف التعلم:**
- فهم مفاهيم البرمجة الأساسية والمصطلحات
- تعلم كيفية تصميم خوارزميات بسيطة
- مقدمة في المخططات الانسيابية والكود الوهمي

**المحتوى:**
البرمجة هي عملية إنشاء تعليمات للحاسوب لحل المشاكل وأداء المهام.

**مفاهيم البرمجة الأساسية:**

**1. الخوارزمية:**
إجراء خطوة بخطوة لحل مشكلة أو إكمال مهمة.

**مثال - إعداد الشاي:**
1. املأ الغلاية بالماء
2. شغل الغلاية
3. انتظر حتى يغلي الماء
4. ضع كيس الشاي في الكوب
5. اسكب الماء الساخن في الكوب
6. انتظر 3-5 دقائق
7. أخرج كيس الشاي
8. أضف السكر/الحليب إذا رغبت

**2. البرنامج:**
خوارزمية مكتوبة بلغة برمجة يمكن للحاسوب تنفيذها.

**3. الإدخال والإخراج:**
- **الإدخال**: البيانات المقدمة للبرنامج (مثل إدخال المستخدم، بيانات الملف)
- **الإخراج**: النتائج التي ينتجها البرنامج (مثل النص المعروض، الملف المحفوظ)

**4. المتغيرات:**
مواقع تخزين مسماة للبيانات التي يمكن تغييرها أثناء تنفيذ البرنامج.

**تطبيقات البرمجة:**
- تطبيقات الهاتف المحمول
- مواقع الويب
- الألعاب
- أنظمة إدارة قواعد البيانات

**سؤال في نمط البكالوريا:**
صمم خوارزمية لمساعدة أمين مكتبة في إدارة إعارة الكتب. يجب أن تشمل الخوارزمية: (1) التحقق من توفر الكتاب، (2) تسجيل معلومات المستعير، (3) تحديد تاريخ الإرجاع، (4) تحديث حالة الكتاب. قدم حلك باستخدام المخطط الانسيابي والكود الوهمي.'
WHERE id = 'computer-science-intro-term-as';

-- If the lesson doesn't exist yet, insert it with correct content
INSERT INTO public.lessons (id, title, title_ar, content, content_ar, order_num, duration, course_id) 
VALUES (
'computer-science-intro-term-as',
'Introduction to Programming Concepts',
'مقدمة في مفاهيم البرمجة',
'**Learning Objectives:**
- Understand basic programming concepts and terminology
- Learn how to design simple algorithms
- Introduction to flowcharts and pseudocode

**Content:**
Programming is the process of creating instructions for computers to solve problems and perform tasks.

**Basic Programming Concepts:**

**1. Algorithm:**
A step-by-step procedure for solving a problem or completing a task.

**Example - Making Tea:**
1. Fill kettle with water
2. Turn on kettle
3. Wait for water to boil
4. Place tea bag in cup
5. Pour hot water into cup
6. Wait 3-5 minutes
7. Remove tea bag
8. Add sugar/milk if desired

**2. Program:**
An algorithm written in a programming language that can be executed by a computer.

**3. Input and Output:**
- **Input**: Data provided to the program (e.g., user input, file data)
- **Output**: Results produced by the program (e.g., displayed text, saved file)

**4. Variables:**
Named storage locations for data that can be changed during program execution.

**Programming Applications:**
- Mobile applications
- Websites
- Games
- Database management systems

**BAC-Style Question:**
Design an algorithm to help a librarian manage book lending. The algorithm should: (1) Check if a book is available, (2) Record borrower information, (3) Set return date, (4) Update book status. Present your solution using both flowchart and pseudocode.',

'**أهداف التعلم:**
- فهم مفاهيم البرمجة الأساسية والمصطلحات
- تعلم كيفية تصميم خوارزميات بسيطة
- مقدمة في المخططات الانسيابية والكود الوهمي

**المحتوى:**
البرمجة هي عملية إنشاء تعليمات للحاسوب لحل المشاكل وأداء المهام.

**مفاهيم البرمجة الأساسية:**

**1. الخوارزمية:**
إجراء خطوة بخطوة لحل مشكلة أو إكمال مهمة.

**مثال - إعداد الشاي:**
1. املأ الغلاية بالماء
2. شغل الغلاية
3. انتظر حتى يغلي الماء
4. ضع كيس الشاي في الكوب
5. اسكب الماء الساخن في الكوب
6. انتظر 3-5 دقائق
7. أخرج كيس الشاي
8. أضف السكر/الحليب إذا رغبت

**2. البرنامج:**
خوارزمية مكتوبة بلغة برمجة يمكن للحاسوب تنفيذها.

**3. الإدخال والإخراج:**
- **الإدخال**: البيانات المقدمة للبرنامج (مثل إدخال المستخدم، بيانات الملف)
- **الإخراج**: النتائج التي ينتجها البرنامج (مثل النص المعروض، الملف المحفوظ)

**4. المتغيرات:**
مواقع تخزين مسماة للبيانات التي يمكن تغييرها أثناء تنفيذ البرنامج.

**تطبيقات البرمجة:**
- تطبيقات الهاتف المحمول
- مواقع الويب
- الألعاب
- أنظمة إدارة قواعد البيانات

**سؤال في نمط البكالوريا:**
صمم خوارزمية لمساعدة أمين مكتبة في إدارة إعارة الكتب. يجب أن تشمل الخوارزمية: (1) التحقق من توفر الكتاب، (2) تسجيل معلومات المستعير، (3) تحديد تاريخ الإرجاع، (4) تحديث حالة الكتاب. قدم حلك باستخدام المخطط الانسيابي والكود الوهمي.',

1, 45, 'computer-science-term-as'
)
ON CONFLICT (id) DO UPDATE SET
content = EXCLUDED.content,
content_ar = EXCLUDED.content_ar,
updated_at = now();
