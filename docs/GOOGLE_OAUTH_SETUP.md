# Google OAuth Setup Guide

## Problem
You're getting redirected to `/auth/auth-code-error` when clicking the Google login button during registration.

## Root Cause
Google OAuth is not properly configured in your Supabase project.

## Solution

### Step 1: Configure Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen
6. Set up the OAuth 2.0 client:
   - Application type: Web application
   - Authorized JavaScript origins: 
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `https://your-supabase-project.supabase.co/auth/v1/callback`

### Step 2: Configure Google OAuth in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to Authentication → Providers
3. Find "Google" and enable it
4. Enter your Google OAuth credentials:
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
5. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)

### Step 3: Test the Setup

1. Restart your development server: `npm run dev`
2. Go to `/auth` page
3. Click "Sign up" 
4. Click the Google button
5. You should be redirected to Google's OAuth consent screen

## Important Notes

1. **No environment variables needed**: With Supabase, Google OAuth is configured in the Supabase dashboard, not in environment variables.

2. **Redirect URL**: Make sure the redirect URL in Supabase matches exactly what you're using in your app (`/auth/callback`).

3. **Localhost testing**: For local development, make sure to add `http://localhost:3000` to your Google OAuth authorized origins.

4. **Production deployment**: Update the redirect URLs when deploying to production.

## Troubleshooting

If you're still getting errors:

1. Check browser console for any JavaScript errors
2. Check Supabase logs in the dashboard
3. Verify that the Google OAuth app is not in testing mode (should be published)
4. Make sure your domain is verified in Google Cloud Console

## What the Fixed Code Does

The updated authentication flow:

1. **`/api/auth/social`**: Creates the OAuth URL using Supabase's `signInWithOAuth`
2. **`/auth/callback`**: Handles the OAuth callback, exchanges code for session, creates user profile if needed
3. **Error handling**: Provides detailed error messages if something goes wrong

Try the Google OAuth again after configuring it in Supabase!
