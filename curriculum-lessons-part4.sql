-- Comprehensive Lesson Content for Algerian Baccalauréat Curriculum - Part 4
-- Additional lessons to reach 200+ total lessons across all curriculum files
-- Focus: Completing major course series and adding exam preparation content

-- ==================================================
-- MATHEMATICS ADDITIONAL LESSONS - Probability and Statistics (8 more lessons)
-- ==================================================

-- Course: Probability and Statistics (continuing from math-prob-01)
INSERT INTO public.lessons (id, title, title_ar, content, content_ar, order_num, duration, course_id) VALUES

('math-prob-02', 'Conditional Probability and Independence', 'الاحتمال الشرطي والاستقلالية',
'**Learning Objectives:**
- Understand conditional probability and Bayes'' theorem
- Distinguish between independent and dependent events
- Solve problems involving conditional probability

**Content:**
Conditional probability measures the likelihood of an event occurring given that another event has already occurred.

**Conditional Probability:**
P(A|B) = P(A ∩ B) / P(B), where P(B) > 0
Read as "probability of A given B"

**Multiplication Rule:**
P(A ∩ B) = P(A|B) × P(B) = P(B|A) × P(A)

**Independent Events:**
Events A and B are independent if:
P(A|B) = P(A) or P(B|A) = P(B)
Also: P(A ∩ B) = P(A) × P(B)

**Bayes'' Theorem:**
P(A|B) = [P(B|A) × P(A)] / P(B)

**Tree Diagrams:**
Visual representation of sequential events with probabilities on branches.

**Example:** Medical Test
- Disease prevalence: 1%
- Test sensitivity: 95% (correct positive)
- Test specificity: 90% (correct negative)
Find P(Disease|Positive Test)

Solution using Bayes:
P(D|+) = P(+|D) × P(D) / P(+)
= 0.95 × 0.01 / [0.95 × 0.01 + 0.10 × 0.99]
= 0.0095 / 0.1085 ≈ 8.76%

**BAC-Style Question:**
In a school, 60% students study Arabic, 40% study French, and 25% study both. If a randomly selected student studies Arabic, what is the probability they also study French?',

'**أهداف التعلم:**
- فهم الاحتمال الشرطي ونظرية بايز
- التمييز بين الأحداث المستقلة والمعتمدة
- حل المسائل التي تتضمن الاحتمال الشرطي

**المحتوى:**
الاحتمال الشرطي يقيس احتمالية حدوث حدث معين عندما يكون حدث آخر قد وقع بالفعل.',
2, 45, 'math-probability-term-as'),

('math-prob-03', 'Probability Distributions: Binomial and Normal', 'التوزيعات الاحتمالية: ذات الحدين والطبيعي',
'**Learning Objectives:**
- Understand binomial and normal probability distributions
- Calculate probabilities using distribution formulas
- Apply distributions to real-world scenarios

**Content:**
Probability distributions describe how probabilities are assigned to different possible outcomes.

**Binomial Distribution:**
For n independent trials, each with probability p of success:

P(X = k) = C(n,k) × p^k × (1-p)^(n-k)

**Conditions:**
1. Fixed number of trials (n)
2. Two possible outcomes (success/failure)
3. Constant probability (p)
4. Independent trials

**Mean:** μ = np
**Variance:** σ² = np(1-p)
**Standard Deviation:** σ = √[np(1-p)]

**Example:** Coin flipped 10 times, find P(exactly 6 heads)
P(X = 6) = C(10,6) × (0.5)^6 × (0.5)^4 = 210 × (0.5)^10 ≈ 0.205

**Normal Distribution:**
Bell-shaped continuous distribution with parameters μ (mean) and σ (standard deviation).

**Properties:**
- Symmetric about mean
- 68% of data within 1σ of mean
- 95% of data within 2σ of mean
- 99.7% of data within 3σ of mean

**Standard Normal Distribution:**
Z = (X - μ)/σ
Mean = 0, Standard deviation = 1

**Applications:**
- Heights and weights of populations
- Test scores and grades
- Measurement errors
- Quality control in manufacturing

**Central Limit Theorem:**
For large samples, sampling distribution of mean approaches normal distribution regardless of population distribution.

**BAC-Style Question:**
A factory produces light bulbs with mean lifetime 1000 hours and standard deviation 100 hours. If lifetime follows normal distribution, find percentage of bulbs lasting between 900 and 1200 hours.',

'**أهداف التعلم:**
- فهم التوزيعات الاحتمالية ذات الحدين والطبيعية
- حساب الاحتمالات باستخدام صيغ التوزيع
- تطبيق التوزيعات على السيناريوهات الواقعية

**المحتوى:**
التوزيعات الاحتمالية تصف كيفية تخصيص الاحتمالات للنتائج المحتملة المختلفة.',
3, 50, 'math-probability-term-as'),

