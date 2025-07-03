import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

// Define protected routes
const protectedRoutes = ['/dashboard', '/profile', '/courses', '/exams'];
const authRoutes = ['/auth', '/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Get current user
  const currentUser = await getCurrentUser(request);

  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && !currentUser) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // If user is authenticated and trying to access auth routes
  if (isAuthRoute && currentUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};