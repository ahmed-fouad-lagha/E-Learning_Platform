import { createClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const supabase = createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { credit_amount, quantity = 1, expires_in_days = 365, batch_name, notes } = body

    if (!credit_amount || credit_amount <= 0) {
      return NextResponse.json({ error: 'Valid credit amount required' }, { status: 400 })
    }

    if (quantity <= 0 || quantity > 100) {
      return NextResponse.json({ error: 'Quantity must be between 1 and 100' }, { status: 400 })
    }

    // Calculate expiration date
    const expires_at = new Date()
    expires_at.setDate(expires_at.getDate() + expires_in_days)

    // Generate multiple cards
    const cards = []
    for (let i = 0; i < quantity; i++) {
      // Generate unique card code using database function
      const { data: codeData } = await supabase.rpc('generate_card_code')

      const card = {
        card_code: codeData,
        credit_amount,
        expires_at: expires_at.toISOString(),
        created_by: user.id,
        batch_name,
        notes
      }

      cards.push(card)
    }

    // Insert cards into database
    const { data: insertedCards, error: insertError } = await supabase
      .from('recharge_cards')
      .insert(cards)
      .select()

    if (insertError) {
      console.error('Error inserting cards:', insertError)
      return NextResponse.json({ error: 'Failed to generate cards' }, { status: 500 })
    }

    return NextResponse.json({
      message: `Successfully generated ${quantity} recharge cards`,
      cards: insertedCards
    })

  } catch (error) {
    console.error('Error generating cards:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}