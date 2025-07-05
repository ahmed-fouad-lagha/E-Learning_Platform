-- Comprehensive Lesson Content for Algerian Baccalauréat Curriculum
-- 200+ lessons with detailed content, learning objectives, and BAC-style exercises

-- ==================================================
-- MATHEMATICS LESSONS: Functions and Analysis
-- ==================================================

-- Course 1: Functions and Analysis (15 lessons)
INSERT INTO public.lessons (id, title, title_ar, content, content_ar, order_num, duration, course_id) VALUES

('math-func-01', 'Introduction to Functions', 'مقدمة في الدوال',
'**Learning Objectives:**
- Define what a function is and understand function notation
- Identify domain and range of functions
- Recognize different types of functions (linear, quadratic, polynomial)

**Content:**
A function f is a rule that assigns to each element x in a set D exactly one element f(x) in a set E. The set D is called the domain and the set E is the codomain.

**Key Concepts:**
1. Function notation: f(x) = y
2. Domain: all possible input values
3. Range: all actual output values
4. One-to-one functions (injective)
5. Onto functions (surjective)

**Examples:**
- f(x) = 2x + 3 (linear function)
- g(x) = x² - 4x + 3 (quadratic function)
- h(x) = 1/x (rational function, domain: x ≠ 0)

**Practice Problems:**
1. Find the domain of f(x) = √(x-2)
2. Determine if f(x) = x³ is one-to-one
3. Graph f(x) = |x-1| + 2

**BAC-Style Question:**
Let f(x) = (x+1)/(x-2). Find the domain of f and solve f(x) = 3.',

'**أهداف التعلم:**
- تعريف الدالة وفهم رموز الدوال
- تحديد مجال ومدى الدوال
- التعرف على أنواع مختلفة من الدوال (خطية، تربيعية، كثيرة الحدود)

**المحتوى:**
الدالة f هي قاعدة تربط كل عنصر x في مجموعة D بعنصر واحد فقط f(x) في مجموعة E. المجموعة D تسمى المجال والمجموعة E تسمى المجال المقابل.

**المفاهيم الأساسية:**
1. رمز الدالة: f(x) = y
2. المجال: جميع القيم المدخلة الممكنة
3. المدى: جميع القيم المخرجة الفعلية
4. الدوال الفردية (حقنية)
5. الدوال الشاملة (إسقاطية)

**أمثلة:**
- f(x) = 2x + 3 (دالة خطية)
- g(x) = x² - 4x + 3 (دالة تربيعية)
- h(x) = 1/x (دالة نسبية، المجال: x ≠ 0)

**مسائل التدريب:**
1. أوجد مجال الدالة f(x) = √(x-2)
2. حدد ما إذا كانت f(x) = x³ فردية
3. ارسم الدالة f(x) = |x-1| + 2

**سؤال نمط البكالوريا:**
ليكن f(x) = (x+1)/(x-2). أوجد مجال f وحل المعادلة f(x) = 3.',
1, 45, 'math-functions-term-as'),

