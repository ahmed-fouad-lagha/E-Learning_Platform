# Vercel Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Completed
- [x] Project builds successfully (`npm run build`)
- [x] Vercel configuration file created (`vercel.json`)
- [x] Environment variables documented (`.env.example`)
- [x] Git repository is up to date

### 🔧 Required Environment Variables for Vercel

Set these in your Vercel dashboard (Settings > Environment Variables):

#### Database & Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://username:password@host:5432/database
```

#### Authentication
```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret
```

#### Optional (for full functionality)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🚀 Deployment Steps

### 1. Initial Deployment
```bash
# Login to Vercel
npx vercel login

# Deploy to production
npx vercel --prod
```

### 2. Set Environment Variables
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add all required variables from above

### 3. Redeploy After Setting Variables
```bash
npx vercel --prod
```

## 🔧 Post-Deployment Setup

### 1. Database Setup
Once deployed, run your database setup scripts:
```bash
# Connect to your production database and run:
# 1. supabase-schema.sql
# 2. curriculum-courses.sql
# 3. curriculum-lessons-part1.sql through part5.sql
# 4. curriculum-exams.sql
# 5. supabase-data.sql
```

### 2. Domain Configuration
1. In Vercel Dashboard > Domains
2. Add your custom domain (if applicable)
3. Update NEXTAUTH_URL environment variable

### 3. Testing Production Deployment
- [ ] Homepage loads correctly
- [ ] Authentication works
- [ ] Database connection is established
- [ ] Course data is visible
- [ ] User registration/login works
- [ ] Payment flow functions (if configured)

## 🐛 Common Issues & Solutions

### Build Errors
- Check that all imports are correct
- Ensure environment variables are set
- Verify Next.js configuration

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Supabase configuration
- Ensure database is accessible from Vercel

### Authentication Issues
- Update NEXTAUTH_URL to your Vercel domain
- Verify NEXTAUTH_SECRET is set
- Check callback URLs in auth providers

## 📊 Monitoring & Analytics

### Add to your project:
- [ ] Vercel Analytics
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] User analytics

## 🔄 Continuous Deployment

Your project is now set up for automatic deployments:
- Push to main branch → auto-deploy to production
- Push to other branches → preview deployments

## 📝 Next Steps After Deployment

1. **Set up custom domain** (if needed)
2. **Configure CDN and caching**
3. **Set up monitoring and alerts**
4. **Test all functionality thoroughly**
5. **Set up backup procedures**
6. **Configure SSL/TLS settings**
7. **Set up staging environment**

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
