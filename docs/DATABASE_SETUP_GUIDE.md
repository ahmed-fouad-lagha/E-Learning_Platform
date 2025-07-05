# Database Migration Setup Guide

## 🗄️ **Setting Up Supabase PostgreSQL Database**

### **Step 1: Get Your Database Connection URL**

1. **Go to your Supabase project**: https://supabase.com/dashboard/project/tgmnzmmfjkwougqtgwif
2. **Navigate to**: Settings → Database
3. **Copy the Connection String** under "Connection Pooling"
4. **It should look like**: 
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.tgmnzmmfjkwougqtgwif.supabase.co:5432/postgres
   ```

### **Step 2: Update Environment Variables**

Update your `.env.local` file with the correct DATABASE_URL:

```bash
# Replace [YOUR-PASSWORD] with your actual Supabase database password
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.tgmnzmmfjkwougqtgwif.supabase.co:5432/postgres"
```

### **Step 3: Run Database Migrations**

Execute these commands in order:

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Run database migrations
npx prisma migrate dev --name init

# 3. (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### **Step 4: Verify Migration Success**

After successful migration, you should see:
- ✅ All database tables created
- ✅ Prisma client generated
- ✅ Migration files in `prisma/migrations/`

## 📊 **Database Schema Overview**

Our schema includes these main tables:
- **users** - User profiles (synced with Supabase auth)
- **courses** - Course information and content
- **lessons** - Individual lesson content
- **course_enrollments** - User enrollments in courses
- **exams** - BAC practice exams
- **exam_submissions** - User exam attempts
- **study_groups** - Collaborative learning groups
- **forums** - Community discussion forums
- **notifications** - User notifications
- **learning_progress** - Detailed progress tracking

## 🔧 **Troubleshooting Common Issues**

### **Issue: Connection Refused**
```bash
Error: P1001: Can't reach database server
```
**Solution**: Check your DATABASE_URL and ensure it has the correct password.

### **Issue: Permission Denied**
```bash
Error: P3000: Failed to create database
```
**Solution**: Make sure you're using the correct Supabase credentials.

### **Issue: Table Already Exists**
```bash
Error: P3005: Database schema is not empty
```
**Solution**: This is normal if tables exist. Prisma will handle migrations automatically.

## 🎯 **Next Steps After Migration**

1. **Seed Initial Data** (if you have a seed script)
2. **Test Database Connection** with your API endpoints
3. **Verify User Authentication** works with the database
4. **Test Course Enrollment** with real database operations

## ⚠️ **Important Notes**

- **Backup**: Supabase handles backups automatically
- **Security**: Never commit your DATABASE_URL to version control
- **Development**: Use `.env.local` for local development
- **Production**: Set environment variables in your deployment platform

## 🚀 **Ready for Production**

After successful migration:
- ✅ All mock data fallbacks will be bypassed
- ✅ Real database operations will be used
- ✅ Course enrollment will persist in the database
- ✅ User progress will be tracked properly
