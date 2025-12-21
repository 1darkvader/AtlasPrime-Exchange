#!/bin/bash

echo "🔧 Fixing Prisma versions..."

# Update both Prisma packages to match
npm i prisma@latest @prisma/client@latest

echo "✨ Generating Prisma Client..."
npx prisma generate

echo "🤖 Seeding trading bots..."
node scripts/seed-bots.js

echo "✅ Done!"
