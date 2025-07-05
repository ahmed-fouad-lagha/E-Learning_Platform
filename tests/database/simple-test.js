/**
 * Simple Enrollment Test - Step by Step
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

async function simpleEnrollmentTest() {
  console.log("🔬 Simple Enrollment Test\n");

  // Login
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: "laghaahmedfouad@gmail.com",
      password: "fofo1234",
    });

  if (signInError) {
    console.error("❌ Login failed");
    return;
  }

  console.log("✅ Login successful");
  const token = signInData.session.access_token;

  // Test 1: Check courses endpoint
  console.log("\n1. Testing /api/courses...");
  try {
    const response = await fetch("http://localhost:3000/api/courses");
    console.log(`   Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`   Success: ${data.success}`);
      console.log(`   Courses: ${data.data ? data.data.length : "N/A"}`);
    } else {
      console.log(`   Error: ${response.statusText}`);
    }
  } catch (error) {
    console.log(`   Failed: ${error.message}`);
  }

  // Test 2: Check course detail endpoint
  console.log("\n2. Testing /api/courses/[courseId]...");
  try {
    const testCourseId = "test-course-1"; // Using mock course ID
    const response = await fetch(
      `http://localhost:3000/api/courses/${testCourseId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log(`   Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`   Success: ${data.success}`);
      console.log(`   Course found: ${data.data ? "Yes" : "No"}`);
    } else {
      const errorData = await response.json();
      console.log(`   Error: ${errorData.error || response.statusText}`);
    }
  } catch (error) {
    console.log(`   Failed: ${error.message}`);
  }

  // Test 3: Check enrollment endpoint
  console.log("\n3. Testing /api/courses/[courseId]/enroll...");
  try {
    const testCourseId = "test-course-1";
    const response = await fetch(
      `http://localhost:3000/api/courses/${testCourseId}/enroll`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(`   Status: ${response.status}`);

    const data = await response.json();
    console.log(`   Success: ${data.success}`);
    console.log(`   Message: ${data.message || data.error}`);
  } catch (error) {
    console.log(`   Failed: ${error.message}`);
  }

  // Test 4: Check enrolled courses endpoint
  console.log("\n4. Testing /api/user/enrolled-courses...");
  try {
    const response = await fetch(
      "http://localhost:3000/api/user/enrolled-courses",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log(`   Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`   Success: ${data.success}`);
      console.log(
        `   Enrolled courses: ${data.data ? data.data.length : "N/A"}`
      );
    } else {
      const errorData = await response.json();
      console.log(`   Error: ${errorData.error || response.statusText}`);
    }
  } catch (error) {
    console.log(`   Failed: ${error.message}`);
  }

  await supabase.auth.signOut();
  console.log("\n✅ Test completed");
}

simpleEnrollmentTest().catch(console.error);
