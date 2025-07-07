# Supabase OAuth Configuration Fix

## Current Issue
- Google OAuth redirects to `localhost:3000` instead of `bacalgerie.me`
- This happens because Supabase redirect URIs are not updated for production

## Fix Steps

### 1. Update Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/tgmnzmmfjkwougqtgwif
2. Navigate to: **Authentication** → **URL Configuration**
3. Update these fields:

**Site URL:**
```
https://bacalgerie.me
```

**Redirect URLs:**
```
https://bacalgerie.me/auth/callback
https://localhost:3000/auth/callback
```

### 2. Update Google OAuth Settings (if needed)
1. Go to Google Cloud Console
2. Navigate to APIs & Services → Credentials
3. Find your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   - `https://bacalgerie.me/auth/callback`
   - `https://tgmnzmmfjkwougqtgwif.supabase.co/auth/v1/callback`

### 3. Environment Variables
The current environment variables should work fine for production.
Make sure Vercel has the same environment variables set.

### 4. Test After Changes
1. Clear browser cache
2. Try Google login on https://bacalgerie.me
3. Should redirect to https://bacalgerie.me/auth/callback instead of localhost

## Expected Result
After these changes, Google OAuth should redirect to:
`https://bacalgerie.me/auth/callback?code=...`

Instead of:
`http://localhost:3000/auth/callback?code=...`
