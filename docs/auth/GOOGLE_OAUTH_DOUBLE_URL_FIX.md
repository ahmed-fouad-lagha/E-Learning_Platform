# Google OAuth Double URL Fix

## Problem
The Google OAuth callback was failing with a double URL error:
```
http://localhost:3000http://localhost:3000/auth/callback?redirect=%2Fdashboard
```

## Root Cause
The issue was in `app/api/auth/social/route.ts` where it was using `process.env.NEXT_PUBLIC_APP_URL` to construct the redirect URL, but this environment variable was either:
1. Not set properly
2. Already containing the full URL instead of just the base URL

## Solution
**Fixed the social auth route** to use the request origin instead of an environment variable:

```typescript
// OLD (problematic):
redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`,

// NEW (fixed):
const origin = request.headers.get('origin') || 'http://localhost:3000'
redirectTo: `${origin}/auth/callback${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`,
```

## What This Fix Does
1. **Gets the origin dynamically** from the request headers
2. **Provides a fallback** to `http://localhost:3000` for local development
3. **Eliminates dependency** on potentially misconfigured environment variables
4. **Ensures proper URL construction** for both local development and production

## Files Modified
- `app/api/auth/social/route.ts` - Fixed the redirect URL construction

## Testing
After this fix:
1. The Google OAuth sign-in should work properly
2. The callback URL will be correctly formed
3. Users will be redirected to the intended destination after authentication

## Next Steps
1. Test the Google OAuth flow again
2. Verify the callback URL is correctly formed
3. Ensure successful authentication and redirect to dashboard
