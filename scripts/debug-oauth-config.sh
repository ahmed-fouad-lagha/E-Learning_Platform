#!/bin/bash

# Debug OAuth Configuration
echo "🔍 OAuth Configuration Debug"
echo "=========================="

echo ""
echo "✅ CORRECT OAuth Flow:"
echo "1. User clicks Google Sign In"
echo "2. Google → https://tgmnzmmfjkwougqtgwif.supabase.co/auth/v1/callback"
echo "3. Supabase → https://bacalgerie.me/auth/callback?code=..."
echo "4. Your app processes the code"
echo ""

echo "❌ CURRENT ISSUE:"
echo "OAuth is redirecting to: https://www.bacalgerie.me/?code=..."
echo "Should redirect to: https://www.bacalgerie.me/auth/callback?code=..."
echo ""

echo "🔧 FIXES TO CHECK:"
echo ""
echo "1. GOOGLE OAUTH SETTINGS:"
echo "   - Go to: https://console.cloud.google.com/apis/credentials"
echo "   - Find your OAuth 2.0 Client ID"
echo "   - Authorized redirect URIs should ONLY be:"
echo "     https://tgmnzmmfjkwougqtgwif.supabase.co/auth/v1/callback"
echo "   - Remove any other URLs like bacalgerie.me"
echo ""

echo "2. SUPABASE SETTINGS:"
echo "   - Go to: https://supabase.com/dashboard/project/tgmnzmmfjkwougqtgwif"
echo "   - Authentication → URL Configuration"
echo "   - Site URL: https://bacalgerie.me"
echo "   - Redirect URLs:"
echo "     https://bacalgerie.me/auth/callback"
echo "     http://localhost:3000/auth/callback"
echo ""

echo "3. VERIFY OAUTH PROVIDER:"
echo "   - In Supabase Dashboard"
echo "   - Authentication → Providers"
echo "   - Check Google provider configuration"
echo "   - Make sure redirect URL is correct"
echo ""

echo "💡 IMPORTANT:"
echo "   - Google OAuth redirect should go to SUPABASE, not your app"
echo "   - Supabase then redirects to your app"
echo "   - Your app's callback route processes the final code"