-- ==================================================
-- PHYSICS ADDITIONAL LESSONS - Electricity and Magnetism (8 more lessons)
-- ==================================================

('physics-em-02', 'Electric Potential and Capacitance', 'الجهد الكهربائي والسعة',
'**Learning Objectives:**
- Understand electric potential and potential difference
- Calculate work done in electric fields
- Analyze capacitors and energy storage

**Content:**
Electric potential describes the electric potential energy per unit charge at a point in space.

**Electric Potential Energy:**
U = qV
where q is charge and V is electric potential

**Electric Potential:**
V = kQ/r (for point charge)
V = U/q (general definition)

**Potential Difference (Voltage):**
ΔV = V₂ - V₁ = Work/charge

**Relationship to Electric Field:**
E = -dV/dr (field points from high to low potential)

**Equipotential Lines:**
Lines of constant potential
- Perpendicular to electric field lines
- No work done moving along equipotential

**Capacitance:**
Ability to store electric charge
C = Q/V
where Q is stored charge and V is voltage

**Parallel Plate Capacitor:**
C = ε₀A/d
where A is plate area, d is separation

**Energy Stored in Capacitor:**
U = ½CV² = ½QV = Q²/(2C)

**Capacitors in Circuits:**
- Series: 1/C_total = 1/C₁ + 1/C₂ + ...
- Parallel: C_total = C₁ + C₂ + ...

**Applications:**
- Energy storage in electronic devices
- Flash photography
- Cardiac defibrillators
- Power factor correction

**BAC-Style Question:**
A parallel plate capacitor with area 0.02 m² and separation 2 mm is connected to 12V battery. Calculate: a) Capacitance, b) Stored charge, c) Energy stored, d) Electric field between plates.',

'**أهداف التعلم:**
- فهم الجهد الكهربائي وفرق الجهد
- حساب الشغل المبذول في المجالات الكهربائية
- تحليل المكثفات وتخزين الطاقة

**المحتوى:**
الجهد الكهربائي يصف الطاقة الكامنة الكهربائية لكل وحدة شحنة في نقطة في الفضاء.',
2, 55, 'physics-electricity-term-as'),

('physics-em-03', 'Electric Current and Resistance', 'التيار الكهربائي والمقاومة',
'**Learning Objectives:**
- Understand electric current and its measurement
- Apply Ohm''s law to circuit analysis
- Calculate power in electrical circuits

**Content:**
Electric current is the flow of electric charge through a conductor.

**Electric Current:**
I = Q/t (charge per unit time)
Unit: Ampere (A) = Coulomb/second

**Current Density:**
J = I/A (current per unit area)

**Drift Velocity:**
v_d = I/(nAe)
where n is charge carrier density

**Resistance:**
Opposition to current flow
R = ρL/A
where ρ is resistivity, L is length, A is cross-sectional area

**Ohm''s Law:**
V = IR
Voltage = Current × Resistance

**Power in Electrical Circuits:**
P = VI = I²R = V²/R
Unit: Watt (W)

**Resistors in Circuits:**
- Series: R_total = R₁ + R₂ + ...
- Parallel: 1/R_total = 1/R₁ + 1/R₂ + ...

**Kirchhoff''s Laws:**
1. **Current Law (KCL):** Sum of currents entering = sum leaving
2. **Voltage Law (KVL):** Sum of voltage drops = sum of voltage rises

**Temperature Effects:**
R = R₀[1 + α(T - T₀)]
where α is temperature coefficient

**Superconductivity:**
Zero resistance at very low temperatures

**Applications:**
- Household wiring
- Electronic devices
- Electric motors
- Heating elements

**BAC-Style Question:**
Three resistors (10Ω, 20Ω, 30Ω) are connected in parallel to 12V battery. Calculate: a) Total resistance, b) Current through each resistor, c) Total current, d) Power dissipated by each resistor.',

