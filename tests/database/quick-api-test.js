/**
 * Quick API Test with Authentication
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

// Read environment variables
let supabaseUrl, supabaseKey;
try {
  const envContent = fs.readFileSync(".env.local", "utf8");
  const lines = envContent.split("\n");

  for (const line of lines) {
    if (line.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
      supabaseUrl = line.split("=")[1];
    }
    if (line.startsWith("NEXT_PUBLIC_SUPABASE_ANON_KEY=")) {
      supabaseKey = line.split("=")[1];
    }
  }
} catch (error) {
  console.error("Could not read .env.local file");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function quickApiTest() {
  console.log("🚀 Quick API Test...\n");

  // Login first
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: "laghaahmedfouad@gmail.com",
      password: "fofo1234",
    });

  if (signInError) {
    console.error("❌ Login failed:", signInError.message);
    return;
  }

  console.log("✅ Login successful");

  // Test API endpoints
  const endpoints = ["/api/user/enrolled-courses", "/api/courses"];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n🌐 Testing ${endpoint}...`);

      const response = await fetch(`http://localhost:3000${endpoint}`, {
        headers: {
          Authorization: `Bearer ${signInData.session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log(`   Status: ${response.status}`);
      console.log(`   Success: ${data.success || "N/A"}`);
      console.log(`   Data length: ${data.data ? data.data.length : "N/A"}`);

      if (!response.ok) {
        console.log(`   Error: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }
  }

  // Logout
  await supabase.auth.signOut();
  console.log("\n✅ Test completed and logged out");
}

quickApiTest().catch(console.error);
