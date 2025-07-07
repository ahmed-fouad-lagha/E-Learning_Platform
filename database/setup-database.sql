-- Step 1: Create the profiles table
-- Copy and paste this into your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'TEACHER', 'PARENT', 'ADMIN')),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Student specific fields
    grade TEXT,
    wilaya TEXT,
    school TEXT,
    student_id TEXT UNIQUE,
    birth_date DATE,
    
    -- Parent connection
    parent_id UUID REFERENCES public.profiles(id),
    parent_phone TEXT,
    parent_email TEXT,
    
    -- Subscription and progress
    subscription TEXT DEFAULT 'FREE' CHECK (subscription IN ('FREE', 'PREMIUM', 'SCHOOL')),
    total_points INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_active TIMESTAMPTZ DEFAULT now(),
    
    -- Security
    login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        'STUDENT'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS handle_updated_at ON public.profiles;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