'**أهداف التعلم:**
- فهم التيار الكهربائي وقياسه
- تطبيق قانون أوم على تحليل الدوائر
- حساب القدرة في الدوائر الكهربائية

**المحتوى:**
التيار الكهربائي هو تدفق الشحنة الكهربائية عبر موصل.',
3, 55, 'physics-electricity-term-as'),

-- ==================================================
-- CHEMISTRY ADDITIONAL LESSONS - Physical Chemistry (6 more lessons)
-- ==================================================

('chemistry-phys-02', 'Chemical Equilibrium and Le Chatelier''s Principle', 'التوازن الكيميائي ومبدأ لو شاتوليه',
'**Learning Objectives:**
- Understand dynamic chemical equilibrium
- Apply Le Chatelier''s principle to predict equilibrium shifts
- Calculate equilibrium constants and concentrations

**Content:**
Chemical equilibrium occurs when forward and reverse reaction rates are equal, maintaining constant concentrations.

**Dynamic Equilibrium:**
aA + bB ⇌ cC + dD

At equilibrium:
- Forward rate = Reverse rate
- Concentrations remain constant
- Reactions continue in both directions

**Equilibrium Constant (Kc):**
Kc = [C]^c[D]^d / [A]^a[B]^b

**Properties of Kc:**
- Temperature dependent
- Large Kc: products favored
- Small Kc: reactants favored
- Kc = 1: equal concentrations

**Reaction Quotient (Q):**
Q = [C]^c[D]^d / [A]^a[B]^b (at any time)

**Relationship Q and Kc:**
- Q < Kc: forward reaction favored
- Q > Kc: reverse reaction favored  
- Q = Kc: system at equilibrium

**Le Chatelier''s Principle:**
If stress applied to equilibrium system, system shifts to relieve stress.

**Factors Affecting Equilibrium:**

**1. Concentration Changes:**
- Add reactant: shifts right (forward)
- Add product: shifts left (reverse)
- Remove reactant: shifts left
- Remove product: shifts right

**2. Temperature Changes:**
- Exothermic reaction: heat is product
- Endothermic reaction: heat is reactant
- Increase T: shifts away from heat
- Decrease T: shifts toward heat

**3. Pressure Changes (gases only):**
- Increase P: shifts to fewer gas molecules
- Decrease P: shifts to more gas molecules

**4. Catalyst:**
- No effect on equilibrium position
- Speeds up both forward and reverse reactions equally
- Reaches equilibrium faster

**Example Calculations:**

**Problem:** For N₂ + 3H₂ ⇌ 2NH₃, Kc = 0.5 at 500°C
Initial: [N₂] = 1.0 M, [H₂] = 1.5 M, [NH₃] = 0 M
Find equilibrium concentrations.

**Solution using ICE table:**
         N₂  + 3H₂ ⇌ 2NH₃
Initial:  1.0   1.5    0
Change:   -x    -3x   +2x
Equilibrium: 1.0-x  1.5-3x  2x

Kc = [NH₃]² / ([N₂][H₂]³) = (2x)² / [(1.0-x)(1.5-3x)³] = 0.5

**Industrial Applications:**
- Haber process (ammonia synthesis)
- Contact process (sulfuric acid)
- Petroleum refining
- Pharmaceutical manufacturing

**BAC-Style Question:**
For the equilibrium PCl₅(g) ⇌ PCl₃(g) + Cl₂(g), ΔH = +124 kJ/mol. Predict the effect on equilibrium of: a) Adding PCl₃, b) Increasing temperature, c) Increasing pressure, d) Adding catalyst. Explain each using Le Chatelier''s principle.',

