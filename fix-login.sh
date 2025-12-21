#!/bin/bash

echo "🔧 AtlasPrime Exchange - Login Fix Script"
echo "=========================================="
echo ""

# Step 1: Regenerate Prisma Client
echo "📦 Step 1/3: Regenerating Prisma Client..."
bunx prisma generate
if [ $? -eq 0 ]; then
    echo "✅ Prisma client regenerated successfully"
else
    echo "❌ Failed to regenerate Prisma client"
    exit 1
fi
echo ""

# Step 2: Seed Admin User
echo "👤 Step 2/3: Creating Admin User in Database..."
bun run seed-admin
if [ $? -eq 0 ]; then
    echo "✅ Admin user created/updated successfully"
else
    echo "❌ Failed to create admin user"
    exit 1
fi
echo ""

# Step 3: Restart Dev Server
echo "🔄 Step 3/3: Restarting Dev Server..."
echo "   Stopping existing server..."
pkill -f "bun run dev" 2>/dev/null
sleep 2

echo "   Starting dev server..."
echo "   Server will run in the background..."
nohup bun run dev > dev-server.log 2>&1 &
sleep 3

# Check if server started
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Dev server started successfully on port 3000"
else
    echo "⚠️  Dev server starting... (may take a few more seconds)"
fi
echo ""

echo "=========================================="
echo "🎉 Login Fix Complete!"
echo "=========================================="
echo ""
echo "📧 Login Credentials:"
echo "   Email: admin@atlasprime.trade"
echo "   Password: Admin@AtlasPrime2024!"
echo ""
echo "⚠️  IMPORTANT: Clear your browser cache before logging in!"
echo ""
echo "Chrome/Edge: Ctrl+Shift+Delete → Clear cookies and cache"
echo "Firefox: Ctrl+Shift+Delete → Clear cookies and cache"
echo "Safari: Cmd+, → Privacy → Remove All"
echo ""
echo "🌐 Then visit: http://localhost:3000/login"
echo ""
echo "📋 Server logs: tail -f dev-server.log"
echo ""
