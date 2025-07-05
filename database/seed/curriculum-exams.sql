-- BAC-Style Exam Questions for Algerian Baccalauréat E-Learning Platform
-- Comprehensive exam database with questions, solutions, and rubrics
-- Covers all major subjects: Mathematics, Physics, Chemistry, Literature, Philosophy, Islamic Studies

-- ==================================================
-- EXAMS TABLE POPULATION
-- ==================================================

-- Mathematics BAC Exam: Functions and Analysis (Terminale AS/AL)
INSERT INTO public.exams (id, title, title_ar, description, description_ar, course_id, exam_type, duration, total_points, difficulty, instructions, instructions_ar) VALUES
('bac-math-functions-2024', 
'BAC Mathematics 2024: Functions and Analysis', 
'بكالوريا الرياضيات 2024: الدوال والتحليل',
'Comprehensive BAC-level examination covering functions, limits, derivatives, and applications. Designed to test analytical thinking and problem-solving skills essential for university mathematics.',
'امتحان شامل على مستوى البكالوريا يغطي الدوال والنهايات والمشتقات والتطبيقات. مصمم لاختبار التفكير التحليلي ومهارات حل المسائل الضرورية لرياضيات الجامعة.',
'math-functions-term-as', 'FINAL_EXAM', 240, 100, 'BAC_LEVEL',
'Read all questions carefully. Show all work and justify your answers. Use appropriate mathematical notation. Time limit: 4 hours.',
'اقرأ جميع الأسئلة بعناية. أظهر جميع خطوات العمل وبرر إجاباتك. استخدم الترميز الرياضي المناسب. حد زمني: 4 ساعات.');

-- Physics BAC Exam: Mechanics (Terminale AS)
INSERT INTO public.exams (id, title, title_ar, description, description_ar, course_id, exam_type, duration, total_points, difficulty, instructions, instructions_ar) VALUES
('bac-physics-mechanics-2024',
'BAC Physics 2024: Classical Mechanics',
'بكالوريا الفيزياء 2024: الميكانيكا الكلاسيكية', 
'Advanced physics examination testing understanding of kinematics, dynamics, energy, and momentum. Includes theoretical questions and practical problem-solving.',
'امتحان فيزياء متقدم يختبر فهم الحركة والديناميكا والطاقة والزخم. يتضمن أسئلة نظرية وحل المسائل العملية.',
'physics-mechanics-term-as', 'FINAL_EXAM', 180, 100, 'BAC_LEVEL',
'Answer all questions. Use SI units throughout. Draw clear diagrams where appropriate. Show all calculations.',
'أجب على جميع الأسئلة. استخدم الوحدات الدولية في جميع أنحاء الامتحان. ارسم مخططات واضحة عند الضرورة. أظهر جميع الحسابات.');

-- Chemistry BAC Exam: Organic Chemistry (Terminale AS)
INSERT INTO public.exams (id, title, title_ar, description, description_ar, course_id, exam_type, duration, total_points, difficulty, instructions, instructions_ar) VALUES
('bac-chemistry-organic-2024',
'BAC Chemistry 2024: Organic Chemistry',
'بكالوريا الكيمياء 2024: الكيمياء العضوية',
'Comprehensive organic chemistry examination covering hydrocarbons, functional groups, reactions, and mechanisms. Tests understanding of molecular structure and chemical reactivity.',
'امتحان شامل في الكيمياء العضوية يغطي الهيدروكربونات والمجموعات الوظيفية والتفاعلات والآليات. يختبر فهم التركيب الجزيئي والنشاط الكيميائي.',
'chemistry-organic-term-as', 'FINAL_EXAM', 180, 100, 'BAC_LEVEL',
'Write clear chemical equations. Use proper chemical nomenclature. Draw accurate structural formulas. Explain reaction mechanisms.',
'اكتب معادلات كيميائية واضحة. استخدم التسمية الكيميائية المناسبة. ارسم الصيغ البنائية بدقة. اشرح آليات التفاعل.');

