/**
 * Authentication Test with Existing User
 * Testing login/logout flow with real user credentials
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

console.log("🧪 Testing Authentication with Existing User...\n");

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase environment variables not found!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testExistingUserAuth() {
  const userEmail = "laghaahmedfouad@gmail.com";
  const userPassword = "fofo1234";

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

  console.log("\n🔑 2. Testing User Login...");
  try {
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword,
      });

    if (signInError) throw signInError;

    if (signInData.user && signInData.session) {
      console.log("✅ User login successful!");
      console.log("   User ID:", signInData.user.id);
      console.log("   Email:", signInData.user.email);
      console.log(
        "   Email Confirmed:",
        signInData.user.email_confirmed_at ? "Yes" : "No"
      );
      console.log("   Created At:", signInData.user.created_at);
      console.log(
        "   Session Token:",
        signInData.session.access_token ? "Present" : "Missing"
      );
      console.log("   Token Type:", signInData.session.token_type);
      console.log(
        "   Expires At:",
        new Date(signInData.session.expires_at * 1000).toLocaleString()
      );

      // Test getting current session
      console.log("\n📱 3. Testing Session Persistence...");
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        console.error("❌ Session retrieval failed:", sessionError.message);
      } else {
        console.log("✅ Session retrieved successfully");
        console.log("   Session Active:", !!sessionData.session);
      }

      // Test fetching user profile (if profile table exists)
      console.log("\n👤 4. Testing Profile Fetch...");
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", signInData.user.id)
          .single();

        if (profileError) {
          console.log(
            "⚠️  Profile fetch failed (table might not exist):",
            profileError.message
          );
        } else {
          console.log("✅ Profile fetched successfully");
          console.log("   Name:", profileData.name || "Not set");
          console.log("   Role:", profileData.role || "Not set");
          console.log("   Grade:", profileData.grade || "Not set");
          console.log("   Wilaya:", profileData.wilaya || "Not set");
        }
      } catch (error) {
        console.log("⚠️  Profile fetch failed:", error.message);
      }

      // Test API call with session token
      console.log("\n🌐 5. Testing API Call with Session Token...");
      try {
        const response = await fetch(
          "http://localhost:3000/api/user/enrolled-courses",
          {
            headers: {
              authorization: `Bearer ${signInData.session.access_token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("✅ API call successful");
          console.log("   Response:", data.success ? "Success" : "Failed");
        } else {
          console.log(
            "⚠️  API call failed (server might not be running):",
            response.status
          );
        }
      } catch (error) {
        console.log(
          "⚠️  API call failed (server might not be running):",
          error.message
        );
      }
    }
  } catch (error) {
    console.error("❌ User login failed:", error.message);
    return;
  }

  console.log("\n🚪 6. Testing User Logout...");
  try {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
    console.log("✅ User logout successful");

    // Verify session is cleared
    const { data: sessionAfterLogout } = await supabase.auth.getSession();
    console.log(
      "   Session after logout:",
      sessionAfterLogout.session ? "Still active" : "Cleared"
    );
  } catch (error) {
    console.error("❌ User logout failed:", error.message);
  }

  console.log("\n🎉 Authentication flow test completed!");
}

testExistingUserAuth().catch(console.error);
