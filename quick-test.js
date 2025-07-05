const fetch = require("node-fetch");

async function quickTest() {
  console.log("🧪 Quick API Test\n");

  try {
    console.log("Testing /api/courses...");
    const response = await fetch("http://localhost:3000/api/courses");
    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Success:", data.success);
    console.log("Source:", data.source || "database");
    console.log("Courses count:", data.data?.courses?.length || 0);

    if (data.data?.courses?.length > 0) {
      console.log("First course:", data.data.courses[0].titleAr);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

quickTest();
