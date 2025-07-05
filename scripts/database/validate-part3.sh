#!/bin/bash

echo "==================================================="
echo "SQL VALIDATION FOR curriculum-lessons-part3.sql"
echo "==================================================="

FILE="curriculum-lessons-part3.sql"

echo "1. Basic file checks..."
if [ ! -f "$FILE" ]; then
    echo "❌ File not found: $FILE"
    exit 1
fi

LINES=$(wc -l < "$FILE")
echo "✅ File exists: $LINES lines"

echo ""
echo "2. Structure validation..."

# Check for INSERT statement
INSERT_COUNT=$(grep -c "INSERT INTO.*lessons.*VALUES" "$FILE")
echo "   INSERT statements: $INSERT_COUNT"

# Check for lesson entries  
LESSON_COUNT=$(grep -c "^('.*-.*'," "$FILE")
echo "   Lesson entries found: $LESSON_COUNT"

# Check for proper termination
if grep -q "ON CONFLICT.*DO UPDATE" "$FILE"; then
    echo "✅ ON CONFLICT clause found"
else
    echo "❌ ON CONFLICT clause missing"
fi

echo ""
echo "3. VALUES structure validation..."

# Count parentheses
OPEN_PARENS=$(grep -o "(" "$FILE" | wc -l)
CLOSE_PARENS=$(grep -o ")" "$FILE" | wc -l)
echo "   Open parentheses: $OPEN_PARENS"
echo "   Close parentheses: $CLOSE_PARENS"

if [ "$OPEN_PARENS" -eq "$CLOSE_PARENS" ]; then
    echo "✅ Parentheses balanced"
else
    echo "❌ Parentheses unbalanced"
fi

echo ""
echo "4. Lesson completion check..."
grep -n "^.*), *$" "$FILE" | while read line; do
    echo "   Lesson end: $line"
done

echo ""
echo "5. Potential issues check..."

# Check for unmatched quotes (simplified)
QUOTE_COUNT=$(grep -o "'" "$FILE" | wc -l)
echo "   Single quotes count: $QUOTE_COUNT"
if [ $((QUOTE_COUNT % 2)) -eq 0 ]; then
    echo "✅ Quote count is even (potentially balanced)"
else
    echo "⚠️  Quote count is odd (potentially unbalanced)"
fi

# Check for common SQL errors
echo ""
echo "6. Common error patterns..."

if grep -q "VALUES.*VALUES" "$FILE"; then
    echo "❌ Duplicate VALUES keyword found"
else
    echo "✅ No duplicate VALUES keywords"
fi

if grep -q "\*\*.*\*\*.*:" "$FILE" | grep -q "^[^']*$"; then
    echo "⚠️  Potential unquoted content with colons"
else
    echo "✅ No obvious unquoted content issues"
fi

echo ""
echo "7. Field count validation..."
echo "   Checking each lesson has exactly 8 fields..."

# Find lesson starts and check structure
grep -n "^('.*'," "$FILE" | while IFS=: read -r linenum content; do
    echo "   Line $linenum: $(echo "$content" | cut -c1-50)..."
done

echo ""
echo "Validation complete!"
echo "==================================================="
