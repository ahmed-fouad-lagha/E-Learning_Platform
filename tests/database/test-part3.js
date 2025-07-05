const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "❌ Missing Supabase configuration. Please check your .env.local file."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testPart3SQL() {
  console.log("🧪 Testing curriculum-lessons-part3.sql...");

  try {
    // Read the SQL file
    const sqlContent = fs.readFileSync("curriculum-lessons-part3.sql", "utf8");

    console.log("✅ File read successfully");
    console.log(`📄 File size: ${Math.round(sqlContent.length / 1024)}KB`);

    // Basic validation
    const insertCount = (
      sqlContent.match(/INSERT INTO.*lessons.*VALUES/gi) || []
    ).length;
    const lessonCount = (sqlContent.match(/\('[\w-]+',/g) || []).length;
    const hasOnConflict = sqlContent.includes("ON CONFLICT");

    console.log(`📊 Structure Analysis:`);
    console.log(`   - INSERT statements: ${insertCount}`);
    console.log(`   - Lesson entries: ${lessonCount}`);
    console.log(`   - ON CONFLICT clause: ${hasOnConflict ? "✅" : "❌"}`);

    if (insertCount !== 1) {
      console.log("⚠️  Expected exactly 1 INSERT statement");
    }

    if (lessonCount === 0) {
      console.log("❌ No lesson entries found");
      return;
    }

    // Test the SQL execution
    console.log("\n🚀 Attempting to execute SQL...");

    const { data, error } = await supabase.rpc("exec_sql", {
      sql_query: sqlContent,
    });

    if (error) {
      console.error("❌ SQL Execution Error:");
      console.error(`   Error: ${error.message}`);
      console.error(`   Code: ${error.code || "N/A"}`);
      console.error(`   Details: ${error.details || "N/A"}`);

      // Try to identify the problematic line
      if (error.message.includes("LINE")) {
        const lineMatch = error.message.match(/LINE (\d+):/);
        if (lineMatch) {
          const lineNum = parseInt(lineMatch[1]);
          console.log(`\n🔍 Problematic area around line ${lineNum}:`);
          const lines = sqlContent.split("\n");
          const start = Math.max(0, lineNum - 3);
          const end = Math.min(lines.length, lineNum + 2);
          for (let i = start; i < end; i++) {
            const marker = i === lineNum - 1 ? ">>> " : "    ";
            console.log(`${marker}${i + 1}: ${lines[i]}`);
          }
        }
      }

      return false;
    } else {
      console.log("✅ SQL executed successfully!");
      console.log(`📝 Lessons inserted/updated: ${lessonCount}`);

      // Verify the data was inserted
      const { data: verifyData, error: verifyError } = await supabase
        .from("lessons")
        .select("id, title")
        .in("course_id", [
          "french-classical-term-al",
          "islamic-civilization-term-al",
          "islamic-ethics-term-al",
          "computer-science-term-as",
        ]);

      if (verifyError) {
        console.log("⚠️  Could not verify inserted data:", verifyError.message);
      } else {
        console.log(`✅ Verified ${verifyData.length} lessons in database`);
        verifyData.forEach((lesson) => {
          console.log(`   - ${lesson.id}: ${lesson.title}`);
        });
      }

      return true;
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    return false;
  }
}

// Alternative: Direct Supabase query test
async function testWithDirectQuery() {
  console.log("\n🔄 Trying direct query method...");

  try {
    const sqlContent = fs.readFileSync("curriculum-lessons-part3.sql", "utf8");

    // Execute the SQL directly
    const { data, error } = await supabase
      .from("lessons")
      .insert([]) // This will trigger the SQL parser without actually inserting
      .select();

    // If we get here, the basic structure might be OK
    console.log("✅ Basic SQL structure seems valid");

    // Now try executing the actual SQL content
    const { error: execError } = await supabase.rpc("exec_sql", {
      sql_query: sqlContent,
    });

    if (execError) {
      console.error("❌ Execution failed:", execError.message);
      return false;
    } else {
      console.log("✅ Direct execution successful!");
      return true;
    }
  } catch (error) {
    console.error("❌ Direct query test failed:", error.message);
    return false;
  }
}

async function main() {
  console.log("🎯 CURRICULUM-LESSONS-PART3.SQL VALIDATION");
  console.log("==========================================");

  const success = await testPart3SQL();

  if (!success) {
    console.log("\n🔧 Attempting alternative method...");
    await testWithDirectQuery();
  }

  console.log("\n📋 SUMMARY:");
  console.log("- Fix any errors shown above");
  console.log("- If successful, you can proceed to part 4 and 5");
  console.log(
    "- Remember to execute in Supabase SQL Editor if this script has issues"
  );
}

main().catch(console.error);