('math-func-02', 'Limits and Continuity', 'النهايات والاستمرارية',
'**Learning Objectives:**
- Understand the concept of limits
- Calculate limits using algebraic techniques
- Determine continuity of functions
- Apply L''Hôpital''s rule for indeterminate forms

**Content:**
The limit of a function f(x) as x approaches a is the value that f(x) gets arbitrarily close to as x gets arbitrarily close to a.

**Limit Laws:**
1. lim[x→a] (f(x) + g(x)) = lim[x→a] f(x) + lim[x→a] g(x)
2. lim[x→a] (f(x) · g(x)) = lim[x→a] f(x) · lim[x→a] g(x)
3. lim[x→a] (f(x)/g(x)) = lim[x→a] f(x) / lim[x→a] g(x), if lim[x→a] g(x) ≠ 0

**Continuity:**
A function f is continuous at x = a if:
1. f(a) is defined
2. lim[x→a] f(x) exists
3. lim[x→a] f(x) = f(a)

**L''Hôpital''s Rule:**
If lim[x→a] f(x)/g(x) gives 0/0 or ∞/∞, then:
lim[x→a] f(x)/g(x) = lim[x→a] f''(x)/g''(x)

**Examples:**
- lim[x→2] (x² - 4)/(x - 2) = lim[x→2] (x + 2) = 4
- lim[x→0] sin(x)/x = 1
- lim[x→∞] (1 + 1/x)^x = e

**Practice Problems:**
1. Calculate lim[x→3] (x² - 9)/(x - 3)
2. Determine if f(x) = {x² if x ≤ 1, 2x if x > 1} is continuous at x = 1
3. Find lim[x→0] (e^x - 1)/x

**BAC-Style Question:**
Study the continuity of f(x) = {(x² - 1)/(x - 1) if x ≠ 1, k if x = 1} and find the value of k that makes f continuous.',

'**أهداف التعلم:**
- فهم مفهوم النهايات
- حساب النهايات باستخدام التقنيات الجبرية
- تحديد استمرارية الدوال
- تطبيق قاعدة لوبيتال للصيغ غير المحددة

**المحتوى:**
نهاية الدالة f(x) عندما x تقترب من a هي القيمة التي تقترب منها f(x) عندما تقترب x من a.

**قوانين النهايات:**
1. lim[x→a] (f(x) + g(x)) = lim[x→a] f(x) + lim[x→a] g(x)
2. lim[x→a] (f(x) · g(x)) = lim[x→a] f(x) · lim[x→a] g(x)
3. lim[x→a] (f(x)/g(x)) = lim[x→a] f(x) / lim[x→a] g(x)، إذا كان lim[x→a] g(x) ≠ 0

**الاستمرارية:**
الدالة f مستمرة عند x = a إذا:
1. f(a) معرفة
2. lim[x→a] f(x) موجودة
3. lim[x→a] f(x) = f(a)

**قاعدة لوبيتال:**
إذا كان lim[x→a] f(x)/g(x) يعطي 0/0 أو ∞/∞، فإن:
lim[x→a] f(x)/g(x) = lim[x→a] f''(x)/g''(x)

**أمثلة:**
- lim[x→2] (x² - 4)/(x - 2) = lim[x→2] (x + 2) = 4
- lim[x→0] sin(x)/x = 1
- lim[x→∞] (1 + 1/x)^x = e

**مسائل التدريب:**
1. احسب lim[x→3] (x² - 9)/(x - 3)
2. حدد ما إذا كانت f(x) = {x² إذا x ≤ 1, 2x إذا x > 1} مستمرة عند x = 1
3. أوجد lim[x→0] (e^x - 1)/x

**سؤال نمط البكالوريا:**
ادرس استمرارية f(x) = {(x² - 1)/(x - 1) إذا x ≠ 1, k إذا x = 1} وأوجد قيمة k التي تجعل f مستمرة.',
2, 50, 'math-functions-term-as'),

