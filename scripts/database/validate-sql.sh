#!/bin/bash

# Simple SQL syntax validation script
echo "Validating SQL syntax for curriculum-lessons-part3.sql..."

# Check for basic syntax patterns
echo "Checking for unmatched quotes..."
if grep -n "^[^']*'[^']*$" curriculum-lessons-part3.sql > /dev/null; then
    echo "WARNING: Potential unmatched quotes found"
else
    echo "✓ No obvious unmatched quotes detected"
fi

# Check for proper VALUES structure
echo "Checking VALUES structure..."
VALUES_COUNT=$(grep -c "INSERT INTO.*VALUES" curriculum-lessons-part3.sql)
echo "Found $VALUES_COUNT INSERT...VALUES statements"

# Check for lesson entries
LESSON_COUNT=$(grep -c "^('.*'," curriculum-lessons-part3.sql)
echo "Found $LESSON_COUNT lesson entries"

# Check for proper termination
echo "Checking for proper statement termination..."
if grep -n "ON CONFLICT.*DO UPDATE" curriculum-lessons-part3.sql > /dev/null; then
    echo "✓ ON CONFLICT clause found"
else
    echo "WARNING: ON CONFLICT clause not found"
fi

echo "Basic validation complete."
