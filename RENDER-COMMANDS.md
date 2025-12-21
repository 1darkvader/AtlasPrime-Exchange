# Render Server Setup - Simple Instructions

After pushing to GitHub, SSH into your Render server and run these commands:

## Step 1: Install dotenv (required for Prisma config)
```bash
npm install dotenv
```

## Step 2: Update Prisma Packages
```bash
npm i prisma@latest @prisma/client@latest
```

## Step 3: Generate Prisma Client
```bash
npx prisma generate
```

## Step 4: Run Seed Script
```bash
node scripts/seed-bots.js
```

## Step 5: Verify
You should see:
```
🤖 Seeding trading bots...
✅ Created/Updated bot: Grid Trading Pro
✅ Created/Updated bot: DCA Accumulator
✅ Created/Updated bot: Momentum Scalper
✅ Created/Updated bot: Mean Reversion Master
✅ Created/Updated bot: Trend Rider Elite
✅ Created/Updated bot: Arbitrage Hunter
✅ Created/Updated bot: Breakout Warrior
✅ Created/Updated bot: AI Neural Network
✅ Created/Updated bot: Options Hedge Fund
✅ Created/Updated bot: Flash Crash Sniper
✅ Trading bots seeded successfully!
📊 Total bots: 10
```

## Done!
Now visit: https://atlasprime-exchange.onrender.com/bot

The bot marketplace should show all 10 trading bots!
