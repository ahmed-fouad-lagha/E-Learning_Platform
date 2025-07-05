# منصة التعلم الإلكتروني الجزائرية - Algerian E-Learning Platform

## 🎯 Overview | نظرة عامة

A comprehensive e-learning platform designed specifically for Algerian high school students (lycée) to prepare for BAC exams, aligned with the official ONEC curriculum and optimized for the Algerian educational context.

منصة تعليمية إلكترونية شاملة مصممة خصيصاً لطلاب الثانوية الجزائرية للتحضير لامتحانات البكالوريا، متوافقة مع منهاج الديوان الوطني للامتحانات والمسابقات ومحسنة للسياق التعليمي الجزائري.

## 🚀 Key Features | الميزات الرئيسية

### 📚 Core Learning
- **Adaptive Learning Paths** - مسارات تعلم تكيفية
- **ONEC Curriculum Alignment** - توافق مع منهاج الديوان الوطني
- **Multilingual Content** (Arabic, French, English) - محتوى متعدد اللغات
- **Offline Mode** - وضع العمل بدون انترنت

### 📊 Assessment & Testing
- **BAC Exam Simulator** (2015-2025) - محاكي امتحانات البكالوريا
- **AI-Powered Grading** - التصحيح بالذكاء الاصطناعي
- **Progress Tracking** - تتبع التقدم
- **Performance Analytics** - تحليلات الأداء

### 🤝 Collaboration
- **Study Groups** - مجموعات الدراسة
- **Teacher Q&A Forums** - منتديات الأسئلة والأجوبة مع المعلمين
- **Parent Dashboards** - لوحات تحكم للأولياء
- **Peer Learning** - التعلم التشاركي

### 📱 Accessibility
- **Mobile-First Design** - تصميم محمول أولاً
- **RTL Support** - دعم الكتابة من اليمين إلى اليسار
- **Low-Bandwidth Mode** - وضع النطاق الترددي المنخفض
- **SMS Notifications** - إشعارات الرسائل النصية

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **Internationalization**: next-intl
- **UI Components**: Radix UI + Custom Components
- **Charts**: Recharts
- **Animations**: Framer Motion

## � Project Status

### ✅ Foundation Complete (January 2025)
- [x] **Full-stack architecture** with Next.js 14 + TypeScript
- [x] **Database schema** designed for 100K+ users scaling
- [x] **Authentication system** with role-based access (Student/Teacher/Parent/Admin)
- [x] **Arabic/RTL internationalization** with next-intl
- [x] **PWA setup** with offline capabilities
- [x] **Core UI components** with Radix UI + Tailwind CSS
- [x] **Registration/Login flows** with Supabase integration
- [x] **Comprehensive documentation** (10+ strategic documents)

### 🚧 Current Focus (February 2025)
- [ ] **Team recruitment** (Local Algerian developers + international specialists)
- [ ] **Payment gateway integration** (BaridiMob + CIB Bank)
- [ ] **School partnerships** (5 pilot schools in Algiers/Oran/Constantine)
- [ ] **Ministry of Education** engagement and ONEC alignment
- [ ] **Content creation** (First 10 BAC practice exams)

### 🎯 Next Milestones
- **Sprint 1 (Week 3-4)**: Frontend-Backend integration, SMS verification
- **Sprint 2 (Week 5-6)**: BAC exam simulation core, teacher CMS
- **Alpha Launch (Month 2)**: 200 student testers across 5 schools
- **Beta Launch (Month 3)**: 2,000 students, payment system live

## �🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (for production)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🌍 Internationalization

The platform supports:
- **Arabic** (ar) - Primary language
- **French** (fr) - Secondary language
- **English** (en) - Administrative language

## 📱 Mobile Support

Optimized for Android devices with:
- Progressive Web App (PWA) capabilities
- Offline functionality
- Touch-friendly interface
- Low data usage optimization

## 🎯 Target Market

