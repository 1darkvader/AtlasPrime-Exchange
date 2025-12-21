# Render Setup Instructions for Bot Trading System

## Step 1: SSH into Render Server
```bash
# Already done - you're connected
```

## Step 2: Navigate to Project Directory
```bash
cd ~/project/src
```

## Step 3: Generate Prisma Client
```bash
npx prisma generate
```

## Step 4: Push Database Schema
```bash
npx prisma db push
```

When prompted "Do you want to continue? All data will be lost", type **y** and press Enter.

## Step 5: Seed Trading Bots
```bash
bun run scripts/seed-bots.ts
```

OR if that fails:
```bash
node -r esbuild-register scripts/seed-bots.ts
```

OR compile and run:
```bash
npx tsx scripts/seed-bots.ts
```

## Expected Output:
```
 Created/Updated bot: Grid Trading Pro
 Created/Updated bot: DCA Accumulator
 Created/Updated bot: Momentum Scalper
 Created/Updated bot: Mean Reversion Master
 Created/Updated bot: Trend Rider Elite
 Created/Updated bot: Arbitrage Hunter
 Created/Updated bot: Breakout Warrior
 Created/Updated bot: AI Neural Network
 Created/Updated bot: Options Hedge Fund
 Created/Updated bot: Flash Crash Sniper
 Trading bots seeded successfully!
```

## Troubleshooting:

If you get "bunx: command not found", use `npx` instead:
```bash
npx prisma generate
npx prisma db push
```

If seed script fails with Prisma errors, try:
```bash
cd ~/project/src
npx prisma generate
bun run scripts/seed-bots.ts
```

## Verify Bots Were Created:
```bash
# Connect to database and check
npx prisma studio
```

Or query directly:
```sql
SELECT name, "riskLevel", "winRate", "totalUsers" FROM "TradingBot";
```

## After Setup:
1. Restart Render service (optional)
2. Visit https://atlasprime-exchange.onrender.com/bot
3. Login and test bot activation
4. Login as admin and test profit addition at /admin/bots
