const { createClient } = require("@supabase/supabase-js");

// Test Supabase connection
const supabaseUrl = "https://tgmnzmmfjkwougqtgwif.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbW56bW1mamt3b3VncXRnd2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NDcwMjAsImV4cCI6MjA2NzEyMzAyMH0.pZtITFp0_1NAYZLXVPfyy3jPEiUDnS_gladoQrhKVcA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log("Testing Supabase connection...");

    // Test REST API
    const { data, error } = await supabase.from("courses").select("*").limit(1);

    if (error) {
      console.log("Error fetching data:", error.message);
      if (error.message.includes("does not exist")) {
        console.log(
          "Tables may not be created yet. This is expected if you haven't set up the schema."
        );
      }
    } else {
      console.log("Successfully connected to Supabase!");
      console.log("Data:", data);
    }

    // Test auth
    const { data: user, error: authError } = await supabase.auth.getUser();
    console.log(
      "Auth test result:",
      authError ? authError.message : "Auth working"
    );
  } catch (err) {
    console.log("Connection failed:", err.message);
  }
}

testConnection();
