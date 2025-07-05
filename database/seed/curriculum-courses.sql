-- Comprehensive Algerian Baccalauréat Curriculum Data
-- Production-ready course content for E-Learning Platform
-- Subjects: Mathematics, Physics, Chemistry, Arabic Literature, French Literature, Philosophy, Islamic Studies

-- ==================================================
-- MATHEMATICS COURSES (Terminale AS/AL)
-- ==================================================

-- Course 1: Functions and Analysis (Terminale AS/AL)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('math-functions-term-as', 
'Functions and Mathematical Analysis', 
'الدوال والتحليل الرياضي',
'Master the fundamental concepts of functions, limits, continuity, and derivatives essential for the Baccalauréat examination. This comprehensive course covers polynomial, rational, exponential, and logarithmic functions with real-world applications.',
'اتقن المفاهيم الأساسية للدوال والنهايات والاستمرارية والمشتقات الضرورية لامتحان البكالوريا. تغطي هذه الدورة الشاملة الدوال كثيرة الحدود والنسبية والأسية واللوغاريتمية مع التطبيقات العملية.',
'MATHEMATICS', 'TERMINALE_AS', 'BAC_LEVEL', 
'Algerian National Curriculum - Mathematics Terminale AS/AL', 
0.95, 15, 30, true, false);

-- Course 2: Integrals and Primitives (Terminale AS/AL)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('math-integrals-term-as',
'Integrals and Primitive Functions',
'التكامل والدوال الأصلية', 
'Comprehensive study of integration techniques, definite and indefinite integrals, and their applications in physics and geometry. Includes numerical integration methods and practical problem-solving strategies.',
'دراسة شاملة لتقنيات التكامل والتكاملات المحددة وغير المحددة وتطبيقاتها في الفيزياء والهندسة. تشمل طرق التكامل العددي واستراتيجيات حل المسائل العملية.',
'MATHEMATICS', 'TERMINALE_AS', 'BAC_LEVEL',
'Algerian National Curriculum - Mathematics Terminale AS/AL',
0.90, 12, 24, true, false);

-- Course 3: Complex Numbers (Terminale AS/AL)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('math-complex-term-as',
'Complex Numbers and Applications',
'الأعداد المركبة والتطبيقات',
'Explore the fascinating world of complex numbers, their algebraic and geometric representations, De Moivre theorem, and applications in solving polynomial equations and geometric transformations.',
'استكشف العالم الرائع للأعداد المركبة وتمثيلاتها الجبرية والهندسية ونظرية دي موافر وتطبيقاتها في حل المعادلات كثيرة الحدود والتحويلات الهندسية.',
'MATHEMATICS', 'TERMINALE_AS', 'ADVANCED',
'Algerian National Curriculum - Mathematics Terminale AS/AL',
0.85, 10, 20, true, false);

-- Course 4: Probability and Statistics (Terminale AS/AL)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('math-probability-term-as',
'Probability and Statistics',
'الاحتمالات والإحصاء',
'Master probability theory, statistical distributions, hypothesis testing, and data analysis techniques essential for scientific research and real-world problem solving.',
'اتقن نظرية الاحتمالات والتوزيعات الإحصائية واختبار الفرضيات وتقنيات تحليل البيانات الضرورية للبحث العلمي وحل المشاكل الواقعية.',
'MATHEMATICS', 'TERMINALE_AS', 'INTERMEDIATE',
'Algerian National Curriculum - Mathematics Terminale AS/AL',
0.80, 8, 16, true, true);

-- ==================================================
-- PHYSICS COURSES (Terminale AS/TM)  
-- ==================================================

-- Course 5: Classical Mechanics (Terminale AS/TM)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('physics-mechanics-term-as',
'Classical Mechanics and Dynamics',
'الميكانيكا الكلاسيكية والديناميكا',
'Comprehensive study of Newtonian mechanics, including kinematics, dynamics, work-energy theorem, conservation laws, and rotational motion. Essential foundation for engineering and physics studies.',
'دراسة شاملة للميكانيكا النيوتونية تشمل الحركة والديناميكا ونظرية الشغل والطاقة وقوانين الحفظ والحركة الدائرية. أساس ضروري لدراسات الهندسة والفيزياء.',
'PHYSICS', 'TERMINALE_AS', 'BAC_LEVEL',
'Algerian National Curriculum - Physics Terminale AS/TM',
0.95, 18, 36, true, false);

