# Supabase Server Error Debug

## Current Error
```json
{"code":500,"error_code":"unexpected_failure","msg":"Unexpected failure, please check server logs for more information"}
```

## Issue Found in JWT State
Decoded JWT state shows:
- `"site_url":" https://bacalgerie.me"` (notice the SPACE before https)
- This space is causing validation failures

## How to Check Supabase Logs
1. Go to: https://supabase.com/dashboard/project/tgmnzmmfjkwougqtgwif
2. Navigate to: **Logs** (in the left sidebar)
3. Select: **Auth Logs**
4. Look for recent errors around the time you tested OAuth

## Potential Fixes

### Fix 1: Clear and Re-enter Site URL
1. In Supabase Dashboard → Authentication → URL Configuration
2. Clear the Site URL field completely
3. Re-type (don't copy-paste): https://bacalgerie.me
4. Save settings

### Fix 2: Check for Hidden Characters
- The space might be from copy-pasting
- Manually type the URL instead of copying

### Fix 3: Environment Variable Check
If you have any environment variables that set the site URL, check for spaces

## Next Steps
1. Check Supabase Auth logs for detailed error
2. Clear and re-enter Site URL manually
3. Test OAuth again
4. If still failing, we may need to check your auth callback code
