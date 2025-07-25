# OAuth Site URL Management for Development & Production

## The Problem
- **Site URL** in Supabase controls where OAuth flows redirect by default
- When Site URL = `https://bacalgerie.me` → All OAuth flows go to production
- When Site URL = `http://localhost:3000` → All OAuth flows go to localhost

## Solution Options

### Option 1: Manual Switching (Current Working Method)
**For Local Development:**
1. Set Supabase Site URL to: `http://localhost:3000`
2. Keep Redirect URLs: `http://localhost:3000/auth/callback, https://bacalgerie.me/auth/callback`

**For Production Deployment:**
1. Set Supabase Site URL to: `https://bacalgerie.me`
2. Keep same Redirect URLs

### Option 2: Environment-Specific Supabase Projects (Recommended for Teams)
- Create separate Supabase projects for dev/prod
- Use different environment variables for each
- No manual switching needed

### Option 3: Custom Redirect Parameter (Advanced)
- Modify OAuth flow to explicitly specify redirect URL
- Override Supabase's default Site URL behavior

## Quick Development Workflow

### When Developing Locally:
```bash
# 1. Set Supabase Site URL to localhost
# 2. Run development server
npm run dev
# 3. OAuth will work with localhost
```

### When Deploying to Production:
```bash
# 1. Set Supabase Site URL to bacalgerie.me
# 2. Deploy to Vercel
vercel --prod
# 3. OAuth will work with production domain
```

## Current Status
✅ **Working**: Local development with Site URL = `http://localhost:3000`
✅ **Working**: Production with Site URL = `https://bacalgerie.me`
⚠️ **Manual**: Need to switch Site URL when switching environments

## Recommendation
For now, use the manual switching method since it's working. Consider setting up separate Supabase projects for dev/prod in the future for a more robust setup.
