#!/usr/bin/env node

const https = require('https');

console.log('🔍 E-Learning Platform - Deployment Verification');
console.log('='.repeat(50));
console.log('');

const domain = 'e-learning-platform-l1fw452ik-ahmedfouadlaghas-projects.vercel.app';
const url = `https://${domain}`;

console.log(`🌐 Testing: ${url}`);
console.log('');

// Test basic connectivity
https.get(url, (res) => {
  console.log(`📊 HTTP Status: ${res.statusCode}`);
  console.log(`📋 Response Headers:`);
  Object.entries(res.headers).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
  
  if (res.statusCode === 200) {
    console.log('✅ Website is accessible!');
  } else if (res.statusCode >= 500) {
    console.log('❌ Server error - check environment variables');
  } else if (res.statusCode >= 400) {
    console.log('⚠️  Client error - check configuration');
  }
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('');
    console.log('📄 Response Preview:');
    console.log(data.substring(0, 500) + '...');
    console.log('');
    
    // Check for common issues
    if (data.includes('Internal Server Error')) {
      console.log('❌ Internal Server Error detected');
      console.log('💡 This usually means environment variables are missing');
    } else if (data.includes('<title>')) {
      console.log('✅ HTML content loaded successfully');
      const titleMatch = data.match(/<title>(.*?)<\/title>/i);
      if (titleMatch) {
        console.log(`📝 Page Title: ${titleMatch[1]}`);
      }
    } else if (data.includes('NOT_FOUND')) {
      console.log('❌ 404 Not Found - deployment may have failed');
    }
    
    console.log('');
    console.log('🔧 Environment Variables Setup:');
    console.log('   NEXTAUTH_URL should be:');
    console.log(`   https://${domain}`);
    console.log('');
    console.log('💡 Next Steps:');
    console.log('1. Set environment variables in Vercel dashboard');
    console.log('2. Use this exact URL for NEXTAUTH_URL');
    console.log('3. Redeploy after setting variables');
    console.log('4. Test authentication and navigation');
  });
  
}).on('error', (err) => {
  console.log('❌ Connection failed:', err.message);
  console.log('💡 Check if the domain is correct and accessible');
});

console.log('⏳ Testing connection...');