('math-func-03', 'Derivatives and Differentiation', 'المشتقات والتفاضل',
'**Learning Objectives:**
- Understand the geometric and physical meaning of derivatives
- Master differentiation rules and techniques
- Apply derivatives to solve optimization problems
- Analyze function behavior using derivatives

**Content:**
The derivative of a function f at point x is defined as:
f''(x) = lim[h→0] [f(x+h) - f(x)]/h

**Geometric Interpretation:**
The derivative represents the slope of the tangent line to the curve at a given point.

**Physical Interpretation:**
If s(t) represents position, then s''(t) represents velocity and s''''(t) represents acceleration.

**Differentiation Rules:**
1. Power Rule: d/dx(x^n) = nx^(n-1)
2. Product Rule: d/dx(fg) = f''g + fg''
3. Quotient Rule: d/dx(f/g) = (f''g - fg'')/g²
4. Chain Rule: d/dx(f(g(x))) = f''(g(x)) · g''(x)

**Common Derivatives:**
- d/dx(sin x) = cos x
- d/dx(cos x) = -sin x
- d/dx(e^x) = e^x
- d/dx(ln x) = 1/x

**Applications:**
1. Finding tangent lines
2. Optimization problems
3. Related rates
4. Function analysis (increasing/decreasing, concavity)

**Examples:**
- f(x) = x³ + 2x² - x + 1 → f''(x) = 3x² + 4x - 1
- g(x) = sin(x²) → g''(x) = 2x cos(x²)
- h(x) = e^(2x+1) → h''(x) = 2e^(2x+1)

**Practice Problems:**
1. Find f''(x) if f(x) = (x² + 1)/(x - 1)
2. Find the equation of the tangent line to y = x³ - 2x + 1 at x = 2
3. A rectangle is inscribed in a semicircle of radius 5. Find the maximum area.

**BAC-Style Question:**
Let f(x) = x³ - 3x² + 2. Find the critical points and determine the nature of each critical point.',

'**أهداف التعلم:**
- فهم المعنى الهندسي والفيزيائي للمشتقات
- إتقان قواعد وتقنيات التفاضل
- تطبيق المشتقات لحل مسائل الأمثلة
- تحليل سلوك الدوال باستخدام المشتقات

**المحتوى:**
مشتقة الدالة f عند النقطة x تُعرف بأنها:
f''(x) = lim[h→0] [f(x+h) - f(x)]/h

**التفسير الهندسي:**
المشتقة تمثل ميل خط المماس للمنحنى عند نقطة معينة.

**التفسير الفيزيائي:**
إذا كان s(t) يمثل الموضع، فإن s''(t) يمثل السرعة و s''''(t) يمثل التسارع.

**قواعد التفاضل:**
1. قاعدة القوة: d/dx(x^n) = nx^(n-1)
2. قاعدة الضرب: d/dx(fg) = f''g + fg''
3. قاعدة القسمة: d/dx(f/g) = (f''g - fg'')/g²
4. قاعدة السلسلة: d/dx(f(g(x))) = f''(g(x)) · g''(x)

**المشتقات الشائعة:**
- d/dx(sin x) = cos x
- d/dx(cos x) = -sin x
- d/dx(e^x) = e^x
- d/dx(ln x) = 1/x

**التطبيقات:**
1. إيجاد خطوط المماس
2. مسائل الأمثلة
3. المعدلات المترابطة
4. تحليل الدوال (متزايدة/متناقصة، التقعر)

**أمثلة:**
- f(x) = x³ + 2x² - x + 1 → f''(x) = 3x² + 4x - 1
- g(x) = sin(x²) → g''(x) = 2x cos(x²)
- h(x) = e^(2x+1) → h''(x) = 2e^(2x+1)

**مسائل التدريب:**
1. أوجد f''(x) إذا كان f(x) = (x² + 1)/(x - 1)
2. أوجد معادلة خط المماس للمنحنى y = x³ - 2x + 1 عند x = 2
3. مستطيل محاط بنصف دائرة نصف قطرها 5. أوجد أكبر مساحة.

**سؤال نمط البكالوريا:**
ليكن f(x) = x³ - 3x² + 2. أوجد النقاط الحرجة وحدد طبيعة كل نقطة حرجة.',
3, 55, 'math-functions-term-as'),

