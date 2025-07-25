# Domain Consistency Issue Debug

## The Problem
- OAuth redirects to: https://www.bacalgerie.me/?code=...
- Should redirect to: https://www.bacalgerie.me/auth/callback?code=...
- Notice the www. prefix in both!

## Root Cause
Domain mismatch between:
1. What Google OAuth is configured for
2. What Supabase redirect URLs are configured for
3. What your actual domain serves

## Fix Options

### Option 1: Update Supabase to use www
Change Supabase settings to:
- Site URL: https://www.bacalgerie.me
- Redirect URLs: 
  - https://www.bacalgerie.me/auth/callback
  - http://localhost:3000/auth/callback

### Option 2: Update Google OAuth to use non-www
Change Google OAuth settings to redirect to:
- https://bacalgerie.me (without www)

### Option 3: Domain Redirect Setup
Set up domain redirects so www.bacalgerie.me redirects to bacalgerie.me

## Current Status
✅ Auth callback route works: /auth/callback
❌ OAuth redirects to wrong URL: /?code=... instead of /auth/callback?code=...
❌ Domain consistency issue: www vs non-www