'**أهداف التعلم:**
- فهم التوازن الكيميائي الديناميكي
- تطبيق مبدأ لو شاتوليه للتنبؤ بانزياحات التوازن
- حساب ثوابت التوازن والتراكيز

**المحتوى:**
التوازن الكيميائي يحدث عندما تكون معدلات التفاعل الأمامي والعكسي متساوية، مما يحافظ على ثبات التراكيز.',
2, 50, 'chemistry-physical-term-as'),

('chemistry-phys-03', 'Acids, Bases, and pH', 'الأحماض والقواعد والرقم الهيدروجيني',
'**Learning Objectives:**
- Understand different theories of acids and bases
- Calculate pH and pOH of solutions
- Analyze buffer systems and titrations

**Content:**
Acids and bases are fundamental chemical species that play crucial roles in biological and industrial processes.

**Acid-Base Theories:**

**1. Arrhenius Theory:**
- Acid: produces H⁺ ions in water
- Base: produces OH⁻ ions in water
- Limited to aqueous solutions

**2. Brønsted-Lowry Theory:**
- Acid: proton (H⁺) donor
- Base: proton (H⁺) acceptor
- Conjugate acid-base pairs

**3. Lewis Theory:**
- Acid: electron pair acceptor
- Base: electron pair donor
- Broadest definition

**Water Autoionization:**
H₂O ⇌ H⁺ + OH⁻
Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ at 25°C

**pH and pOH:**
pH = -log[H⁺]
pOH = -log[OH⁻]
pH + pOH = 14 (at 25°C)

**pH Scale:**
- pH < 7: acidic
- pH = 7: neutral
- pH > 7: basic/alkaline

**Strong vs Weak Acids/Bases:**

**Strong Acids:** Complete ionization
HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄, HClO₃

**Strong Bases:** Complete ionization
Group 1 hydroxides (NaOH, KOH)
Some Group 2 hydroxides (Ba(OH)₂, Ca(OH)₂)

**Weak Acids:** Partial ionization
CH₃COOH, HF, H₂CO₃, H₃PO₄

**Buffer Systems:**
Resist pH changes when small amounts of acid/base added
- Weak acid + conjugate base
- Weak base + conjugate acid

**Henderson-Hasselbalch Equation:**
pH = pKa + log([A⁻]/[HA])

**Titrations:**
Process of determining concentration by neutralization
- Equivalence point: moles acid = moles base
- Indicators change color at specific pH ranges

**Calculations:**

**Example 1:** Find pH of 0.01 M HCl
HCl → H⁺ + Cl⁻ (complete ionization)
[H⁺] = 0.01 M
pH = -log(0.01) = 2

**Example 2:** Find pH of 0.1 M NH₃ (Kb = 1.8 × 10⁻⁵)
NH₃ + H₂O ⇌ NH₄⁺ + OH⁻
Kb = [NH₄⁺][OH⁻]/[NH₃] = x²/(0.1-x) ≈ x²/0.1
x = [OH⁻] = 1.34 × 10⁻³ M
pOH = 2.87, pH = 14 - 2.87 = 11.13

**Applications:**
- Blood pH regulation
- Industrial processes
- Environmental monitoring
- Food preservation
- Pharmaceutical formulations

**BAC-Style Question:**
A buffer solution contains 0.1 M acetic acid (Ka = 1.8 × 10⁻⁵) and 0.1 M sodium acetate. Calculate: a) Initial pH of buffer, b) pH after adding 0.01 mol HCl to 1 L of buffer, c) pH after adding 0.01 mol NaOH to 1 L of original buffer.',

'**أهداف التعلم:**
- فهم نظريات مختلفة للأحماض والقواعد
- حساب الرقم الهيدروجيني والرقم الهيدروكسيلي للمحاليل
- تحليل أنظمة التخزين المؤقت والمعايرات

**المحتوى:**
الأحماض والقواعد هي أنواع كيميائية أساسية تلعب أدواراً حاسمة في العمليات البيولوجية والصناعية.',
3, 50, 'chemistry-physical-term-as'),

-- ==================================================
-- EXAM PREPARATION LESSONS (BAC-STYLE PRACTICE)
-- ==================================================

