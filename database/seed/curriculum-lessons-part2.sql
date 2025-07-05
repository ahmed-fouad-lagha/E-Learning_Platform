-- Continuation of Comprehensive Lesson Content
-- Physics, Chemistry, Literature, Philosophy, and Islamic Studies

-- ==================================================
-- PHYSICS LESSONS: Classical Mechanics
-- ==================================================

INSERT INTO public.lessons (id, title, title_ar, content, content_ar, order_num, duration, course_id) VALUES

('physics-mech-01', 'Kinematics: Motion in One Dimension', 'الحركة في بُعد واحد',
'**Learning Objectives:**
- Understand position, velocity, and acceleration
- Analyze motion graphs and interpret their meaning
- Solve problems involving uniformly accelerated motion
- Apply kinematic equations to real-world scenarios

**Content:**
Kinematics is the study of motion without considering the forces that cause it.

**Key Concepts:**
1. Position (x): location of an object
2. Displacement (Δx): change in position
3. Velocity (v): rate of change of position
4. Acceleration (a): rate of change of velocity

**Kinematic Equations (constant acceleration):**
1. v = v₀ + at
2. x = x₀ + v₀t + ½at²
3. v² = v₀² + 2a(x - x₀)
4. x = x₀ + ½(v₀ + v)t

**Motion Graphs:**
- Position vs. time: slope = velocity
- Velocity vs. time: slope = acceleration, area = displacement
- Acceleration vs. time: area = change in velocity

**Free Fall:**
Special case where a = g = 9.8 m/s² (downward)

**Examples:**
- A car accelerates from rest at 2 m/s² for 10 seconds. Find final velocity and distance.
- A ball is thrown upward with initial velocity 20 m/s. Find maximum height and time to return.

**Practice Problems:**
1. A train travels 100 m in 20 s with constant acceleration from rest. Find acceleration.
2. A stone is dropped from 45 m height. Find time to hit ground and final velocity.
3. Two cars start from rest. Car A accelerates at 3 m/s², car B at 2 m/s². When will A be 50 m ahead?

**BAC-Style Question:**
A particle moves along x-axis with acceleration a(t) = 6t - 2. If at t=0, x=5m and v=3m/s, find position and velocity at t=4s.',

'**أهداف التعلم:**
- فهم الموضع والسرعة والتسارع
- تحليل رسوم الحركة وتفسير معناها
- حل مسائل الحركة المتسارعة بانتظام
- تطبيق معادلات الحركة على سيناريوهات واقعية

**المحتوى:**
علم الحركة هو دراسة الحركة دون النظر في القوى المسببة لها.

**المفاهيم الأساسية:**
1. الموضع (x): مكان الجسم
2. الإزاحة (Δx): التغير في الموضع
3. السرعة (v): معدل تغير الموضع
4. التسارع (a): معدل تغير السرعة

**معادلات الحركة (تسارع ثابت):**
1. v = v₀ + at
2. x = x₀ + v₀t + ½at²
3. v² = v₀² + 2a(x - x₀)
4. x = x₀ + ½(v₀ + v)t

**رسوم الحركة:**
- الموضع مقابل الزمن: الميل = السرعة
- السرعة مقابل الزمن: الميل = التسارع، المساحة = الإزاحة
- التسارع مقابل الزمن: المساحة = التغير في السرعة

**السقوط الحر:**
حالة خاصة حيث a = g = 9.8 m/s² (نحو الأسفل)

**أمثلة:**
- سيارة تتسارع من السكون بـ 2 m/s² لمدة 10 ثوان. أوجد السرعة النهائية والمسافة.
- كرة تُرمى لأعلى بسرعة ابتدائية 20 m/s. أوجد أقصى ارتفاع ووقت العودة.

**مسائل التدريب:**
1. قطار يقطع 100 m في 20 s بتسارع ثابت من السكون. أوجد التسارع.
2. حجر يسقط من ارتفاع 45 m. أوجد وقت الوصول للأرض والسرعة النهائية.
3. سيارتان تبدآن من السكون. السيارة A تتسارع بـ 3 m/s²، والسيارة B بـ 2 m/s². متى ستكون A متقدمة بـ 50 m؟

**سؤال نمط البكالوريا:**
جسيم يتحرك على المحور x بتسارع a(t) = 6t - 2. إذا كان عند t=0، x=5m و v=3m/s، أوجد الموضع والسرعة عند t=4s.',
1, 45, 'physics-mechanics-term-as'),

