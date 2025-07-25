# Server Error Debug Guide

## Current Status
✅ OAuth redirects to correct callback URL
❌ Server error: "unexpected_failure" 
❌ Error code: Check server logs

## Debugging Steps

### 1. Check Vercel Logs
```bash
vercel logs --follow
```

### 2. Check Supabase Logs
1. Go to Supabase Dashboard
2. Navigate to Logs section
3. Look for authentication errors

### 3. Common Causes
- Environment variables missing in production
- Database connection issues
- Supabase service role key problems
- CORS issues

### 4. Environment Variables Check
Required for production:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXTAUTH_SECRET
- DATABASE_URL

### 5. Debug Steps
1. Check if environment variables are set in Vercel
2. Verify Supabase connection in production
3. Check if database schema is up to date
4. Look for any missing dependencies
