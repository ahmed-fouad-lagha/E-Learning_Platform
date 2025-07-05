import { NextRequest, NextResponse } from 'next/server'
import { createClient, AuthError, hashPassword } from '@/lib/auth'
import { z } from 'zod'

const resetConfirmSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = resetConfirmSchema.parse(body)

    const supabase = await createClient()

    // Verify reset token
    const { data: resetData, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select(`
        user_id,
        expires_at,
        used_at,
        user_profiles!inner(email)
      `)
      .eq('token', token)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (tokenError || !resetData) {
      throw new AuthError('Invalid or expired reset token', 'INVALID_TOKEN')
    }

    // Update password in auth.users
    const { error: passwordError } = await supabase.auth.admin.updateUserById(
      resetData.user_id,
      { password }
    )

    if (passwordError) {
      throw new AuthError('Failed to update password', 'PASSWORD_UPDATE_FAILED')
    }

    // Mark token as used
    await supabase
      .from('password_reset_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token)

    // Reset login attempts
    await supabase
      .from('user_profiles')
      .update({
        login_attempts: 0,
        account_locked_until: null
      })
      .eq('user_id', resetData.user_id)

    // Revoke all existing sessions for security
    await supabase
      .from('user_sessions')
      .update({ status: 'revoked' })
      .eq('user_id', resetData.user_id)

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.'
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

    console.error('Password reset confirm error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
