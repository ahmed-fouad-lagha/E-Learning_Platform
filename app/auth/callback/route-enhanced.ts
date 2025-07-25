import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  let redirectTo = requestUrl.searchParams.get('redirect') ?? '/dashboard';

  console.log('OAuth callback - Starting OAuth flow');
  console.log('OAuth callback - Code received:', !!code);
  console.log('OAuth callback - Redirect destination:', redirectTo);

  // Sanitize redirect URL
  try {
    redirectTo = decodeURIComponent(redirectTo);
  } catch {
    redirectTo = '/dashboard';
  }

  // Ensure redirectTo is a safe internal path
  if (redirectTo.startsWith('http')) {
    try {
      const redirectUrl = new URL(redirectTo);
      redirectTo = redirectUrl.pathname + redirectUrl.search;
    } catch {
      redirectTo = '/dashboard';
    }
  }

  // Prevent redirect loops
  if (redirectTo.includes('/auth/callback') || redirectTo.includes('/auth/confirming')) {
    redirectTo = '/dashboard';
  }

  // Ensure redirectTo starts with /
  if (!redirectTo.startsWith('/')) {
    redirectTo = '/' + redirectTo;
  }

  if (!code) {
    console.error('OAuth callback - No authorization code received');
    return NextResponse.redirect(`${origin}/auth?error=no_code`);
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    console.log('OAuth callback - Exchanging code for session');
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('OAuth callback - Exchange failed:', error.message);
      return NextResponse.redirect(`${origin}/auth?error=exchange_failed&message=${encodeURIComponent(error.message)}`);
    }

    if (!data.session || !data.user) {
      console.error('OAuth callback - No session or user data received');
      return NextResponse.redirect(`${origin}/auth?error=no_session_data`);
    }

    console.log('OAuth callback - Session established successfully');
    console.log('OAuth callback - User:', data.user.email);

    // Check if profile exists, create if not
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!existingProfile) {
        console.log('OAuth callback - Creating profile for new user');
        
        // Extract user information from metadata
        const userMetadata = data.user.user_metadata;
        const name = userMetadata?.full_name || userMetadata?.name || data.user.email?.split('@')[0] || '';
        const avatarUrl = userMetadata?.avatar_url || userMetadata?.picture;

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            name: name,
            avatar_url: avatarUrl,
            role: 'STUDENT',
            is_verified: true,
            last_login: new Date().toISOString(),
          });

        if (profileError) {
          console.error('OAuth callback - Profile creation failed:', profileError);
          // Don't fail the OAuth flow, just log the error
        } else {
          console.log('OAuth callback - Profile created successfully');
        }
      } else {
        // Update last login for existing user
        console.log('OAuth callback - Updating last login for existing user');
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);
      }
    } catch (profileError) {
      console.error('OAuth callback - Profile handling error:', profileError);
      // Don't fail the OAuth flow
    }

    console.log('OAuth callback - Redirecting to:', redirectTo);

    // Create the final redirect response with success indicators
    const redirectUrl = new URL(redirectTo, origin);
    redirectUrl.searchParams.set('auth', 'complete');

    response = NextResponse.redirect(redirectUrl.toString());
    
    // Set cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;

  } catch (error) {
    console.error('OAuth callback - Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.redirect(`${origin}/auth?error=unexpected_error&message=${encodeURIComponent(errorMessage)}`);
  }
}
