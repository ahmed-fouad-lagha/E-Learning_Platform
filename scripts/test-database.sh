#!/bin/bash
# Script to test database connection and schema

echo "Testing Supabase database connection and schema..."

# Run the development server to test
npm run dev &

# Wait a moment for the server to start
sleep 5

# Test the database connection
echo "Testing database connection..."
curl -s http://localhost:3000/api/test-db || echo "Database test endpoint not found"

# Kill the dev server
pkill -f "next dev"

echo "Database test completed."
