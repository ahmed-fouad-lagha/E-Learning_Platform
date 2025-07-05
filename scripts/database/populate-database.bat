@echo off
REM Populate Supabase Database with Algerian BAC Curriculum Content
REM Windows batch version of database population script

echo 🚀 Starting Supabase Database Population...
echo =================================================

REM Database connection details from .env.local
set "DB_URL=postgresql://postgres.tgmnzmmfjkwougqtgwif:UTBqUHsyaIh1sBIk@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

echo Step 1: Setting up database schema...
echo 📄 Executing: supabase-schema.sql
psql "%DB_URL%" -f "supabase-schema.sql"
if %errorlevel% equ 0 (
    echo    ✅ Success: Schema created
) else (
    echo    ❌ Error: Failed to create schema
    pause
    exit /b 1
)

echo.
echo Step 2: Populating course catalog...
echo 📄 Executing: curriculum-courses.sql
psql "%DB_URL%" -f "curriculum-courses.sql"
if %errorlevel% equ 0 (
    echo    ✅ Success: Courses added
) else (
    echo    ❌ Error: Failed to add courses
    pause
    exit /b 1
)

echo.
echo Step 3: Adding lesson content (Part 1)...
echo 📄 Executing: curriculum-lessons-part1.sql
psql "%DB_URL%" -f "curriculum-lessons-part1.sql"
if %errorlevel% equ 0 (
    echo    ✅ Success: Math lessons added
) else (
    echo    ❌ Error: Failed to add math lessons
    pause
    exit /b 1
)

echo.
echo Step 4: Adding lesson content (Part 2)...
echo 📄 Executing: curriculum-lessons-part2.sql
psql "%DB_URL%" -f "curriculum-lessons-part2.sql"
if %errorlevel% equ 0 (
    echo    ✅ Success: Multi-subject lessons added
) else (
    echo    ❌ Error: Failed to add multi-subject lessons
    pause
    exit /b 1
)

echo.
echo Step 5: Adding lesson content (Part 3)...
echo 📄 Executing: curriculum-lessons-part3.sql
psql "%DB_URL%" -f "curriculum-lessons-part3.sql"
if %errorlevel% equ 0 (
    echo    ✅ Success: Literature and Islamic studies added
) else (
    echo    ❌ Error: Failed to add literature lessons
    pause
    exit /b 1
)

echo.
echo Step 6: Adding lesson content (Part 4)...
echo 📄 Executing: curriculum-lessons-part4.sql
psql "%DB_URL%" -f "curriculum-lessons-part4.sql"
if %errorlevel% equ 0 (
    echo    ✅ Success: Advanced lessons added
) else (
    echo    ❌ Error: Failed to add advanced lessons
    pause
    exit /b 1
)

echo.
echo Step 7: Adding lesson content (Part 5)...
echo 📄 Executing: curriculum-lessons-part5.sql
psql "%DB_URL%" -f "curriculum-lessons-part5.sql"
if %errorlevel% equ 0 (
    echo    ✅ Success: Mathematics advanced topics added
) else (
    echo    ❌ Error: Failed to add advanced math lessons
    pause
    exit /b 1
)

echo.
echo Step 8: Adding BAC examinations...
echo 📄 Executing: curriculum-exams.sql
psql "%DB_URL%" -f "curriculum-exams.sql"
if %errorlevel% equ 0 (
    echo    ✅ Success: BAC exams added
) else (
    echo    ❌ Error: Failed to add exams
    pause
    exit /b 1
)

echo.
echo Step 9: Adding sample data...
echo 📄 Executing: supabase-data.sql
psql "%DB_URL%" -f "supabase-data.sql"
if %errorlevel% equ 0 (
    echo    ✅ Success: Sample data added
) else (
    echo    ❌ Error: Failed to add sample data
    pause
    exit /b 1
)

echo.
echo =================================================
echo 🎉 Database population complete!
echo.
echo 📊 Content Summary:
echo    • 21 Complete Courses
echo    • 28+ Comprehensive Lessons  
echo    • BAC-Style Examinations
echo    • Bilingual Content (Arabic/English)
echo    • Sample Users and Test Data
echo.
echo 🌐 Your E-Learning Platform is now ready!
echo    Access: http://localhost:3000
echo    Supabase: https://tgmnzmmfjkwougqtgwif.supabase.co
echo.
pause