('physics-mech-02', 'Newton''s Laws of Motion', 'قوانين نيوتن للحركة',
'**Learning Objectives:**
- Understand and apply Newton''s three laws of motion
- Analyze forces and their effects on motion
- Solve problems involving friction, tension, and normal forces
- Apply Newton''s laws to systems of connected objects

**Content:**
Newton''s laws form the foundation of classical mechanics and describe the relationship between forces and motion.

**Newton''s First Law (Law of Inertia):**
An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by a net external force.

**Newton''s Second Law:**
The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.
F_net = ma

**Newton''s Third Law:**
For every action, there is an equal and opposite reaction.
F_AB = -F_BA

**Types of Forces:**
1. Gravitational force: F_g = mg
2. Normal force: F_N (perpendicular to surface)
3. Friction force: f = μN
4. Tension force: F_T (in strings/ropes)
5. Applied force: F_applied

**Friction:**
- Static friction: f_s ≤ μ_s N
- Kinetic friction: f_k = μ_k N
- μ_s > μ_k (static coefficient > kinetic coefficient)

**Problem-Solving Strategy:**
1. Draw free-body diagram
2. Choose coordinate system
3. Apply Newton''s second law in component form
4. Solve for unknowns

**Examples:**
- Block on inclined plane: analyze forces parallel and perpendicular to incline
- Atwood machine: two masses connected by rope over pulley
- Block being pulled with friction: F_applied vs. friction force

**Practice Problems:**
1. A 10 kg box is pushed with 50 N force. If μ_k = 0.3, find acceleration.
2. Two blocks (5 kg and 3 kg) connected by rope. 20 N force pulls the system. Find acceleration and tension.
3. A 2 kg block slides down a 30° incline with μ_k = 0.2. Find acceleration.

**BAC-Style Question:**
A car of mass 1200 kg travels at 60 km/h on a horizontal road. If the coefficient of friction between tires and road is 0.7, find the minimum stopping distance.',

'**أهداف التعلم:**
- فهم وتطبيق قوانين نيوتن الثلاثة للحركة
- تحليل القوى وتأثيراتها على الحركة
- حل مسائل تشمل الاحتكاك والشد والقوى العمودية
- تطبيق قوانين نيوتن على أنظمة الأجسام المتصلة

**المحتوى:**
قوانين نيوتن تشكل أساس الميكانيكا الكلاسيكية وتصف العلاقة بين القوى والحركة.

**قانون نيوتن الأول (قانون القصور الذاتي):**
الجسم الساكن يبقى ساكناً، والجسم المتحرك يبقى متحركاً بسرعة ثابتة، ما لم تؤثر عليه قوة خارجية محصلة.

**قانون نيوتن الثاني:**
تسارع الجسم يتناسب طردياً مع القوة المحصلة المؤثرة عليه وعكسياً مع كتلته.
F_net = ma

**قانون نيوتن الثالث:**
لكل فعل رد فعل مساوٍ له في المقدار ومعاكس له في الاتجاه.
F_AB = -F_BA

**أنواع القوى:**
1. قوة الجاذبية: F_g = mg
2. القوة العمودية: F_N (عمودية على السطح)
3. قوة الاحتكاك: f = μN
4. قوة الشد: F_T (في الخيوط/الحبال)
5. القوة المطبقة: F_applied

**الاحتكاك:**
- الاحتكاك الساكن: f_s ≤ μ_s N
- الاحتكاك الحركي: f_k = μ_k N
- μ_s > μ_k (معامل السكون > معامل الحركة)

**استراتيجية حل المسائل:**
1. ارسم مخطط الجسم الحر
2. اختر نظام الإحداثيات
3. طبق قانون نيوتن الثاني في شكل مركبات
4. حل للمجاهيل

**أمثلة:**
- كتلة على مستوى مائل: تحليل القوى الموازية والعمودية للمستوى
- آلة أتوود: كتلتان متصلتان بحبل عبر بكرة
- كتلة تُسحب مع الاحتكاك: القوة المطبقة مقابل قوة الاحتكاك

**مسائل التدريب:**
1. صندوق كتلته 10 kg يُدفع بقوة 50 N. إذا كان μ_k = 0.3، أوجد التسارع.
2. كتلتان (5 kg و 3 kg) متصلتان بحبل. قوة 20 N تسحب النظام. أوجد التسارع والشد.
3. كتلة 2 kg تنزلق على مستوى مائل 30° مع μ_k = 0.2. أوجد التسارع.

**سؤال نمط البكالوريا:**
سيارة كتلتها 1200 kg تسير بسرعة 60 km/h على طريق أفقي. إذا كان معامل الاحتكاك بين الإطارات والطريق 0.7، أوجد أقل مسافة توقف.',
2, 50, 'physics-mechanics-term-as'),

