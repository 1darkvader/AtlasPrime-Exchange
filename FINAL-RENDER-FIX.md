# Final Fix for Render - Just 4 Commands

The issue is missing dotenv package. Run these commands:

## 1. Install dotenv
```bash
npm install dotenv
```

## 2. Install latest Prisma
```bash
npm i prisma@latest @prisma/client@latest
```

## 3. Generate Prisma Client
```bash
npx prisma generate
```

## 4. Seed Bots
```bash
node scripts/seed-bots.js
```

You should see:
```
 Created/Updated bot: Grid Trading Pro
 Created/Updated bot: DCA Accumulator
...
 Trading bots seeded successfully!
```

Then visit: https://atlasprime-exchange.onrender.com/bot
