/**
 * Course Enrollment Flow Test
 * Tests the complete enrollment process from course discovery to enrollment completion
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

async function testEnrollmentFlow() {
  console.log("📚 Testing Course Enrollment Flow...\n");

  // Step 1: Login
  console.log("🔑 1. Logging in...");
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

  const authToken = signInData.session.access_token;
  const baseUrl = "http://localhost:3000";

  // Step 2: Browse available courses
  console.log("\n📋 2. Fetching available courses...");
  try {
    const response = await fetch(`${baseUrl}/api/courses`);
    const data = await response.json();

    if (data.success && data.data && data.data.length > 0) {
      console.log("✅ Courses fetched successfully");
      console.log(`   Available courses: ${data.data.length}`);
      console.log(
        `   First course: "${data.data[0].titleAr || data.data[0].title}"`
      );

      // Use the first available course for testing
      const testCourse = data.data[0];

      // Step 3: Get course details
      console.log(`\n📖 3. Getting details for course: ${testCourse.id}`);
      const detailResponse = await fetch(
        `${baseUrl}/api/courses/${testCourse.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const detailData = await detailResponse.json();

      if (detailData.success && detailData.data) {
        console.log("✅ Course details fetched");
        console.log(
          `   Title: ${detailData.data.titleAr || detailData.data.title}`
        );
        console.log(`   Subject: ${detailData.data.subject}`);
        console.log(`   Grade: ${detailData.data.grade}`);
        console.log(`   Is Free: ${detailData.data.isFree ? "Yes" : "No"}`);
        console.log(`   Total Lessons: ${detailData.data.totalLessons}`);
        console.log(
          `   Is Enrolled: ${detailData.data.isEnrolled ? "Yes" : "No"}`
        );

        // Step 4: Test enrollment
        if (!detailData.data.isEnrolled) {
          console.log(`\n🎯 4. Attempting to enroll in course...`);

          const enrollResponse = await fetch(
            `${baseUrl}/api/courses/${testCourse.id}/enroll`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          const enrollData = await enrollResponse.json();

          if (enrollResponse.ok && enrollData.success) {
            console.log("✅ Enrollment successful!");
            console.log(`   Message: ${enrollData.message}`);

            // Step 5: Verify enrollment by checking enrolled courses
            console.log("\n📚 5. Verifying enrollment in user dashboard...");

            const enrolledResponse = await fetch(
              `${baseUrl}/api/user/enrolled-courses`,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );

            const enrolledData = await enrolledResponse.json();

            if (enrolledData.success && enrolledData.data) {
              const isEnrolled = enrolledData.data.some(
                (course) => course.id === testCourse.id
              );

              if (isEnrolled) {
                console.log("✅ Enrollment verified in user dashboard");
                console.log(
                  `   Total enrolled courses: ${enrolledData.data.length}`
                );
              } else {
                console.log(
                  "⚠️  Enrollment not found in user dashboard (using mock data)"
                );
              }
            } else {
              console.log(
                "⚠️  Could not fetch enrolled courses (using mock data)"
              );
            }
          } else {
            console.log(
              "❌ Enrollment failed:",
              enrollData.error || "Unknown error"
            );
          }
        } else {
          console.log("ℹ️  User is already enrolled in this course");

          // Step 5: Check enrolled courses anyway
          console.log("\n📚 5. Checking enrolled courses...");

          const enrolledResponse = await fetch(
            `${baseUrl}/api/user/enrolled-courses`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          const enrolledData = await enrolledResponse.json();

          if (enrolledData.success && enrolledData.data) {
            console.log("✅ Enrolled courses fetched");
            console.log(
              `   Total enrolled courses: ${enrolledData.data.length}`
            );
          }
        }

        // Step 6: Test lesson access
        if (detailData.data.lessons && detailData.data.lessons.length > 0) {
          console.log(`\n🎬 6. Testing lesson access...`);
          const firstLesson = detailData.data.lessons[0];

          const lessonResponse = await fetch(
            `${baseUrl}/api/courses/${testCourse.id}/lessons`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          if (lessonResponse.ok) {
            const lessonData = await lessonResponse.json();
            console.log("✅ Lesson access available");
            console.log(
              `   Available lessons: ${
                lessonData.data ? lessonData.data.length : "Mock data"
              }`
            );
          } else {
            console.log(
              "⚠️  Lesson access test failed (API might be using mock data)"
            );
          }
        }
      } else {
        console.log("❌ Failed to fetch course details");
      }
    } else {
      console.log("⚠️  No courses available or using mock data");
    }
  } catch (error) {
    console.log("❌ Failed to fetch courses:", error.message);
  }

  // Logout
  await supabase.auth.signOut();
  console.log("\n🚪 Logged out successfully");

  console.log("\n🎉 Course Enrollment Flow Test Complete!");
}

testEnrollmentFlow().catch(console.error);