-- ==================================================
-- EXAM QUESTIONS TABLE POPULATION
-- ==================================================

-- Mathematics Exam Questions
INSERT INTO public.exam_questions (id, exam_id, question_text, question_text_ar, question_type, points, difficulty, correct_answer, explanation, explanation_ar, order_num) VALUES

-- Question 1: Function Analysis (25 points)
('bac-math-q1-2024',
'bac-math-functions-2024',
'**Problem 1: Function Study (25 points)**

Consider the function f defined by: f(x) = (x² - 4x + 3)/(x - 1)

**Part A: Domain and Asymptotes (8 points)**
1. Determine the domain of f. (2 points)
2. Study the behavior of f near x = 1. (3 points)  
3. Find the oblique asymptote and study the position of the curve relative to this asymptote. (3 points)

**Part B: Derivative and Monotonicity (10 points)**
4. Calculate f''(x) and simplify. (4 points)
5. Determine the critical points and study the monotonicity of f. (4 points)
6. Find the coordinates of any local extrema. (2 points)

**Part C: Curve Sketching (7 points)**
7. Sketch the graph of f, showing all important features: domain, asymptotes, critical points, and general shape. (7 points)',

'**المسألة 1: دراسة دالة (25 نقطة)**

لتكن الدالة f معرفة بـ: f(x) = (x² - 4x + 3)/(x - 1)

**الجزء أ: المجال والمقاربات (8 نقاط)**
1. حدد مجال الدالة f. (2 نقطة)
2. ادرس سلوك f بالقرب من x = 1. (3 نقاط)
3. أوجد المقارب المائل وادرس وضع المنحنى بالنسبة لهذا المقارب. (3 نقاط)

**الجزء ب: المشتقة والرتابة (10 نقاط)**
4. احسب f''(x) وبسط النتيجة. (4 نقاط)
5. حدد النقاط الحرجة وادرس رتابة f. (4 نقاط)
6. أوجد إحداثيات أي نقاط قصوى محلية. (2 نقطة)

**الجزء ج: رسم المنحنى (7 نقاط)**
7. ارسم منحنى الدالة f، موضحاً جميع الخصائص المهمة: المجال والمقاربات والنقاط الحرجة والشكل العام. (7 نقاط)',

'ESSAY', 25, 'BAC_LEVEL',

'**Solution:**

**Part A:**
1. Domain: ℝ \ {1} (all real numbers except x = 1)
2. Near x = 1: f(x) = (x-1)(x-3)/(x-1) = x-3 for x ≠ 1. So lim(x→1) f(x) = -2, but f(1) undefined. Removable discontinuity.
3. f(x) = x - 3 + 0/(x-1) = x - 3. Oblique asymptote: y = x - 3. Curve coincides with asymptote except at x = 1.

**Part B:**
4. f(x) = x - 3 for x ≠ 1, so f''(x) = 1 for x ≠ 1
5. f''(x) = 1 > 0 for all x in domain, so f is strictly increasing on (-∞,1) and (1,+∞)
6. No critical points (f''(x) never equals 0), so no local extrema

**Part C:**
7. Graph: Straight line y = x - 3 with hole at point (1, -2). Increasing everywhere in domain.',

'**الحل:**

**الجزء أ:**
1. المجال: ℝ \ {1} (جميع الأعداد الحقيقية عدا x = 1)
2. بالقرب من x = 1: f(x) = (x-1)(x-3)/(x-1) = x-3 لـ x ≠ 1. إذن lim(x→1) f(x) = -2، لكن f(1) غير معرفة. انقطاع قابل للإزالة.
3. f(x) = x - 3 + 0/(x-1) = x - 3. المقارب المائل: y = x - 3. المنحنى يتطابق مع المقارب عدا عند x = 1.',

1),