-- ==================================================
-- CHEMISTRY LESSONS: Organic Chemistry
-- ==================================================

('chemistry-org-01', 'Introduction to Organic Chemistry', 'مقدمة في الكيمياء العضوية',
'**Learning Objectives:**
- Understand the unique properties of carbon
- Learn basic nomenclature of organic compounds
- Identify functional groups and their properties
- Understand isomerism in organic compounds

**Content:**
Organic chemistry is the study of carbon-containing compounds. Carbon''s unique ability to form four covalent bonds and chain with itself makes it the basis of all life.

**Why Carbon is Special:**
1. Tetravalent (forms 4 bonds)
2. Can form single, double, and triple bonds
3. Can chain with itself indefinitely
4. Forms stable bonds with many elements (H, O, N, S, halogens)

**Types of Carbon Compounds:**
1. Hydrocarbons: contain only C and H
   - Alkanes: C-C single bonds (saturated)
   - Alkenes: C=C double bonds (unsaturated)
   - Alkynes: C≡C triple bonds (unsaturated)
   - Aromatic: benzene ring structures

2. Functional Groups:
   - Alcohols: -OH
   - Aldehydes: -CHO
   - Ketones: C=O
   - Carboxylic acids: -COOH
   - Esters: -COO-
   - Amines: -NH₂

**Nomenclature Rules (IUPAC):**
1. Find longest carbon chain
2. Number to give functional group lowest number
3. Name substituents as prefixes
4. Use appropriate suffix for functional group

**Isomerism:**
1. Structural isomers: different connectivity
2. Stereoisomers: same connectivity, different spatial arrangement
   - Geometric (cis/trans)
   - Optical (enantiomers)

**Examples:**
- Methane: CH₄ (simplest alkane)
- Ethanol: C₂H₅OH (alcohol)
- Acetone: CH₃COCH₃ (ketone)
- Benzene: C₆H₆ (aromatic)

**Practice Problems:**
1. Name: CH₃CH₂CH(CH₃)CH₂OH
2. Draw structural formula for 2-methylbutanoic acid
3. Identify functional groups in glucose: C₆H₁₂O₆

**BAC-Style Question:**
An organic compound has molecular formula C₄H₁₀O. Draw all possible structural isomers and identify the functional groups.',

'**أهداف التعلم:**
- فهم الخصائص الفريدة للكربون
- تعلم التسمية الأساسية للمركبات العضوية
- تحديد المجموعات الوظيفية وخصائصها
- فهم التشاكل في المركبات العضوية

**المحتوى:**
الكيمياء العضوية هي دراسة المركبات المحتوية على الكربون. قدرة الكربون الفريدة على تكوين أربع روابط تساهمية والتسلسل مع نفسه تجعله أساس كل الحياة.

**لماذا الكربون مميز:**
1. رباعي التكافؤ (يكون 4 روابط)
2. يمكنه تكوين روابط أحادية ومزدوجة وثلاثية
3. يمكنه التسلسل مع نفسه إلى ما لا نهاية
4. يكون روابط مستقرة مع عناصر كثيرة (H, O, N, S, الهالوجينات)

**أنواع مركبات الكربون:**
1. الهيدروكربونات: تحتوي على C و H فقط
   - الألكانات: روابط C-C أحادية (مشبعة)
   - الألكينات: روابط C=C مزدوجة (غير مشبعة)
   - الألكاينات: روابط C≡C ثلاثية (غير مشبعة)
   - العطرية: تراكيب حلقة البنزين

2. المجموعات الوظيفية:
   - الكحولات: -OH
   - الألدهيدات: -CHO
   - الكيتونات: C=O
   - الأحماض الكربوكسيلية: -COOH
   - الإسترات: -COO-
   - الأمينات: -NH₂

**قواعد التسمية (IUPAC):**
1. أوجد أطول سلسلة كربونية
2. رقم لتعطي المجموعة الوظيفية أقل رقم
3. سم البدائل كبادئات
4. استخدم اللاحقة المناسبة للمجموعة الوظيفية

**التشاكل:**
1. المتشاكلات البنيوية: اتصال مختلف
2. المتشاكلات الفراغية: نفس الاتصال، ترتيب فراغي مختلف
   - هندسي (سيس/ترانس)
   - ضوئي (متقابلات)

**أمثلة:**
- الميثان: CH₄ (أبسط ألكان)
- الإيثانول: C₂H₅OH (كحول)
- الأسيتون: CH₃COCH₃ (كيتون)
- البنزين: C₆H₆ (عطري)

**مسائل التدريب:**
1. سم: CH₃CH₂CH(CH₃)CH₂OH
2. ارسم الصيغة البنيوية لحمض 2-ميثيل بيوتانويك
3. حدد المجموعات الوظيفية في الجلوكوز: C₆H₁₂O₆

**سؤال نمط البكالوريا:**
مركب عضوي له الصيغة الجزيئية C₄H₁₀O. ارسم جميع المتشاكلات البنيوية الممكنة وحدد المجموعات الوظيفية.',
1, 45, 'chemistry-organic-term-as'),

