#!/bin/bash

echo "🤖 Bot Seeding Script for Render"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this from the project root."
  exit 1
fi

# Install dotenv if not already installed
echo "📦 Installing dependencies..."
npm install dotenv --save

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run the seed script
echo "🌱 Seeding trading bots..."
node scripts/seed-bots.js

echo ""
echo "✅ Done! Check the output above for any errors."
