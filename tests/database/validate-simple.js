const fs = require("fs");

console.log("🎯 CURRICULUM-LESSONS-PART3.SQL VALIDATION");
console.log("==========================================");

try {
  // Read the SQL file
  const sqlContent = fs.readFileSync("curriculum-lessons-part3.sql", "utf8");

  console.log("✅ File read successfully");
  console.log(`📄 File size: ${Math.round(sqlContent.length / 1024)}KB`);
  console.log(`📏 Total lines: ${sqlContent.split("\n").length}`);

  // Basic structural analysis
  const insertCount = (sqlContent.match(/INSERT INTO.*lessons.*VALUES/gi) || [])
    .length;
  const lessonCount = (sqlContent.match(/^\('[\w-]+',/gm) || []).length;
  const hasOnConflict = sqlContent.includes("ON CONFLICT");
  const endCount = (sqlContent.match(/\d+,\s*\d+,\s*'[\w-]+'\),?/g) || [])
    .length;

  console.log(`\n📊 Structure Analysis:`);
  console.log(`   - INSERT statements: ${insertCount}`);
  console.log(`   - Lesson entries: ${lessonCount}`);
  console.log(`   - Lesson endings: ${endCount}`);
  console.log(`   - ON CONFLICT clause: ${hasOnConflict ? "✅" : "❌"}`);

  // Validate structure
  const issues = [];

  if (insertCount !== 1) {
    issues.push(`Expected exactly 1 INSERT statement, found ${insertCount}`);
  }

  if (lessonCount !== endCount) {
    issues.push(
      `Lesson count mismatch: ${lessonCount} starts vs ${endCount} endings`
    );
  }

  if (!hasOnConflict) {
    issues.push("Missing ON CONFLICT clause");
  }

  // Check for common syntax issues
  const lines = sqlContent.split("\n");
  const syntaxIssues = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check for lines that might be outside quotes
    if (line.match(/^\s*\*\*.*\*\*.*:\s*$/) && !line.includes("'")) {
      syntaxIssues.push(
        `Line ${lineNum}: Potential unquoted content: ${line.trim()}`
      );
    }

    // Check for incomplete lesson entries
    if (line.match(/^\('[\w-]+',/) && !line.includes("VALUES")) {
      const nextLines = lines.slice(index, index + 10).join("\n");
      const commaCount = (nextLines.match(/,/g) || []).length;
      if (commaCount < 7) {
        // Should have at least 7 commas for 8 fields
        syntaxIssues.push(`Line ${lineNum}: Potential incomplete lesson entry`);
      }
    }
  });

  // Check parentheses balance
  const openParens = (sqlContent.match(/\(/g) || []).length;
  const closeParens = (sqlContent.match(/\)/g) || []).length;

  if (openParens !== closeParens) {
    issues.push(
      `Unbalanced parentheses: ${openParens} open vs ${closeParens} close`
    );
  }

  // Check quotes (simple check)
  const singleQuotes = (sqlContent.match(/'/g) || []).length;
  if (singleQuotes % 2 !== 0) {
    issues.push(
      `Odd number of single quotes: ${singleQuotes} (potentially unbalanced)`
    );
  }

  console.log(`\n🔍 Syntax Analysis:`);
  if (syntaxIssues.length === 0) {
    console.log("✅ No obvious syntax issues detected");
  } else {
    console.log(`⚠️  Found ${syntaxIssues.length} potential syntax issues:`);
    syntaxIssues.slice(0, 5).forEach((issue) => console.log(`   - ${issue}`));
    if (syntaxIssues.length > 5) {
      console.log(`   ... and ${syntaxIssues.length - 5} more`);
    }
  }

  console.log(`\n📋 Validation Summary:`);
  if (issues.length === 0 && syntaxIssues.length === 0) {
    console.log("🎉 FILE APPEARS TO BE VALID!");
    console.log("✅ Ready for execution in Supabase SQL Editor");
    console.log("\n📝 Next steps:");
    console.log("1. Copy the content of curriculum-lessons-part3.sql");
    console.log("2. Paste it in your Supabase SQL Editor");
    console.log("3. Execute it");
    console.log("4. If successful, proceed to part 4 and 5");
  } else {
    console.log("❌ ISSUES FOUND:");
    [...issues, ...syntaxIssues.slice(0, 3)].forEach((issue) => {
      console.log(`   - ${issue}`);
    });

    console.log("\n🔧 RECOMMENDED FIXES:");
    if (lessonCount !== endCount) {
      console.log("   - Check for incomplete lesson entries");
      console.log("   - Ensure each lesson has exactly 8 fields");
    }
    if (syntaxIssues.length > 0) {
      console.log("   - Review lines with potential unquoted content");
      console.log("   - Ensure all content is within SQL string literals");
    }
  }

  // Show specific lesson entries for verification
  console.log(`\n📚 Detected Lessons:`);
  const lessonMatches = sqlContent.match(/^\('([\w-]+)',\s*'([^']+)',/gm);
  if (lessonMatches) {
    lessonMatches.forEach((match, index) => {
      const idMatch = match.match(/'([\w-]+)'/);
      const titleMatch = match.match(/',\s*'([^']+)'/);
      if (idMatch && titleMatch) {
        console.log(`   ${index + 1}. ${idMatch[1]}: ${titleMatch[1]}`);
      }
    });
  }
} catch (error) {
  console.error("❌ Validation failed:", error.message);
}
