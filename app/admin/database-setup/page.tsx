'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Database, Play, Copy } from 'lucide-react';

export default function DatabaseSetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [sqlCopied, setSqlCopied] = useState(false);

  const testDatabase = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      const response = await fetch('/api/verify-db');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copySQL = async () => {
    const sql = `-- Minimal Database Setup for E-Learning Platform
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
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`;

    try {
      await navigator.clipboard.writeText(sql);
      setSqlCopied(true);
      setTimeout(() => setSqlCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy SQL:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Database Setup & Verification
          </h1>
          <p className="text-gray-600">
            Verify your Supabase database setup and troubleshoot any issues
          </p>
        </div>

        <div className="grid gap-6">
          {/* Database Test Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Connection Test
              </CardTitle>
              <CardDescription>
                Test the connection to your Supabase database and verify table structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={testDatabase} 
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Database Test
                    </>
                  )}
                </Button>

                {results && (
                  <Alert variant={results.success ? "default" : "destructive"}>
                    {results.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>
                      {results.success ? 
                        "Database test completed! Check the browser console for detailed results." :
                        `Database test failed: ${results.error}`
                      }
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* SQL Setup Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Schema Setup
              </CardTitle>
              <CardDescription>
                Copy and run this SQL in your Supabase SQL Editor to set up the required tables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Setup Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Go to your Supabase dashboard</li>
                    <li>Navigate to the SQL Editor</li>
                    <li>Copy the SQL below and paste it into a new query</li>
                    <li>Run the query to create all necessary tables and policies</li>
                    <li>Return here and run the database test</li>
                  </ol>
                </div>
                
                <Button onClick={copySQL} variant="outline" className="w-full sm:w-auto">
                  <Copy className="h-4 w-4 mr-2" />
                  {sqlCopied ? 'Copied!' : 'Copy SQL Setup Script'}
                </Button>

                {sqlCopied && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      SQL script copied to clipboard! Paste it in your Supabase SQL Editor.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Environment Check */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>
                Current Supabase configuration status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓" : "✗"}
                  </Badge>
                  <span className="text-sm">NEXT_PUBLIC_SUPABASE_URL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓" : "✗"}
                  </Badge>
                  <span className="text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Common Issues & Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Table does not exist</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    If you see &quot;relation does not exist&quot; errors, you need to run the SQL setup script above.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Permission denied</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Check that Row Level Security policies are properly configured. The setup script includes all necessary policies.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Profile not found</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    This is normal for new OAuth users. The system will automatically create profiles when users sign in.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