-- Question 2: Integration Problem (20 points)
('bac-math-q2-2024',
'bac-math-functions-2024',
'**Problem 2: Integration and Applications (20 points)**

**Part A: Indefinite Integration (12 points)**
Calculate the following integrals, showing all steps:

1. ∫(2x³ - 3x² + x - 5) dx (3 points)

2. ∫x·e^(x²) dx (4 points)

3. ∫sin(x)·cos(x) dx (3 points)

4. ∫1/(x² + 4) dx (2 points)

**Part B: Definite Integration (8 points)**
5. Calculate ∫₀^π x·sin(x) dx using integration by parts. (6 points)

6. A particle moves with velocity v(t) = 3t² - 6t + 2 m/s. Find the displacement of the particle from t = 0 to t = 3 seconds. (2 points)',

'**المسألة 2: التكامل والتطبيقات (20 نقطة)**

**الجزء أ: التكامل غير المحدد (12 نقطة)**
احسب التكاملات التالية، موضحاً جميع الخطوات:

1. ∫(2x³ - 3x² + x - 5) dx (3 نقاط)

2. ∫x·e^(x²) dx (4 نقاط)

3. ∫sin(x)·cos(x) dx (3 نقاط)

4. ∫1/(x² + 4) dx (2 نقطة)

**الجزء ب: التكامل المحدد (8 نقاط)**
5. احسب ∫₀^π x·sin(x) dx باستخدام التكامل بالأجزاء. (6 نقاط)

6. جسيم يتحرك بسرعة v(t) = 3t² - 6t + 2 م/ث. أوجد إزاحة الجسيم من t = 0 إلى t = 3 ثوان. (2 نقطة)',

'ESSAY', 20, 'BAC_LEVEL',

'**Solution:**

**Part A:**
1. ∫(2x³ - 3x² + x - 5) dx = 2x⁴/4 - 3x³/3 + x²/2 - 5x + C = x⁴/2 - x³ + x²/2 - 5x + C

2. ∫x·e^(x²) dx: Let u = x², du = 2x dx, so x dx = ½ du
   ∫x·e^(x²) dx = ½∫e^u du = ½e^u + C = ½e^(x²) + C

3. ∫sin(x)·cos(x) dx: Let u = sin(x), du = cos(x) dx
   ∫u du = u²/2 + C = sin²(x)/2 + C

4. ∫1/(x² + 4) dx = ½ arctan(x/2) + C

**Part B:**
5. ∫₀^π x·sin(x) dx: Using integration by parts with u = x, dv = sin(x) dx
   du = dx, v = -cos(x)
   ∫x·sin(x) dx = -x·cos(x) + ∫cos(x) dx = -x·cos(x) + sin(x) + C
   ∫₀^π x·sin(x) dx = [-x·cos(x) + sin(x)]₀^π = [-π·(-1) + 0] - [0 + 0] = π

6. Displacement = ∫₀³ (3t² - 6t + 2) dt = [t³ - 3t² + 2t]₀³ = 27 - 27 + 6 = 6 meters',

'**الحل:**

**الجزء أ:**
1. ∫(2x³ - 3x² + x - 5) dx = x⁴/2 - x³ + x²/2 - 5x + C

2. ∫x·e^(x²) dx: ليكن u = x²، du = 2x dx، إذن x dx = ½ du
   ∫x·e^(x²) dx = ½∫e^u du = ½e^u + C = ½e^(x²) + C',

2),

