const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const supabaseUrl = "https://tgmnzmmfjkwougqtgwif.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbW56bW1mamt3b3VncXRnd2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NDcwMjAsImV4cCI6MjA2NzEyMzAyMH0.pZtITFp0_1NAYZLXVPfyy3jPEiUDnS_gladoQrhKVcA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log("Setting up database schema...");

    // Read schema file
    const schema = fs.readFileSync("./supabase-schema.sql", "utf8");

    // Execute schema
    const { data, error } = await supabase.rpc("exec_sql", { sql: schema });

    if (error) {
      console.log("Error executing schema:", error.message);
      console.log("Trying individual commands...");

      // Try executing individual CREATE TABLE commands
      const commands = [
        `CREATE TABLE IF NOT EXISTS public.course_enrollments (
                    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
                    enrolled_at TIMESTAMPTZ DEFAULT now(),
                    progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
                    completed_at TIMESTAMPTZ,
                    UNIQUE(user_id, course_id)
                );`,
        `ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;`,
        `CREATE POLICY IF NOT EXISTS "Users can view own enrollments" ON public.course_enrollments
                    FOR SELECT USING (auth.uid() = user_id);`,
        `CREATE POLICY IF NOT EXISTS "Users can create enrollments" ON public.course_enrollments
                    FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      ];

      for (const cmd of commands) {
        try {
          const { error: cmdError } = await supabase.rpc("exec_sql", {
            sql: cmd,
          });
          if (cmdError) {
            console.log(`Command failed: ${cmdError.message}`);
          } else {
            console.log("Command executed successfully");
          }
        } catch (err) {
          console.log(`Command error: ${err.message}`);
        }
      }
    } else {
      console.log("Schema executed successfully!");
    }

    // Test tables
    console.log("\nTesting tables...");
    const tables = [
      "courses",
      "lessons",
      "course_enrollments",
      "exams",
      "profiles",
    ];

    for (const table of tables) {
      const { data: tableData, error: tableError } = await supabase
        .from(table)
        .select("*")
        .limit(1);

      if (tableError) {
        console.log(`Table "${table}": ERROR - ${tableError.message}`);
      } else {
        console.log(`Table "${table}": OK (${tableData.length} records)`);
      }
    }
  } catch (err) {
    console.log("Setup error:", err.message);
  }
}

setupDatabase();