-- ==================================================
-- ARABIC LITERATURE LESSONS: Classical Literature
-- ==================================================

('arabic-class-01', 'Pre-Islamic Poetry (Al-Shi''r Al-Jahili)', 'الشعر الجاهلي',
'**Learning Objectives:**
- Understand the characteristics of pre-Islamic poetry
- Analyze the seven suspended poems (Al-Mu''allaqat)
- Study the themes and meters of Jahili poetry
- Appreciate the oral tradition and its preservation

**Content:**
Pre-Islamic poetry represents the pinnacle of Arabic literary expression before Islam. It reflects the life, values, and culture of Arabian tribes.

**Key Characteristics:**
1. Oral tradition: memorized and recited
2. Complex meter and rhyme schemes
3. Rich imagery from desert life
4. Tribal pride and individual heroism
5. Detailed descriptions of nature, camels, horses

**Major Themes:**
1. **Al-Ghazal (الغزل)**: Love poetry
2. **Al-Fakhr (الفخر)**: Boasting and pride
3. **Al-Hija'' (الهجاء)**: Satirical poetry
4. **Ar-Ritha'' (الرثاء)**: Elegiac poetry
5. **Al-Wasf (الوصف)**: Descriptive poetry

**The Seven Suspended Poems (Al-Mu''allaqat):**
1. Imru'' al-Qais: "قفا نبك من ذكرى حبيب ومنزل"
2. Tarafa ibn al-Abd: "لخولة أطلال ببرقة ثهمد"
3. Zuhayr ibn Abi Sulma: "أمن أم أوفى دمنة لم تكلم"
4. Labid ibn Rabi''a: "عفت الديار محلها فمقامها"
5. Antara ibn Shaddad: "هل غادر الشعراء من متردم"
6. Amr ibn Kulthum: "ألا هبي بصحنك فاصبحينا"
7. Al-Harith ibn Hilliza: "آذنتنا ببينها أسماء"

**Poetic Structure:**
- **Bayt (بيت)**: Single line consisting of two hemistichs
- **Sadr (صدر)**: First hemistich
- **Ajuz (عجز)**: Second hemistich
- **Qafiya (قافية)**: Rhyme
- **Bahr (بحر)**: Meter

**Famous Pre-Islamic Poets:**
1. **Imru'' al-Qais**: "The Wandering King" - master of love poetry
2. **Antara ibn Shaddad**: Warrior-poet, symbol of chivalry
3. **Zuhayr ibn Abi Sulma**: Known for wisdom poetry
4. **Al-Nabigha al-Dhubiyani**: Court poet of Al-Hira

**Analysis Example - Imru'' al-Qais:**
"قفا نبك من ذكرى حبيب ومنزل / بسقط اللوى بين الدخول فحومل"
- Theme: Nostalgia and lost love
- Meter: At-Tawil
- Imagery: Desert landscape, abandoned campsites

**Practice Activities:**
1. Memorize the opening lines of three Mu''allaqat
2. Identify themes in selected verses
3. Analyze the imagery in Antara''s description of his horse
4. Compare different poets'' treatment of the same theme

**BAC-Style Question:**
Analyze the theme of "Al-Atlal" (abandoned dwelling places) in pre-Islamic poetry, citing examples from at least two different poets and explaining its cultural significance.',

'**أهداف التعلم:**
- فهم خصائص الشعر الجاهلي
- تحليل المعلقات السبع
- دراسة موضوعات وبحور الشعر الجاهلي
- تقدير التقليد الشفهي وحفظه

**المحتوى:**
الشعر الجاهلي يمثل قمة التعبير الأدبي العربي قبل الإسلام. يعكس حياة وقيم وثقافة القبائل العربية.

**الخصائص الرئيسية:**
1. التقليد الشفهي: محفوظ ومتلو
2. بحور وقواف معقدة
3. صور غنية من الحياة الصحراوية
4. الفخر القبلي والبطولة الفردية
5. وصف تفصيلي للطبيعة والإبل والخيل

**الموضوعات الرئيسية:**
1. **الغزل**: شعر الحب
2. **الفخر**: المباهاة والكبرياء
3. **الهجاء**: الشعر الساخر
4. **الرثاء**: شعر الحزن
5. **الوصف**: الشعر الوصفي

**المعلقات السبع:**
1. امرؤ القيس: "قفا نبك من ذكرى حبيب ومنزل"
2. طرفة بن العبد: "لخولة أطلال ببرقة ثهمد"
3. زهير بن أبي سلمى: "أمن أم أوفى دمنة لم تكلم"
4. لبيد بن ربيعة: "عفت الديار محلها فمقامها"
5. عنترة بن شداد: "هل غادر الشعراء من متردم"
6. عمرو بن كلثوم: "ألا هبي بصحنك فاصبحينا"
7. الحارث بن حلزة: "آذنتنا ببينها أسماء"

**البنية الشعرية:**
- **البيت**: سطر واحد يتكون من شطرين
- **الصدر**: الشطر الأول
- **العجز**: الشطر الثاني
- **القافية**: الروي
- **البحر**: الوزن

**شعراء جاهليون مشهورون:**
1. **امرؤ القيس**: "الملك الضليل" - أستاذ الغزل
2. **عنترة بن شداد**: الشاعر المحارب، رمز الفروسية
3. **زهير بن أبي سلمى**: مشهور بالحكمة
4. **النابغة الذبياني**: شاعر بلاط الحيرة

**مثال التحليل - امرؤ القيس:**
"قفا نبك من ذكرى حبيب ومنزل / بسقط اللوى بين الدخول فحومل"
- الموضوع: الحنين والحب المفقود
- البحر: الطويل
- الصور: المناظر الصحراوية، المنازل المهجورة

**أنشطة التدريب:**
1. احفظ المطالع لثلاث معلقات
2. حدد الموضوعات في أبيات مختارة
3. حلل الصور في وصف عنترة لفرسه
4. قارن معالجة شعراء مختلفين لنفس الموضوع

**سؤال نمط البكالوريا:**
حلل موضوع "الأطلال" (الديار المهجورة) في الشعر الجاهلي، مستشهداً بأمثلة من شاعرين مختلفين على الأقل وموضحاً أهميتها الثقافية.',
1, 50, 'arabic-classical-term'),

