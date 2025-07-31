
-- Digital Credits and Prepaid Cards System Schema
-- Execute this in your Supabase SQL Editor

-- Recharge cards table for prepaid card management
CREATE TABLE IF NOT EXISTS public.recharge_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    card_code TEXT UNIQUE NOT NULL,
    credit_amount INTEGER NOT NULL CHECK (credit_amount > 0),
    
    -- Card status and lifecycle
    status TEXT DEFAULT 'UNUSED' CHECK (status IN ('UNUSED', 'USED', 'EXPIRED')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    
    -- Optional metadata
    batch_name TEXT,
    notes TEXT
);

-- User credit wallets table
CREATE TABLE IF NOT EXISTS public.user_credit_wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Credit balance
    current_balance INTEGER DEFAULT 0 CHECK (current_balance >= 0),
    total_earned INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Credit transactions table for transaction history
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Transaction details
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('RECHARGE', 'COURSE_PURCHASE', 'REFUND', 'ADMIN_ADJUSTMENT')),
    amount INTEGER NOT NULL, -- Positive for credits added, negative for credits spent
    balance_before INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    
    -- Related references
    recharge_card_id UUID REFERENCES public.recharge_cards(id) ON DELETE SET NULL,
    course_id TEXT REFERENCES public.courses(id) ON DELETE SET NULL,
    
    -- Transaction metadata
    description TEXT NOT NULL,
    notes TEXT,
    processed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- For admin transactions
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add credit_price column to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS credit_price INTEGER DEFAULT 0 CHECK (credit_price >= 0);

-- Update course enrollments to track credit transactions
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS paid_with_credits BOOLEAN DEFAULT false;
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS credit_transaction_id UUID REFERENCES public.credit_transactions(id) ON DELETE SET NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recharge_cards_code ON public.recharge_cards(card_code);
CREATE INDEX IF NOT EXISTS idx_recharge_cards_status ON public.recharge_cards(status);
CREATE INDEX IF NOT EXISTS idx_recharge_cards_created_by ON public.recharge_cards(created_by);
CREATE INDEX IF NOT EXISTS idx_user_credit_wallets_user_id ON public.user_credit_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON public.credit_transactions(transaction_type);

-- Enable RLS
ALTER TABLE public.recharge_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credit_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recharge_cards
CREATE POLICY "Admins can manage all recharge cards" ON public.recharge_cards
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'ADMIN'
        )
    );

CREATE POLICY "Users can view unused recharge cards for redemption" ON public.recharge_cards
    FOR SELECT USING (status = 'UNUSED');

-- RLS Policies for user_credit_wallets
CREATE POLICY "Users can view their own wallet" ON public.user_credit_wallets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage wallets" ON public.user_credit_wallets
    FOR ALL USING (true); -- Allow system operations

CREATE POLICY "Admins can view all wallets" ON public.user_credit_wallets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'ADMIN'
        )
    );

-- RLS Policies for credit_transactions
CREATE POLICY "Users can view their own transactions" ON public.credit_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create transactions" ON public.credit_transactions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all transactions" ON public.credit_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'ADMIN'
        )
    );

-- Function to create wallet when user signs up
CREATE OR REPLACE FUNCTION public.create_user_wallet()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_credit_wallets (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Trigger to create wallet on user signup
DROP TRIGGER IF EXISTS on_user_wallet_created ON public.profiles;
CREATE TRIGGER on_user_wallet_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.create_user_wallet();

-- Function to update wallet updated_at timestamp
CREATE TRIGGER update_user_credit_wallets_updated_at 
    BEFORE UPDATE ON public.user_credit_wallets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate unique card codes
CREATE OR REPLACE FUNCTION public.generate_card_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        -- Generate a 12-character alphanumeric code in format XXXX-XXXX-XXXX
        code := UPPER(
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4) || '-' ||
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4) || '-' ||
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)
        );
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM public.recharge_cards WHERE card_code = code) INTO exists_check;
        
        -- Exit loop if code is unique
        IF NOT exists_check THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;
