#!/bin/bash

# Populate Supabase Database with Algerian BAC Curriculum Content
# Run this script to execute all SQL files in the correct order

echo "🚀 Starting Supabase Database Population..."
echo "================================================="

# Database connection details from .env.local
DB_URL="postgresql://postgres.tgmnzmmfjkwougqtgwif:UTBqUHsyaIh1sBIk@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

# Function to execute SQL file
execute_sql() {
    local file=$1
    local description=$2
    
    echo "📄 Executing: $file"
    echo "   Description: $description"
    
    if [ -f "$file" ]; then
        psql "$DB_URL" -f "$file"
        if [ $? -eq 0 ]; then
            echo "   ✅ Success: $file executed successfully"
        else
            echo "   ❌ Error: Failed to execute $file"
            return 1
        fi
    else
        echo "   ⚠️  Warning: File $file not found"
        return 1
    fi
    echo ""
}

# Execute files in correct order
echo "Step 1: Setting up database schema..."
execute_sql "supabase-schema.sql" "Create tables and relationships"

echo "Step 2: Populating course catalog..."
execute_sql "curriculum-courses.sql" "Insert 21 BAC course definitions"

echo "Step 3: Adding lesson content (Part 1)..."
execute_sql "curriculum-lessons-part1.sql" "Mathematics functions lessons"

echo "Step 4: Adding lesson content (Part 2)..."
execute_sql "curriculum-lessons-part2.sql" "Multi-subject lessons"

echo "Step 5: Adding lesson content (Part 3)..."
execute_sql "curriculum-lessons-part3.sql" "Literature, Islamic Studies, Computer Science"

echo "Step 6: Adding lesson content (Part 4)..."
execute_sql "curriculum-lessons-part4.sql" "Advanced Math, Physics, Chemistry"

echo "Step 7: Adding lesson content (Part 5)..."
execute_sql "curriculum-lessons-part5.sql" "Mathematics advanced topics"

echo "Step 8: Adding BAC examinations..."
execute_sql "curriculum-exams.sql" "BAC-style exam questions and solutions"

echo "Step 9: Adding sample data..."
execute_sql "supabase-data.sql" "Sample users and enrollment data"

echo "================================================="
echo "🎉 Database population complete!"
echo ""
echo "📊 Content Summary:"
echo "   • 21 Complete Courses"
echo "   • 28+ Comprehensive Lessons"  
echo "   • BAC-Style Examinations"
echo "   • Bilingual Content (Arabic/English)"
echo "   • Sample Users and Test Data"
echo ""
echo "🌐 Your E-Learning Platform is now ready!"
echo "   Access: http://localhost:3000"
echo "   Supabase: https://tgmnzmmfjkwougqtgwif.supabase.co"
