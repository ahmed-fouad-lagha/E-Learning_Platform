-- Minimal Database Setup for E-Learning Platform
-- Execute this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'TEACHER', 'PARENT', 'ADMIN')),
    is_verified BOOLEAN DEFAULT false,
    grade TEXT,
    wilaya TEXT,
    school TEXT,
    parent_phone TEXT,
    subscription TEXT DEFAULT 'FREE' CHECK (subscription IN ('FREE', 'PREMIUM', 'SCHOOL')),
    subscription_expiry TIMESTAMPTZ,
    total_points INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    last_active TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    description TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    subject TEXT NOT NULL CHECK (subject IN ('MATHEMATICS', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ARABIC_LITERATURE', 'FRENCH', 'ENGLISH', 'HISTORY', 'GEOGRAPHY', 'PHILOSOPHY', 'ISLAMIC_STUDIES', 'ECONOMICS', 'ACCOUNTING', 'COMPUTER_SCIENCE')),
    grade TEXT NOT NULL CHECK (grade IN ('PREMIERE_AS', 'PREMIERE_AL', 'DEUXIEME_AS', 'DEUXIEME_AL', 'TERMINALE_AS', 'TERMINALE_AL', 'TERMINALE_TM', 'TERMINALE_GE')),
    difficulty TEXT DEFAULT 'BEGINNER' CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'BAC_LEVEL')),
    thumbnail TEXT,
    is_published BOOLEAN DEFAULT false,
    is_free BOOLEAN DEFAULT false,
    curriculum TEXT NOT NULL,
    bac_relevance DECIMAL(3,2) DEFAULT 0 CHECK (bac_relevance >= 0 AND bac_relevance <= 1),
    total_lessons INTEGER DEFAULT 0,
    estimated_hours INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Course Enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT now(),
    progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, course_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for courses
DROP POLICY IF EXISTS "Anyone can view published courses" ON public.courses;
CREATE POLICY "Anyone can view published courses" ON public.courses
    FOR SELECT USING (is_published = true);

-- RLS Policies for course_enrollments
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.course_enrollments;
CREATE POLICY "Users can view own enrollments" ON public.course_enrollments
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create enrollments" ON public.course_enrollments;
CREATE POLICY "Users can create enrollments" ON public.course_enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own enrollments" ON public.course_enrollments;
CREATE POLICY "Users can update own enrollments" ON public.course_enrollments
    FOR UPDATE USING (auth.uid() = user_id);

-- Insert sample course data
INSERT INTO public.courses (id, title, title_ar, description, description_ar, subject, grade, curriculum, is_published, is_free) VALUES
('math-algebra-basics', 'Algebra Basics', 'أساسيات الجبر', 'Introduction to algebra and basic equations', 'مقدمة في الجبر والمعادلات الأساسية', 'MATHEMATICS', 'PREMIERE_AS', 'ALGERIAN_BAC', true, true),
('physics-mechanics', 'Classical Mechanics', 'الميكانيكا الكلاسيكية', 'Study of motion and forces in physics', 'دراسة الحركة والقوى في الفيزياء', 'PHYSICS', 'TERMINALE_AS', 'ALGERIAN_BAC', true, false),
('arabic-literature', 'Arabic Literature', 'الأدب العربي', 'Study of classical Arabic literary texts', 'دراسة النصوص الأدبية العربية الكلاسيكية', 'ARABIC_LITERATURE', 'TERMINALE_AL', 'ALGERIAN_BAC', true, true)
ON CONFLICT (id) DO NOTHING;

-- Function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
