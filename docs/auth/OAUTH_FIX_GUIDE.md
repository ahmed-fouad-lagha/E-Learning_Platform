# 🔧 Fix Google OAuth Step by Step

## Current Problem
You're getting HTTP 500 error when Google redirects back to your app because:
1. **URL malformation**: The redirect URL was being doubled
2. **Database table missing**: The `profiles` table might not exist

## ✅ What I've Fixed

### 1. Fixed the Callback Route URL Issue
- ✅ Fixed URL malformation in `/auth/callback/route.ts`
- ✅ Added proper URL parsing to handle full URLs vs paths
- ✅ Added detailed logging to debug issues

### 2. Created Database Test Page
- ✅ Created `/test-database` page to check if your database is set up correctly

## 🧪 Let's Test and Fix Step by Step

### Step 1: Test Database Setup

1. **Go to the database test page:**
   ```
   http://localhost:3000/test-database
   ```

2. **Check the results:** You should see something like:
   - ✅ Supabase connection successful
   - ✅ profiles table exists and is accessible
   - ✅ Database structure is correct

3. **If you see errors:** Follow the instructions on that page to set up the database

### Step 2: Set Up Database (If Needed)

If the test page shows that the `profiles` table doesn't exist:

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the database setup:**
   - Copy ALL content from the file: `setup-database.sql`
   - Paste it into the SQL Editor
   - Click "Run"

4. **Verify it worked:**
   - Go back to `http://localhost:3000/test-database`
   - Refresh the page
   - Should now show all green checkmarks

### Step 3: Test the Fixed Google OAuth

1. **Try Google sign-in again:**
   - Go to `http://localhost:3000/auth`
   - Click "Sign up" 
   - Click the Google button

2. **What should happen now:**
   - Redirects to Google OAuth
   - After Google consent, redirects back to your app
   - **No more HTTP 500 error!**
   - Creates user profile automatically
   - Redirects to dashboard

### Step 4: Check the Console Logs

If you still get errors, check the **server console** (where you ran `npm run dev`) for detailed logs like:
```
OAuth callback - received code: 89fed276...
OAuth callback - redirect to: /dashboard
OAuth callback - user authenticated: user@example.com
OAuth callback - creating new profile for user
OAuth callback - profile created successfully
OAuth callback - redirecting to: http://localhost:3000/dashboard
```

## 🐛 Troubleshooting

### If Database Test Fails:
- Make sure your Supabase URL is correct in `.env.local`
- Run the `setup-database.sql` script in Supabase SQL Editor
- Check that RLS policies are enabled

### If Google OAuth Still Fails:
- Check browser console for JavaScript errors
- Check server console for detailed error logs
- Make sure Google OAuth is configured in Supabase Dashboard

### If Profile Creation Fails:
- Make sure the `profiles` table has the correct structure
- Check that RLS policies allow inserts for authenticated users

## 🎯 Next Steps

1. **First**: Test database at `/test-database`
2. **Second**: Fix database if needed using `setup-database.sql`
3. **Third**: Try Google OAuth again
4. **Report**: Tell me what happens!

The main issues have been fixed. Now we just need to make sure your database is set up correctly! 🚀