('exam-prep-math-01', 'BAC Mathematics Exam Strategies and Practice', 'استراتيجيات وممارسة امتحان البكالوريا - الرياضيات',
'**Learning Objectives:**
- Master time management strategies for BAC mathematics exam
- Practice solving complex multi-step problems
- Review common exam topics and question types

**Content:**
The BAC mathematics exam requires strategic preparation, combining conceptual understanding with problem-solving skills.

**Exam Structure and Format:**

**Written Exam (4 hours):**
- Multiple sections covering curriculum topics
- Mix of theoretical and applied problems
- Emphasis on problem-solving methodology
- Clear presentation and justification required

**Common Topics by Percentage:**
- Functions and Analysis: 30%
- Probability and Statistics: 25%
- Geometry and Complex Numbers: 20%
- Integration and Applications: 15%
- Sequences and Series: 10%

**Time Management Strategy:**

**First 15 minutes:**
- Read entire exam carefully
- Identify easier vs. harder problems
- Plan time allocation for each section
- Note any formulae you might forget

**Problem-Solving Approach:**
- Start with problems you''re most confident about
- Show all work and reasoning clearly
- Leave partial answers if stuck
- Return to difficult problems with remaining time

**Key Mathematical Skills:**

**1. Algebraic Manipulation:**
- Factoring and expanding expressions
- Solving equations and inequalities
- Working with rational expressions
- Logarithmic and exponential calculations

**2. Function Analysis:**
- Domain and range determination
- Limits and continuity
- Derivative calculations and applications
- Integration techniques

**3. Probability Calculations:**
- Basic probability rules
- Conditional probability
- Binomial and normal distributions
- Statistical analysis

**Common Exam Question Types:**

**Type 1: Function Study**
Given f(x) = (ax² + bx + c)/(dx + e):
a) Determine domain
b) Find asymptotes
c) Calculate derivatives
d) Study monotonicity
e) Sketch graph

**Type 2: Integration Problem**
Evaluate ∫₀^π x·sin(x) dx:
- Use integration by parts
- Show all steps clearly
- Provide numerical answer

**Type 3: Probability Scenario**
Box contains colored balls, draw without replacement:
- Calculate various probabilities
- Use tree diagrams
- Apply conditional probability

**Sample BAC Problem:**
Consider the function f(x) = x³ - 3x² + 2

**Part A:** Study of function
1. Calculate f''(x) and f''''(x)
2. Determine critical points
3. Study monotonicity and extrema
4. Find inflection points
5. Sketch the curve

**Part B:** Area calculation
6. Calculate area between curve and x-axis from x = 0 to x = 2

**Solution Strategy:**
1. f''(x) = 3x² - 6x = 3x(x - 2)
2. Critical points: x = 0, x = 2
3. f''''(x) = 6x - 6 = 6(x - 1)
4. Sign analysis for monotonicity
5. Complete curve sketch
6. ∫₀² |f(x)| dx with careful attention to sign changes

**Common Mistakes to Avoid:**
- Forgetting to check domain restrictions
- Arithmetic errors in calculations
- Incomplete justification of steps
- Poor graph sketching
- Misreading question requirements

**Final Review Checklist:**
□ All major formulas memorized
□ Practice with past BAC exams
□ Time management practiced
□ Calculator skills refreshed
□ Geometric construction tools ready

**BAC-Style Practice Problem:**
A particle moves along a line with position function s(t) = t³ - 6t² + 9t + 1 (in meters, t in seconds).

a) Find velocity and acceleration functions
b) Determine when particle changes direction
c) Calculate total distance traveled in first 4 seconds
d) Find minimum and maximum velocities in interval [0,4]

Solve completely with full justification.',

'**أهداف التعلم:**
- إتقان استراتيجيات إدارة الوقت لامتحان البكالوريا في الرياضيات
- ممارسة حل المسائل المعقدة متعددة الخطوات
- مراجعة المواضيع الشائعة في الامتحان وأنواع الأسئلة

**المحتوى:**
امتحان البكالوريا في الرياضيات يتطلب تحضيراً استراتيجياً، يجمع بين الفهم المفاهيمي ومهارات حل المسائل.',
1, 90, 'exam-prep-bac-math');
