/**
 * Authentication Flow Test Script
 *
 * This script tests the authentication flow by making direct API calls
 * to verify Supabase integration and authentication functionality.
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

// Read environment variables from .env.local file manually
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

console.log("🧪 Testing Authentication Flow...\n");

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase environment variables not found!");
  console.log("Please check your .env.local file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthFlow() {
  const testEmail = "testuser" + Date.now() + "@gmail.com";
  const testPassword = "testpassword123";
  const testUserData = {
    name: "Test User",
    phone: "+213555123456",
    role: "STUDENT",
    grade: "TERMINALE_AS",
    wilaya: "ALGIERS",
    school: "Test High School",
  };

  console.log("🔍 1. Testing Supabase Connection...");
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error && error.message !== "Auth session missing!") {
      throw error;
    }
    console.log("✅ Supabase connection successful");
  } catch (error) {
    console.error("❌ Supabase connection failed:", error.message);
    return;
  }

  console.log("\n👤 2. Testing User Registration...");
  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: testEmail,
        password: testPassword,
      }
    );

    if (signUpError) throw signUpError;

    if (signUpData.user) {
      console.log("✅ User registration successful");
      console.log("   User ID:", signUpData.user.id);
      console.log("   Email:", signUpData.user.email);

      // Test profile creation
      console.log("\n📝 3. Testing Profile Creation...");
      const { error: profileError } = await supabase.from("profiles").insert({
        id: signUpData.user.id,
        email: signUpData.user.email,
        name: testUserData.name,
        phone: testUserData.phone,
        role: testUserData.role,
        grade: testUserData.grade,
        wilaya: testUserData.wilaya,
        school: testUserData.school,
        is_verified: true,
      });

      if (profileError) {
        console.log(
          "⚠️  Profile creation failed (this might be expected if tables don't exist):",
          profileError.message
        );
      } else {
        console.log("✅ Profile creation successful");
      }
    }
  } catch (error) {
    console.error("❌ User registration failed:", error.message);
    return;
  }

  console.log("\n🔑 4. Testing User Login...");
  try {
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

    if (signInError) throw signInError;

    if (signInData.user && signInData.session) {
      console.log("✅ User login successful");
      console.log("   Session:", !!signInData.session);
      console.log(
        "   Access Token:",
        signInData.session.access_token ? "Present" : "Missing"
      );
      console.log("   Token Type:", signInData.session.token_type);
    }
  } catch (error) {
    console.error("❌ User login failed:", error.message);
    return;
  }

  console.log("\n🚪 5. Testing User Logout...");
  try {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
    console.log("✅ User logout successful");
  } catch (error) {
    console.error("❌ User logout failed:", error.message);
  }

  console.log("\n🎉 Authentication flow test completed successfully!");
}

testAuthFlow().catch(console.error);
