-- Enhanced Authentication Schema for E-Learning Platform
-- Execute this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enhanced profiles table with advanced authentication features
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'TEACHER', 'PARENT', 'ADMIN')),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Student specific fields
    grade TEXT CHECK (grade IN ('PREMIERE_AS', 'PREMIERE_AL', 'DEUXIEME_AS', 'DEUXIEME_AL', 'TERMINALE_AS', 'TERMINALE_AL', 'TERMINALE_TM', 'TERMINALE_GE')),
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
    subscription_expiry TIMESTAMPTZ,
    total_points INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_active TIMESTAMPTZ DEFAULT now(),
    
    -- Multi-factor authentication
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret TEXT,
    backup_codes TEXT[],
    
    -- Security and session management
    last_login TIMESTAMPTZ,
    login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMPTZ,
    password_reset_token TEXT,
    password_reset_expires TIMESTAMPTZ,
    email_verification_token TEXT,
    email_verification_expires TIMESTAMPTZ,
    
    -- Preferences
    language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'ar', 'en')),
    timezone TEXT DEFAULT 'Africa/Algiers',
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- User sessions table for advanced session management
CREATE TABLE public.user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    refresh_token TEXT UNIQUE,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_accessed TIMESTAMPTZ DEFAULT now()
);

-- Social auth providers
CREATE TABLE public.social_auth_providers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'facebook', 'github')),
    provider_user_id TEXT NOT NULL,
    provider_data JSONB,
    connected_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, provider)
);

-- Academic progress tracking
CREATE TABLE public.academic_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id TEXT,
    progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent INTEGER DEFAULT 0, -- in minutes
    last_accessed TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    grade DECIMAL(5,2),
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, course_id, lesson_id)
);

-- Achievement badges system
CREATE TABLE public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    icon_url TEXT,
    badge_color TEXT DEFAULT '#3B82F6',
    criteria JSONB NOT NULL, -- Achievement criteria as JSON
    points_reward INTEGER DEFAULT 0,
    category TEXT CHECK (category IN ('LEARNING', 'STREAK', 'COMPLETION', 'EXCELLENCE', 'PARTICIPATION')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- User achievements
CREATE TABLE public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT now(),
    progress JSONB DEFAULT '{}'::jsonb,
    UNIQUE(user_id, achievement_id)
);

-- Notifications system
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('SUCCESS', 'INFO', 'WARNING', 'ERROR', 'ACHIEVEMENT', 'REMINDER')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Parent-student relationships
CREATE TABLE public.parent_student_links (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    relationship_type TEXT DEFAULT 'PARENT' CHECK (relationship_type IN ('PARENT', 'GUARDIAN', 'TUTOR')),
    is_primary BOOLEAN DEFAULT false,
    permissions JSONB DEFAULT '{"view_progress": true, "receive_notifications": true, "manage_subscription": false}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(parent_id, student_id)
);

-- Teacher classes and student assignments
CREATE TABLE public.teacher_classes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    grade TEXT NOT NULL CHECK (grade IN ('PREMIERE_AS', 'PREMIERE_AL', 'DEUXIEME_AS', 'DEUXIEME_AL', 'TERMINALE_AS', 'TERMINALE_AL', 'TERMINALE_TM', 'TERMINALE_GE')),
    subject TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    max_students INTEGER DEFAULT 50,
    join_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Class enrollments
CREATE TABLE public.class_enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    class_id UUID REFERENCES public.teacher_classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'COMPLETED')),
    UNIQUE(class_id, student_id)
);

-- Assignments system
CREATE TABLE public.assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.teacher_classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    course_id TEXT REFERENCES public.courses(id),
    lesson_ids TEXT[],
    due_date TIMESTAMPTZ,
    max_score DECIMAL(5,2) DEFAULT 100,
    is_published BOOLEAN DEFAULT false,
    assignment_type TEXT DEFAULT 'PRACTICE' CHECK (assignment_type IN ('PRACTICE', 'QUIZ', 'EXAM', 'PROJECT')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Assignment submissions
CREATE TABLE public.assignment_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    submission_data JSONB,
    score DECIMAL(5,2),
    feedback TEXT,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    graded_at TIMESTAMPTZ,
    graded_by UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'SUBMITTED' CHECK (status IN ('DRAFT', 'SUBMITTED', 'GRADED', 'RETURNED')),
    UNIQUE(assignment_id, student_id)
);

-- Create indexes for performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_parent_id ON public.profiles(parent_id);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_academic_progress_student ON public.academic_progress(student_id);
CREATE INDEX idx_academic_progress_course ON public.academic_progress(course_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read);
CREATE INDEX idx_class_enrollments_student ON public.class_enrollments(student_id);
CREATE INDEX idx_class_enrollments_class ON public.class_enrollments(class_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_auth_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
