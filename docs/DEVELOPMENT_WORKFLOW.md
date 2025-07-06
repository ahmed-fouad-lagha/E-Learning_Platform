# 🔧 Development Workflow Guide

## 📋 Daily Development Commands

### 🚀 Getting Started
```bash
# Start development server
npm run dev

# Run in parallel terminals:
npm run db:studio    # Database GUI
npm run lint         # Code quality check
```

### 🗄️ Database Operations
```bash
# Setup fresh database
npm run db:setup

# Generate Prisma client (after schema changes)
npm run db:generate

# Create new migration
npm run db:migrate

# Reset database (careful!)
npm run db:reset

# Seed with sample data
npm run db:seed
```

### 🧪 Testing
```bash
# Test all systems
npm run test:all

# Test specific components
npm run test:auth         # Authentication system
npm run test:database     # Database connections
npm run test:enrollment   # Student enrollment
npm run test:email        # Email functionality
```

### ⚙️ Environment Setup
```bash
# Interactive environment setup (first time)
npm run setup:interactive

# Quick environment check
npm run setup:env

# Production environment setup
npm run setup:production

# Verify everything is ready
npm run setup:complete
```

### 🚢 Deployment
```bash
# Verify deployment status
npm run deploy:verify

# Fix deployment issues
npm run deploy:fix

# Build for production
npm run build

# Vercel deployment (automatic via GitHub)
git push origin main
```

### 🛠️ Utilities
```bash
# Check database tables
npm run check:tables

# Convert icons for PWA
npm run utils:convert-icons

# Populate database with curriculum
npm run utils:populate-db

# Check project readiness
npm run check:ready
```

## 🔄 Typical Development Flow

### 1. **Morning Setup**
```bash
git pull origin main          # Get latest changes
npm run dev                   # Start dev server
npm run db:studio            # Open database GUI
```

### 2. **Feature Development**
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes, then test
npm run test:all

# Check code quality
npm run lint
```

### 3. **Database Changes**
```bash
# After modifying schema
npm run db:generate
npm run db:migrate
npm run test:database
```

### 4. **Before Committing**
```bash
npm run build               # Ensure build works
npm run test:all           # Run all tests
npm run lint               # Check code quality
npm run check:ready        # Verify deployment readiness
```

### 5. **Deployment**
```bash
git add .
git commit -m "feat: description of changes"
git push origin feature/new-feature

# Create PR, merge to main
# Automatic deployment via Vercel
```

## 🐛 Common Issues & Solutions

### Database Issues
```bash
# Connection problems
npm run test:database
npm run setup:env

# Migration issues
npm run db:reset
npm run db:setup
```

### Build Issues
```bash
# Dependency problems
rm -rf node_modules package-lock.json
npm install

# TypeScript errors
npm run db:generate
npm run build
```

### Deployment Issues
```bash
# Environment variables
npm run setup:production
npm run deploy:verify

# Build failures
npm run build
npm run deploy:fix
```

## 📊 Project Health Checks

### Daily Checks
- [ ] Development server starts without errors
- [ ] Database connections work
- [ ] All tests pass
- [ ] No linting errors

### Weekly Checks
- [ ] Production deployment works
- [ ] All features functional
- [ ] Performance metrics good
- [ ] Security updates applied

### Before Release
- [ ] Full test suite passes
- [ ] Production build successful
- [ ] Database migrations tested
- [ ] Environment variables verified
- [ ] Documentation updated

## 🎯 Best Practices

### Code Quality
- Use TypeScript for type safety
- Follow ESLint rules
- Write meaningful commit messages
- Create tests for new features

### Database
- Always create migrations for schema changes
- Test migrations on staging first
- Backup before major changes
- Use transactions for data integrity

### Environment
- Never commit secrets to Git
- Use different environments for dev/staging/prod
- Verify environment variables after changes
- Document new environment requirements

---
*Keep this guide updated as workflows evolve*
