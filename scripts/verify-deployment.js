#!/usr/bin/env node

const https = require("https");

console.log("🔍 E-Learning Platform - Deployment Verification");
console.log("=".repeat(50));
console.log("");

const domain = "e-learning-platform-beta.vercel.app";
const url = `https://${domain}`;

console.log(`🌐 Testing: ${url}`);
console.log("");

// Test basic connectivity
https
  .get(url, (res) => {
    console.log(`📊 HTTP Status: ${res.statusCode}`);
    console.log(`📋 Headers: ${JSON.stringify(res.headers, null, 2)}`);

    if (res.statusCode === 200) {
      console.log("✅ Website is accessible!");
    } else if (res.statusCode >= 500) {
      console.log("❌ Server error - check environment variables");
    } else if (res.statusCode >= 400) {
      console.log("⚠️  Client error - check configuration");
    }

    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("");
      console.log("📄 Response Preview:");
      console.log(data.substring(0, 200) + "...");
      console.log("");

      // Check for common issues
      if (data.includes("Internal Server Error")) {
        console.log("❌ Internal Server Error detected");
        console.log("💡 This usually means environment variables are missing");
      } else if (data.includes("<title>")) {
        console.log("✅ HTML content loaded successfully");
      }

      console.log("🔧 Next Steps:");
      console.log("1. If you see errors, check Vercel environment variables");
      console.log(
        '2. Ensure all variables are set to "Production" environment'
      );
      console.log("3. Wait 30 seconds after setting variables, then redeploy");
      console.log("4. Test authentication and navigation manually");
    });
  })
  .on("error", (err) => {
    console.log("❌ Connection failed:", err.message);
    console.log("💡 Check if the domain is correct and accessible");
  });

console.log("⏳ Testing connection...");
