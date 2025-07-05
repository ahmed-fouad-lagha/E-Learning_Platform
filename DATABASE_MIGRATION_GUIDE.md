# 🗄️ Database Migration Complete Guide

## **Quick Setup (If you have your Supabase password)**

### **Option 1: Automated Setup**
Run the automated setup script:
```bash
# Windows
./setup-database.bat

# Linux/Mac
chmod +x setup-database.sh
./setup-database.sh
```

### **Option 2: Manual Setup**
```bash
# 1. Update .env.local with your DATABASE_URL
# 2. Generate Prisma client
npx prisma generate

# 3. Run migrations
npx prisma migrate dev --name init

# 4. Seed initial data
npm run prisma:seed
```

## **Step-by-Step Database Setup**

### **1. Get Your Database Connection String**

1. **Visit your Supabase project**: 
   - Go to: https://supabase.com/dashboard/project/tgmnzmmfjkwougqtgwif
   - Navigate to: **Settings → Database**

2. **Find "Connection Pooling" section**
   - Look for the connection string that looks like:
   ```
   postgresql://postgres.tgmnzmmfjkwougqtgwif:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

3. **Or use Direct Connection**:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.tgmnzmmfjkwougqtgwif.supabase.co:5432/postgres
   ```

### **2. Update Environment Variables**

Replace the DATABASE_URL in your `.env.local`:
```env
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.tgmnzmmfjkwougqtgwif.supabase.co:5432/postgres"
```

### **3. Run Database Setup**

Execute these commands in order:

```bash
# Generate Prisma client
npx prisma generate

# Run database migration (creates tables)
npx prisma migrate dev --name "init-elearning-platform"

# Seed initial course data
npm run prisma:seed

# (Optional) Open database browser
npx prisma studio
```

### **4. Verify Setup**

After successful setup, you should see:
- ✅ Migration files in `prisma/migrations/`
- ✅ Database tables created in Supabase
- ✅ Sample courses and lessons in the database

## **Database Schema Overview**

The migration creates these tables:

### **Core Tables**
- `users` - User profiles (synced with Supabase auth)
- `courses` - Course information and metadata
- `lessons` - Individual lesson content
- `course_enrollments` - Track user enrollments

### **Assessment Tables**
- `exams` - BAC practice exams and quizzes
- `exam_submissions` - User exam attempts and scores
- `exam_questions` - Individual exam questions

### **Community Tables**
- `study_groups` - Collaborative learning groups
- `study_group_members` - Group membership
- `forums` - Discussion forums
- `forum_posts` - Forum discussions
- `forum_replies` - Replies to forum posts

### **Progress Tracking**
- `learning_progress` - Detailed lesson progress
- `notifications` - User notifications

## **Sample Data Included**

After seeding, you'll have:

### **📚 Courses**
1. **Mathematics BAC 2025** (Free)
   - 15 lessons, 45 hours
   - High BAC relevance (95%)

2. **Physics BAC 2025** (Paid)
   - 20 lessons, 60 hours
   - High BAC relevance (90%)

3. **Arabic Literature BAC** (Free)
   - 12 lessons, 36 hours
   - Good BAC relevance (85%)

### **📖 Lessons**
- Mathematical concepts (Functions, Derivatives, Integrals)
- Physics topics (Mechanics, Electricity)
- Literature analysis (Classical Poetry)

### **📝 Practice Exams**
- Mathematics BAC Practice Exam 1
- Based on previous BAC papers

## **Testing Your Database**

### **1. Verify API Endpoints**
After setup, test these URLs:
- `http://localhost:3000/api/courses` - Should return real courses (not mock)
- `http://localhost:3000/api/courses/math-bac-2025` - Course details

### **2. Test Enrollment Flow**
1. Login with your credentials
2. Browse courses at `/courses`
3. Enroll in a course
4. Verify enrollment persists in database

### **3. Check Database Browser**
```bash
npx prisma studio
```
This opens a web interface to browse your database.

## **Troubleshooting**

### **Connection Issues**
```
Error: P1001: Can't reach database server
```
**Solution**: Check your DATABASE_URL and Supabase password.

### **Permission Issues**
```
Error: P3000: Failed to create database
```
**Solution**: Ensure your Supabase user has proper permissions.

### **Migration Issues**
```
Error: Schema drift detected
```
**Solution**: Run `npx prisma migrate reset` and try again.

### **Seed Issues**
```
Error: PrismaClientKnownRequestError
```
**Solution**: Check if data already exists. Seed script uses `upsert` to handle duplicates.

## **Production Considerations**

### **Environment Variables**
- **Development**: Use `.env.local`
- **Production**: Set `DATABASE_URL` in your deployment platform
- **Never commit** database credentials to version control

### **Database Backup**
- Supabase provides automatic backups
- Consider manual exports for important data

### **Performance**
- Database queries are optimized with indexes
- Consider connection pooling for high traffic

## **Useful Commands**

```bash
# Database Management
npx prisma studio              # Browse database
npx prisma migrate reset       # Reset database
npx prisma migrate deploy      # Deploy migrations to production
npx prisma db push             # Push schema changes without migration

# Data Management
npm run prisma:seed           # Seed database
npx prisma db seed            # Alternative seed command

# Development
npm run dev                   # Start development server
npm run build                 # Build for production
```

## **Next Steps After Setup**

1. **Test the application** with real database operations
2. **Add more courses** and content as needed
3. **Customize the schema** for your specific requirements
4. **Set up production** deployment with proper environment variables

Your E-Learning Platform database is now ready for production use! 🚀
