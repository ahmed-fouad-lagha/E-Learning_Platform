#!/bin/bash

# OAuth Site URL Management Script
# This script helps switch between development and production OAuth configurations

echo "🔧 OAuth Site URL Management"
echo "============================"
echo ""

# Check current environment
if [[ "$1" == "dev" ]]; then
    echo "🛠️  Setting up for LOCAL DEVELOPMENT"
    echo "Supabase Site URL should be: http://localhost:3000"
    echo "Redirect URLs should include both:"
    echo "  - http://localhost:3000/auth/callback"
    echo "  - https://bacalgerie.me/auth/callback"
    echo ""
    echo "📝 Manual Steps:"
    echo "1. Go to: https://supabase.com/dashboard/project/tgmnzmmfjkwougqtgwif"
    echo "2. Navigate to: Authentication → URL Configuration"
    echo "3. Set Site URL to: http://localhost:3000"
    echo "4. Ensure Redirect URLs include both localhost and production"
    echo ""
    echo "🚀 Then run: npm run dev"
    
elif [[ "$1" == "prod" ]]; then
    echo "🌐 Setting up for PRODUCTION"
    echo "Supabase Site URL should be: https://bacalgerie.me"
    echo "Redirect URLs should include both:"
    echo "  - http://localhost:3000/auth/callback"
    echo "  - https://bacalgerie.me/auth/callback"
    echo ""
    echo "📝 Manual Steps:"
    echo "1. Go to: https://supabase.com/dashboard/project/tgmnzmmfjkwougqtgwif"
    echo "2. Navigate to: Authentication → URL Configuration"
    echo "3. Set Site URL to: https://bacalgerie.me"
    echo "4. Ensure Redirect URLs include both localhost and production"
    echo ""
    echo "🚀 Then run: vercel --prod"
    
else
    echo "Usage: $0 [dev|prod]"
    echo ""
    echo "Examples:"
    echo "  $0 dev   # Setup for local development"
    echo "  $0 prod  # Setup for production deployment"
    echo ""
    echo "Current OAuth Setup:"
    echo "- For LOCAL DEV: Site URL = http://localhost:3000"
    echo "- For PRODUCTION: Site URL = https://bacalgerie.me"
    echo "- Always keep both URLs in Redirect URLs list"
fi