-- Course 6: Electricity and Magnetism (Terminale AS/TM)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('physics-electromagnetism-term-as',
'Electricity and Magnetism',
'الكهرباء والمغناطيسية',
'Master electromagnetic theory, electric and magnetic fields, electromagnetic induction, AC/DC circuits, and Maxwell equations. Critical for understanding modern technology and engineering applications.',
'اتقن النظرية الكهرومغناطيسية والمجالات الكهربائية والمغناطيسية والحث الكهرومغناطيسي ودوائر التيار المتردد والمستمر ومعادلات ماكسويل. حاسم لفهم التكنولوجيا الحديثة والتطبيقات الهندسية.',
'PHYSICS', 'TERMINALE_AS', 'BAC_LEVEL',
'Algerian National Curriculum - Physics Terminale AS/TM',
0.90, 16, 32, true, false);

-- Course 7: Optics and Wave Physics (Terminale AS/TM)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('physics-optics-term-as',
'Optics and Wave Physics',
'البصريات وفيزياء الموجات',
'Explore geometric and wave optics, interference, diffraction, polarization, and laser physics. Includes practical applications in telecommunications, medicine, and modern optical technologies.',
'استكشف البصريات الهندسية وبصريات الموجات والتداخل والحيود والاستقطاب وفيزياء الليزر. تشمل التطبيقات العملية في الاتصالات والطب والتقنيات البصرية الحديثة.',
'PHYSICS', 'TERMINALE_AS', 'ADVANCED',
'Algerian National Curriculum - Physics Terminale AS/TM',
0.85, 14, 28, true, false);

-- Course 8: Modern Physics and Quantum Mechanics (Terminale AS/TM)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('physics-modern-term-as',
'Modern Physics and Quantum Mechanics',
'الفيزياء الحديثة وميكانيكا الكم',
'Introduction to quantum mechanics, atomic structure, radioactivity, nuclear physics, and particle physics. Foundation for understanding modern technology and scientific research.',
'مقدمة في ميكانيكا الكم والبنية الذرية والنشاط الإشعاعي والفيزياء النووية وفيزياء الجسيمات. أساس لفهم التكنولوجيا الحديثة والبحث العلمي.',
'PHYSICS', 'TERMINALE_AS', 'ADVANCED',
'Algerian National Curriculum - Physics Terminale AS/TM',
0.75, 12, 24, true, true);

-- ==================================================
-- CHEMISTRY COURSES (Terminale AS/TM)
-- ==================================================

-- Course 9: Organic Chemistry (Terminale AS/TM)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('chemistry-organic-term-as',
'Organic Chemistry and Biomolecules',
'الكيمياء العضوية والجزيئات الحيوية',
'Comprehensive study of organic compounds, functional groups, reaction mechanisms, stereochemistry, and biomolecules. Essential for medicine, pharmacy, and biochemistry studies.',
'دراسة شاملة للمركبات العضوية والمجموعات الوظيفية وآليات التفاعل والكيمياء الفراغية والجزيئات الحيوية. ضروري لدراسات الطب والصيدلة والكيمياء الحيوية.',
'CHEMISTRY', 'TERMINALE_AS', 'BAC_LEVEL',
'Algerian National Curriculum - Chemistry Terminale AS/TM',
0.90, 16, 32, true, false);

-- Course 10: Physical Chemistry and Thermodynamics (Terminale AS/TM)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('chemistry-physical-term-as',
'Physical Chemistry and Thermodynamics',
'الكيمياء الفيزيائية والديناميكا الحرارية',
'Master thermodynamics, chemical kinetics, equilibrium, electrochemistry, and phase transitions. Critical for understanding industrial processes and chemical engineering.',
'اتقن الديناميكا الحرارية والحركية الكيميائية والتوازن والكيمياء الكهربائية وانتقالات الطور. حاسم لفهم العمليات الصناعية والهندسة الكيميائية.',
'CHEMISTRY', 'TERMINALE_AS', 'BAC_LEVEL',
'Algerian National Curriculum - Chemistry Terminale AS/TM',
0.85, 14, 28, true, false);

