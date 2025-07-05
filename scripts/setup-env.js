#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔧 E-Learning Platform Environment Setup\n');

// Generate secure secrets
const jwtSecret = crypto.randomBytes(32).toString('hex');
const sessionSecret = crypto.randomBytes(32).toString('hex');

console.log('🔐 Generated Secure Secrets:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`SESSION_SECRET=${sessionSecret}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Read current .env.local
const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.log('❌ .env.local file not found. Please create it first.\n');
  process.exit(1);
}

// Update secrets if they're still placeholder values
if (envContent.includes('your-super-secret-jwt-key-min-32-characters-long-random-string')) {
  envContent = envContent.replace(
    'JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-random-string',
    `JWT_SECRET=${jwtSecret}`
  );
  console.log('✅ Updated JWT_SECRET');
}

if (envContent.includes('your-session-secret-key-different-from-jwt')) {
  envContent = envContent.replace(
    'SESSION_SECRET=your-session-secret-key-different-from-jwt',
    `SESSION_SECRET=${sessionSecret}`
  );
  console.log('✅ Updated SESSION_SECRET');
}

// Write back to file
fs.writeFileSync(envPath, envContent);

// Validate configuration
console.log('\n🔍 Validating Configuration:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const envVars = {};
envContent.split('\n').forEach(line => {
  if (line.includes('=') && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    envVars[key] = value;
  }
});

// Check required variables
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'JWT_SECRET',
  'SMTP_USER',
  'SMTP_PASS'
];

const optional = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'GOOGLE_CLIENT_ID',
  'FACEBOOK_CLIENT_ID'
];

let allRequired = true;

console.log('📋 Required Variables:');
required.forEach(key => {
  const value = envVars[key];
  if (value && !value.includes('your-') && value.length > 10) {
    console.log(`  ✅ ${key}: Configured`);
  } else {
    console.log(`  ❌ ${key}: NOT CONFIGURED`);
    allRequired = false;
  }
});

console.log('\n📋 Optional Variables:');
optional.forEach(key => {
  const value = envVars[key];
  if (value && !value.includes('your-') && value.length > 10) {
    console.log(`  ✅ ${key}: Configured`);
  } else {
    console.log(`  ⚠️  ${key}: Not configured (optional)`);
  }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (allRequired) {
  console.log('🎉 All required environment variables are configured!');
  console.log('');
  console.log('📧 Next Steps:');
  console.log('1. Test email configuration: npm run test-email');
  console.log('2. Set up Supabase database: npm run setup-db');
  console.log('3. Start development server: npm run dev');
} else {
  console.log('⚠️  Some required variables need configuration.');
  console.log('');
  console.log('📖 Please check ENVIRONMENT_SETUP_GUIDE.md for detailed instructions.');
}

console.log('\n🔗 Quick Links:');
console.log('• Supabase Dashboard: https://supabase.com/dashboard/project/tgmnzmmfjkwougqtgwif');
console.log('• Google Cloud Console: https://console.cloud.google.com/');
console.log('• Facebook Developers: https://developers.facebook.com/');
console.log('');
