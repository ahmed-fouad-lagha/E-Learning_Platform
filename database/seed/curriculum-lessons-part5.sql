-- Comprehensive Lesson Content for Algerian Baccalauréat Curriculum - Part 5
-- Continuing expansion to reach 200+ lessons - Focus on Mathematics and Physics completion

-- ==================================================
-- MATHEMATICS LESSONS - Functions and Analysis (Complete remaining 10 lessons)
-- ==================================================

INSERT INTO public.lessons (id, title, title_ar, content, content_ar, order_num, duration, course_id) VALUES

('math-func-06', 'Applications of Derivatives: Optimization', 'تطبيقات المشتقات: الأمثلة',
'**Learning Objectives:**
- Apply derivatives to solve optimization problems
- Find maximum and minimum values in real-world contexts
- Use calculus to analyze business and geometric problems

**Content:**
Derivatives provide powerful tools for finding optimal solutions to real-world problems involving maxima and minima.

**Steps for Optimization Problems:**
1. **Identify the quantity to optimize** (maximize or minimize)
2. **Set up the constraint equation** (if any)
3. **Express the objective function** in terms of one variable
4. **Find the derivative** of the objective function
5. **Set derivative equal to zero** and solve for critical points
6. **Test critical points** using second derivative test or endpoint analysis
7. **Verify the solution** makes physical sense

**Example 1: Maximum Area Problem**
A farmer has 200 meters of fence to enclose a rectangular field. What dimensions give maximum area?

**Solution:**
Let x = width, y = length
Constraint: 2x + 2y = 200, so y = 100 - x
Area function: A(x) = x(100 - x) = 100x - x²
A''(x) = 100 - 2x
Setting A''(x) = 0: 100 - 2x = 0, so x = 50
A''''(x) = -2 < 0, confirming maximum
Therefore: x = 50 m, y = 50 m (square gives maximum area)
Maximum area = 2500 m²

**Example 2: Minimum Cost Problem**
A cylindrical can must hold 1000 cm³. Find dimensions that minimize surface area.

**Solution:**
Volume constraint: πr²h = 1000, so h = 1000/(πr²)
Surface area: S = 2πr² + 2πrh = 2πr² + 2πr(1000/πr²) = 2πr² + 2000/r
S''(r) = 4πr - 2000/r²
Setting S''(r) = 0: 4πr - 2000/r² = 0
4πr³ = 2000
r³ = 500/π
r = ∛(500/π) ≈ 5.42 cm
h = 1000/(π(5.42)²) ≈ 10.84 cm

**Related Rates Problems:**
When two or more variables change with respect to time, we can relate their rates of change.

**Example 3: Balloon Expansion**
A spherical balloon is being inflated at 100 cm³/min. How fast is radius increasing when r = 5 cm?

**Solution:**
Volume: V = (4/3)πr³
Given: dV/dt = 100 cm³/min
Find: dr/dt when r = 5 cm

Differentiate: dV/dt = (4/3)π(3r²)(dr/dt) = 4πr²(dr/dt)
Substitute: 100 = 4π(5²)(dr/dt) = 100π(dr/dt)
Therefore: dr/dt = 1/π ≈ 0.318 cm/min

**Business Applications:**

**Example 4: Profit Maximization**
A company''s profit function is P(x) = -2x² + 800x - 5000, where x is units produced.
Find production level for maximum profit.

**Solution:**
P''(x) = -4x + 800
Setting P''(x) = 0: -4x + 800 = 0, so x = 200
P''''(x) = -4 < 0, confirming maximum
Maximum profit occurs at 200 units
P(200) = -2(200)² + 800(200) - 5000 = 75,000

**Geometric Optimization:**

**Example 5: Shortest Distance**
Find the point on curve y = x² closest to point (0, 1).

**Solution:**
Distance function: D² = x² + (x² - 1)²
D² = x² + x⁴ - 2x² + 1 = x⁴ - x² + 1
To minimize D², we minimize D²:
d(D²)/dx = 4x³ - 2x = 2x(2x² - 1)
Critical points: x = 0, x = ±1/√2
Testing: x = 1/√2 gives minimum distance
Closest point: (1/√2, 1/2)

**Practice Problems:**
1. Find two positive numbers whose sum is 50 and whose product is maximum.
2. A box with square base and open top must have volume 32 m³. Find dimensions for minimum surface area.
3. Water flows into conical tank at 2 m³/min. If tank has radius 3 m and height 4 m, how fast is water level rising when depth is 2 m?

**BAC-Style Question:**
A rectangular poster must have area 300 cm² with margins of 2 cm on top and bottom, 3 cm on sides. Find dimensions of poster that minimize total area including margins.',

'**أهداف التعلم:**
- تطبيق المشتقات لحل مسائل الأمثلة
- إيجاد القيم العظمى والصغرى في السياقات الواقعية
- استخدام التفاضل لتحليل مسائل الأعمال والهندسة

**المحتوى:**
المشتقات توفر أدوات قوية لإيجاد الحلول المثلى للمسائل الواقعية التي تتضمن القيم العظمى والصغرى.',
6, 60, 'math-functions-term-as'),