### Primary Users
- **Students**: Algerian lycée students (15-18 years)
- **Teachers**: High school educators
- **Parents**: Student guardians

### Geographic Focus
- **Urban areas**: Algiers, Oran, Constantine
- **Semi-urban**: Provincial capitals
- **Rural**: With offline capabilities

## 💰 Business Model & Market Opportunity

### 🎯 Target Market
- **1.2M+ lycée students** across Algeria
- **600K students** with internet access
- **150K target users** (25% market penetration)
- **Average revenue**: $20-60/year per student

### 💵 Revenue Projections
```
Year 1: $82,500 (MVP + Early Adoption)
├── Premium Students: 2,500 × $20 = $50,000
├── Family Plans: 500 × $50 = $25,000  
└── School Licenses: 5 × $1,500 = $7,500

Year 2: $792,500 (Growth Phase)
├── Premium Students: 15,000 × $30 = $450,000
├── Family Plans: 3,000 × $60 = $180,000
├── School Licenses: 25 × $2,500 = $62,500
└── Partnerships: $100,000

Year 3: $2,205,000 (Scale Phase)  
├── Premium Students: 40,000 × $30 = $1,200,000
├── Family Plans: 8,000 × $60 = $480,000
├── School Licenses: 75 × $3,000 = $225,000
└── Partnerships: $300,000
```

### Freemium Structure
- **Free Tier**: Basic content access, limited practice tests
- **Premium Tier**: Full content library, unlimited tests, tutoring
- **School License**: Institutional access for schools

## 🤝 Partnerships

### Strategic Partnerships
- **Ministry of Education**: Content validation, official endorsement
- **ONEC**: Curriculum alignment, exam paper licensing  
- **Telecom Partners**: Djezzy/Ooredoo/Mobilis zero-rating programs
- **Universities**: Advanced placement and scholarship programs
- **International**: UNESCO, World Bank education initiatives

## 🔧 Development Status & Setup

## 📈 Implementation Roadmap

### Phase 1: MVP Foundation ✅ (Completed)
- [x] **Project Architecture**: Next.js 14 + TypeScript + Tailwind CSS
- [x] **Database Design**: PostgreSQL + Prisma ORM with user roles
- [x] **Authentication System**: NextAuth.js with Supabase integration  
- [x] **UI Components**: Arabic/RTL support with Radix UI
- [x] **PWA Setup**: Offline capabilities and service workers
- [x] **Documentation**: Business strategy, technical architecture, financial planning

### Phase 2: Team Assembly & Payment Integration 🚧 (Current - Month 1-2)
- [ ] **Local Team Recruitment**: Frontend, Backend, Mobile, UI/UX developers
- [ ] **Payment Gateways**: BaridiMob + CIB Bank integration
- [ ] **Business Registration**: CNRC registration, educational license
- [ ] **School Partnerships**: 5 pilot schools for alpha testing
- [ ] **Content Development**: First 20 courses (Math, Physics, Chemistry)

### Phase 3: Alpha Launch 🎯 (Month 2-3)
- [ ] **Core Features**: Course enrollment, exam simulation, progress tracking
- [ ] **Teacher Portal**: Content management, student analytics
- [ ] **SMS Integration**: Mobilis/Djezzy/Ooredoo notifications
- [ ] **Offline Mode**: Download lessons for offline study
- [ ] **Alpha Testing**: 200 students across 5 schools

### Phase 4: Beta & Scale 🚀 (Month 4-12)
- [ ] **AI Grading**: Essay evaluation with OpenAI integration
- [ ] **Advanced Analytics**: Learning insights and BAC predictions
- [ ] **Parent Dashboards**: Progress monitoring and communication
- [ ] **Gamification**: Badges, leaderboards, study challenges
- [ ] **Multi-School Deployment**: 25+ schools, 5,000+ students

## 📚 Documentation

Our comprehensive project documentation includes:

