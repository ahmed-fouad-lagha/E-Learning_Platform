import { NextRequest, NextResponse } from 'next/server'
import { createClient, requireAuth, generateMFASecret, verifyMFAToken, enableMFA } from '@/lib/auth'
import { z } from 'zod'

const setupMFASchema = z.object({
  action: z.enum(['generate', 'verify', 'disable']),
  token: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(['teacher', 'admin'])
    const body = await request.json()
    const { action, token } = setupMFASchema.parse(body)

    const supabase = await createClient()

    switch (action) {
      case 'generate':
        const mfaSetup = await generateMFASecret(user.id, user.email)
        return NextResponse.json({
          secret: mfaSetup.secret,
          qrCode: mfaSetup.qrCode,
          manualEntryKey: mfaSetup.manualEntryKey
        })

      case 'verify':
        if (!token) {
          return NextResponse.json(
            { error: 'Token is required for verification' },
            { status: 400 }
          )
        }

        const isEnabled = await enableMFA(user.id, token)
        if (!isEnabled) {
          return NextResponse.json(
            { error: 'Invalid token' },
            { status: 400 }
          )
        }

        // Generate backup codes
        const backupCodes = generateBackupCodes()
        
        await supabase
          .from('user_mfa')
          .update({ backup_codes: backupCodes })
          .eq('user_id', user.id)

        return NextResponse.json({
          success: true,
          message: 'MFA enabled successfully',
          backupCodes
        })

      case 'disable':
        if (!token) {
          return NextResponse.json(
            { error: 'Token is required to disable MFA' },
            { status: 400 }
          )
        }

        const isValidToken = await verifyMFAToken(user.id, token)
        if (!isValidToken) {
          return NextResponse.json(
            { error: 'Invalid token' },
            { status: 400 }
          )
        }

        await supabase
          .from('user_mfa')
          .update({ enabled: false, backup_codes: null })
          .eq('user_id', user.id)

        return NextResponse.json({
          success: true,
          message: 'MFA disabled successfully'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('MFA setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { data: mfaData } = await supabase
      .from('user_mfa')
      .select('enabled, backup_codes')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({
      enabled: mfaData?.enabled || false,
      hasBackupCodes: Boolean(mfaData?.backup_codes?.length)
    })

  } catch (error) {
    console.error('MFA status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateBackupCodes(): string[] {
  const codes = []
  for (let i = 0; i < 10; i++) {
    codes.push(Math.random().toString(36).substring(2, 10).toUpperCase())
  }
  return codes
}
