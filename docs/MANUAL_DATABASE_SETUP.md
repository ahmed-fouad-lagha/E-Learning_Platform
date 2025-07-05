# Manual Database Setup Guide

## 🚀 Populate Supabase Database via Dashboard

### Step-by-Step Instructions:

1. **Access Supabase Dashboard**
   - Go to: https://tgmnzmmfjkwougqtgwif.supabase.co
   - Login with your Supabase account

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Execute SQL Files in Order**

#### Step 1: Create Schema
- Copy content from `supabase-schema.sql`
- Paste into SQL Editor
- Click "Run" button
- ✅ Creates tables: courses, lessons, exams, course_enrollments

#### Step 2: Add Courses
- Copy content from `curriculum-courses.sql`
- Paste into SQL Editor
- Click "Run" button
- ✅ Adds 21 BAC courses

#### Step 3: Add Lessons (Part 1)
- Copy content from `curriculum-lessons-part1.sql`
- Paste into SQL Editor
- Click "Run" button
- ✅ Adds Mathematics function lessons

#### Step 4: Add Lessons (Part 2)
- Copy content from `curriculum-lessons-part2.sql`
- Paste into SQL Editor
- Click "Run" button
- ✅ Adds multi-subject lessons

#### Step 5: Add Lessons (Part 3)
- Copy content from `curriculum-lessons-part3.sql`
- Paste into SQL Editor
- Click "Run" button
- ✅ Adds Literature, Islamic Studies, Computer Science

#### Step 6: Add Lessons (Part 4)
- Copy content from `curriculum-lessons-part4.sql`
- Paste into SQL Editor
- Click "Run" button
- ✅ Adds Advanced Math, Physics, Chemistry

#### Step 7: Add Lessons (Part 5)
- Copy content from `curriculum-lessons-part5.sql`
- Paste into SQL Editor
- Click "Run" button
- ✅ Adds Mathematics advanced topics

#### Step 8: Add Exams
- Copy content from `curriculum-exams.sql`
- Paste into SQL Editor
- Click "Run" button
- ✅ Adds BAC-style exam questions

#### Step 9: Add Sample Data (Optional)
- Copy content from `supabase-data.sql`
- Paste into SQL Editor
- Click "Run" button
- ✅ Adds sample users and test data

## 🎉 Verification

After running all SQL files:

1. **Check Tables**
   - Go to "Table Editor" in Supabase dashboard
   - Verify you see:
     - `courses` (21 records)
     - `lessons` (28+ records)
     - `exams` (multiple records)
     - `course_enrollments` (sample data)

2. **Test Your App**
   - Run: `npm run dev`
   - Visit: http://localhost:3000
   - Check if courses and lessons load properly

## ⚡ Quick Commands

If you prefer terminal (after fixing dependencies):
```bash
# Run the complete population script
./populate-database.sh

# Or use Node.js script
node populate-database.js
```

## 📊 Content Summary

Your database will contain:
- **21 Complete Courses** (all BAC subjects)
- **28+ Comprehensive Lessons** (with exercises, objectives)
- **BAC-Style Exam Questions** (with solutions)
- **Bilingual Content** (Arabic/English)
- **Sample User Data** (for testing)
