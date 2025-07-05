-- SQL script for creating E-Learning Platform database tables
-- Run this in your Supabase SQL Editor

-- Course table
CREATE TABLE IF NOT EXISTS "public"."courses" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "title_ar" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "description_ar" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "grade" TEXT NOT NULL,
  "difficulty" TEXT NOT NULL DEFAULT 'BEGINNER',
  "thumbnail" TEXT,
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "is_free" BOOLEAN NOT NULL DEFAULT false,
  "curriculum" TEXT NOT NULL,
  "bac_relevance" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "total_lessons" INTEGER NOT NULL DEFAULT 0,
  "estimated_hours" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- Lesson table
CREATE TABLE IF NOT EXISTS "public"."lessons" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "title_ar" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "content_ar" TEXT NOT NULL,
  "video_url" TEXT,
  "audio_url" TEXT,
  "order" INTEGER NOT NULL,
  "duration" INTEGER NOT NULL,
  "is_completed" BOOLEAN NOT NULL DEFAULT false,
  "download_size" INTEGER,
  "offline_content" TEXT,
  "course_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "lessons_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "lessons_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Course Enrollment table
CREATE TABLE IF NOT EXISTS "public"."course_enrollments" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "course_id" TEXT NOT NULL,
  "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completed_at" TIMESTAMP(3),
  "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
  
  CONSTRAINT "course_enrollments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "course_enrollments_user_id_course_id_key" UNIQUE ("user_id", "course_id"),
  CONSTRAINT "course_enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "course_enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Learning Progress table
CREATE TABLE IF NOT EXISTS "public"."learning_progress" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "lesson_id" TEXT NOT NULL,
  "course_id" TEXT NOT NULL,
  "completed" BOOLEAN NOT NULL DEFAULT false,
  "time_spent" INTEGER NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "learning_progress_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "learning_progress_user_id_lesson_id_key" UNIQUE ("user_id", "lesson_id"),
  CONSTRAINT "learning_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "learning_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Exam table
CREATE TABLE IF NOT EXISTS "public"."exams" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "title_ar" TEXT NOT NULL,
  "description" TEXT,
  "description_ar" TEXT,
  "type" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "grade" TEXT NOT NULL,
  "duration" INTEGER NOT NULL,
  "total_points" INTEGER NOT NULL,
  "pass_score" INTEGER NOT NULL,
  "is_bac_simulation" BOOLEAN NOT NULL DEFAULT false,
  "bac_year" INTEGER,
  "bac_session" TEXT,
  "course_id" TEXT,
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "exams_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "exams_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON UPDATE CASCADE
);

-- RLS Policies
-- Add Row Level Security policies to protect the data

-- Enable RLS on all tables
ALTER TABLE "public"."courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."lessons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."course_enrollments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."learning_progress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."exams" ENABLE ROW LEVEL SECURITY;

-- Course access policies
CREATE POLICY "Public courses are viewable by everyone" 
  ON "public"."courses" FOR SELECT 
  USING (is_published = true);

-- Course enrollment policies
CREATE POLICY "Users can view their own enrollments" 
  ON "public"."course_enrollments" FOR SELECT 
  USING (auth.uid() = user_id);

-- Learning progress policies
CREATE POLICY "Users can view their own progress" 
  ON "public"."learning_progress" FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON "public"."learning_progress" FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
  ON "public"."learning_progress" FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE "public"."courses" IS 'Stores all courses available in the platform';
COMMENT ON TABLE "public"."lessons" IS 'Individual lessons that make up a course';
COMMENT ON TABLE "public"."course_enrollments" IS 'Tracks student enrollments in courses';
COMMENT ON TABLE "public"."learning_progress" IS 'Records student progress through lessons';
COMMENT ON TABLE "public"."exams" IS 'Exams and assessments including BAC simulations';
