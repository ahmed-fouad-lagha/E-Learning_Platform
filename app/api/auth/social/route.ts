import { NextRequest, NextResponse } from 'next/server'
import { createClient, handleSocialLogin, AuthError } from '@/lib/auth'
import { z } from 'zod'

const socialLoginSchema = z.object({
  provider: z.enum(['google', 'facebook']),
  redirectTo: z.string().url().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, redirectTo } = socialLoginSchema.parse(body)

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo || `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })

    if (error) {
      throw new AuthError(error.message, 'SOCIAL_LOGIN_FAILED')
    }

    return NextResponse.json({
      url: data.url,
      provider
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      )
    }

    console.error('Social login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