-- Physics Exam Questions
('bac-physics-q1-2024',
'bac-physics-mechanics-2024',
'**Problem 1: Projectile Motion (25 points)**

A soccer ball is kicked from ground level at an angle of 45° above the horizontal with an initial speed of 20 m/s. Take g = 9.8 m/s².

**Part A: Kinematic Analysis (15 points)**
1. Write the parametric equations for the position of the ball as functions of time. (4 points)
2. Calculate the maximum height reached by the ball. (4 points)
3. Determine the range (horizontal distance traveled) of the ball. (4 points)
4. Find the velocity vector when the ball reaches maximum height. (3 points)

**Part B: Energy Analysis (10 points)**
5. Calculate the kinetic energy of the ball at the moment of launch. (3 points)
6. Find the potential energy at maximum height. (3 points)
7. Verify energy conservation by comparing total energy at launch and at maximum height. (4 points)',

'**المسألة 1: حركة المقذوف (25 نقطة)**

كرة قدم تُرفس من مستوى الأرض بزاوية 45° فوق الأفقي بسرعة ابتدائية 20 م/ث. خذ g = 9.8 م/ث².

**الجزء أ: التحليل الحركي (15 نقطة)**
1. اكتب المعادلات البارامترية لموضع الكرة كدوال للزمن. (4 نقاط)
2. احسب أقصى ارتفاع تصل إليه الكرة. (4 نقاط)
3. حدد المدى (المسافة الأفقية المقطوعة) للكرة. (4 نقاط)
4. أوجد متجه السرعة عندما تصل الكرة لأقصى ارتفاع. (3 نقاط)

**الجزء ب: تحليل الطاقة (10 نقاط)**
5. احسب الطاقة الحركية للكرة لحظة الإطلاق. (3 نقاط)
6. أوجد الطاقة الكامنة عند أقصى ارتفاع. (3 نقاط)
7. تحقق من حفظ الطاقة بمقارنة الطاقة الكلية عند الإطلاق وعند أقصى ارتفاع. (4 نقاط)',

'ESSAY', 25, 'BAC_LEVEL',

'**Solution:**
Mass of ball = m (to be determined or cancelled out)

**Part A:**
1. v₀ₓ = 20 cos(45°) = 20/√2 = 10√2 m/s
   v₀ᵧ = 20 sin(45°) = 20/√2 = 10√2 m/s
   x(t) = v₀ₓt = 10√2 t
   y(t) = v₀ᵧt - ½gt² = 10√2 t - 4.9t²

2. At maximum height, vᵧ = 0
   vᵧ = v₀ᵧ - gt = 10√2 - 9.8t = 0
   t = 10√2/9.8 ≈ 1.44 s
   h_max = y(1.44) = 10√2(1.44) - 4.9(1.44)² ≈ 10.2 m

3. Total flight time = 2 × 1.44 = 2.88 s
   Range = x(2.88) = 10√2(2.88) ≈ 40.8 m

4. At max height: vₓ = 10√2 m/s, vᵧ = 0
   v⃗ = (10√2, 0) m/s

**Part B:**
5. KE₀ = ½mv₀² = ½m(20)² = 200m J
6. PE_max = mgh_max = mg(10.2) = 10.2mg J
7. At launch: E = KE₀ + PE₀ = 200m + 0 = 200m J
   At max height: E = KE + PE = ½m(10√2)² + 10.2mg = 100m + 10.2mg
   Since 10.2g ≈ 100, energy is conserved.',

'**الحل:**
كتلة الكرة = m

**الجزء أ:**
1. v₀ₓ = 20 cos(45°) = 10√2 م/ث
   v₀ᵧ = 20 sin(45°) = 10√2 م/ث
   x(t) = 10√2 t
   y(t) = 10√2 t - 4.9t²',

1),

-- Chemistry Exam Questions  
('bac-chemistry-q1-2024',
'bac-chemistry-organic-2024',
'**Problem 1: Hydrocarbon Analysis and Reactions (30 points)**

**Part A: Structure and Nomenclature (12 points)**
1. Draw the structural formulas for the following compounds: (6 points)
   a) 2-methylpentane
   b) 3-hexene  
   c) 2-butyne

2. Name the following compounds using IUPAC nomenclature: (6 points)
   a) CH₃-CH₂-CH(CH₃)-CH₂-CH₃
   b) CH₃-CH=CH-CH₂-CH₃
   c) HC≡C-CH₂-CH₃

