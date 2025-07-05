import { NextRequest, NextResponse } from 'next/server'
import { createClient, rateLimitWithAction, AuthError, generateSecureToken, createEmailTransporter } from '@/lib/auth'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum(['student', 'teacher', 'parent']).default('student'),
  grade: z.string().optional(),
  wilaya: z.string().optional(),
  school: z.string().optional(),
  parentEmail: z.string().email().optional(),
  parentPhone: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    rateLimitWithAction(ip, 'signup')

    const supabase = await createClient()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('email', validatedData.email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      }
    })

    if (authError) {
      throw new AuthError(authError.message, 'SIGNUP_FAILED')
    }

    if (!authData.user) {
      throw new AuthError('Failed to create user account', 'SIGNUP_FAILED')
    }

    // Generate student ID for students
    let studentId = null
    if (validatedData.role === 'student') {
      const timestamp = Date.now().toString().slice(-6)
      const random = Math.random().toString(36).substring(2, 5).toUpperCase()
      studentId = `STU${timestamp}${random}`
    }

    // Create user profile
    const profileData = {
      user_id: authData.user.id,
      email: validatedData.email,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      role: validatedData.role,
      grade_level: validatedData.grade,
      wilaya: validatedData.wilaya,
      school_name: validatedData.school,
      student_id: studentId,
      is_verified: false,
      learning_streak: 0,
      total_study_time: 0
    }

    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert(profileData)

    if (profileError) {
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      throw new AuthError('Failed to create user profile', 'PROFILE_CREATION_FAILED')
    }

    // Send verification email
    const verificationToken = generateSecureToken()
    
    // Store verification token
    await supabase
      .from('email_verification_tokens')
      .insert({
        user_id: authData.user.id,
        token: verificationToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      })

    try {
      await sendVerificationEmail(validatedData.email, verificationToken)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail the registration if email fails
    }

    // If student with parent email, notify parent
    if (validatedData.role === 'student' && validatedData.parentEmail) {
      try {
        await sendParentNotification(
          validatedData.parentEmail, 
          `${validatedData.firstName} ${validatedData.lastName}`,
          authData.user.id
        )
      } catch (emailError) {
        console.error('Failed to send parent notification:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email for verification.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        studentId
      }
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

    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendVerificationEmail(email: string, token: string) {
  const transporter = await createEmailTransporter()
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`

  const mailOptions = {
    from: process.env.SMTP_FROM!,
    to: email,
    subject: 'تأكيد البريد الإلكتروني - منصة التعلم',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb; text-align: center;">أهلاً بك في منصة التعلم</h1>
        <p>مرحباً بك! يرجى تأكيد بريدك الإلكتروني لإكمال تسجيل حسابك.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            تأكيد البريد الإلكتروني
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذا البريد الإلكتروني.
        </p>
        <p style="color: #666; font-size: 12px;">
          هذا الرابط صالح لمدة 24 ساعة فقط.
        </p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

async function sendParentNotification(parentEmail: string, studentName: string, studentId: string) {
  const transporter = await createEmailTransporter()
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/parent/dashboard?student=${studentId}`

  const mailOptions = {
    from: process.env.SMTP_FROM!,
    to: parentEmail,
    subject: 'تم إنشاء حساب جديد لطفلك - منصة التعلم',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb; text-align: center;">إشعار إنشاء حساب</h1>
        <p>تم إنشاء حساب جديد لطفلك على منصة التعلم:</p>
        <ul>
          <li><strong>اسم الطالب:</strong> ${studentName}</li>
          <li><strong>تاريخ الإنشاء:</strong> ${new Date().toLocaleDateString('ar-DZ')}</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" 
             style="background-color: #059669; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            متابعة تقدم طفلك
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          يمكنك متابعة تقدم طفلك الأكاديمي ونشاطاته التعليمية من خلال لوحة التحكم الخاصة بالوالدين.
        </p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}
