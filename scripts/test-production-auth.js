// Quick Test: Check if auth callback route is accessible
// Test this in browser console on your production site

console.log("🔍 Testing Auth Callback Route...");

// Test 1: Check if route exists
fetch("https://bacalgerie.me/auth/callback")
  .then((response) => {
    console.log("✅ Route Status:", response.status);
    console.log("✅ Route exists:", response.status !== 404);
    return response.text();
  })
  .then((html) => {
    console.log("✅ Route response received");
  })
  .catch((error) => {
    console.log("❌ Route error:", error);
  });

// Test 2: Check current authentication state
fetch("https://bacalgerie.me/api/auth/session")
  .then((response) => response.json())
  .then((data) => {
    console.log("✅ Current session:", data);
  })
  .catch((error) => {
    console.log("❌ Session check error:", error);
  });
