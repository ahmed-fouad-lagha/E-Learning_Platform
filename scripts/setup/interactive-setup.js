#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  title: (msg) =>
    console.log(`\n${colors.bright}${colors.cyan}🚀 ${msg}${colors.reset}\n`),
};

async function interactiveSetup() {
  log.title("E-Learning Platform Environment Setup");

  const envPath = path.join(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    log.error(".env.local file not found!");
    process.exit(1);
  }

  let envContent = fs.readFileSync(envPath, "utf8");

  console.log(
    "This script will help you configure all required environment variables.\n"
  );

  // 1. Supabase Service Role Key
  log.title("1. Supabase Service Role Key (REQUIRED)");
  console.log("📍 Steps:");
  console.log("   1. Go to https://supabase.com/dashboard");
  console.log("   2. Select your project: tgmnzmmfjkwougqtgwif");
  console.log("   3. Go to Settings → API");
  console.log('   4. Copy the service_role key (starts with "eyJ...")');
  console.log("");

  const serviceRoleKey = await question(
    "🔑 Enter your Supabase Service Role Key: "
  );
  if (serviceRoleKey.trim()) {
    envContent = envContent.replace(
      /SUPABASE_SERVICE_ROLE_KEY=.*/,
      `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey.trim()}`
    );
    log.success("Supabase Service Role Key configured!");
  } else {
    log.warning(
      "Skipped Supabase Service Role Key (REQUIRED for admin functions)"
    );
  }

  // 2. Email Configuration
  log.title("2. Email Configuration (REQUIRED for Authentication)");
  console.log("Choose your email provider:");
  console.log("1. Gmail (Recommended)");
  console.log("2. Outlook/Hotmail");
  console.log("3. Other SMTP");
  console.log("4. Skip email setup");

  const emailChoice = await question("Select option (1-4): ");

  if (emailChoice === "1") {
    // Gmail setup
    console.log("\n📧 Gmail Setup:");
    console.log("   1. Enable 2-Factor Authentication on your Gmail");
    console.log("   2. Go to Google Account → Security → App passwords");
    console.log('   3. Generate an app password for "Mail"');
    console.log("");

    const gmailUser = await question("📧 Enter your Gmail address: ");
    const gmailPass = await question(
      "🔐 Enter your Gmail app password (16 characters): "
    );

    if (gmailUser.trim() && gmailPass.trim()) {
      envContent = envContent.replace(
        /SMTP_USER=.*/,
        `SMTP_USER=${gmailUser.trim()}`
      );
      envContent = envContent.replace(
        /SMTP_PASS=.*/,
        `SMTP_PASS=${gmailPass.trim()}`
      );
      envContent = envContent.replace(
        /SMTP_FROM=.*/,
        `SMTP_FROM=${gmailUser.trim()}`
      );
      log.success("Gmail configuration saved!");
    }
  } else if (emailChoice === "2") {
    // Outlook setup
    console.log("\n📧 Outlook Setup:");
    const outlookUser = await question("📧 Enter your Outlook email: ");
    const outlookPass = await question("🔐 Enter your Outlook password: ");

    if (outlookUser.trim() && outlookPass.trim()) {
      envContent = envContent.replace(
        /SMTP_HOST=.*/,
        "SMTP_HOST=smtp-mail.outlook.com"
      );
      envContent = envContent.replace(/SMTP_PORT=.*/, "SMTP_PORT=587");
      envContent = envContent.replace(
        /SMTP_USER=.*/,
        `SMTP_USER=${outlookUser.trim()}`
      );
      envContent = envContent.replace(
        /SMTP_PASS=.*/,
        `SMTP_PASS=${outlookPass.trim()}`
      );
      envContent = envContent.replace(
        /SMTP_FROM=.*/,
        `SMTP_FROM=${outlookUser.trim()}`
      );
      log.success("Outlook configuration saved!");
    }
  } else if (emailChoice === "3") {
    // Custom SMTP
    const smtpHost = await question("🖥️  SMTP Host: ");
    const smtpPort = await question("🔌 SMTP Port: ");
    const smtpUser = await question("👤 SMTP Username: ");
    const smtpPass = await question("🔐 SMTP Password: ");
    const smtpFrom = await question("📨 From Email: ");

    if (smtpHost.trim() && smtpUser.trim()) {
      envContent = envContent.replace(
        /SMTP_HOST=.*/,
        `SMTP_HOST=${smtpHost.trim()}`
      );
      envContent = envContent.replace(
        /SMTP_PORT=.*/,
        `SMTP_PORT=${smtpPort.trim() || "587"}`
      );
      envContent = envContent.replace(
        /SMTP_USER=.*/,
        `SMTP_USER=${smtpUser.trim()}`
      );
      envContent = envContent.replace(
        /SMTP_PASS=.*/,
        `SMTP_PASS=${smtpPass.trim()}`
      );
      envContent = envContent.replace(
        /SMTP_FROM=.*/,
        `SMTP_FROM=${smtpFrom.trim() || smtpUser.trim()}`
      );
      log.success("Custom SMTP configuration saved!");
    }
  } else {
    log.warning(
      "Skipped email setup (REQUIRED for user registration/password reset)"
    );
  }

  // 3. Social Login (Optional)
  log.title("3. Social Login Configuration (OPTIONAL)");
  const setupSocial = await question(
    "Do you want to set up social login? (y/N): "
  );

  if (
    setupSocial.toLowerCase() === "y" ||
    setupSocial.toLowerCase() === "yes"
  ) {
    // Google OAuth
    console.log("\n🔍 Google OAuth Setup:");
    console.log("   1. Go to https://console.cloud.google.com/");
    console.log("   2. Create/select a project");
    console.log("   3. Enable Google+ API");
    console.log("   4. Create OAuth 2.0 credentials");
    console.log(
      "   5. Add redirect URI: http://localhost:3000/api/auth/callback/google"
    );
    console.log("");

    const googleClientId = await question("🔑 Google Client ID (optional): ");
    const googleSecret = await question("🔐 Google Client Secret (optional): ");

    if (googleClientId.trim() && googleSecret.trim()) {
      envContent = envContent.replace(
        /GOOGLE_CLIENT_ID=.*/,
        `GOOGLE_CLIENT_ID=${googleClientId.trim()}`
      );
      envContent = envContent.replace(
        /GOOGLE_CLIENT_SECRET=.*/,
        `GOOGLE_CLIENT_SECRET=${googleSecret.trim()}`
      );
      log.success("Google OAuth configured!");
    }

    // Facebook OAuth
    console.log("\n📘 Facebook OAuth Setup:");
    console.log("   1. Go to https://developers.facebook.com/");
    console.log("   2. Create an app");
    console.log("   3. Add Facebook Login product");
    console.log(
      "   4. Add redirect URI: http://localhost:3000/api/auth/callback/facebook"
    );
    console.log("");

    const facebookId = await question("🔑 Facebook App ID (optional): ");
    const facebookSecret = await question(
      "🔐 Facebook App Secret (optional): "
    );

    if (facebookId.trim() && facebookSecret.trim()) {
      envContent = envContent.replace(
        /FACEBOOK_CLIENT_ID=.*/,
        `FACEBOOK_CLIENT_ID=${facebookId.trim()}`
      );
      envContent = envContent.replace(
        /FACEBOOK_CLIENT_SECRET=.*/,
        `FACEBOOK_CLIENT_SECRET=${facebookSecret.trim()}`
      );
      log.success("Facebook OAuth configured!");
    }
  }

  // 4. Analytics (Optional)
  log.title("4. Analytics Configuration (OPTIONAL)");
  const setupAnalytics = await question(
    "Do you want to set up analytics? (y/N): "
  );

  if (
    setupAnalytics.toLowerCase() === "y" ||
    setupAnalytics.toLowerCase() === "yes"
  ) {
    const gaId = await question(
      "📊 Google Analytics Measurement ID (GA-XXXXXXXXXX): "
    );
    const mixpanelToken = await question(
      "📈 Mixpanel Project Token (optional): "
    );

    if (gaId.trim()) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_GA_MEASUREMENT_ID=.*/,
        `NEXT_PUBLIC_GA_MEASUREMENT_ID=${gaId.trim()}`
      );
      log.success("Google Analytics configured!");
    }

    if (mixpanelToken.trim()) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_MIXPANEL_TOKEN=.*/,
        `NEXT_PUBLIC_MIXPANEL_TOKEN=${mixpanelToken.trim()}`
      );
      log.success("Mixpanel configured!");
    }
  }

  // Save the updated environment file
  fs.writeFileSync(envPath, envContent);
  log.success("Environment configuration saved to .env.local!");

  // Final recommendations
  log.title("🎉 Setup Complete!");
  console.log("Next steps:");
  console.log("1. Test your email configuration: npm run test-email");
  console.log("2. Validate all settings: npm run check-ready");
  console.log("3. Start the development server: npm run dev");
  console.log("");
  console.log("📚 Documentation:");
  console.log("- Quick Start Guide: ./QUICK_START.md");
  console.log("- Environment Setup: ./ENVIRONMENT_SETUP_GUIDE.md");
  console.log("- Authentication Guide: ./docs/ENHANCED_AUTH_SYSTEM_GUIDE.md");

  rl.close();
}

// Handle cleanup
process.on("SIGINT", () => {
  console.log("\n\nSetup cancelled by user.");
  rl.close();
  process.exit(0);
});

interactiveSetup().catch((error) => {
  log.error(`Setup failed: ${error.message}`);
  process.exit(1);
});
