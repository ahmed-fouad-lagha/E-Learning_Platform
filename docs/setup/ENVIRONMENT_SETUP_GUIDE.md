# 🛠️ Environment Variables Setup Guide

## 📋 **Step-by-Step Configuration**

### 🔧 **1. Required Configurations (Must Complete)**

#### **1.1 Supabase Service Role Key**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `tgmnzmmfjkwougqtgwif`
3. Go to **Settings** → **API**
4. Copy the **service_role** key (starts with `eyJ...`)
5. Replace in `.env.local`:
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJ_your_actual_service_role_key_here
```

#### **1.2 JWT Secret (Security Critical)**
Generate a strong 32+ character secret:
```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Use online generator
# Visit: https://generate-secret.vercel.app/32
```
Replace in `.env.local`:
```bash
JWT_SECRET=your_generated_32_character_secret_here
```

#### **1.3 Email Configuration (Required for Auth)**

##### **Option A: Gmail (Recommended)**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to **Google Account** → **Security** → **App passwords**
   - Generate password for "Mail"
3. Update `.env.local`:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=your-email@gmail.com
```

##### **Option B: Outlook/Hotmail**
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM=your-email@outlook.com
```

### 🔗 **2. Optional Configurations**

#### **2.1 Google Social Login**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create OAuth 2.0 Client ID**
5. Set authorized origins: `http://localhost:3000`
6. Set redirect URIs: `http://localhost:3000/auth/callback/google`
7. Copy Client ID and Secret:
```bash
GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_secret_here
```

#### **2.2 Facebook Social Login**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app → **Consumer** → **Next**
3. Go to **Facebook Login** → **Settings**
4. Add redirect URI: `http://localhost:3000/auth/callback/facebook`
5. Copy App ID and Secret:
```bash
FACEBOOK_CLIENT_ID=1234567890123456
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret
```

#### **2.3 Analytics (Optional)**
##### **Google Analytics**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create property → Get Measurement ID
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### ⚡ **3. Quick Setup Script**

Let me create a setup script to help you:

```bash
# Run this to generate secure secrets
npm run setup-env
```
