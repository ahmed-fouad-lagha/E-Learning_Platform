import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import nodemailer from 'nodemailer'

export type UserRole = 'student' | 'teacher' | 'admin' | 'parent'
export type SessionStatus = 'active' | 'expired' | 'revoked'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  profile?: any
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return {
      id: user.id,
      email: user.email!,
      role: profile?.role || 'student',
      profile
    }
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function requireAuth(roles?: UserRole[]) {
  const user = await getUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  if (roles && !roles.includes(user.role)) {
    throw new Error('Insufficient permissions')
  }
  
  return user
}

export function generateSecureToken(): string {
  return jwt.sign(
    { timestamp: Date.now(), random: Math.random() },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  )
}

export function verifySecureToken(token: string): boolean {
  try {
    jwt.verify(token, process.env.JWT_SECRET!)
    return true
  } catch {
    return false
  }
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(password, hash)
}

export class AuthError extends Error {
  constructor(message: string, public code: string = 'AUTH_ERROR') {
    super(message)
    this.name = 'AuthError'
  }
}

// Rate limiting helper
const rateLimitMap = new Map()

export function rateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
  const key = `rate_limit_${identifier}`
  const now = Date.now()
  const userAttempts = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs }

  if (now > userAttempts.resetTime) {
    userAttempts.count = 0
    userAttempts.resetTime = now + windowMs
  }

  userAttempts.count++
  rateLimitMap.set(key, userAttempts)

  if (userAttempts.count > maxAttempts) {
    throw new AuthError('Too many attempts. Please try again later.', 'RATE_LIMIT_EXCEEDED')
  }

  return {
    count: userAttempts.count,
    remaining: maxAttempts - userAttempts.count,
    resetTime: userAttempts.resetTime
  }
}

// Multi-Factor Authentication
export async function generateMFASecret(userId: string, email: string) {
  const secret = speakeasy.generateSecret({
    name: `E-Learning Platform (${email})`,
    issuer: 'E-Learning Platform',
    length: 32
  })

  // Store secret in database
  const supabase = await createClient()
  await supabase
    .from('user_mfa')
    .upsert({
      user_id: userId,
      secret: secret.base32,
      enabled: false
    })

  // Generate QR code
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!)
  
  return {
    secret: secret.base32,
    qrCode: qrCodeUrl,
    manualEntryKey: secret.base32
  }
}

export async function verifyMFAToken(userId: string, token: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: mfaData } = await supabase
    .from('user_mfa')
    .select('secret')
    .eq('user_id', userId)
    .eq('enabled', true)
    .single()

  if (!mfaData) return false

  return speakeasy.totp.verify({
    secret: mfaData.secret,
    encoding: 'base32',
    token,
    window: 2
  })
}

export async function enableMFA(userId: string, token: string): Promise<boolean> {
  const isValid = await verifyMFAToken(userId, token)
  if (!isValid) return false

  const supabase = await createClient()
  await supabase
    .from('user_mfa')
    .update({ enabled: true })
    .eq('user_id', userId)

  return true
}

// Session Management
export async function createSession(userId: string, deviceInfo?: string) {
  const supabase = await createClient()
  const sessionToken = generateSecureToken()
  
  const { data: session } = await supabase
    .from('user_sessions')
    .insert({
      user_id: userId,
      session_token: sessionToken,
      device_info: deviceInfo,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      status: 'active'
    })
    .select()
    .single()

  return session
}

export async function validateSession(sessionToken: string) {
  const supabase = await createClient()
  
  const { data: session } = await supabase
    .from('user_sessions')
    .select(`
      *,
      user_profiles(*)
    `)
    .eq('session_token', sessionToken)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .single()

  return session
}

export async function revokeSession(sessionToken: string) {
  const supabase = await createClient()
  
  await supabase
    .from('user_sessions')
    .update({ status: 'revoked' })
    .eq('session_token', sessionToken)
}

export async function revokeAllUserSessions(userId: string) {
  const supabase = await createClient()
  
  await supabase
    .from('user_sessions')
    .update({ status: 'revoked' })
    .eq('user_id', userId)
}

// Email Services
export async function createEmailTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!
    }
  })
}

export async function sendVerificationEmail(email: string, token: string) {
  const transporter = await createEmailTransporter()
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`

  const mailOptions = {
    from: process.env.SMTP_FROM!,
    to: email,
    subject: 'Verify your E-Learning Platform account',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2>Welcome to E-Learning Platform!</h2>
        <p>Please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const transporter = await createEmailTransporter()
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`

  const mailOptions = {
    from: process.env.SMTP_FROM!,
    to: email,
    subject: 'Reset your E-Learning Platform password',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

// Parent Notifications
export async function sendParentNotification(parentEmail: string, studentName: string, message: string) {
  const transporter = await createEmailTransporter()

  const mailOptions = {
    from: process.env.SMTP_FROM!,
    to: parentEmail,
    subject: `Update about ${studentName} - E-Learning Platform`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2>Student Update</h2>
        <p><strong>Student:</strong> ${studentName}</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
          ${message}
        </div>
        <p>Best regards,<br>E-Learning Platform Team</p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

// Social Login Helper
export async function handleSocialLogin(provider: string, profile: any) {
  const supabase = await createClient()
  
  // Check if user exists
  const { data: existingUser } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', profile.email)
    .single()

  if (existingUser) {
    // Update social login info
    await supabase
      .from('user_social_logins')
      .upsert({
        user_id: existingUser.user_id,
        provider,
        provider_id: profile.id,
        provider_data: profile
      })
    
    return existingUser
  }

  // Create new user
  const { data: newUser } = await supabase.auth.signUp({
    email: profile.email,
    password: generateSecureToken(), // Random password for social users
  })

  if (newUser.user) {
    // Create profile
    await supabase
      .from('user_profiles')
      .insert({
        user_id: newUser.user.id,
        email: profile.email,
        first_name: profile.given_name || profile.first_name,
        last_name: profile.family_name || profile.last_name,
        role: 'student', // Default role
        avatar_url: profile.picture || profile.avatar_url
      })

    // Link social account
    await supabase
      .from('user_social_logins')
      .insert({
        user_id: newUser.user.id,
        provider,
        provider_id: profile.id,
        provider_data: profile
      })
  }

  return newUser.user
}

// Advanced rate limiting with different limits per action
export const rateLimits = {
  login: { attempts: 5, windowMs: 15 * 60 * 1000 },
  signup: { attempts: 3, windowMs: 60 * 60 * 1000 },
  passwordReset: { attempts: 3, windowMs: 60 * 60 * 1000 },
  mfaVerify: { attempts: 10, windowMs: 15 * 60 * 1000 }
}

export function rateLimitWithAction(identifier: string, action: keyof typeof rateLimits) {
  const limits = rateLimits[action]
  return rateLimit(identifier, limits.attempts, limits.windowMs)
}
