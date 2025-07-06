#!/usr/bin/env node

const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🚀 E-Learning Platform - Vercel Deployment Setup");
console.log("=".repeat(50));
console.log("");

const questions = [
  {
    key: "NEXT_PUBLIC_SUPABASE_URL",
    question: "Enter your Supabase URL (https://your-project.supabase.co): ",
    required: true,
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    question: "Enter your Supabase Anon Key: ",
    required: true,
  },
  {
    key: "SUPABASE_SERVICE_ROLE_KEY",
    question: "Enter your Supabase Service Role Key: ",
    required: true,
  },
  {
    key: "DATABASE_URL",
    question: "Enter your Database URL (postgresql://...): ",
    required: true,
  },
  {
    key: "NEXTAUTH_SECRET",
    question:
      "Enter your NextAuth Secret (generate with: openssl rand -base64 32): ",
    required: true,
  },
  {
    key: "VERCEL_DOMAIN",
    question: "Enter your Vercel domain (will be provided after deployment): ",
    required: false,
  },
];

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function setupEnvironment() {
  const envVars = {};

  console.log("Please provide the following environment variables:");
  console.log("");

  for (const q of questions) {
    let answer = "";
    do {
      answer = await askQuestion(q.question);
      if (q.required && !answer.trim()) {
        console.log("❌ This field is required. Please try again.");
      }
    } while (q.required && !answer.trim());

    if (answer.trim()) {
      envVars[q.key] = answer.trim();
    }
  }

  // Generate NEXTAUTH_URL from domain if provided
  if (envVars.VERCEL_DOMAIN) {
    envVars.NEXTAUTH_URL = `https://${envVars.VERCEL_DOMAIN}`;
  }

  console.log("");
  console.log("📋 Environment Variables Summary:");
  console.log("=".repeat(50));

  for (const [key, value] of Object.entries(envVars)) {
    const displayValue =
      key.includes("SECRET") || key.includes("KEY")
        ? "*".repeat(Math.min(value.length, 20))
        : value;
    console.log(`${key}=${displayValue}`);
  }

  console.log("");
  console.log("🔧 Next Steps:");
  console.log("1. Copy these environment variables to your Vercel dashboard");
  console.log("2. Go to: https://vercel.com/dashboard");
  console.log("3. Select your project");
  console.log("4. Go to Settings > Environment Variables");
  console.log("5. Add each variable above");
  console.log("6. Redeploy your application");
  console.log("");
  console.log(
    "📄 For detailed instructions, see: docs/VERCEL_DEPLOYMENT_GUIDE.md"
  );

  rl.close();
}

setupEnvironment().catch(console.error);
