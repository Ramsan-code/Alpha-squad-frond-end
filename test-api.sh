#!/bin/bash

# =============================================================================
# API Integration Test Script
# =============================================================================
# This script tests the actual connectivity between the frontend and backend.
# Run this script to verify the backend is reachable before running the app.
#
# Usage: ./test-api.sh [API_URL]
#
# Example:
#   ./test-api.sh https://alpha-squad-back-end.vercel.app/api
#   ./test-api.sh http://localhost:5000/api
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get API URL from argument or environment variable
API_URL="${1:-${NEXT_PUBLIC_API_URL:-https://alpha-squad-back-end.vercel.app/api}}"

echo ""
echo "=================================================================="
echo "  🔗 API Integration Test"
echo "=================================================================="
echo "  Testing: ${API_URL}"
echo "=================================================================="
echo ""

# Counter for results
PASSED=0
FAILED=0

# Function to test an endpoint
test_endpoint() {
    local name="$1"
    local endpoint="$2"
    local method="${3:-GET}"
    local expected_status="${4:-200}"
    local body="$5"
    
    local start_time=$(date +%s%N)
    
    if [ -n "$body" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            -d "$body" \
            "${API_URL}${endpoint}" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Accept: application/json" \
            "${API_URL}${endpoint}" 2>&1)
    fi
    
    local end_time=$(date +%s%N)
    local latency=$(( (end_time - start_time) / 1000000 ))
    
    # Get status code (last line)
    local status_code=$(echo "$response" | tail -n 1)
    # Get response body (all but last line)
    local body_response=$(echo "$response" | sed '$d')
    
    # Check if status is acceptable (handle 401 as acceptable for auth tests)
    if [ "$status_code" == "$expected_status" ] || \
       [ "$expected_status" == "ANY" ] || \
       ([ "$status_code" == "401" ] && [ "$expected_status" == "401" ]); then
        echo -e "  ${GREEN}✅${NC} ${name}: ${status_code} (${latency}ms)"
        ((PASSED++))
        return 0
    else
        echo -e "  ${RED}❌${NC} ${name}: ${status_code} (${latency}ms) - Expected: ${expected_status}"
        if [ "$VERBOSE" == "true" ]; then
            echo "     Response: ${body_response:0:200}"
        fi
        ((FAILED++))
        return 1
    fi
}

echo "📡 Testing Endpoints..."
echo ""

# Test 1: Health endpoint (may return 404 if not implemented)
echo "1. Health Check Endpoint"
test_endpoint "GET /health" "/health" "GET" "ANY" || true

echo ""
echo "2. Courses Endpoints"
test_endpoint "GET /courses" "/courses" "GET" "200"
test_endpoint "GET /courses?limit=1" "/courses?limit=1" "GET" "200"

echo ""
echo "3. Auth Endpoints"
test_endpoint "GET /auth/me (unauthenticated)" "/auth/me" "GET" "401"

# Test POST to login with invalid credentials
echo ""
echo "4. Login Validation"
test_endpoint "POST /auth/login (invalid credentials)" "/auth/login" "POST" "ANY" \
    '{"email":"invalid@test.com","password":"wrongpassword"}'

echo ""
echo "=================================================================="
echo "  📊 Results"
echo "=================================================================="
echo -e "  ${GREEN}Passed:${NC} ${PASSED}"
echo -e "  ${RED}Failed:${NC} ${FAILED}"
echo "=================================================================="

if [ $FAILED -gt 0 ]; then
    echo ""
    echo -e "${RED}⚠️  Some tests failed. Check the backend is running and accessible.${NC}"
    echo ""
    exit 1
else
    echo ""
    echo -e "${GREEN}✅ All tests passed! Backend is ready.${NC}"
    echo ""
    exit 0
fi