-- Course 11: Analytical Chemistry (Terminale AS/TM)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('chemistry-analytical-term-as',
'Analytical Chemistry and Instrumentation',
'الكيمياء التحليلية والقياسات',
'Learn qualitative and quantitative analysis techniques, spectroscopy, chromatography, and modern analytical instruments used in research and industry.',
'تعلم تقنيات التحليل النوعي والكمي والطيف والفصل اللوني والأجهزة التحليلية الحديثة المستخدمة في البحث والصناعة.',
'CHEMISTRY', 'TERMINALE_AS', 'INTERMEDIATE',
'Algerian National Curriculum - Chemistry Terminale AS/TM',
0.80, 12, 24, true, false);

-- ==================================================
-- ARABIC LITERATURE COURSES (All Terminale)
-- ==================================================

-- Course 12: Classical Arabic Literature (Terminale AS/AL/TM/GE)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('arabic-classical-term',
'Classical Arabic Literature and Poetry',
'الأدب العربي الكلاسيكي والشعر',
'Explore the rich heritage of classical Arabic literature, from pre-Islamic poetry to Abbasid prose. Study major poets like Al-Mutanabbi, Al-Ma''arri, and prose writers like Al-Jahiz.',
'استكشف التراث الغني للأدب العربي الكلاسيكي من الشعر الجاهلي إلى النثر العباسي. ادرس كبار الشعراء مثل المتنبي والمعري وكتاب النثر مثل الجاحظ.',
'ARABIC_LITERATURE', 'TERMINALE_AS', 'BAC_LEVEL',
'Algerian National Curriculum - Arabic Literature All Terminale',
0.95, 20, 40, true, true);

-- Course 13: Modern Arabic Literature (Terminale AS/AL/TM/GE)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('arabic-modern-term',
'Modern Arabic Literature and Algerian Writers',
'الأدب العربي الحديث والكتاب الجزائريون',
'Study modern Arabic literature movements, Nahda period, and prominent Algerian writers like Kateb Yacine, Mohammed Dib, and Ahlam Mosteghanemi.',
'ادرس حركات الأدب العربي الحديث وفترة النهضة والكتاب الجزائريين البارزين مثل كاتب ياسين ومحمد ديب وأحلام مستغانمي.',
'ARABIC_LITERATURE', 'TERMINALE_AS', 'BAC_LEVEL',
'Algerian National Curriculum - Arabic Literature All Terminale',
0.90, 18, 36, true, false);

-- ==================================================
-- FRENCH LITERATURE COURSES (All Terminale)
-- ==================================================

-- Course 14: French Classical Literature (Terminale AS/AL/TM/GE)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('french-classical-term',
'French Classical Literature: Molière to Hugo',
'الأدب الفرنسي الكلاسيكي: من موليير إلى هوغو',
'Discover the masterpieces of French classical literature, from Molière''s comedies to Victor Hugo''s romanticism. Analyze literary techniques and historical contexts.',
'اكتشف روائع الأدب الفرنسي الكلاسيكي من كوميديات موليير إلى رومانسية فيكتور هوغو. حلل التقنيات الأدبية والسياقات التاريخية.',
'FRENCH', 'TERMINALE_AS', 'BAC_LEVEL',
'Algerian National Curriculum - French Literature All Terminale',
0.85, 16, 32, true, false);

-- Course 15: Francophone Literature and Algerian Expression (Terminale AS/AL/TM/GE)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('french-francophone-term',
'Francophone Literature and Algerian Expression',
'الأدب الفرنكوفوني والتعبير الجزائري',
'Explore Francophone literature with focus on Algerian writers like Assia Djebar, Yasmina Khadra, and Rachid Boudjedra. Study themes of identity, colonialism, and cultural hybridization.',
'استكشف الأدب الفرنكوفوني مع التركيز على الكتاب الجزائريين مثل آسيا جبار وياسمينة خضرا ورشيد بوجدرة. ادرس موضوعات الهوية والاستعمار والتهجين الثقافي.',
'FRENCH', 'TERMINALE_AS', 'BAC_LEVEL',
'Algerian National Curriculum - French Literature All Terminale',
0.90, 14, 28, true, false);

-- ==================================================
-- PHILOSOPHY COURSES (Terminale AS/AL)
-- ==================================================

-- Course 16: Introduction to Philosophy (Terminale AS/AL)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('philosophy-intro-term-as',
'Introduction to Philosophy and Critical Thinking',
'مقدمة في الفلسفة والتفكير النقدي',
'Develop critical thinking skills through the study of major philosophical questions: What is truth? What is justice? What is the meaning of life? Explore different philosophical traditions.',
'طور مهارات التفكير النقدي من خلال دراسة الأسئلة الفلسفية الكبرى: ما هي الحقيقة؟ ما هي العدالة؟ ما معنى الحياة؟ استكشف التقاليد الفلسفية المختلفة.',
'PHILOSOPHY', 'TERMINALE_AS', 'BAC_LEVEL',
'Algerian National Curriculum - Philosophy Terminale AS/AL',
0.90, 16, 32, true, true);

