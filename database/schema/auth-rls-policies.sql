-- Row Level Security (RLS) Policies for Enhanced Authentication
-- Execute this after running the enhanced-auth-schema.sql

-- Profiles RLS Policies
-- Users can view their own profile and profiles of their students (if they're parents/teachers)
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Parents can view their linked students' profiles
CREATE POLICY "Parents can view linked students" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.parent_student_links psl
            WHERE psl.parent_id = auth.uid() AND psl.student_id = profiles.id
        )
    );

-- Teachers can view students in their classes
CREATE POLICY "Teachers can view class students" ON public.profiles
    FOR SELECT USING (
        role = 'STUDENT' AND EXISTS (
            SELECT 1 FROM public.class_enrollments ce
            JOIN public.teacher_classes tc ON tc.id = ce.class_id
            WHERE tc.teacher_id = auth.uid() AND ce.student_id = profiles.id
        )
    );

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'ADMIN'
        )
    );

-- Insert policy for new user registration
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User Sessions RLS Policies
CREATE POLICY "Users can view own sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.user_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON public.user_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Social Auth Providers RLS Policies
CREATE POLICY "Users can manage own social auth" ON public.social_auth_providers
    FOR ALL USING (auth.uid() = user_id);

-- Academic Progress RLS Policies
-- Students can view their own progress
CREATE POLICY "Students can view own progress" ON public.academic_progress
    FOR SELECT USING (auth.uid() = student_id);

-- Parents can view their children's progress
CREATE POLICY "Parents can view children progress" ON public.academic_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.parent_student_links psl
            WHERE psl.parent_id = auth.uid() AND psl.student_id = academic_progress.student_id
        )
    );

-- Teachers can view progress of students in their classes
CREATE POLICY "Teachers can view class progress" ON public.academic_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.class_enrollments ce
            JOIN public.teacher_classes tc ON tc.id = ce.class_id
            WHERE tc.teacher_id = auth.uid() AND ce.student_id = academic_progress.student_id
        )
    );

-- System can insert/update progress (for API calls)
CREATE POLICY "System can manage progress" ON public.academic_progress
    FOR ALL USING (true);

-- User Achievements RLS Policies
CREATE POLICY "Users can view own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage achievements" ON public.user_achievements
    FOR ALL USING (true);

-- Notifications RLS Policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- Parent-Student Links RLS Policies
CREATE POLICY "Parents can view own links" ON public.parent_student_links
    FOR SELECT USING (auth.uid() = parent_id OR auth.uid() = student_id);

CREATE POLICY "Parents can manage own links" ON public.parent_student_links
    FOR ALL USING (auth.uid() = parent_id);

-- Teacher Classes RLS Policies
CREATE POLICY "Teachers can manage own classes" ON public.teacher_classes
    FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view classes they're enrolled in" ON public.teacher_classes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.class_enrollments ce
            WHERE ce.class_id = teacher_classes.id AND ce.student_id = auth.uid()
        )
    );

-- Class Enrollments RLS Policies
CREATE POLICY "Teachers can manage class enrollments" ON public.class_enrollments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.teacher_classes tc
            WHERE tc.id = class_enrollments.class_id AND tc.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students can view own enrollments" ON public.class_enrollments
    FOR SELECT USING (auth.uid() = student_id);

-- Assignments RLS Policies
CREATE POLICY "Teachers can manage own assignments" ON public.assignments
    FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view class assignments" ON public.assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.class_enrollments ce
            WHERE ce.class_id = assignments.class_id AND ce.student_id = auth.uid()
        )
    );

-- Assignment Submissions RLS Policies
CREATE POLICY "Students can manage own submissions" ON public.assignment_submissions
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view class submissions" ON public.assignment_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.assignments a
            WHERE a.id = assignment_submissions.assignment_id AND a.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can grade submissions" ON public.assignment_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.assignments a
            WHERE a.id = assignment_submissions.assignment_id AND a.teacher_id = auth.uid()
        )
    );

-- Create functions for common operations
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
    SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role = 'ADMIN'
    );
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_teacher(user_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role IN ('TEACHER', 'ADMIN')
    );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to update user's last_active timestamp
CREATE OR REPLACE FUNCTION public.update_last_active()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles 
    SET last_active = now() 
    WHERE id = auth.uid();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update last_active when user performs actions
CREATE TRIGGER update_user_activity
    AFTER INSERT OR UPDATE ON public.academic_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_last_active();

-- Function to generate unique student ID
CREATE OR REPLACE FUNCTION public.generate_student_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'STUDENT' AND NEW.student_id IS NULL THEN
        NEW.student_id := 'STU' || TO_CHAR(NOW(), 'YYYY') || 
                         LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || 
                         LPAD(EXTRACT(HOUR FROM NOW() * 60 + MINUTE FROM NOW())::TEXT, 4, '0') ||
                         SUBSTR(REPLACE(NEW.id::TEXT, '-', ''), 1, 4);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_student_id_trigger
    BEFORE INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.generate_student_id();

-- Function to handle profile updates timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_academic_progress_updated_at
    BEFORE UPDATE ON public.academic_progress
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