('math-func-07', 'Curve Sketching and Graph Analysis', 'رسم المنحنيات وتحليل المخططات',
'**Learning Objectives:**
- Systematically analyze and sketch function graphs
- Identify key features: intercepts, asymptotes, extrema, inflection points
- Interpret mathematical information from graphs

**Content:**
Systematic curve sketching combines multiple calculus concepts to create accurate function graphs.

**Complete Curve Sketching Process:**

**Step 1: Domain and Range**
- Find where function is defined
- Identify any restrictions (division by zero, square roots of negatives)
- Determine vertical asymptotes

**Step 2: Intercepts**
- y-intercept: f(0) if x = 0 is in domain
- x-intercepts: solve f(x) = 0

**Step 3: Symmetry**
- Even function: f(-x) = f(x) (symmetric about y-axis)
- Odd function: f(-x) = -f(x) (symmetric about origin)
- Periodic function: f(x + T) = f(x)

**Step 4: Asymptotes**
- **Vertical**: Where denominator = 0 but numerator ≠ 0
- **Horizontal**: lim(x→∞) f(x) and lim(x→-∞) f(x)
- **Oblique**: When degree of numerator = degree of denominator + 1

**Step 5: First Derivative Analysis**
- Find f''(x)
- Determine critical points where f''(x) = 0 or undefined
- Create sign chart for f''(x)
- Identify intervals of increase/decrease
- Locate local maxima and minima

**Step 6: Second Derivative Analysis**
- Find f''''(x)
- Determine where f''''(x) = 0 or undefined
- Create sign chart for f''''(x)
- Identify concavity (up where f''''(x) > 0, down where f''''(x) < 0)
- Locate inflection points

**Step 7: Additional Points and Sketch**
- Plot key points, asymptotes, extrema, inflection points
- Sketch curve following behavior indicated by analysis

**Example: Complete Analysis of f(x) = (x² - 4)/(x - 1)**

**Step 1: Domain**
Domain: ℝ \ {1} (all real numbers except x = 1)

**Step 2: Intercepts**
y-intercept: f(0) = (0 - 4)/(0 - 1) = 4
x-intercepts: x² - 4 = 0, so x = ±2

**Step 3: Symmetry**
f(-x) = ((-x)² - 4)/(-x - 1) = (x² - 4)/(-x - 1)
No obvious symmetry

**Step 4: Asymptotes**
Vertical asymptote: x = 1
For horizontal asymptote:
f(x) = (x² - 4)/(x - 1) = x + 1 - 3/(x - 1)
As x → ±∞, f(x) → ∞
Oblique asymptote: y = x + 1

**Step 5: First Derivative**
f(x) = (x² - 4)/(x - 1)
f''(x) = [(x - 1)(2x) - (x² - 4)(1)]/(x - 1)²
f''(x) = (2x² - 2x - x² + 4)/(x - 1)²
f''(x) = (x² - 2x + 4)/(x - 1)²

Discriminant: (-2)² - 4(1)(4) = 4 - 16 = -12 < 0
Since x² - 2x + 4 > 0 for all x, and (x - 1)² > 0 for x ≠ 1:
f''(x) > 0 for all x ≠ 1

Therefore, f is strictly increasing on (-∞, 1) and (1, ∞)
No local extrema

**Step 6: Second Derivative**
f''''(x) = d/dx[(x² - 2x + 4)/(x - 1)²]
Using quotient rule:
f''''(x) = -6/(x - 1)³

Sign analysis:
- f''''(x) > 0 when (x - 1)³ < 0, i.e., x < 1
- f''''(x) < 0 when (x - 1)³ > 0, i.e., x > 1

Concave up on (-∞, 1), concave down on (1, ∞)
No inflection points (x = 1 not in domain)

**Step 7: Sketch**
- Vertical asymptote at x = 1
- Oblique asymptote y = x + 1
- x-intercepts at (-2, 0) and (2, 0)
- y-intercept at (0, 4)
- Increasing on both sides of asymptote
- Concave up for x < 1, concave down for x > 1

**Rational Function Guidelines:**

**For f(x) = P(x)/Q(x):**
- Vertical asymptotes where Q(x) = 0 and P(x) ≠ 0
- If degree of P < degree of Q: horizontal asymptote y = 0
- If degree of P = degree of Q: horizontal asymptote y = leading coefficient ratio
- If degree of P = degree of Q + 1: oblique asymptote

**Special Function Types:**

**Exponential Functions:**
- Domain: all real numbers
- Always positive (never crosses x-axis)
- Horizontal asymptote at y = 0
- Strictly increasing (a > 1) or decreasing (0 < a < 1)

**Logarithmic Functions:**
- Domain: x > 0
- Vertical asymptote at x = 0
- No horizontal asymptote
- Strictly increasing (a > 1) or decreasing (0 < a < 1)

**Trigonometric Functions:**
- Periodic behavior
- Know standard periods and amplitudes
- Identify phase shifts and vertical shifts

**Practice Problems:**
1. Sketch f(x) = x³ - 3x² + 2
2. Analyze g(x) = (x² + 1)/(x² - 4)
3. Graph h(x) = xe^(-x)

**BAC-Style Question:**
For f(x) = (2x² - x - 3)/(x + 1), perform complete curve analysis including domain, asymptotes, monotonicity, concavity, and sketch the graph with all key features labeled.',

'**أهداف التعلم:**
- تحليل ورسم مخططات الدوال بشكل منهجي
- تحديد الخصائص الرئيسية: نقاط التقاطع والمقاربات والنقاط القصوى ونقاط الانعطاف
- تفسير المعلومات الرياضية من المخططات

**المحتوى:**
رسم المنحنيات المنهجي يجمع بين مفاهيم متعددة من التفاضل لإنشاء مخططات دقيقة للدوال.',
7, 65, 'math-functions-term-as'),

('math-func-08', 'Sequences and Series Fundamentals', 'أساسيات المتتاليات والمتسلسلات',
'**Learning Objectives:**
- Understand arithmetic and geometric sequences
- Calculate sums of finite and infinite series
- Apply sequences to real-world problems

**Content:**
Sequences and series are fundamental mathematical concepts with applications in finance, computer science, and natural phenomena.

**Sequences:**
A sequence is an ordered list of numbers: a₁, a₂, a₃, ..., aₙ, ...

**Notation:**
- {aₙ} or (aₙ) represents the sequence
- aₙ is the nth term (general term)
- n is the index or position

**Types of Sequences:**

**1. Arithmetic Sequences**
Each term differs from the previous by a constant difference d.

**General Form:** aₙ = a₁ + (n-1)d
where a₁ = first term, d = common difference

**Example:** 3, 7, 11, 15, 19, ...
a₁ = 3, d = 4
aₙ = 3 + (n-1)4 = 4n - 1

**Properties:**
- aₙ₊₁ - aₙ = d (constant)
- Middle term property: aₙ = (aₙ₋₁ + aₙ₊₁)/2

**2. Geometric Sequences**
Each term is obtained by multiplying the previous term by a constant ratio r.

**General Form:** aₙ = a₁ · r^(n-1)
where a₁ = first term, r = common ratio

**Example:** 2, 6, 18, 54, 162, ...
a₁ = 2, r = 3
aₙ = 2 · 3^(n-1)

**Properties:**
- aₙ₊₁/aₙ = r (constant)
- Middle term property: aₙ² = aₙ₋₁ · aₙ₊₁

**Series:**
A series is the sum of terms in a sequence.

**Arithmetic Series:**
Sum of first n terms: Sₙ = n/2[2a₁ + (n-1)d] = n/2(a₁ + aₙ)

**Example:** Find sum of first 20 terms of 3, 7, 11, 15, ...
a₁ = 3, d = 4, n = 20
S₂₀ = 20/2[2(3) + (20-1)4] = 10[6 + 76] = 10(82) = 820

**Geometric Series:**
Sum of first n terms: Sₙ = a₁(1 - rⁿ)/(1 - r) for r ≠ 1

**Example:** Find sum of first 10 terms of 2, 6, 18, 54, ...
a₁ = 2, r = 3, n = 10
S₁₀ = 2(1 - 3¹⁰)/(1 - 3) = 2(1 - 59049)/(-2) = 59048

**Infinite Geometric Series:**
For |r| < 1: S∞ = a₁/(1 - r)

**Example:** Sum of 1 + 1/2 + 1/4 + 1/8 + ...
a₁ = 1, r = 1/2
S∞ = 1/(1 - 1/2) = 1/(1/2) = 2

**Convergence and Divergence:**

**Geometric Series Convergence:**
- If |r| < 1: series converges to a₁/(1 - r)
- If |r| ≥ 1: series diverges

**Tests for Convergence:**

**1. nth Term Test:**
If lim(n→∞) aₙ ≠ 0, then series diverges
If lim(n→∞) aₙ = 0, test is inconclusive

**2. Ratio Test:**
For series Σaₙ, if lim(n→∞) |aₙ₊₁/aₙ| = L:
- L < 1: series converges
- L > 1: series diverges  
- L = 1: test inconclusive

**Applications:**

**1. Compound Interest:**
If P is principal, r is annual rate, compounded n times per year:
Amount after t years: A = P(1 + r/n)^(nt)

**Example:** $1000 invested at 5% annual rate, compounded monthly for 3 years
A = 1000(1 + 0.05/12)^(12×3) = 1000(1.004167)³⁶ ≈ $1161.62

**2. Population Growth:**
If population grows at rate r per period:
Pₙ = P₀(1 + r)ⁿ

**3. Depreciation:**
If value depreciates at rate r per period:
Vₙ = V₀(1 - r)ⁿ

**4. Infinite Decimal Expansions:**
0.333... = 3/10 + 3/100 + 3/1000 + ... = (3/10)/(1 - 1/10) = 1/3

**Fibonacci Sequence:**
Special sequence where each term is sum of two preceding terms:
1, 1, 2, 3, 5, 8, 13, 21, 34, 55, ...
aₙ = aₙ₋₁ + aₙ₋₂ for n ≥ 3

**Golden Ratio:**
lim(n→∞) aₙ₊₁/aₙ = φ = (1 + √5)/2 ≈ 1.618

**Practice Problems:**
1. Find the 50th term of arithmetic sequence: 5, 12, 19, 26, ...
2. Calculate sum of geometric series: 3 + 6 + 12 + ... + 768
3. Determine if series converges: 1/2 + 1/4 + 1/8 + 1/16 + ...
4. A ball bounces to 3/4 of its previous height. If dropped from 16 meters, find total distance traveled.

**BAC-Style Question:**
A bank offers two investment options:
Option A: Simple interest of 6% per year
Option B: Compound interest of 5.5% per year, compounded quarterly

For an initial investment of 10,000 dinars over 5 years:
a) Calculate final amount for each option
b) Determine which option is better
c) Find the break-even time when both options give equal returns',

'**أهداف التعلم:**
- فهم المتتاليات الحسابية والهندسية
- حساب مجاميع المتسلسلات المحدودة واللانهائية
- تطبيق المتتاليات على المسائل الواقعية

**المحتوى:**
المتتاليات والمتسلسلات مفاهيم رياضية أساسية لها تطبيقات في التمويل وعلوم الحاسوب والظواهر الطبيعية.',
8, 55, 'math-functions-term-as'),

-- ==================================================
-- MATHEMATICS LESSONS - Complex Numbers (10 lessons)
-- ==================================================

('math-complex-01', 'Introduction to Complex Numbers', 'مقدمة في الأعداد المركبة',
'**Learning Objectives:**
- Understand the need for complex numbers
- Master algebraic operations with complex numbers
- Convert between rectangular and polar forms

**Content:**
Complex numbers extend the real number system to solve equations that have no real solutions, such as x² + 1 = 0.

**Historical Context:**
- Introduced to solve cubic equations in 16th century
- Initially called "imaginary" numbers by René Descartes
- Now essential in engineering, physics, and mathematics

**The Imaginary Unit:**
i = √(-1), where i² = -1

**Powers of i:**
- i¹ = i
- i² = -1  
- i³ = i² · i = -1 · i = -i
- i⁴ = i² · i² = (-1)(-1) = 1
- Pattern repeats every 4 powers

**Complex Number Definition:**
A complex number z has the form z = a + bi, where:
- a = real part (Re(z))
- b = imaginary part (Im(z))
- a, b ∈ ℝ (real numbers)

**Examples:**
- 3 + 4i: real part = 3, imaginary part = 4
- -2 - 5i: real part = -2, imaginary part = -5
- 7: real part = 7, imaginary part = 0 (pure real)
- 3i: real part = 0, imaginary part = 3 (pure imaginary)

**Complex Plane (Argand Diagram):**
- Horizontal axis: real part
- Vertical axis: imaginary part
- Point (a,b) represents z = a + bi

**Equality of Complex Numbers:**
a + bi = c + di if and only if a = c and b = d

**Algebraic Operations:**

**1. Addition and Subtraction:**
(a + bi) ± (c + di) = (a ± c) + (b ± d)i

**Example:**
(3 + 4i) + (2 - 7i) = (3 + 2) + (4 - 7)i = 5 - 3i
(5 + 2i) - (1 + 6i) = (5 - 1) + (2 - 6)i = 4 - 4i

**2. Multiplication:**
(a + bi)(c + di) = ac + adi + bci + bdi²
= ac + (ad + bc)i + bd(-1)
= (ac - bd) + (ad + bc)i

**Example:**
(3 + 2i)(1 + 4i) = 3(1) - 2(4) + [3(4) + 2(1)]i = 3 - 8 + 14i = -5 + 14i

**3. Complex Conjugate:**
For z = a + bi, the conjugate is z̄ = a - bi

**Properties:**
- z + z̄ = 2a (real number)
- z - z̄ = 2bi (pure imaginary)
- z · z̄ = a² + b² (real number)
- z̄̄ = z

**4. Division:**
To divide complex numbers, multiply by conjugate of denominator:

z₁/z₂ = (z₁ · z̄₂)/(z₂ · z̄₂)

**Example:**
(3 + 4i)/(2 - i) = (3 + 4i)(2 + i)/[(2 - i)(2 + i)]
= (6 + 3i + 8i + 4i²)/(4 - i²)
= (6 + 11i - 4)/(4 + 1)
= (2 + 11i)/5 = 2/5 + 11i/5

**Modulus (Absolute Value):**
For z = a + bi: |z| = √(a² + b²)

This represents the distance from origin to point (a,b) in complex plane.

**Example:** |3 + 4i| = √(3² + 4²) = √(9 + 16) = √25 = 5

**Properties of Modulus:**
- |z₁ · z₂| = |z₁| · |z₂|
- |z₁/z₂| = |z₁|/|z₂|
- |z̄| = |z|
- z · z̄ = |z|²

**Argument (Angle):**
For z = a + bi ≠ 0, the argument θ satisfies:
- cos θ = a/|z|
- sin θ = b/|z|
- tan θ = b/a (when a ≠ 0)

**Polar Form:**
z = r(cos θ + i sin θ) = r cis θ
where r = |z| and θ = arg(z)

**Conversion Examples:**

**Rectangular to Polar:**
Convert z = 1 + i to polar form:
r = |1 + i| = √(1² + 1²) = √2
θ = arctan(1/1) = π/4
Therefore: z = √2 cis(π/4)

**Polar to Rectangular:**
Convert z = 4 cis(π/3) to rectangular form:
z = 4(cos(π/3) + i sin(π/3))
= 4(1/2 + i√3/2)
= 2 + 2√3 i

**Applications:**

**1. Solving Quadratic Equations:**
x² + 2x + 5 = 0
Using quadratic formula:
x = (-2 ± √(4 - 20))/2 = (-2 ± √(-16))/2 = (-2 ± 4i)/2 = -1 ± 2i

**2. Electrical Engineering:**
AC circuits use complex impedance Z = R + iX
where R = resistance, X = reactance

**Practice Problems:**
1. Calculate (2 + 3i)(4 - i) + (1 + 2i)²
2. Find |3 - 4i| and |(2 + i)/(3 - 2i)|
3. Convert 2 + 2√3 i to polar form
4. Solve z² - 4z + 13 = 0

**BAC-Style Question:**
Given z₁ = 2 + 3i and z₂ = 1 - 2i:
a) Calculate z₁ + z₂, z₁ - z₂, z₁ · z₂, and z₁/z₂
b) Find |z₁|, |z₂|, and |z₁ · z₂|  
c) Express z₁ and z₂ in polar form
d) Verify that |z₁ · z₂| = |z₁| · |z₂|',

'**أهداف التعلم:**
- فهم الحاجة للأعداد المركبة
- إتقان العمليات الجبرية مع الأعداد المركبة
- التحويل بين الشكل المستطيل والقطبي

**المحتوى:**
الأعداد المركبة توسع نظام الأعداد الحقيقية لحل المعادلات التي لا تملك حلول حقيقية، مثل x² + 1 = 0.',
1, 60, 'math-complex-term-as');