-- Course 17: Ethics and Moral Philosophy (Terminale AS/AL)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('philosophy-ethics-term-as',
'Ethics and Moral Philosophy',
'الأخلاق والفلسفة الأخلاقية',
'Examine fundamental ethical questions and moral theories. Study virtue ethics, deontology, utilitarianism, and their applications to contemporary moral dilemmas.',
'فحص الأسئلة الأخلاقية الأساسية والنظريات الأخلاقية. ادرس أخلاق الفضيلة وعلم الواجبات والنفعية وتطبيقاتها على المعضلات الأخلاقية المعاصرة.',
'PHILOSOPHY', 'TERMINALE_AS', 'ADVANCED',
'Algerian National Curriculum - Philosophy Terminale AS/AL',
0.80, 12, 24, true, false);

-- ==================================================
-- ISLAMIC STUDIES COURSES (All Terminale)
-- ==================================================

-- Course 18: Islamic Civilization and History (Terminale AS/AL/TM/GE)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('islamic-civilization-term',
'Islamic Civilization and History',
'الحضارة الإسلامية والتاريخ',
'Study the development of Islamic civilization, from the Prophet''s era to the modern period. Explore contributions to science, philosophy, art, and literature.',
'ادرس تطور الحضارة الإسلامية من عهد النبوة إلى العصر الحديث. استكشف الإسهامات في العلوم والفلسفة والفن والأدب.',
'ISLAMIC_STUDIES', 'TERMINALE_AS', 'BAC_LEVEL',
'Algerian National Curriculum - Islamic Studies All Terminale',
0.85, 18, 36, true, true);

-- Course 19: Islamic Ethics and Jurisprudence (Terminale AS/AL/TM/GE)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('islamic-ethics-term',
'Islamic Ethics and Jurisprudence (Fiqh)',
'الأخلاق الإسلامية والفقه',
'Explore Islamic ethical principles, jurisprudence (fiqh), and their applications in contemporary life. Study the sources of Islamic law and ethical decision-making.',
'استكشف المبادئ الأخلاقية الإسلامية والفقه وتطبيقاتها في الحياة المعاصرة. ادرس مصادر الشريعة الإسلامية وصنع القرار الأخلاقي.',
'ISLAMIC_STUDIES', 'TERMINALE_AS', 'INTERMEDIATE',
'Algerian National Curriculum - Islamic Studies All Terminale',
0.80, 14, 28, true, false);

-- ==================================================
-- ADDITIONAL SPECIALIZED COURSES
-- ==================================================

-- Course 20: Scientific Research Methodology (Terminale AS)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('research-methodology-term-as',
'Scientific Research Methodology',
'منهجية البحث العلمي',
'Learn essential research skills: formulating hypotheses, designing experiments, data analysis, and scientific writing. Prepare for university-level research and scientific careers.',
'تعلم مهارات البحث الأساسية: صياغة الفرضيات وتصميم التجارب وتحليل البيانات والكتابة العلمية. استعد للبحث على مستوى الجامعة والوظائف العلمية.',
'COMPUTER_SCIENCE', 'TERMINALE_AS', 'ADVANCED',
'Algerian National Curriculum - Scientific Methodology',
0.70, 10, 20, true, false);

-- Course 21: Introduction to Computer Science (Terminale TM)
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, difficulty, curriculum, bac_relevance, total_lessons, estimated_hours, is_published, is_free) VALUES
('computer-science-term-tm',
'Introduction to Computer Science and Programming',
'مقدمة في علوم الحاسوب والبرمجة',
'Introduction to computer science fundamentals: algorithms, data structures, programming concepts, and computational thinking. Essential for technology and engineering careers.',
'مقدمة في أساسيات علوم الحاسوب: الخوارزميات وبنية البيانات ومفاهيم البرمجة والتفكير الحاسوبي. ضروري لوظائف التكنولوجيا والهندسة.',
'COMPUTER_SCIENCE', 'TERMINALE_TM', 'INTERMEDIATE',
'Algerian National Curriculum - Computer Science Terminale TM',
0.75, 12, 24, true, true);