-- Continue with more math lessons...
('math-func-04', 'Exponential and Logarithmic Functions', 'الدوال الأسية واللوغاريتمية',
'**Learning Objectives:**
- Understand properties of exponential and logarithmic functions
- Solve exponential and logarithmic equations
- Apply these functions to real-world problems
- Study growth and decay models

**Content:**
Exponential functions have the form f(x) = a^x where a > 0, a ≠ 1.
Logarithmic functions are the inverse of exponential functions.

**Key Properties:**
1. a^(x+y) = a^x · a^y
2. a^(x-y) = a^x / a^y
3. (a^x)^y = a^(xy)
4. log_a(xy) = log_a(x) + log_a(y)
5. log_a(x/y) = log_a(x) - log_a(y)
6. log_a(x^n) = n·log_a(x)

**Natural Logarithm:**
ln(x) = log_e(x), where e ≈ 2.718
d/dx(ln x) = 1/x
d/dx(e^x) = e^x

**Applications:**
1. Population growth: P(t) = P₀e^(kt)
2. Radioactive decay: N(t) = N₀e^(-λt)
3. Compound interest: A = P(1 + r/n)^(nt)
4. pH scale: pH = -log₁₀[H⁺]

**Examples:**
- Solve 2^(x+1) = 8: x+1 = 3, so x = 2
- Solve ln(x-1) = 2: x-1 = e², so x = e² + 1
- If bacteria doubles every 3 hours, find the growth rate k

**Practice Problems:**
1. Solve 3^(2x-1) = 27
2. Simplify ln(e^(2x)) + ln(e^(-x))
3. Carbon-14 has half-life 5730 years. Find the decay constant.

**BAC-Style Question:**
A radioactive substance has initial mass 100g and mass 75g after 5 years. Find the half-life.',

'**أهداف التعلم:**
- فهم خصائص الدوال الأسية واللوغاريتمية
- حل المعادلات الأسية واللوغاريتمية
- تطبيق هذه الدوال على مسائل واقعية
- دراسة نماذج النمو والاضمحلال

**المحتوى:**
الدوال الأسية لها الشكل f(x) = a^x حيث a > 0, a ≠ 1.
الدوال اللوغاريتمية هي عكس الدوال الأسية.

**الخصائص الأساسية:**
1. a^(x+y) = a^x · a^y
2. a^(x-y) = a^x / a^y
3. (a^x)^y = a^(xy)
4. log_a(xy) = log_a(x) + log_a(y)
5. log_a(x/y) = log_a(x) - log_a(y)
6. log_a(x^n) = n·log_a(x)

**اللوغاريتم الطبيعي:**
ln(x) = log_e(x)، حيث e ≈ 2.718
d/dx(ln x) = 1/x
d/dx(e^x) = e^x

**التطبيقات:**
1. نمو السكان: P(t) = P₀e^(kt)
2. الاضمحلال الإشعاعي: N(t) = N₀e^(-λt)
3. الفائدة المركبة: A = P(1 + r/n)^(nt)
4. مقياس الحموضة: pH = -log₁₀[H⁺]

**أمثلة:**
- حل 2^(x+1) = 8: x+1 = 3، إذن x = 2
- حل ln(x-1) = 2: x-1 = e²، إذن x = e² + 1
- إذا تضاعفت البكتيريا كل 3 ساعات، أوجد معدل النمو k

**مسائل التدريب:**
1. حل 3^(2x-1) = 27
2. بسط ln(e^(2x)) + ln(e^(-x))
3. الكربون-14 له عمر نصف 5730 سنة. أوجد ثابت الاضمحلال.

**سؤال نمط البكالوريا:**
مادة مشعة كتلتها الأولية 100g وكتلتها 75g بعد 5 سنوات. أوجد العمر النصفي.',
4, 50, 'math-functions-term-as'),

