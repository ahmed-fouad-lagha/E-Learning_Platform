# Step-by-Step Google OAuth Setup Guide

## 🎯 We'll fix this together, step by step!

### Step 1: Test Basic Connection

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit the test page:**
   Open your browser and go to: `http://localhost:3000/test-connection`

3. **Check the browser console:**
   - Press F12 to open developer tools
   - Look at the Console tab
   - You should see "✅ Supabase connection successful!"

❓ **If you see errors:** Let me know what the error message says.

### Step 2: Set Up Database Table

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project: `tgmnzmmfjkwougqtgwif`

2. **Open SQL Editor:**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and paste the SQL from `setup-database.sql`:**
   - Open the file I just created: `setup-database.sql`
   - Copy ALL the content
   - Paste it into the SQL Editor
   - Click "Run" button

4. **Verify the table was created:**
   - Go to "Table Editor" in the left sidebar
   - You should see a table called `profiles`

### Step 3: Configure Google OAuth in Supabase

1. **In your Supabase Dashboard:**
   - Go to "Authentication" → "Providers"
   - Find "Google" in the list
   - Click the toggle to enable it

2. **You'll need Google credentials (don't worry, I'll help you get them):**
   - We need to create a Google Cloud project
   - Get Client ID and Client Secret
   - Configure redirect URLs

### Step 4: Get Google OAuth Credentials

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a new project:**
   - Click "Select a project" at the top
   - Click "New Project"
   - Name it: "E-Learning Platform"
   - Click "Create"

3. **Enable Google Identity API:**
   - In the left menu, go to "APIs & Services" → "Library"
   - Search for "Google Identity"
   - Click "Google Identity API"
   - Click "Enable"

4. **Create OAuth credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Name it: "E-Learning Platform"
   - Add Authorized JavaScript origins: `http://localhost:3000`
   - Add Authorized redirect URIs: `https://tgmnzmmfjkwougqtgwif.supabase.co/auth/v1/callback`
   - Click "Create"

5. **Copy the credentials:**
   - You'll get a Client ID and Client Secret
   - Keep these safe!

### Step 5: Configure in Supabase

1. **Back in Supabase Dashboard:**
   - Go to "Authentication" → "Providers"
   - Click on "Google"
   - Paste your Client ID and Client Secret
   - Set Site URL to: `http://localhost:3000`
   - Set Redirect URLs to: `http://localhost:3000/auth/callback`
   - Click "Save"

### Step 6: Test Google OAuth

1. **Visit your auth page:**
   - Go to: `http://localhost:3000/auth`
   - Click "Sign up"
   - Click the Google button

2. **What should happen:**
   - You should be redirected to Google
   - After signing in, you should be redirected back to your app
   - You should see your dashboard

## 🆘 If You Get Stuck

**Tell me:**
1. Which step you're on
2. What error message you see (if any)
3. What happens when you try

I'll help you fix it!

## 🎉 Success Indicators

- ✅ Test connection page shows "Supabase connection successful!"
- ✅ Database table `profiles` is created
- ✅ Google OAuth is enabled in Supabase
- ✅ Google credentials are configured
- ✅ Google sign-in redirects to Google and back successfully

Let's start with Step 1. Try the test connection first and let me know what happens!