**Part B: Chemical Reactions (18 points)**
3. Complete the following reactions and identify the products: (9 points)
   a) CH₃-CH=CH₂ + HBr →
   b) CH₃-CH₂-CH₃ + Cl₂ (light) →
   c) HC≡CH + 2Br₂ →

4. Combustion analysis: (9 points)
   A hydrocarbon sample with mass 0.58 g produces 1.76 g CO₂ and 0.72 g H₂O upon complete combustion.
   a) Calculate the empirical formula of the hydrocarbon. (6 points)
   b) If the molar mass is 58 g/mol, determine the molecular formula. (3 points)',

'**المسألة 1: تحليل الهيدروكربونات والتفاعلات (30 نقطة)**

**الجزء أ: التركيب والتسمية (12 نقطة)**
1. ارسم الصيغ البنائية للمركبات التالية: (6 نقاط)
   أ) 2-ميثيل بنتان
   ب) 3-هكسين
   ج) 2-بوتاين

2. سمِّ المركبات التالية باستخدام تسمية IUPAC: (6 نقاط)
   أ) CH₃-CH₂-CH(CH₃)-CH₂-CH₃
   ب) CH₃-CH=CH-CH₂-CH₃
   ج) HC≡C-CH₂-CH₃

**الجزء ب: التفاعلات الكيميائية (18 نقطة)**
3. أكمل التفاعلات التالية وحدد النواتج: (9 نقاط)
   أ) CH₃-CH=CH₂ + HBr →
   ب) CH₃-CH₂-CH₃ + Cl₂ (ضوء) →
   ج) HC≡CH + 2Br₂ →

4. تحليل الاحتراق: (9 نقاط)
   عينة هيدروكربون كتلتها 0.58 غ تنتج 1.76 غ CO₂ و 0.72 غ H₂O عند الاحتراق الكامل.
   أ) احسب الصيغة التجريبية للهيدروكربون. (6 نقاط)
   ب) إذا كانت الكتلة المولية 58 غ/مول، حدد الصيغة الجزيئية. (3 نقاط)',

'ESSAY', 30, 'BAC_LEVEL',

'**Solution:**

**Part A:**
1. Structural formulas:
   a) 2-methylpentane: CH₃-CH(CH₃)-CH₂-CH₂-CH₃
   b) 3-hexene: CH₃-CH₂-CH=CH-CH₂-CH₃
   c) 2-butyne: CH₃-C≡C-CH₃

2. IUPAC names:
   a) 3-methylpentane
   b) 2-pentene
   c) 1-butyne

**Part B:**
3. Reaction products:
   a) CH₃-CH=CH₂ + HBr → CH₃-CHBr-CH₃ (Markovnikov addition)
   b) CH₃-CH₂-CH₃ + Cl₂ → CH₃-CHCl-CH₃ + HCl (substitution at 2° carbon)
   c) HC≡CH + 2Br₂ → CHBr₂-CHBr₂ (addition to triple bond)

4. Combustion analysis:
   a) Moles CO₂ = 1.76/44 = 0.04 mol C
      Moles H₂O = 0.72/18 = 0.04 mol → 0.08 mol H
      C:H ratio = 0.04:0.08 = 1:2
      Empirical formula: CH₂
   
   b) Empirical mass = 14 g/mol
      n = 58/14 = 4
      Molecular formula: C₄H₈',

'**الحل:**

**الجزء أ:**
1. الصيغ البنائية:
   أ) 2-ميثيل بنتان: CH₃-CH(CH₃)-CH₂-CH₂-CH₃
   ب) 3-هكسين: CH₃-CH₂-CH=CH-CH₂-CH₃
   ج) 2-بوتاين: CH₃-C≡C-CH₃',

1);

-- Additional course completion and exam data continues...
