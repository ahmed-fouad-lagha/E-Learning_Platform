const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://tgmnzmmfjkwougqtgwif.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbW56bW1mamt3b3VncXRnd2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NDcwMjAsImV4cCI6MjA2NzEyMzAyMH0.pZtITFp0_1NAYZLXVPfyy3jPEiUDnS_gladoQrhKVcA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    console.log("Checking existing tables...");

    // Try to get table info using information_schema
    const { data, error } = await supabase.rpc("get_schema_tables").limit(10);

    if (error) {
      console.log("Error getting table info:", error.message);

      // Try another approach - check specific tables
      const tables = ["courses", "lessons", "enrollments", "exams", "profiles"];

      for (const table of tables) {
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select("*")
          .limit(1);

        if (tableError) {
          console.log(
            `Table "${table}": DOES NOT EXIST (${tableError.message})`
          );
        } else {
          console.log(
            `Table "${table}": EXISTS (${tableData.length} records found)`
          );
        }
      }
    } else {
      console.log("Tables found:", data);
    }
  } catch (err) {
    console.log("Error:", err.message);
  }
}

checkTables();
