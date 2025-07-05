#!/bin/bash

echo "Comprehensive SQL validation for curriculum-lessons-part3.sql"
echo "============================================================"

# Count lessons
LESSON_COUNT=$(grep -c "^('.*'," curriculum-lessons-part3.sql)
echo "✓ Found $LESSON_COUNT lesson entries"

# Check for proper VALUES structure
VALUES_COUNT=$(grep -c "INSERT INTO.*VALUES" curriculum-lessons-part3.sql)
echo "✓ Found $VALUES_COUNT INSERT...VALUES statements"

# Check for balanced quotes in content
echo "Checking quote balance..."
SINGLE_QUOTES=$(grep -o "'" curriculum-lessons-part3.sql | wc -l)
echo "  Total single quotes: $SINGLE_QUOTES"

# Check for potential problematic patterns
echo "Checking for potential syntax issues..."

# Look for unmatched parentheses
OPEN_PARENS=$(grep -o "(" curriculum-lessons-part3.sql | wc -l)
CLOSE_PARENS=$(grep -o ")" curriculum-lessons-part3.sql | wc -l)
echo "  Open parentheses: $OPEN_PARENS"
echo "  Close parentheses: $CLOSE_PARENS"
if [ "$OPEN_PARENS" -eq "$CLOSE_PARENS" ]; then
    echo "  ✓ Parentheses are balanced"
else
    echo "  ⚠ Parentheses may be unbalanced"
fi

# Check for proper termination
if grep -q "ON CONFLICT.*DO UPDATE" curriculum-lessons-part3.sql; then
    echo "✓ ON CONFLICT clause found"
else
    echo "⚠ ON CONFLICT clause not found"
fi

# Check for duplicate content patterns
echo "Checking for duplicate patterns..."
DUPLICATE_LINES=$(sort curriculum-lessons-part3.sql | uniq -d | wc -l)
if [ "$DUPLICATE_LINES" -gt 0 ]; then
    echo "  ⚠ Found $DUPLICATE_LINES potentially duplicate lines"
else
    echo "  ✓ No obvious duplicate lines found"
fi

echo "Validation complete."
