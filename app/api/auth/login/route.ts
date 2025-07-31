import { NextRequest, NextResponse } from 'next/server'
import { createClient, rateLimitWithAction, AuthError } from '@/lib/auth'
import { applyRateLimit, rateLimitConfigs, validateRequest, validationSchemas, getClientIP, logSecurityEvent, getSecurityHeaders, sanitizeError } from '@/lib/security'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  mfaToken: z.string().optional(),
  rememberMe: z.boolean().default(false)
})

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'

  try {
    // Rate limiting
    const rateLimit = applyRateLimit(clientIP, rateLimitConfigs.auth)
    if (!rateLimit.success) {
      logSecurityEvent({
        type: 'RATE_LIMIT',
        ip: clientIP,
        userAgent,
        details: { endpoint: 'login' }
      })

      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            ...getSecurityHeaders()
          }
        }
      )
    }

    const body = await request.json()

    // Input validation
    const loginSchema = z.object({
      email: validationSchemas.email,
      password: validationSchemas.password
    })

    const validation = validateRequest(loginSchema, body)
    if (!validation.success) {
      logSecurityEvent({
        type: 'INVALID_INPUT',
        ip: clientIP,
        userAgent,
        details: { endpoint: 'login', errors: validation.errors }
      })

      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    const { email, password } = validation.data

    const supabase = await createClient()

    // Attempt login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password
    })

    if (authError) {
      throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS')
    }

    if (!authData.user) {
      logSecurityEvent({
        type: 'AUTH_FAILURE',
        ip: clientIP,
        userAgent,
        details: { email, error: authError?.message }
      })

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError || !profile) {
      throw new AuthError('User profile not found', 'PROFILE_NOT_FOUND')
    }

    // Check if user is active
    if (!profile.is_active) {
      throw new AuthError('Account has been deactivated', 'ACCOUNT_DEACTIVATED')
    }

    // Check email verification for students and teachers
    if ((profile.role === 'student' || profile.role === 'teacher') && !profile.is_verified) {
      throw new AuthError('Please verify your email before logging in', 'EMAIL_NOT_VERIFIED')
    }

    // Check MFA if enabled
    const { data: mfaData } = await supabase
      .from('user_mfa')
      .select('enabled')
      .eq('user_id', authData.user.id)
      .single()

    if (mfaData?.enabled) {
      if (!validatedData.mfaToken) {
        return NextResponse.json({
          requiresMFA: true,
          message: 'Multi-factor authentication required'
        }, { status: 200 })
      }

      const isValidMFA = await verifyMFAToken(authData.user.id, validatedData.mfaToken)
      if (!isValidMFA) {
        throw new AuthError('Invalid MFA code', 'INVALID_MFA')
      }
    }

    // Update last login and activity
    await supabase
      .from('profiles')
      .update({
        last_active: new Date().toISOString(),
        login_attempts: 0 // Reset failed attempts on successful login
      })
      .eq('id', authData.user.id)

    // Create session record
    const deviceInfo = request.headers.get('user-agent') || 'Unknown device'
    await createSession(authData.user.id, deviceInfo)

    // Update learning streak for students
    if (profile.role === 'student') {
      await updateLearningStreak(authData.user.id)
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: profile.role,
        firstName: profile.first_name,
        lastName: profile.last_name,
        isVerified: profile.is_verified,
        learningStreak: profile.learning_streak,
        totalStudyTime: profile.total_study_time
      },
      session: authData.session
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof AuthError) {
      // Log failed login attempt
      if (error.code === 'INVALID_CREDENTIALS') {
        try {
          const supabase = await createClient()
          const body = await request.json()

          // Get current login attempts
          const { data: currentProfile } = await supabase
            .from('profiles')
            .select('login_attempts')
            .eq('email', body.email)
            .single()

          const newAttempts = (currentProfile?.login_attempts || 0) + 1
          const shouldLock = newAttempts >= 5

          await supabase
            .from('profiles')
            .update({
              login_attempts: newAttempts,
              ...(shouldLock && {
                account_locked_until: new Date(Date.now() + 15 * 60 * 1000).toISOString()
              })
            })
            .eq('email', body.email)
        } catch (dbError) {
          console.error('Failed to update login attempts:', dbError)
        }
      }

      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 401 }
      )
    }

    logSecurityEvent({
      type: 'AUTH_FAILURE',
      ip: clientIP,
      userAgent,
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    })

    const sanitizedError = sanitizeError(error)
    return NextResponse.json(
      { error: sanitizedError.message },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}

async function updateLearningStreak(userId: string) {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('last_activity, learning_streak')
    .eq('user_id', userId)
    .single()

  if (!profile) return

  const lastActivity = profile.last_activity ? new Date(profile.last_activity) : null
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  let newStreak = profile.learning_streak || 0

  if (!lastActivity || lastActivity < yesterday) {
    // Reset streak if more than a day has passed
    newStreak = 1
  } else if (lastActivity.toDateString() === yesterday.toDateString()) {
    // Increment streak if last activity was yesterday
    newStreak += 1
  }
  // If last activity was today, keep the current streak

  await supabase
    .from('profiles')
    .update({
      current_streak: newStreak,
      last_active: now.toISOString()
    })
    .eq('id', userId)
}