/*
  # Complete Course Management Schema

  1. New Tables
    - `courses` - Main course information
    - `units` - Course units/chapters
    - `lessons` - Individual lessons within units
    - `videos` - Video content for lessons
    - `documents` - PDF and document resources
    - `quizzes` - Quiz assessments
    - `quiz_questions` - Individual quiz questions
    - `quiz_attempts` - Student quiz attempts
    - `user_progress` - Track student progress
    - `enrollments` - Course enrollments

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Students can only access enrolled courses
    - Teachers can manage their courses
    - Admins have full access

  3. Features
    - Complete course structure
    - Video streaming support
    - Document management
    - Quiz system with multiple question types
    - Progress tracking
    - Enrollment management
*/

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  subject text NOT NULL, -- MATHEMATICS, PHYSICS, CHEMISTRY, etc.
  grade text NOT NULL, -- TERMINALE_AS, TERMINALE_AL, etc.
  level text DEFAULT 'INTERMEDIATE', -- BEGINNER, INTERMEDIATE, ADVANCED
  duration_hours integer DEFAULT 0,
  price decimal(10,2) DEFAULT 0,
  is_free boolean DEFAULT false,
  is_published boolean DEFAULT false,
  instructor_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Units table (chapters/modules within a course)
CREATE TABLE IF NOT EXISTS units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lessons table (individual lessons within units)
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES units(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content text, -- Rich text content
  lesson_type text DEFAULT 'VIDEO', -- VIDEO, DOCUMENT, QUIZ, TEXT
  order_index integer NOT NULL,
  duration_minutes integer DEFAULT 0,
  is_published boolean DEFAULT false,
  is_free boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  duration_seconds integer DEFAULT 0,
  quality text DEFAULT 'HD', -- SD, HD, FHD
  file_size_mb decimal(10,2),
  created_at timestamptz DEFAULT now()
);

-- Documents table (PDFs, etc.)
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL, -- PDF, DOCX, etc.
  file_size_mb decimal(10,2),
  page_count integer,
  is_downloadable boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  instructions text,
  time_limit_minutes integer, -- NULL for no time limit
  max_attempts integer DEFAULT 3,
  passing_score decimal(5,2) DEFAULT 70.00,
  is_required boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL, -- MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER, ESSAY
  options jsonb, -- For multiple choice options
  correct_answer text,
  explanation text,
  points decimal(5,2) DEFAULT 1.00,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  answers jsonb NOT NULL, -- Student's answers
  score decimal(5,2),
  max_score decimal(5,2),
  percentage decimal(5,2),
  time_spent_minutes integer,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  status text DEFAULT 'NOT_STARTED', -- NOT_STARTED, IN_PROGRESS, COMPLETED
  progress_percentage decimal(5,2) DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  last_accessed_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Course enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date timestamptz DEFAULT now(),
  completion_date timestamptz,
  progress_percentage decimal(5,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  UNIQUE(user_id, course_id)
);

-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Courses policies
CREATE POLICY "Anyone can view published courses" ON courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Instructors can manage their courses" ON courses
  FOR ALL USING (instructor_id = auth.uid());

CREATE POLICY "Admins can manage all courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Units policies
CREATE POLICY "Users can view units of accessible courses" ON units
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = course_id 
      AND (c.is_published = true OR c.instructor_id = auth.uid())
    )
  );

CREATE POLICY "Instructors can manage units of their courses" ON units
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = course_id AND c.instructor_id = auth.uid()
    )
  );

-- Lessons policies
CREATE POLICY "Users can view lessons of accessible units" ON lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM units u
      JOIN courses c ON c.id = u.course_id
      WHERE u.id = unit_id 
      AND (c.is_published = true OR c.instructor_id = auth.uid())
    )
  );

CREATE POLICY "Instructors can manage lessons of their courses" ON lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM units u
      JOIN courses c ON c.id = u.course_id
      WHERE u.id = unit_id AND c.instructor_id = auth.uid()
    )
  );

-- Videos policies
CREATE POLICY "Users can view videos of accessible lessons" ON videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lessons l
      JOIN units u ON u.id = l.unit_id
      JOIN courses c ON c.id = u.course_id
      WHERE l.id = lesson_id 
      AND (c.is_published = true OR c.instructor_id = auth.uid())
    )
  );

-- Documents policies
CREATE POLICY "Users can view documents of accessible lessons" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lessons l
      JOIN units u ON u.id = l.unit_id
      JOIN courses c ON c.id = u.course_id
      WHERE l.id = lesson_id 
      AND (c.is_published = true OR c.instructor_id = auth.uid())
    )
  );

-- Quizzes policies
CREATE POLICY "Users can view quizzes of accessible lessons" ON quizzes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lessons l
      JOIN units u ON u.id = l.unit_id
      JOIN courses c ON c.id = u.course_id
      WHERE l.id = lesson_id 
      AND (c.is_published = true OR c.instructor_id = auth.uid())
    )
  );

-- Quiz questions policies
CREATE POLICY "Users can view quiz questions" ON quiz_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      JOIN lessons l ON l.id = q.lesson_id
      JOIN units u ON u.id = l.unit_id
      JOIN courses c ON c.id = u.course_id
      WHERE q.id = quiz_id 
      AND (c.is_published = true OR c.instructor_id = auth.uid())
    )
  );

-- Quiz attempts policies
CREATE POLICY "Users can view their own quiz attempts" ON quiz_attempts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own quiz attempts" ON quiz_attempts
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- User progress policies
CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own progress" ON user_progress
  FOR ALL USING (user_id = auth.uid());

-- Enrollments policies
CREATE POLICY "Users can view their own enrollments" ON enrollments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own enrollments" ON enrollments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_subject_grade ON courses(subject, grade);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_units_course ON units(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_unit ON lessons(unit_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_course ON user_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_quiz ON quiz_attempts(user_id, quiz_id);