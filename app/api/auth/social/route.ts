import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

const socialLoginSchema = z.object({
  provider: z.enum(['google', 'facebook']),
  redirectTo: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, redirectTo } = socialLoginSchema.parse(body)

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    // Get the origin from the request
    const origin = request.headers.get('origin') || 'http://localhost:3000'
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })

    if (error) {
      console.error('OAuth error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ url: data.url })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Social auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
