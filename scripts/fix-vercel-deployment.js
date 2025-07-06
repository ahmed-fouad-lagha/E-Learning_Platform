#!/usr/bin/env node

console.log('🚀 E-Learning Platform - Vercel Environment Setup');
console.log('='.repeat(60));
console.log('');
console.log('❗ IMPORTANT: Your deployment failed because environment variables');
console.log('   are not set in Vercel. Follow these steps:');
console.log('');

// Read the local .env.local file to get the values
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
let envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    if (line.includes('=') && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    }
  });
}

console.log('📋 STEP 1: Go to Vercel Dashboard');
console.log('   🔗 https://vercel.com/dashboard');
console.log('   📁 Select your project: e-learning-platform');
console.log('   ⚙️  Go to Settings > Environment Variables');
console.log('');

console.log('📝 STEP 2: Add these Environment Variables:');
console.log('='.repeat(60));

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL',
  'NEXTAUTH_SECRET'
];

requiredVars.forEach(varName => {
  const value = envVars[varName];
  if (value) {
    const displayValue = varName.includes('SECRET') || varName.includes('KEY') || varName.includes('DATABASE_URL')
      ? '*'.repeat(20) + value.slice(-10)
      : value;
    console.log(`✅ ${varName}=${displayValue}`);
  } else {
    console.log(`❌ ${varName}=<NOT_FOUND_IN_LOCAL_ENV>`);
  }
});

console.log('');
console.log('🔧 STEP 3: Add this CRITICAL variable:');
console.log('   ❗ NEXTAUTH_URL=https://your-vercel-app-url.vercel.app');
console.log('   📌 Replace with your actual Vercel deployment URL');
console.log('');

console.log('🔄 STEP 4: Redeploy');
console.log('   After setting all variables, run: npx vercel --prod');
console.log('');

console.log('🐛 TROUBLESHOOTING:');
console.log('   • Make sure all variables are set to "Production" environment');
console.log('   • NEXTAUTH_URL must match your Vercel domain exactly');
console.log('   • No trailing slashes in URLs');
console.log('   • Check Vercel function logs for specific errors');
console.log('');

console.log('📱 STEP 5: Test Your Deployment');
console.log('   • Homepage should load');
console.log('   • Authentication should work');
console.log('   • Database connections should be established');
console.log('');

console.log('For detailed help, see: docs/VERCEL_DEPLOYMENT_GUIDE.md');
console.log('='.repeat(60));
