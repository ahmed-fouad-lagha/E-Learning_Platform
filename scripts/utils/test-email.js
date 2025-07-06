#!/usr/bin/env node

const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.join(process.cwd(), ".env.local") });

console.log("📧 Testing Email Configuration\n");

async function testEmailConfig() {
  try {
    // Check if email variables are configured
    const requiredVars = [
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_USER",
      "SMTP_PASS",
      "SMTP_FROM",
    ];
    const missing = requiredVars.filter(
      (v) => !process.env[v] || process.env[v].includes("your-")
    );

    if (missing.length > 0) {
      console.log("❌ Missing email configuration:");
      missing.forEach((v) => console.log(`   - ${v}`));
      console.log("\n📖 Please configure these in .env.local file");
      process.exit(1);
    }

    console.log("🔧 Email Configuration:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Host: ${process.env.SMTP_HOST}`);
    console.log(`Port: ${process.env.SMTP_PORT}`);
    console.log(`User: ${process.env.SMTP_USER}`);
    console.log(`From: ${process.env.SMTP_FROM}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log("🔍 Testing SMTP connection...");

    // Verify connection
    await transporter.verify();
    console.log("✅ SMTP connection successful!\n");

    // Send test email
    console.log("📤 Sending test email...");

    const testEmail = {
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER, // Send to self for testing
      subject: "E-Learning Platform - Email Test ✅",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">🎓 E-Learning Platform</h1>
            <h2 style="color: #059669;">Email Configuration Test</h2>
          </div>
          
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0; color: #0c4a6e;">✅ Success!</h3>
            <p style="margin: 10px 0 0 0; color: #075985;">
              Your email configuration is working correctly. The authentication system can now send:
            </p>
          </div>

          <ul style="line-height: 1.8; color: #374151;">
            <li>📧 Email verification messages</li>
            <li>🔒 Password reset links</li>
            <li>👨‍👩‍👧‍👦 Parent notification emails</li>
            <li>🏆 Achievement notifications</li>
            <li>📊 Progress reports</li>
          </ul>

          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #374151;">Configuration Details:</h4>
            <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 14px;">
              Host: ${process.env.SMTP_HOST}<br>
              Port: ${process.env.SMTP_PORT}<br>
              User: ${process.env.SMTP_USER}
            </code>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Test sent at: ${new Date().toLocaleString()}<br>
              E-Learning Platform - Authentication System
            </p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(testEmail);
    console.log("✅ Test email sent successfully!");
    console.log(`📬 Message ID: ${result.messageId}`);
    console.log(`📧 Check your inbox: ${process.env.SMTP_USER}\n`);

    console.log("🎉 Email configuration is ready for production!");
    console.log("\n📋 Supported Email Features:");
    console.log("  ✅ User registration verification");
    console.log("  ✅ Password reset functionality");
    console.log("  ✅ Parent progress notifications");
    console.log("  ✅ Achievement notifications");
    console.log("  ✅ System alerts and updates");
  } catch (error) {
    console.log("❌ Email configuration test failed:");
    console.log(`   Error: ${error.message}\n`);

    if (error.code === "EAUTH") {
      console.log("🔧 Authentication Error - Check these:");
      console.log("  • Gmail: Use App Password (not regular password)");
      console.log("  • Enable 2-Factor Authentication first");
      console.log(
        "  • App Password: Google Account → Security → App passwords"
      );
    } else if (error.code === "ENOTFOUND") {
      console.log("🔧 Connection Error - Check these:");
      console.log("  • SMTP_HOST setting");
      console.log("  • Internet connection");
      console.log("  • Firewall settings");
    } else if (error.code === "ETIMEDOUT") {
      console.log("🔧 Timeout Error - Check these:");
      console.log("  • SMTP_PORT setting");
      console.log("  • Network connectivity");
    }

    console.log(
      "\n📖 For detailed setup instructions, see: ENVIRONMENT_SETUP_GUIDE.md"
    );
    process.exit(1);
  }
}

testEmailConfig();