-- ==================================================
-- PHILOSOPHY LESSONS: Introduction to Philosophy
-- ==================================================

('philosophy-intro-01', 'What is Philosophy?', 'ما هي الفلسفة؟',
'**Learning Objectives:**
- Define philosophy and understand its scope
- Distinguish philosophy from other disciplines
- Identify major branches of philosophy
- Understand the value of philosophical thinking

**Content:**
Philosophy (from Greek "philo" = love, "sophia" = wisdom) is the love of wisdom and the pursuit of fundamental questions about existence, knowledge, values, reason, mind, and language.

**What Makes a Question Philosophical:**
1. Fundamental and abstract
2. Cannot be answered by empirical observation alone
3. Requires critical thinking and logical reasoning
4. Often challenges common assumptions
5. Has practical implications for how we live

**Major Branches of Philosophy:**

**1. Metaphysics (الميتافيزيقا):**
- What is reality?
- What exists?
- What is the nature of being?
- Mind-body problem
- Free will vs. determinism

**2. Epistemology (نظرية المعرفة):**
- What is knowledge?
- How do we know what we know?
- What are the sources of knowledge?
- Skepticism and certainty
- Truth and belief

**3. Ethics (الأخلاق):**
- What is right and wrong?
- How should we live?
- What makes actions moral or immoral?
- Virtue, duty, and consequences
- Applied ethics (medical, business, environmental)

**4. Logic (المنطق):**
- What makes reasoning valid?
- How to construct good arguments?
- Fallacies and their identification
- Deductive vs. inductive reasoning
- Symbolic logic

**5. Aesthetics (علم الجمال):**
- What is beauty?
- What is art?
- Aesthetic experience and judgment
- Creativity and artistic value

**Philosophy vs. Other Disciplines:**
- **Science**: Empirical observation and experimentation
- **Religion**: Faith and revelation
- **Philosophy**: Reason and logical argumentation
- **Common sense**: Unexamined beliefs and assumptions

**The Socratic Method:**
Questioning technique developed by Socrates:
1. Ask clarifying questions
2. Challenge assumptions
3. Examine evidence
4. Consider implications
5. Question the question

**Benefits of Philosophical Thinking:**
1. Critical thinking skills
2. Clear and precise communication
3. Ability to see multiple perspectives
4. Better decision-making
5. Understanding of fundamental concepts

**Famous Philosophical Questions:**
- Is there a God?
- Do we have free will?
- What is the meaning of life?
- What is justice?
- What is consciousness?
- How should society be organized?

**Practice Activities:**
1. Identify which branch of philosophy addresses each question
2. Use the Socratic method to examine a belief you hold
3. Construct a valid argument for a position you support
4. Analyze the assumptions behind a common saying

**BAC-Style Question:**
"I think, therefore I am" (Cogito ergo sum) - Explain Descartes'' argument and discuss what this tells us about the nature of knowledge and existence.',

'**أهداف التعلم:**
- تعريف الفلسفة وفهم نطاقها
- التمييز بين الفلسفة والتخصصات الأخرى
- تحديد الفروع الرئيسية للفلسفة
- فهم قيمة التفكير الفلسفي

**المحتوى:**
الفلسفة (من اليونانية "فيلو" = حب، "صوفيا" = حكمة) هي حب الحكمة والسعي وراء الأسئلة الأساسية حول الوجود والمعرفة والقيم والعقل والذهن واللغة.

**ما يجعل السؤال فلسفياً:**
1. أساسي ومجرد
2. لا يمكن الإجابة عليه بالملاحظة التجريبية وحدها
3. يتطلب التفكير النقدي والاستدلال المنطقي
4. غالباً ما يتحدى الافتراضات الشائعة
5. له آثار عملية على كيفية عيشنا

**الفروع الرئيسية للفلسفة:**

**1. الميتافيزيقا:**
- ما هي الحقيقة؟
- ما الذي يوجد؟
- ما طبيعة الكينونة؟
- مشكلة العقل-الجسد
- الإرادة الحرة مقابل الحتمية

**2. نظرية المعرفة:**
- ما هي المعرفة؟
- كيف نعرف ما نعرف؟
- ما مصادر المعرفة؟
- الشك واليقين
- الحقيقة والاعتقاد

**3. الأخلاق:**
- ما الصواب والخطأ؟
- كيف يجب أن نعيش؟
- ما الذي يجعل الأفعال أخلاقية أو غير أخلاقية؟
- الفضيلة والواجب والنتائج
- الأخلاق التطبيقية (طبية، تجارية، بيئية)

**4. المنطق:**
- ما الذي يجعل الاستدلال صحيحاً؟
- كيفية بناء حجج جيدة؟
- المغالطات وتحديدها
- الاستدلال الاستنباطي مقابل الاستقرائي
- المنطق الرمزي

**5. علم الجمال:**
- ما هو الجمال؟
- ما هو الفن؟
- التجربة والحكم الجمالي
- الإبداع والقيمة الفنية

**الفلسفة مقابل التخصصات الأخرى:**
- **العلم**: الملاحظة والتجريب التجريبي
- **الدين**: الإيمان والوحي
- **الفلسفة**: العقل والمحاجة المنطقية
- **الحس المشترك**: المعتقدات والافتراضات غير المفحوصة

**الطريقة السقراطية:**
تقنية الاستجواب التي طورها سقراط:
1. طرح أسئلة توضيحية
2. تحدي الافتراضات
3. فحص الأدلة
4. النظر في الآثار
5. التشكيك في السؤال

**فوائد التفكير الفلسفي:**
1. مهارات التفكير النقدي
2. التواصل الواضح والدقيق
3. القدرة على رؤية وجهات نظر متعددة
4. اتخاذ قرارات أفضل
5. فهم المفاهيم الأساسية

**أسئلة فلسفية مشهورة:**
- هل يوجد إله؟
- هل لدينا إرادة حرة؟
- ما معنى الحياة؟
- ما هي العدالة؟
- ما هو الوعي؟
- كيف يجب تنظيم المجتمع؟

**أنشطة التدريب:**
1. حدد أي فرع من الفلسفة يتناول كل سؤال
2. استخدم الطريقة السقراطية لفحص اعتقاد تحمله
3. بناء حجة صحيحة لموقف تدعمه
4. تحليل الافتراضات وراء قول شائع

**سؤال نمط البكالوريا:**
"أنا أفكر، إذن أنا موجود" (كوجيتو إرجو سوم) - اشرح حجة ديكارت وناقش ما يخبرنا به هذا عن طبيعة المعرفة والوجود.',
1, 48, 'philosophy-intro-term-as');
