# Google OAuth Redirect Loop Fix

## Problem
The Google OAuth was creating a redirect loop where the callback was redirecting to itself:

```
OAuth callback - redirecting to: http://localhost:3000/auth/callback?redirect=%2Fdashboard
GET /auth/callback?redirect=%2Fdashboard 307 in 32ms
GET /auth/auth-code-error?error=no_code 200 in 625ms
```

## Root Cause
The issue was in the redirect parameter parsing in `app/auth/callback/route.ts`. The redirect parameter was being double-encoded and the callback route was redirecting to itself instead of extracting the final destination.

## Solution
Fixed the callback route to properly handle nested redirect parameters:

### 1. Added URL Decoding
```typescript
// Decode URL-encoded parameters
try {
  redirectTo = decodeURIComponent(redirectTo);
} catch {
  redirectTo = '/dashboard';
}
```

### 2. Added Loop Prevention
```typescript
// Prevent redirect loops - if redirectTo is pointing to callback, redirect to dashboard
if (redirectTo.includes('/auth/callback')) {
  // Extract the nested redirect parameter if it exists
  const nestedRedirect = redirectTo.match(/redirect=([^&]*)/);
  if (nestedRedirect && nestedRedirect[1]) {
    redirectTo = decodeURIComponent(nestedRedirect[1]);
  } else {
    redirectTo = '/dashboard';
  }
}
```

### 3. Added Better Logging
```typescript
console.log('OAuth callback - raw redirect param:', redirectTo);
console.log('OAuth callback - full URL:', request.url);
console.log('OAuth callback - final redirect destination:', redirectTo);
```

## What This Fix Does
1. **Properly decodes** URL-encoded redirect parameters
2. **Prevents redirect loops** by detecting when redirectTo points to the callback route itself
3. **Extracts nested redirect parameters** from malformed URLs
4. **Provides better debugging** with comprehensive logging
5. **Ensures safe fallback** to `/dashboard` if parsing fails

## Files Modified
- `app/auth/callback/route.ts` - Fixed redirect parameter parsing and loop prevention

## Testing
After this fix:
1. Google OAuth should complete successfully
2. Users should be redirected to `/dashboard` instead of getting stuck in a loop
3. The server logs will show the redirect processing steps
4. No more "no_code" errors after successful authentication

## Next Steps
1. Test the Google OAuth flow again
2. Verify successful authentication and redirect to dashboard
3. Check that user profile is created/found correctly
4. Confirm no redirect loops occur
