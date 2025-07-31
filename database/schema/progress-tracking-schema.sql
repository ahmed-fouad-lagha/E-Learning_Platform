
-- Student Progress Tracking Schema
-- Execute this in your Supabase SQL Editor

-- Enhanced lesson progress tracking
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    
    -- Progress tracking
    status TEXT DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')),
    progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent_seconds INTEGER DEFAULT 0,
    
    -- Timestamps
    first_accessed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    
    -- Lesson interaction data
    video_progress_seconds INTEGER DEFAULT 0,
    quiz_attempts INTEGER DEFAULT 0,
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(user_id, lesson_id)
);

-- Enhanced course progress tracking
CREATE TABLE IF NOT EXISTS public.course_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    
    -- Progress metrics
    progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    lessons_completed INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    total_time_spent_seconds INTEGER DEFAULT 0,
    
    -- Status tracking
    status TEXT DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED')),
    enrollment_date TIMESTAMPTZ DEFAULT now(),
    first_lesson_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ DEFAULT now(),
    completion_date TIMESTAMPTZ,
    
    -- Achievement tracking
    streak_days INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    certificates_earned TEXT[], -- Array of certificate IDs
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(user_id, course_id)
);

-- Study sessions for detailed analytics
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
    
    -- Session data
    started_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER DEFAULT 0,
    
    -- Activity tracking
    interactions JSONB DEFAULT '{}'::jsonb, -- Video pauses, quiz attempts, etc.
    device_type TEXT, -- mobile, tablet, desktop
    completion_status TEXT DEFAULT 'INCOMPLETE' CHECK (completion_status IN ('INCOMPLETE', 'COMPLETED', 'ABANDONED')),
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Learning streaks and achievements
CREATE TABLE IF NOT EXISTS public.learning_streaks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    
    -- Weekly/monthly goals
    weekly_goal_minutes INTEGER DEFAULT 300, -- 5 hours per week default
    weekly_progress_minutes INTEGER DEFAULT 0,
    monthly_goal_lessons INTEGER DEFAULT 20,
    monthly_progress_lessons INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_course ON public.lesson_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_status ON public.lesson_progress(status);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_updated ON public.lesson_progress(updated_at);

CREATE INDEX IF NOT EXISTS idx_course_progress_user ON public.course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_status ON public.course_progress(status);
CREATE INDEX IF NOT EXISTS idx_course_progress_activity ON public.course_progress(last_activity_at);

CREATE INDEX IF NOT EXISTS idx_study_sessions_user ON public.study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_course ON public.study_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON public.study_sessions(started_at);

-- Enable RLS
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Lesson Progress
CREATE POLICY "Students can view own lesson progress" ON public.lesson_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can update own lesson progress" ON public.lesson_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view class progress" ON public.lesson_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() 
            AND p.role IN ('TEACHER', 'ADMIN')
        )
    );

-- Course Progress
CREATE POLICY "Students can view own course progress" ON public.course_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can update own course progress" ON public.course_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view class course progress" ON public.course_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() 
            AND p.role IN ('TEACHER', 'ADMIN')
        )
    );

-- Study Sessions
CREATE POLICY "Students can manage own sessions" ON public.study_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Learning Streaks
CREATE POLICY "Students can manage own streaks" ON public.learning_streaks
    FOR ALL USING (auth.uid() = user_id);

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION public.update_course_progress_from_lesson()
RETURNS TRIGGER AS $$
BEGIN
    -- Update course progress when lesson progress changes
    IF NEW.status = 'COMPLETED' AND (OLD.status IS NULL OR OLD.status != 'COMPLETED') THEN
        -- Increment completed lessons and recalculate progress
        WITH course_stats AS (
            SELECT 
                COUNT(*) as total_lessons,
                COUNT(CASE WHEN lp.status = 'COMPLETED' THEN 1 END) as completed_lessons,
                SUM(COALESCE(lp.time_spent_seconds, 0)) as total_time
            FROM public.lessons l
            LEFT JOIN public.lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = NEW.user_id
            WHERE l.course_id = NEW.course_id
        )
        INSERT INTO public.course_progress (user_id, course_id, lessons_completed, total_lessons, progress_percentage, total_time_spent_seconds, last_activity_at, status)
        SELECT 
            NEW.user_id,
            NEW.course_id,
            cs.completed_lessons,
            cs.total_lessons,
            CASE WHEN cs.total_lessons > 0 THEN (cs.completed_lessons::decimal / cs.total_lessons * 100) ELSE 0 END,
            cs.total_time,
            now(),
            CASE 
                WHEN cs.completed_lessons = cs.total_lessons THEN 'COMPLETED'
                WHEN cs.completed_lessons > 0 THEN 'IN_PROGRESS'
                ELSE 'NOT_STARTED'
            END
        FROM course_stats cs
        ON CONFLICT (user_id, course_id) 
        DO UPDATE SET
            lessons_completed = EXCLUDED.lessons_completed,
            total_lessons = EXCLUDED.total_lessons,
            progress_percentage = EXCLUDED.progress_percentage,
            total_time_spent_seconds = EXCLUDED.total_time_spent_seconds,
            last_activity_at = now(),
            status = EXCLUDED.status,
            completion_date = CASE WHEN EXCLUDED.status = 'COMPLETED' THEN now() ELSE course_progress.completion_date END,
            updated_at = now();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_course_progress_trigger
    AFTER INSERT OR UPDATE ON public.lesson_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_course_progress_from_lesson();

-- Function to update learning streaks
CREATE OR REPLACE FUNCTION public.update_learning_streak(user_uuid UUID)
RETURNS void AS $$
DECLARE
    last_date DATE;
    current_date DATE := CURRENT_DATE;
    new_streak INTEGER := 1;
BEGIN
    -- Get current streak data
    SELECT last_activity_date INTO last_date
    FROM public.learning_streaks
    WHERE user_id = user_uuid;
    
    IF last_date IS NULL THEN
        -- First time tracking
        INSERT INTO public.learning_streaks (user_id, current_streak, longest_streak, last_activity_date)
        VALUES (user_uuid, 1, 1, current_date)
        ON CONFLICT (user_id) DO NOTHING;
    ELSE
        -- Calculate streak
        IF last_date = current_date THEN
            -- Same day, no change
            RETURN;
        ELSIF last_date = current_date - INTERVAL '1 day' THEN
            -- Consecutive day
            UPDATE public.learning_streaks 
            SET 
                current_streak = current_streak + 1,
                longest_streak = GREATEST(longest_streak, current_streak + 1),
                last_activity_date = current_date,
                updated_at = now()
            WHERE user_id = user_uuid;
        ELSE
            -- Streak broken
            UPDATE public.learning_streaks 
            SET 
                current_streak = 1,
                last_activity_date = current_date,
                updated_at = now()
            WHERE user_id = user_uuid;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamps
CREATE TRIGGER update_lesson_progress_updated_at 
    BEFORE UPDATE ON public.lesson_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_progress_updated_at 
    BEFORE UPDATE ON public.course_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_streaks_updated_at 
    BEFORE UPDATE ON public.learning_streaks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
