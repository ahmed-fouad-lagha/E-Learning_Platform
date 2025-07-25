#!/bin/bash

echo "🔧 COMPREHENSIVE OAUTH DEBUG - Production Issue"
echo "=============================================="
echo ""

echo "❌ CURRENT PROBLEM:"
echo "- OAuth redirects to: https://www.bacalgerie.me/?code=..."
echo "- Should redirect to: https://www.bacalgerie.me/auth/callback?code=..."
echo "- Dashboard stuck on loading screen"
echo ""

echo "🔍 STEP-BY-STEP DIAGNOSIS:"
echo ""

echo "1️⃣ TEST CALLBACK ROUTE:"
echo "   Visit: https://bacalgerie.me/auth/callback"
echo "   Expected: Should NOT show 404"
echo "   If 404: Route not deployed properly"
echo ""

echo "2️⃣ CHECK SUPABASE CONFIGURATION:"
echo "   Dashboard: https://supabase.com/dashboard/project/tgmnzmmfjkwougqtgwif"
echo "   Authentication > URL Configuration"
echo "   Site URL: https://bacalgerie.me"
echo "   Redirect URLs: https://bacalgerie.me/auth/callback"
echo ""

echo "3️⃣ VERIFY GOOGLE OAUTH:"
echo "   Google Cloud Console > APIs & Services > Credentials"
echo "   Find your OAuth 2.0 Client ID"
echo "   Authorized redirect URIs should include:"
echo "   - https://tgmnzmmfjkwougqtgwif.supabase.co/auth/v1/callback"
echo ""

echo "4️⃣ CHECK DEPLOYMENT:"
echo "   Verify latest code is deployed to Vercel"
echo "   Check if auth callback route exists in deployment"
echo ""

echo "🚨 COMMON ISSUES:"
echo "   - Site URL set but Redirect URLs missing /auth/callback"
echo "   - Google OAuth still pointing to old URLs"
echo "   - Latest code not deployed to production"
echo "   - Auth callback route not properly built"
echo ""

echo "💡 NEXT STEPS:"
echo "   1. Test callback route directly"
echo "   2. Verify Supabase settings exactly"
echo "   3. Check Google OAuth configuration"
echo "   4. Redeploy if needed"
