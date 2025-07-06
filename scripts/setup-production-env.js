#!/usr/bin/env node

console.log("🚀 E-Learning Platform - Production Environment Setup");
console.log("=".repeat(60));
console.log("🌐 Domain: e-learning-platform-beta.vercel.app");
console.log("=".repeat(60));
console.log("");

console.log("📋 VERCEL ENVIRONMENT VARIABLES TO SET:");
console.log("   Go to: https://vercel.com/dashboard");
console.log("   Project: e-learning-platform");
console.log("   Settings > Environment Variables");
console.log("");

// Environment variables with the correct domain
const envVars = {
  NEXT_PUBLIC_SUPABASE_URL: "https://tgmnzmmfjkwougqtgwif.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbW56bW1mamt3b3VncXRnd2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NDcwMjAsImV4cCI6MjA2NzEyMzAyMH0.pZtITFp0_1NAYZLXVPfyy3jPEiUDnS_gladoQrhKVcA",
  SUPABASE_SERVICE_ROLE_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbW56bW1mamt3b3VncXRnd2lmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTU0NzAyMCwiZXhwIjoyMDY3MTIzMDIwfQ.1_n6t5QHFGy39jKagyR_jkGKMN8zI_J0vwsEQLvXHiQ",
  DATABASE_URL:
    "postgresql://postgres.tgmnzmmfjkwougqtgwif:UTBqUHsyaIh1sBIk@aws-0-us-west-1.pooler.supabase.com:6543/postgres",
  NEXTAUTH_SECRET: "A9+kX/8ZINZGjQASmZJuT43sJ9ZYeZHLHqtNyDgmS4w=",
  NEXTAUTH_URL: "https://e-learning-platform-beta.vercel.app",
};

console.log("🔑 Copy and paste these exactly:");
console.log("=".repeat(40));

Object.entries(envVars).forEach(([key, value]) => {
  const displayValue =
    key.includes("SECRET") ||
    key.includes("SERVICE_ROLE") ||
    key.includes("DATABASE_URL")
      ? `${value.substring(0, 20)}...${value.slice(-10)}`
      : value;

  console.log(`\n${key}`);
  console.log(`${value}`);
  console.log(`(Shown: ${displayValue})`);
});

console.log("\n" + "=".repeat(60));
console.log("⚠️  IMPORTANT NOTES:");
console.log('   • Set Environment: "Production"');
console.log(
  "   • NEXTAUTH_URL must be EXACTLY: https://e-learning-platform-beta.vercel.app"
);
console.log("   • No trailing slash in NEXTAUTH_URL");
console.log("   • All values are case-sensitive");
console.log("");

console.log("🔄 AFTER SETTING VARIABLES:");
console.log("   1. Wait 30 seconds for propagation");
console.log("   2. Run: npx vercel --prod");
console.log("   3. Test: https://e-learning-platform-beta.vercel.app");
console.log("");

console.log("📱 TEST CHECKLIST:");
console.log("   ✅ Homepage loads");
console.log("   ✅ Navigation works");
console.log("   ✅ Login/Register pages accessible");
console.log("   ✅ Database connections work");
console.log("   ✅ No console errors");
console.log("");

console.log("🆘 IF STILL NOT WORKING:");
console.log("   • Check Vercel Function Logs");
console.log("   • Verify environment variables are set to Production");
console.log("   • Ensure NEXTAUTH_URL matches domain exactly");
console.log("   • Check browser console for errors");
console.log("=".repeat(60));
