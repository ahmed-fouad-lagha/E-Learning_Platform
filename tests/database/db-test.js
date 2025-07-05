/**
 * Database Connection Troubleshooting Script
 * Tests various connection methods to identify the issue
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

async function testDatabaseConnection() {
  console.log("🔍 Database Connection Troubleshooting\n");

  // Read environment variables
  let supabaseUrl, supabaseKey, databaseUrl;
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
      if (line.startsWith("DATABASE_URL=")) {
        databaseUrl = line.split("=")[1].replace(/"/g, "");
      }
    }
  } catch (error) {
    console.error("❌ Could not read .env.local file");
    return;
  }

  console.log("📋 Current Configuration:");
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(`Database URL: ${databaseUrl ? "Set" : "Not set"}`);
  console.log();

  // Test 1: Supabase Connection (this should work)
  console.log("🧪 Test 1: Supabase Auth Connection...");
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.auth.getSession();

    if (error && error.message !== "Auth session missing!") {
      throw error;
    }
    console.log("✅ Supabase connection successful");
  } catch (error) {
    console.log("❌ Supabase connection failed:", error.message);
    return;
  }

  // Test 2: Check project status
  console.log("\n🧪 Test 2: Project Status Check...");
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (response.ok) {
      console.log("✅ Supabase project is active and accessible");
    } else {
      console.log(
        `⚠️  Project response: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.log("❌ Could not reach Supabase project:", error.message);
  }

  // Test 3: Database URL validation
  console.log("\n🧪 Test 3: Database URL Validation...");
  if (databaseUrl) {
    try {
      const url = new URL(databaseUrl);
      console.log(`✅ Database URL is valid`);
      console.log(`   Host: ${url.hostname}`);
      console.log(`   Port: ${url.port}`);
      console.log(`   Database: ${url.pathname.slice(1)}`);
      console.log(`   Username: ${url.username}`);
      console.log(`   Password: ${url.password ? "Set" : "Not set"}`);
    } catch (error) {
      console.log("❌ Invalid DATABASE_URL format:", error.message);
    }
  } else {
    console.log("❌ DATABASE_URL not found in environment");
  }

  console.log("\n📝 Troubleshooting Recommendations:");
  console.log("1. Check if your Supabase project is paused:");
  console.log(
    "   → Go to https://supabase.com/dashboard/project/tgmnzmmfjkwougqtgwif"
  );
  console.log('   → Look for any "Project Paused" warnings');
  console.log();
  console.log("2. Verify database credentials:");
  console.log("   → Settings → Database → Connection Info");
  console.log("   → Make sure the password matches");
  console.log();
  console.log("3. Try connection pooling URL:");
  console.log(
    '   → Use the "Connection Pooling" URL instead of direct connection'
  );
  console.log();
  console.log("4. Check firewall/network:");
  console.log("   → Make sure port 5432 is not blocked");
  console.log("   → Try from a different network if possible");
}

testDatabaseConnection().catch(console.error);
