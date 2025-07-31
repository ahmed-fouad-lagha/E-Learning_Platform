
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
  courseId: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId } = params

    // Get course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if course is free
    if (course.is_free || !course.credit_price || course.credit_price === 0) {
      return NextResponse.json({ error: 'This course is free, use regular enrollment' }, { status: 400 })
    }

    // Check if user is already enrolled
    const { data: existingEnrollment } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single()

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 })
    }

    // Get user's wallet
    const { data: wallet, error: walletError } = await supabase
      .from('user_credit_wallets')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'User wallet not found' }, { status: 500 })
    }

    // Check if user has enough credits
    if (wallet.current_balance < course.credit_price) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        required: course.credit_price,
        available: wallet.current_balance,
        shortage: course.credit_price - wallet.current_balance
      }, { status: 400 })
    }

    const balance_before = wallet.current_balance
    const balance_after = balance_before - course.credit_price

    // Update wallet balance
    const { error: updateWalletError } = await supabase
      .from('user_credit_wallets')
      .update({
        current_balance: balance_after,
        total_spent: wallet.total_spent + course.credit_price,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    if (updateWalletError) {
      console.error('Error updating wallet:', updateWalletError)
      return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 })
    }

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        transaction_type: 'COURSE_PURCHASE',
        amount: -course.credit_price,
        balance_before,
        balance_after,
        course_id: courseId,
        description: `Enrollment in course: ${course.title}`,
        notes: `Credit price: ${course.credit_price}`
      })
      .select()
      .single()

    if (transactionError) {
      console.error('Error creating transaction:', transactionError)
      // Rollback wallet update
      await supabase
        .from('user_credit_wallets')
        .update({
          current_balance: balance_before,
          total_spent: wallet.total_spent,
          updated_at: wallet.updated_at
        })
        .eq('user_id', user.id)
      
      return NextResponse.json({ error: 'Failed to record transaction' }, { status: 500 })
    }

    // Create enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('course_enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId,
        paid_with_credits: true,
        credit_transaction_id: transaction.id
      })
      .select()
      .single()

    if (enrollmentError) {
      console.error('Error creating enrollment:', enrollmentError)
      // Rollback wallet and transaction
      await supabase
        .from('user_credit_wallets')
        .update({
          current_balance: balance_before,
          total_spent: wallet.total_spent,
          updated_at: wallet.updated_at
        })
        .eq('user_id', user.id)
      
      await supabase
        .from('credit_transactions')
        .delete()
        .eq('id', transaction.id)
      
      return NextResponse.json({ error: 'Failed to create enrollment' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Successfully enrolled in course',
      enrollment,
      credits_spent: course.credit_price,
      new_balance: balance_after
    })

  } catch (error) {
    console.error('Error enrolling with credits:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