### 📋 Strategic Planning
- **[Business Strategy](docs/BUSINESS_STRATEGY.md)**: Market analysis, revenue projections ($2.2M by Year 3)
- **[Financial Planning](docs/FINANCIAL_PLANNING.md)**: Budget breakdown ($251K development cost, 280% ROI)
- **[User Acquisition Strategy](docs/USER_ACQUISITION_STRATEGY.md)**: Multi-channel marketing ($500K budget)
- **[Risk Management](docs/RISK_MANAGEMENT.md)**: 20+ identified risks with mitigation plans

### 🛠️ Technical & Implementation  
- **[Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md)**: Scalable system design for 100K+ users
- **[Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md)**: 16-week detailed sprint plan
- **[Implementation Challenges](docs/IMPLEMENTATION_CHALLENGES.md)**: Solutions for Algerian context
- **[Project Management](docs/PROJECT_MANAGEMENT.md)**: Jira templates, GitHub workflows

### 🎯 Action Plans
- **[Next Steps Action Plan](docs/NEXT_STEPS_ACTION_PLAN.md)**: Immediate priorities and timelines
- **[Sprint 0 Action Plan](docs/SPRINT_0_ACTION_PLAN.md)**: Foundation and team setup tasks
- **[Supabase Setup Guide](docs/supabase-setup.md)**: Database configuration instructions

## 🔒 Security & Privacy

- GDPR-compliant data handling
- Secure authentication with NextAuth.js
- Encrypted data transmission
- Regular security audits
- Student data protection protocols

## 🛠️ Backend API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "phone": "+213555123456",
  "password": "password123",
  "name": "أحمد محمد",
  "role": "STUDENT",
  "grade": "TERMINALE_AS",
  "wilaya": "الجزائر",
  "school": "ثانوية الأمير عبد القادر",
  "parentPhone": "+213555987654"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "emailOrPhone": "student@example.com",
  "password": "password123"
}
```

### Course Management

#### Get Courses
```http
GET /api/courses?subject=MATHEMATICS&grade=TERMINALE_AS&page=1&limit=12
Authorization: Bearer <token>
```

#### Get Course Details
```http
GET /api/courses/{courseId}
Authorization: Bearer <token>
```

#### Enroll in Course
```http
POST /api/courses/{courseId}/enroll
Authorization: Bearer <token>
```

### BAC Exam Simulation

#### Get Exams
```http
GET /api/exams?type=BAC_SIMULATION&subject=MATHEMATICS&year=2024
Authorization: Bearer <token>
```

#### Submit Exam
```http
POST /api/exams/{examId}/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": {
    "questionId1": "answer1",
    "questionId2": "answer2"
  },
  "timeSpent": 7200
}
```

### Adaptive Learning

#### Get Learning Recommendations
```http
GET /api/learning/recommendations
Authorization: Bearer <token>
```

#### Record Study Session
```http
POST /api/learning/recommendations
Authorization: Bearer <token>
Content-Type: application/json

{
  "contentId": "lesson_123",
  "subject": "MATHEMATICS",
  "timeSpent": 30,
  "questionsAnswered": 10,
  "correctAnswers": 8,
  "difficulty": "medium"
}
```

### Notifications

#### Get Notifications
```http
GET /api/notifications?page=1&unreadOnly=true
Authorization: Bearer <token>
```

#### Mark as Read
```http
PATCH /api/notifications/{notificationId}
Authorization: Bearer <token>
```

## 🚀 Setup Instructions

### 1. Environment Setup

```bash
# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push
```

### 2. Database Setup

The platform uses PostgreSQL with Prisma ORM. The schema includes:

- **Users**: Students, teachers, parents, admins
- **Courses**: Subject-based courses aligned with ONEC curriculum
- **Lessons**: Individual learning units with offline support
- **Exams**: BAC simulations and practice tests
- **Learning Progress**: Adaptive learning tracking
- **Study Groups**: Collaborative learning
- **Forum**: Q&A and discussions
- **Notifications**: Multi-channel alerts

### 3. SMS Integration

Configure SMS providers for Algerian telecom operators:

```env
# Mobilis
SMS_PROVIDER="mobilis"
SMS_API_URL="https://api.mobilis.dz/sms"

