import { NextRequest, NextResponse } from 'next/server'
import { createClient, AuthError } from '@/lib/auth'
import { z } from 'zod'

const verifyEmailSchema = z.object({
  token: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = verifyEmailSchema.parse(body)

    const supabase = await createClient()

    // Verify email token
    const { data: tokenData, error: tokenError } = await supabase
      .from('email_verification_tokens')
      .select(`
        user_id,
        expires_at,
        used_at
      `)
      .eq('token', token)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (tokenError || !tokenData) {
      throw new AuthError('Invalid or expired verification token', 'INVALID_TOKEN')
    }

    // Mark email as verified
    const { error: verifyError } = await supabase
      .from('user_profiles')
      .update({
        is_verified: true,
        email_verified_at: new Date().toISOString()
      })
      .eq('user_id', tokenData.user_id)

    if (verifyError) {
      throw new AuthError('Failed to verify email', 'VERIFICATION_FAILED')
    }

    // Mark token as used
    await supabase
      .from('email_verification_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token)

    // Update auth.users email confirmation
    await supabase.auth.admin.updateUserById(tokenData.user_id, {
      email_confirm: true
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully. You can now access all features.'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      )
    }

    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      )
    }

    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?error=missing_token`
      )
    }

    // Attempt verification
    const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })

    const result = await verifyResponse.json()

    if (result.success) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/verified?success=true`
      )
    } else {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?error=${result.code || 'verification_failed'}`
      )
    }

  } catch (error) {
    console.error('Email verification GET error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?error=server_error`
    )
  }
}
