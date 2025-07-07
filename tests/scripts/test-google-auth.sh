#!/bin/bash

echo "🔧 Testing Google OAuth Authentication Setup..."
echo ""

# Check if required environment variables are set
echo "📋 Checking environment variables..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local file found"
    
    # Check for required Supabase variables
    if grep -q "NEXT_PUBLIC_SUPABASE_URL=" .env.local && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local; then
        echo "✅ Supabase configuration found"
    else
        echo "❌ Missing Supabase configuration in .env.local"
        echo "   Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set"
    fi
    
    # Check for app URL
    if grep -q "NEXT_PUBLIC_APP_URL=" .env.local; then
        echo "✅ App URL configured"
    else
        echo "⚠️  NEXT_PUBLIC_APP_URL not found - using localhost:3000"
        echo "   Consider adding: NEXT_PUBLIC_APP_URL=http://localhost:3000"
    fi
else
    echo "❌ .env.local file not found"
    echo "   Please copy .env.example to .env.local and configure it"
    exit 1
fi

echo ""
echo "🚀 Starting development server..."
echo "   Navigate to http://localhost:3000/auth"
echo "   Try clicking the Google sign-up button"
echo ""
echo "📊 What to expect:"
echo "   1. Should redirect to Google OAuth consent screen"
echo "   2. After consent, should redirect back to /auth/callback"
echo "   3. Should create user profile and redirect to dashboard"
echo ""
echo "🐛 If you see /auth/auth-code-error:"
echo "   1. Check browser console for errors"
echo "   2. Verify Google OAuth is configured in Supabase dashboard"
echo "   3. Check that redirect URL matches exactly"
echo ""

# Start the development server
npm run dev