# Djezzy
SMS_PROVIDER="djezzy"
SMS_API_URL="https://api.djezzy.dz/sms"

# Ooredoo
SMS_PROVIDER="ooredoo"
SMS_API_URL="https://api.ooredoo.dz/sms"
```

### 4. PWA Features

The platform includes:
- **Service Worker**: Offline caching and background sync
- **Web App Manifest**: Native app-like experience
- **Push Notifications**: Exam reminders and updates
- **Offline Mode**: Download lessons for offline study

### 5. Adaptive Learning Engine

Features include:
- **Personalized Recommendations**: Based on performance and BAC requirements
- **Study Schedule Generation**: Optimized for Algerian school calendar
- **Performance Prediction**: BAC exam score estimation
- **Weakness Identification**: Focus areas for improvement

## 📱 Mobile-First Features

### Offline Support
- Cached lessons and practice tests
- Background sync when connection restored
- Low-bandwidth optimizations
- Audio-only lessons for data saving

### Algerian Context
- RTL text direction for Arabic content
- Wilaya-based school listings
- ONEC curriculum alignment
- BAC exam simulation with past papers
- Cultural references in examples

### Accessibility
- Screen reader support
- High contrast mode
- Font size adjustment
- Keyboard navigation
- Voice notes for visual impairments

## 🔧 Development

### Database Schema
```bash
# Generate Prisma client
npx prisma generate

# Apply schema changes
npx prisma db push

# Reset database (development only)
npx prisma migrate reset
```

### API Testing
```bash
# Run development server
npm run dev

# Test API endpoints
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

### SMS Testing
```bash
# Test SMS service
node -e "
const { createSMSService, SMSService } = require('./src/lib/sms.ts');
const service = createSMSService();
service.sendSMS({
  to: '+213555123456',
  message: 'Test message',
  type: 'verification'
}).then(console.log);
"
```

## 🤝 Contributing

We welcome contributions from developers, educators, and the Algerian community!

### Getting Started for Contributors
1. **Fork the repository**
2. **Clone locally**: `git clone https://github.com/your-username/E-Learning_Platform.git`
3. **Install dependencies**: `npm install`
4. **Set up environment**: Copy `.env.example` to `.env.local`
5. **Run development server**: `npm run dev`
6. **Create feature branch**: `git checkout -b feature/your-feature`
7. **Submit pull request** with comprehensive description

### Areas for Contribution
- **Content Creation**: BAC exercises, lesson materials
- **Translation**: Arabic/French localization improvements
- **UI/UX**: Mobile-first design enhancements
- **Backend**: API optimizations, database improvements
- **Testing**: Automated testing, device compatibility
- **Documentation**: Technical guides, user manuals

### Community
- **Discord**: Join our developer community (link coming soon)
- **GitHub Issues**: Report bugs, request features
- **Email**: contact@elearning-dz.com (coming soon)

## 📞 Contact & Support

### For Developers
- **Technical Issues**: Create GitHub issue
- **Feature Requests**: Use GitHub discussions
- **Security Issues**: Email security@elearning-dz.com

### For Schools & Educators  
- **Partnership Inquiries**: partnerships@elearning-dz.com
- **Content Collaboration**: content@elearning-dz.com
- **Training Programs**: training@elearning-dz.com

### For Students & Parents
- **Support**: support@elearning-dz.com
- **WhatsApp**: +213 XXX XXX XXX (coming soon)
- **SMS Help**: Send "HELP" to 32XXX (coming soon)

---

**Made with ❤️ for Algerian students | صُنع بـ ❤️ للطلاب الجزائريين**

*Empowering the next generation of Algerian scholars through innovative technology and culturally-aligned education.*
