import { NextRequest, NextResponse } from 'next/server'
import { createClient, rateLimitWithAction, AuthError, generateSecureToken, sendPasswordResetEmail } from '@/lib/auth'
import { z } from 'zod'

const resetRequestSchema = z.object({
  email: z.string().email()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = resetRequestSchema.parse(body)

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    rateLimitWithAction(ip, 'passwordReset')

    const supabase = await createClient()

    // Check if user exists
    const { data: user } = await supabase
      .from('user_profiles')
      .select('user_id, email')
      .eq('email', email)
      .single()

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.'
      })
    }

    // Generate reset token
    const resetToken = generateSecureToken()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Store reset token
    await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: user.user_id,
        token: resetToken,
        expires_at: expiresAt.toISOString()
      })

    // Send reset email
    try {
      await sendPasswordResetEmail(email, resetToken)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // Don't reveal email send failure to prevent enumeration
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
