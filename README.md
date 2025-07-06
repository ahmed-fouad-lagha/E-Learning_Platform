# 🎓 E-Learning Platform for Algerian BAC Preparation

A comprehensive, modern e-learning platform specifically designed for Algerian Baccalauréat (BAC) students. Built with Next.js, Supabase, and modern web technologies.

## 🌟 Features

### 📚 **Educational Content**
- Complete BAC curriculum coverage (Scientific, Literary, Mathematics)
- Interactive lessons with video content
- Practice exams and quizzes
- Progress tracking and analytics
- Downloadable resources

### 🔐 **User Management**
- Multi-role authentication (Student, Teacher, Admin)
- Secure registration and login
- Profile management
- Progress tracking

### 💳 **Payment & Subscriptions**
- Local payment gateway integration (CIB, BaridiMob)
- Flexible pricing plans
- Course-specific purchases
- Subscription management

### 📱 **Modern UI/UX**
- Responsive design for all devices
- Dark/Light mode support
- Progressive Web App (PWA) capabilities
- Offline learning support

## 🚀 Live Demo

**Production URL:** [https://your-deployment-url.vercel.app](https://your-deployment-url.vercel.app)

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - Backend as a Service
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication

### Deployment & DevOps
- **Vercel** - Hosting and deployment
- **GitHub** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/E-Learning_Platform.git
cd E-Learning_Platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
# Add your Supabase credentials, database URL, etc.
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Set up database schema and seed data
npm run db:setup
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
E-Learning_Platform/
├── 📱 app/                     # Next.js App Router pages
│   ├── api/                    # API routes
│   ├── auth/                   # Authentication pages
│   ├── courses/                # Course-related pages
│   ├── dashboard/              # User dashboards
│   └── ...
├── 🧩 components/              # Reusable UI components
│   ├── auth/                   # Authentication components
│   ├── courses/                # Course components
│   ├── ui/                     # Base UI components
│   └── ...
├── 🪝 hooks/                   # Custom React hooks
├── 📚 lib/                     # Utility functions & configs
├── 🗄️ prisma/                  # Database schema & migrations
├── 🏗️ scripts/                 # Automation & utility scripts
│   ├── database/               # Database-related scripts
│   ├── deployment/             # Deployment scripts
│   ├── setup/                  # Setup scripts
│   └── utils/                  # Utility scripts
├── 🧪 tests/                   # Test files
│   ├── auth/                   # Authentication tests
│   ├── database/               # Database tests
│   └── ...
├── 📖 docs/                    # Documentation
│   ├── api/                    # API documentation
│   ├── deployment/             # Deployment guides
│   ├── features/               # Feature documentation
│   └── setup/                  # Setup guides
└── 🌐 public/                  # Static assets
```

## 🛠️ Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npm run db:setup     # Setup database with schema and seed data
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

### Setup & Configuration
```bash
npm run setup:env           # Interactive environment setup
npm run setup:complete      # Complete setup verification
npm run check:ready         # Check if project is ready for deployment
```

### Testing
```bash
npm run test:auth           # Test authentication system
npm run test:database       # Test database connections
npm run test:enrollment     # Test enrollment flow
```

## 🌍 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

See [Deployment Guide](docs/deployment/VERCEL_DEPLOYMENT_GUIDE.md) for detailed instructions.

### Other Platforms
- [Netlify](docs/deployment/netlify.md)
- [Railway](docs/deployment/railway.md)
- [Digital Ocean](docs/deployment/digitalocean.md)

## 📚 Documentation

- [Setup Guide](docs/setup/DATABASE_SETUP_GUIDE.md)
- [Authentication System](docs/features/ENHANCED_AUTH_SYSTEM_GUIDE.md)
- [API Documentation](docs/api/)
- [Deployment Guide](docs/deployment/)
- [Troubleshooting](docs/DATABASE_CONNECTION_TROUBLESHOOTING.md)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: your-email@example.com
- 💬 Discord: [Your Discord Server](https://discord.gg/your-server)
- 📝 Issues: [GitHub Issues](https://github.com/your-username/E-Learning_Platform/issues)

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] User authentication and authorization
- [x] Course management system
- [x] Basic student dashboard
- [x] Database schema and migrations

### Phase 2: Enhanced Learning 🔄
- [ ] Video streaming integration
- [ ] Interactive quizzes and exams
- [ ] Progress tracking and analytics
- [ ] Certificate generation

### Phase 3: Advanced Features 📅
- [ ] Live classes and video conferencing
- [ ] AI-powered study assistant
- [ ] Mobile app development
- [ ] Offline learning capabilities

### Phase 4: Business Features 💼
- [ ] Payment gateway integration
- [ ] Subscription management
- [ ] Teacher marketplace
- [ ] Analytics dashboard

## 🌟 Acknowledgments

- Built for Algerian BAC students
- Inspired by modern e-learning platforms
- Thanks to the open-source community

---

**Made with ❤️ for Algerian students**

*Last updated: ${new Date().toLocaleDateString()}*
