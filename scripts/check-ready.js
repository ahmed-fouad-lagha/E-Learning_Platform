#!/usr/bin/env node

const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

console.log('🔍 E-Learning Platform Readiness Check\n');

const checks = [
  {
    name: 'Supabase URL',
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    required: true,
    test: (val) => val && val.includes('supabase.co')
  },
  {
    name: 'Supabase Anon Key',
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: true,
    test: (val) => val && val.startsWith('eyJ') && val.length > 100
  },
  {
    name: 'Supabase Service Role',
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    required: true,
    test: (val) => val && val.startsWith('eyJ') && val.length > 100
  },
  {
    name: 'JWT Secret',
    key: 'JWT_SECRET',
    required: true,
    test: (val) => val && val.length >= 32 && !val.includes('your-')
  },
  {
    name: 'Session Secret',
    key: 'SESSION_SECRET',
    required: true,
    test: (val) => val && val.length >= 32 && !val.includes('your-')
  },
  {
    name: 'SMTP User',
    key: 'SMTP_USER',
    required: true,
    test: (val) => val && val.includes('@') && !val.includes('your-')
  },
  {
    name: 'SMTP Password',
    key: 'SMTP_PASS',
    required: true,
    test: (val) => val && val.length > 5 && !val.includes('your-')
  },
  {
    name: 'SMTP From',
    key: 'SMTP_FROM',
    required: true,
    test: (val) => val && val.includes('@') && !val.includes('your-')
  },
  {
    name: 'Google Client ID',
    key: 'GOOGLE_CLIENT_ID',
    required: false,
    test: (val) => val && val.includes('.apps.googleusercontent.com')
  },
  {
    name: 'Facebook Client ID',
    key: 'FACEBOOK_CLIENT_ID',
    required: false,
    test: (val) => val && val.length > 10 && !val.includes('your-')
  }
];

let allRequired = true;
let optionalCount = 0;

console.log('📋 Configuration Status:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

checks.forEach(check => {
  const value = process.env[check.key];
  const isConfigured = check.test(value);
  
  if (check.required) {
    if (isConfigured) {
      console.log(`✅ ${check.name}: Configured`);
    } else {
      console.log(`❌ ${check.name}: MISSING`);
      allRequired = false;
    }
  } else {
    if (isConfigured) {
      console.log(`✅ ${check.name}: Configured (optional)`);
      optionalCount++;
    } else {
      console.log(`⚠️  ${check.name}: Not configured (optional)`);
    }
  }
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (allRequired) {
  console.log('🎉 SUCCESS! All required configurations are complete!');
  console.log(`📊 Optional features configured: ${optionalCount}/2`);
  console.log('');
  console.log('🚀 Your E-Learning Platform is ready to launch!');
  console.log('');
  console.log('📋 Next Steps:');
  console.log('1. Run: npm run test-email');
  console.log('2. Run: npm run dev');
  console.log('3. Visit: http://localhost:3000');
  console.log('');
  console.log('🎯 Available Features:');
  console.log('  ✅ User Registration & Login');
  console.log('  ✅ Email Verification & Password Reset');
  console.log('  ✅ Multi-Factor Authentication');
  console.log('  ✅ Student Progress Tracking');
  console.log('  ✅ Parent Notifications');
  console.log('  ✅ Teacher Course Management');
  console.log('  ✅ Achievement System');
  if (optionalCount > 0) {
    console.log('  ✅ Social Login (Google/Facebook)');
  }
} else {
  console.log('⚠️  Configuration incomplete. Missing required variables.');
  console.log('');
  console.log('📖 Please complete the setup:');
  console.log('1. Check QUICK_START.md for step-by-step instructions');
  console.log('2. Run: npm run setup-env (to regenerate secrets if needed)');
  console.log('3. Configure missing email and Supabase settings');
}

console.log('');