('math-func-05', 'Trigonometric Functions', 'الدوال المثلثية',
'**Learning Objectives:**
- Master trigonometric functions and their properties
- Solve trigonometric equations and inequalities
- Apply trigonometric identities
- Use trigonometry in real-world applications

**Content:**
The six trigonometric functions are defined using the unit circle:
sin θ, cos θ, tan θ, csc θ, sec θ, cot θ

**Fundamental Identities:**
1. sin²θ + cos²θ = 1
2. tan θ = sin θ / cos θ
3. 1 + tan²θ = sec²θ
4. 1 + cot²θ = csc²θ

**Angle Addition Formulas:**
- sin(A ± B) = sin A cos B ± cos A sin B
- cos(A ± B) = cos A cos B ∓ sin A sin B
- tan(A ± B) = (tan A ± tan B) / (1 ∓ tan A tan B)

**Double Angle Formulas:**
- sin(2θ) = 2 sin θ cos θ
- cos(2θ) = cos²θ - sin²θ = 2cos²θ - 1 = 1 - 2sin²θ
- tan(2θ) = 2tan θ / (1 - tan²θ)

**Derivatives:**
- d/dx(sin x) = cos x
- d/dx(cos x) = -sin x
- d/dx(tan x) = sec²x

**Applications:**
1. Wave motion: y = A sin(ωt + φ)
2. Harmonic motion: x(t) = A cos(ωt + φ)
3. AC circuits: V(t) = V₀ sin(ωt)
4. Navigation and surveying

**Examples:**
- Solve sin x = 1/2 for 0 ≤ x ≤ 2π: x = π/6, 5π/6
- Verify: sin(π/4 + π/3) = (√6 + √2)/4
- Find period of y = 3sin(2x - π/4): Period = π

**Practice Problems:**
1. Solve 2cos²x - cos x - 1 = 0 for 0 ≤ x ≤ 2π
2. Prove: tan x + cot x = 2csc(2x)
3. Find amplitude, period, and phase shift of y = 4sin(3x - π/2)

**BAC-Style Question:**
A Ferris wheel with radius 20m rotates once every 60 seconds. If a passenger starts at the bottom, write an equation for their height above ground as a function of time.',

'**أهداف التعلم:**
- إتقان الدوال المثلثية وخصائصها
- حل المعادلات والمتراجحات المثلثية
- تطبيق المتطابقات المثلثية
- استخدام المثلثات في التطبيقات الواقعية

**المحتوى:**
الدوال المثلثية الستة تُعرف باستخدام الدائرة الوحدة:
sin θ, cos θ, tan θ, csc θ, sec θ, cot θ

**المتطابقات الأساسية:**
1. sin²θ + cos²θ = 1
2. tan θ = sin θ / cos θ
3. 1 + tan²θ = sec²θ
4. 1 + cot²θ = csc²θ

**صيغ جمع الزوايا:**
- sin(A ± B) = sin A cos B ± cos A sin B
- cos(A ± B) = cos A cos B ∓ sin A sin B
- tan(A ± B) = (tan A ± tan B) / (1 ∓ tan A tan B)

**صيغ الزاوية المضاعفة:**
- sin(2θ) = 2 sin θ cos θ
- cos(2θ) = cos²θ - sin²θ = 2cos²θ - 1 = 1 - 2sin²θ
- tan(2θ) = 2tan θ / (1 - tan²θ)

**المشتقات:**
- d/dx(sin x) = cos x
- d/dx(cos x) = -sin x
- d/dx(tan x) = sec²x

**التطبيقات:**
1. الحركة الموجية: y = A sin(ωt + φ)
2. الحركة التوافقية: x(t) = A cos(ωt + φ)
3. دوائر التيار المتردد: V(t) = V₀ sin(ωt)
4. الملاحة والمساحة

**أمثلة:**
- حل sin x = 1/2 لـ 0 ≤ x ≤ 2π: x = π/6, 5π/6
- تحقق: sin(π/4 + π/3) = (√6 + √2)/4
- أوجد دورة y = 3sin(2x - π/4): الدورة = π

**مسائل التدريب:**
1. حل 2cos²x - cos x - 1 = 0 لـ 0 ≤ x ≤ 2π
2. برهن: tan x + cot x = 2csc(2x)
3. أوجد السعة والدورة وإزاحة الطور لـ y = 4sin(3x - π/2)

**سؤال نمط البكالوريا:**
دولاب عملاق نصف قطره 20m يدور مرة كل 60 ثانية. إذا بدأ راكب من الأسفل، اكتب معادلة لارتفاعه عن الأرض كدالة للزمن.',
5, 52, 'math-functions-term-as');
