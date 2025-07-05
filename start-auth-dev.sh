#!/bin/bash

# E-Learning Platform - Authentication Development Setup
# This script helps you get started with authentication development

echo "🚀 Setting up E-Learning Platform for Authentication Development"
echo "============================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📁 Project structure organized!"
echo "✅ Database files → /database/"
echo "✅ Test files → /tests/"
echo "✅ Scripts → /scripts/"
echo "✅ Documentation → /docs/"

echo ""
echo "🔧 Next steps for Authentication Development:"
echo "1. Set up environment variables:"
echo "   cp .env.example .env.local"
echo ""
echo "2. Install dependencies:"
echo "   npm install"
echo ""
echo "3. Set up database:"
echo "   cd scripts/database && ./setup-database.sh"
echo ""
echo "4. Run the development server:"
echo "   npm run dev"
echo ""
echo "5. Key files for authentication:"
echo "   📄 Schema: database/schema/supabase-schema.sql"
echo "   🧩 Components: components/auth/"
echo "   🔗 API Routes: app/api/auth/"
echo "   🧪 Tests: tests/auth/"
echo ""
echo "📖 For detailed information, see PROJECT_STRUCTURE.md"
echo ""
echo "Happy coding! 🎉"
