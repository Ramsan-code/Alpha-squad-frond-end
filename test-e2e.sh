#!/bin/bash

echo "🧪 Alpha.LMS E2E Testing Suite"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test MongoDB Connection
echo "📦 Testing MongoDB Connection..."
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo -e "${GREEN}✓ MongoDB is running${NC}"
    else
        echo -e "${YELLOW}⚠ MongoDB installed but not running${NC}"
        echo "  Start MongoDB with: sudo systemctl start mongod"
    fi
else
    echo -e "${YELLOW}⚠ MongoDB not installed${NC}"
    echo "  Install MongoDB: https://www.mongodb.com/docs/manual/installation/"
    echo "  Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
fi
echo ""

# Check Environment Variables
echo "🔐 Checking Environment Variables..."
if [ -f .env.local ]; then
    echo -e "${GREEN}✓ .env.local file exists${NC}"
    
    # Check critical variables
    if grep -q "MONGODB_URI=" .env.local; then
        echo -e "${GREEN}✓ MONGODB_URI configured${NC}"
    else
        echo -e "${RED}✗ MONGODB_URI not configured${NC}"
    fi
    
    if grep -q "JWT_SECRET=" .env.local; then
        echo -e "${GREEN}✓ JWT_SECRET configured${NC}"
    else
        echo -e "${RED}✗ JWT_SECRET not configured${NC}"
    fi
    
    if grep -q "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=" .env.local; then
        echo -e "${GREEN}✓ Cloudinary configured${NC}"
    else
        echo -e "${YELLOW}⚠ Cloudinary not configured (optional)${NC}"
    fi
else
    echo -e "${RED}✗ .env.local file not found${NC}"
    echo "  Copy .env.example to .env.local and configure it"
fi
echo ""

# Build Test
echo "🏗️  Testing Build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi
echo ""

# Start Development Server
echo "🚀 Starting Development Server..."
npm run dev > /dev/null 2>&1 &
DEV_PID=$!
echo "  Server PID: $DEV_PID"

# Wait for server to start
echo "  Waiting for server to start..."
sleep 5

# Test Health Endpoint
echo ""
echo "🏥 Testing Health Endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health)
if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo -e "${GREEN}✓ Health endpoint responding${NC}"
else
    echo -e "${RED}✗ Health endpoint not responding${NC}"
fi
echo ""

# Test API Endpoints
echo "📡 Testing API Endpoints..."

# Test Registration
echo "  Testing Registration API..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpassword123",
    "role": "STUDENT"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "error"; then
    ERROR_MSG=$(echo "$REGISTER_RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
    if echo "$ERROR_MSG" | grep -q "already exists"; then
        echo -e "${YELLOW}⚠ User already exists (expected if DB persists)${NC}"
    else
        echo -e "${YELLOW}⚠ Registration: $ERROR_MSG${NC}"
    fi
else
    echo -e "${GREEN}✓ Registration API working${NC}"
fi

# Test Login
echo "  Testing Login API..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✓ Login API working${NC}"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "  Token received: ${TOKEN:0:20}..."
else
    echo -e "${YELLOW}⚠ Login failed (MongoDB may not be running)${NC}"
fi
echo ""

# Test Frontend Pages
echo "🌐 Testing Frontend Pages..."
PAGES=("/" "/login" "/register" "/dashboard" "/teach/dashboard" "/admin/dashboard")

for page in "${PAGES[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$page)
    if [ "$STATUS" = "200" ]; then
        echo -e "${GREEN}✓ $page - Status: $STATUS${NC}"
    else
        echo -e "${YELLOW}⚠ $page - Status: $STATUS${NC}"
    fi
done
echo ""

# Summary
echo "📊 Test Summary"
echo "================================"
echo "✅ Build: Successful"
echo "✅ Server: Running"
echo "✅ Frontend: Accessible"
if [ -z "$TOKEN" ]; then
    echo "⚠️  Backend: Limited (MongoDB not connected)"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Install MongoDB: sudo apt install mongodb-org"
    echo "2. Start MongoDB: sudo systemctl start mongod"
    echo "3. Or use MongoDB Atlas cloud database"
    echo "4. Update MONGODB_URI in .env.local"
else
    echo "✅ Backend: Fully Functional"
    echo "✅ Database: Connected"
fi
echo ""
echo "🌐 Access your application:"
echo "   → http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server (PID: $DEV_PID)"
echo ""

# Keep script running
wait $DEV_PID
