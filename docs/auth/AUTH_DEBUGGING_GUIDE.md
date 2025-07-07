# Authentication Flow Debugging Guide

## Issue
After successful Google OAuth authentication, the user is redirected to `/dashboard` but then immediately redirected to `/auth`, suggesting the authentication state is not being properly maintained.

## Debugging Steps

### 1. Check Authentication Debug Page
Visit `/debug-auth` to see the current authentication state:
- Session status
- User information
- Token presence
- Session expiry

### 2. Check Browser Console
Look for these console messages:
- `Dashboard - Auth state: { user: true/false, profile: true/false, session: true/false, loading: true/false }`
- `Dashboard - Redirecting to auth: user not found`

### 3. Check Server Logs
Look for these OAuth callback messages:
- `OAuth callback - exchange result: { hasData: true/false, hasUser: true/false, hasSession: true/false, error: null/message }`

### 4. Check Browser Cookies
In DevTools → Application → Cookies, look for:
- `sb-[project-id]-auth-token`
- `sb-[project-id]-auth-token.0`
- `sb-[project-id]-auth-token.1`

## Possible Issues

### Issue 1: Session Not Persisted
The OAuth callback creates a session but it's not properly saved to cookies.

**Solution**: The callback route should automatically handle this via the Supabase SSR client.

### Issue 2: Auth Context Not Updating
The `AuthProvider` might not be detecting the new session after OAuth.

**Solution**: The auth context should automatically update via `onAuthStateChange`.

### Issue 3: Cookie Domain/Path Issues
The cookies might be set with incorrect domain/path, making them inaccessible.

**Solution**: Check cookie settings in the Supabase client configuration.

### Issue 4: Race Condition
The dashboard might be checking authentication before the session is fully loaded.

**Solution**: The loading state should prevent premature redirects.

## Testing Steps

1. **Clear all cookies** before testing
2. **Open browser DevTools** (Console + Network + Application tabs)
3. **Navigate to** `/debug-auth` first to see current state
4. **Try Google OAuth** login
5. **Check** `/debug-auth` again after login
6. **Monitor console** for auth state changes
7. **Check cookies** in DevTools

## Expected Flow
1. User clicks "Sign in with Google"
2. OAuth redirect to Google
3. Google redirects to `/auth/callback`
4. Callback processes code and creates session
5. Session is saved to cookies
6. User redirected to `/dashboard`
7. Dashboard loads with authenticated user
8. Auth context has user/session/profile

## If Still Failing
- Check environment variables (`.env.local`)
- Verify Supabase project settings
- Test with a fresh incognito window
- Check for any ad blockers or extensions interfering
