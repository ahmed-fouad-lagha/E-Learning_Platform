# Development vs Production OAuth Setup

## Current Issue
OAuth is redirecting to `https://www.bacalgerie.me/?code=...` instead of `/auth/callback?code=...`

## Root Cause
The OAuth callback URL in Supabase is not correctly configured. It's redirecting to the Site URL with the code parameter instead of the proper callback route.

## Solution: Fix Supabase OAuth Configuration

### Step 1: Check Google OAuth Settings
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. **Authorized redirect URIs** should be:
   ```
   https://tgmnzmmfjkwougqtgwif.supabase.co/auth/v1/callback
   ```
   NOT your app URLs! This is the Supabase OAuth endpoint.

### Step 2: Update Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/tgmnzmmfjkwougqtgwif
2. Navigate to: **Authentication** → **URL Configuration**
3. **Site URL**: `https://bacalgerie.me`
4. **Redirect URLs**: 
   ```
   https://bacalgerie.me/auth/callback
   http://localhost:3000/auth/callback
   ```

### Step 3: The OAuth Flow Should Be:
1. User clicks Google Sign In
2. Google → Supabase OAuth endpoint (`*.supabase.co/auth/v1/callback`)
3. Supabase → Your app callback (`/auth/callback?code=...`)
4. Your app processes the code and completes authentication

## Current Problem
The flow is going:
1. User clicks Google Sign In
2. Google → Supabase
3. Supabase → `https://www.bacalgerie.me/?code=...` (WRONG!)

Should be:
3. Supabase → `https://www.bacalgerie.me/auth/callback?code=...` (CORRECT!)

## Fix: Check Your Google OAuth Redirect URI
The Google OAuth redirect URI should ONLY be the Supabase endpoint:
- ✅ `https://tgmnzmmfjkwougqtgwif.supabase.co/auth/v1/callback`
- ❌ NOT `https://bacalgerie.me/auth/callback`

## Alternative Debug Steps
1. Check the Google OAuth configuration
2. Verify Supabase Provider settings
3. Make sure you're using the correct OAuth flow
