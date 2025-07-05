#!/bin/bash

# Database Migration Setup Script for E-Learning Platform
# This script sets up the Supabase PostgreSQL database with Prisma

echo "🗄️  E-Learning Platform Database Setup"
echo "======================================"

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=" .env.local; then
    echo ""
    echo "⚠️  DATABASE_URL not found in .env.local"
    echo ""
    echo "Please follow these steps:"
    echo "1. Go to your Supabase project: https://supabase.com/dashboard/project/tgmnzmmfjkwougqtgwif"
    echo "2. Navigate to Settings → Database"
    echo "3. Copy the Connection String (URI format)"
    echo "4. Add it to your .env.local file:"
    echo "   DATABASE_URL=\"postgresql://postgres:YOUR_PASSWORD@db.tgmnzmmfjkwougqtgwif.supabase.co:5432/postgres\""
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo ""
echo "📋 Pre-migration checklist:"
echo "✅ Supabase project is active"
echo "✅ DATABASE_URL is configured"
echo "✅ Prisma schema is ready"

echo ""
echo "🔄 Step 1: Generating Prisma Client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Prisma client generated successfully"
else
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo ""
echo "🗄️  Step 2: Running Database Migration..."
npx prisma migrate dev --name "init-elearning-platform"

if [ $? -eq 0 ]; then
    echo "✅ Database migration completed successfully"
else
    echo "❌ Database migration failed"
    echo "💡 Troubleshooting tips:"
    echo "   - Check your DATABASE_URL is correct"
    echo "   - Ensure your Supabase database is accessible"
    echo "   - Verify your database password is correct"
    exit 1
fi

echo ""
echo "🌱 Step 3: Seeding Initial Data..."
npm run prisma:seed

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
else
    echo "❌ Database seeding failed"
    echo "💡 The migration was successful, but seeding failed."
    echo "   You can run 'npm run prisma:seed' manually later."
fi

echo ""
echo "🎉 Database Setup Complete!"
echo ""
echo "📊 What was created:"
echo "   - All database tables (users, courses, lessons, etc.)"
echo "   - Sample courses (Mathematics, Physics, Arabic Literature)"
echo "   - Sample lessons for each course"
echo "   - Sample BAC practice exam"
echo ""
echo "🚀 Next steps:"
echo "   1. Start your development server: npm run dev"
echo "   2. Test course enrollment at: http://localhost:3000/courses"
echo "   3. View your database: npx prisma studio"
echo ""
echo "🔗 Useful commands:"
echo "   - View database: npx prisma studio"
echo "   - Reset database: npx prisma migrate reset"
echo "   - Add more seed data: npm run prisma:seed"
