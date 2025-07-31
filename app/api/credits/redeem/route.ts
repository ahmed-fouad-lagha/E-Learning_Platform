
import { createClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { applyRateLimit, rateLimitConfigs, validateRequest, validationSchemas, getClientIP, logSecurityEvent, getSecurityHeaders, sanitizeError } from '@/lib/security'

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'

  try {
    const supabase = createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    // Rate limiting per user
    const rateLimit = applyRateLimit(`redeem:${user.id}`, rateLimitConfigs.cardRedeem)
    if (!rateLimit.success) {
      logSecurityEvent({
        type: 'RATE_LIMIT',
        ip: clientIP,
        userAgent,
        userId: user.id,
        details: { endpoint: 'card-redeem' }
      })
      
      return NextResponse.json(
        { error: 'Too many redemption attempts. Please try again later.' },
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
    const validation = validateRequest(
      validationSchemas.cardCode,
      body.card_code
    )
    
    if (!validation.success) {
      logSecurityEvent({
        type: 'INVALID_INPUT',
        ip: clientIP,
        userAgent,
        userId: user.id,
        details: { endpoint: 'card-redeem', errors: validation.errors }
      })
      
      return NextResponse.json(
        { error: 'Invalid card code format' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    const card_code = validation.data

    // Normalize card code (remove spaces, convert to uppercase)
    const normalizedCode = card_code.replace(/\s+/g, '').toUpperCase()

    // Start a transaction by checking the card
    const { data: card, error: cardError } = await supabase
      .from('recharge_cards')
      .select('*')
      .eq('card_code', normalizedCode)
      .single()

    if (cardError || !card) {
      return NextResponse.json({ error: 'Invalid card code' }, { status: 400 })
    }

    // Check card status
    if (card.status === 'USED') {
      return NextResponse.json({ error: 'This card has already been used' }, { status: 400 })
    }

    if (card.status === 'EXPIRED') {
      return NextResponse.json({ error: 'This card has expired' }, { status: 400 })
    }

    // Check if card is expired
    if (new Date(card.expires_at) < new Date()) {
      // Mark card as expired
      await supabase
        .from('recharge_cards')
        .update({ status: 'EXPIRED' })
        .eq('id', card.id)

      return NextResponse.json({ error: 'This card has expired' }, { status: 400 })
    }

    // Get user's current wallet
    const { data: wallet, error: walletError } = await supabase
      .from('user_credit_wallets')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'User wallet not found' }, { status: 500 })
    }

    const balance_before = wallet.current_balance
    const balance_after = balance_before + card.credit_amount

    // Update card status to USED
    const { error: updateCardError } = await supabase
      .from('recharge_cards')
      .update({
        status: 'USED',
        used_by: user.id,
        used_at: new Date().toISOString()
      })
      .eq('id', card.id)

    if (updateCardError) {
      console.error('Error updating card:', updateCardError)
      return NextResponse.json({ error: 'Failed to redeem card' }, { status: 500 })
    }

    // Update wallet balance
    const { error: updateWalletError } = await supabase
      .from('user_credit_wallets')
      .update({
        current_balance: balance_after,
        total_earned: wallet.total_earned + card.credit_amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    if (updateWalletError) {
      console.error('Error updating wallet:', updateWalletError)
      return NextResponse.json({ error: 'Failed to update wallet' }, { status: 500 })
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        transaction_type: 'RECHARGE',
        amount: card.credit_amount,
        balance_before,
        balance_after,
        recharge_card_id: card.id,
        description: `Recharge with card ${card.card_code}`,
        notes: `Card credit amount: ${card.credit_amount}`
      })

    if (transactionError) {
      console.error('Error creating transaction:', transactionError)
      // Don't fail the entire operation for transaction logging
    }

    return NextResponse.json({
      message: 'Card redeemed successfully',
      credit_amount: card.credit_amount,
      new_balance: balance_after
    })

  } catch (error) {
    console.error('Error redeeming card:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
