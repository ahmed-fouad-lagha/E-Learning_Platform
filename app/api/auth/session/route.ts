import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
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
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {
              console.error('Error setting cookies:', error);
            }
          },
        },
      }
    );

    const { data: { session }, error } = await supabase.auth.getSession();
    
    return NextResponse.json({
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
      sessionExpiry: session?.expires_at,
      cookies: cookieStore.getAll().map(c => ({ name: c.name, hasValue: !!c.value })),
      error: error?.message
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
