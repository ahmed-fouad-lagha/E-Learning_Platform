#!/bin/bash

# Test script to verify the blue bar removal
echo "Testing if the blue bar has been removed from the homepage..."

# Check if the duplicate navigation is no longer present in page.tsx
if grep -q "Enhanced Navigation" app/page.tsx; then
    echo "❌ ERROR: Navigation still present in page.tsx"
    exit 1
else
    echo "✅ SUCCESS: Duplicate navigation removed from page.tsx"
fi

# Check if the main Header component is still in layout.tsx
if grep -q "<Header />" app/layout.tsx; then
    echo "✅ SUCCESS: Main Header component is still in layout.tsx"
else
    echo "❌ ERROR: Main Header component missing from layout.tsx"
    exit 1
fi

echo "✅ Blue bar removal test completed successfully!"
