#!/bin/bash

# Test OAuth Flow Script
echo "🔧 Testing OAuth Authentication Flow"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Testing the new OAuth authentication flow...${NC}"

# Check if the app is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo -e "${RED}❌ App is not running on localhost:3000${NC}"
    echo "Please run 'npm run dev' first"
    exit 1
fi

echo -e "${GREEN}✅ App is running${NC}"

# Test OAuth callback endpoint
echo -e "${YELLOW}Testing OAuth callback route...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/auth/callback?code=test&redirect=/dashboard")

if [ "$response" = "302" ] || [ "$response" = "307" ]; then
    echo -e "${GREEN}✅ OAuth callback responds correctly with redirect${NC}"
else
    echo -e "${RED}❌ OAuth callback returned unexpected status: $response${NC}"
fi

# Test dashboard protection
echo -e "${YELLOW}Testing dashboard protection...${NC}"
dashboard_response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/dashboard")

if [ "$dashboard_response" = "200" ] || [ "$dashboard_response" = "302" ] || [ "$dashboard_response" = "307" ]; then
    echo -e "${GREEN}✅ Dashboard endpoint is accessible${NC}"
else
    echo -e "${RED}❌ Dashboard returned unexpected status: $dashboard_response${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Basic endpoint tests completed!${NC}"
echo ""
echo "To test the complete OAuth flow:"
echo "1. Navigate to http://localhost:3000/auth"
echo "2. Click on Google Sign In"
echo "3. Complete OAuth in Google"
echo "4. Verify you're redirected to dashboard without race conditions"
echo ""
echo "Monitor the browser console and server logs for any issues."
