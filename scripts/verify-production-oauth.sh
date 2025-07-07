#!/bin/bash

# Verify Vercel Environment Variables
echo "🔍 Checking Vercel Environment Variables..."

echo "📋 Required Environment Variables for Production:"
echo "- NEXT_PUBLIC_SUPABASE_URL"
echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "- SUPABASE_SERVICE_ROLE_KEY"
echo "- NEXTAUTH_SECRET"
echo "- DATABASE_URL"
echo "- DIRECT_URL"
echo ""

echo "🚀 To check your Vercel environment variables:"
echo "1. Run: vercel env ls"
echo "2. Or go to: https://vercel.com/fouad/bacalgerie/settings/environment-variables"
echo ""

echo "🔧 To add missing environment variables:"
echo "vercel env add NEXT_PUBLIC_SUPABASE_URL"
echo "vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "vercel env add SUPABASE_SERVICE_ROLE_KEY"
echo "vercel env add NEXTAUTH_SECRET"
echo "vercel env add DATABASE_URL"
echo "vercel env add DIRECT_URL"
echo ""

echo "💡 After updating Supabase redirect URIs, redeploy:"
echo "vercel --prod"
