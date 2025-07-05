const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://tgmnzmmfjkwougqtgwif.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbW56bW1mamt3b3VncXRnd2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NDcwMjAsImV4cCI6MjA2NzEyMzAyMH0.pZtITFp0_1NAYZLXVPfyy3jPEiUDnS_gladoQrhKVcA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function createEnrollmentsTable() {
  try {
    console.log("Creating course_enrollments table...");

    // Try to create table
    const { data, error } = await supabase
      .from("course_enrollments")
      .select("*")
      .limit(1);

    if (error && error.message.includes("does not exist")) {
      console.log(
        "Table does not exist. You need to create it in the Supabase dashboard."
      );
      console.log("SQL to run in Supabase SQL Editor:");
      console.log(`
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT now(),
    progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view own enrollments" ON public.course_enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create enrollments" ON public.course_enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);
            `);
    } else if (error) {
      console.log("Other error:", error.message);
    } else {
      console.log("Table exists! Records found:", data.length);
    }

    // Test other tables too
    console.log("\nChecking all tables:");
    const tables = [
      "courses",
      "lessons",
      "course_enrollments",
      "exams",
      "profiles",
    ];

    for (const table of tables) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select("*")
          .limit(1);

        if (tableError) {
          console.log(`❌ ${table}: ${tableError.message}`);
        } else {
          console.log(`✅ ${table}: OK (${tableData.length} records)`);
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`);
      }
    }
  } catch (err) {
    console.log("Error:", err.message);
  }
}

createEnrollmentsTable();
