import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const isConfigured = Boolean(
    supabaseUrl && 
    supabaseUrl !== 'your-supabase-url' && 
    supabaseAnonKey && 
    supabaseAnonKey !== 'your-supabase-anon-key'
  );

  // If Supabase is not configured, allow all requests to pass through
  if (!isConfigured) {
    console.warn('Middleware: Supabase not configured, allowing all requests');
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  let user = null;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    console.error('Middleware: Error getting user:', error);
    // Continue with user as null
  }

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/courses', '/admin', '/payment'];
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // Auth-related paths that should be accessible without authentication
  const authPaths = ['/auth', '/api/auth'];
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // Public paths that don't require authentication
  const publicPaths = ['/', '/pricing', '/about', '/contact', '/api/verify-db'];
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith('/api/verify-db')
  );

  if (isProtectedPath && !user) {
    // User is not authenticated, redirect to login
    console.log('Middleware: Redirecting unauthenticated user to auth page');
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access auth pages (except callback/confirm), redirect to dashboard
  if (user && isAuthPath && 
      !request.nextUrl.pathname.includes('/callback') &&
      !request.nextUrl.pathname.includes('/confirm') &&
      !request.nextUrl.pathname.includes('/auth-code-error') &&
      !request.nextUrl.pathname.startsWith('/api/auth')) {
    console.log('Middleware: Redirecting authenticated user to dashboard');
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
