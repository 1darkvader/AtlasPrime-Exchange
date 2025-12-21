# Quick Fix for Seed Script

The issue is the Prisma client import. After upgrading Prisma, regenerate the client:

```bash
npx prisma generate
```

Then try the seed again:
```bash
node --loader ts-node/esm scripts/seed-bots.ts
```

OR create a simple Node.js version:
```bash
cat > scripts/seed-bots-simple.js << 'SCRIPT'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tradingBots = [
  {
    name: "Grid Trading Pro",
    description: "Advanced grid trading strategy that profits from market volatility by placing buy and sell orders at predetermined intervals",
    strategy: "Places multiple limit orders above and below current price in a grid pattern. Profits from price oscillations without predicting direction. Ideal for ranging markets.",
    riskLevel: "LOW",
    winRate: 78.5,
    totalUsers: 1247,
    avgMonthlyReturn: 12.3,
    minInvestment: 100,
    maxInvestment: 50000,
    supportedPairs: ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"],
  },
  {
    name: "DCA Accumulator",
    description: "Dollar Cost Averaging strategy that systematically buys assets at regular intervals, reducing the impact of volatility",
    strategy: "Automatically purchases fixed amounts at scheduled intervals (daily/weekly). Reduces timing risk and averages entry price. Best for long-term accumulation.",
    riskLevel: "LOW",
    winRate: 82.1,
    totalUsers: 2156,
    avgMonthlyReturn: 8.7,
    minInvestment: 50,
    maxInvestment: 100000,
    supportedPairs: ["BTCUSDT", "ETHUSDT"],
  },
  {
    name: "Momentum Scalper",
    description: "High-frequency trading bot that capitalizes on short-term price momentum and market inefficiencies",
    strategy: "Identifies strong momentum candles and executes rapid trades. Uses RSI and MACD indicators for entry/exit signals. Targets 0.5-2% per trade.",
    riskLevel: "MEDIUM",
    winRate: 71.3,
    totalUsers: 892,
    avgMonthlyReturn: 18.5,
    minInvestment: 500,
    maxInvestment: 25000,
    supportedPairs: ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "ADAUSDT"],
  },
  {
    name: "Mean Reversion Master",
    description: "Statistical arbitrage bot that profits from price deviations returning to their historical average",
    strategy: "Monitors Bollinger Bands and standard deviations. Buys oversold conditions, sells overbought. Profits from market reversion to mean.",
    riskLevel: "MEDIUM",
    winRate: 75.8,
    totalUsers: 1534,
    avgMonthlyReturn: 15.2,
    minInvestment: 300,
    maxInvestment: 75000,
    supportedPairs: ["BTCUSDT", "ETHUSDT", "BNBUSDT", "XRPUSDT"],
  },
  {
    name: "Trend Rider Elite",
    description: "Advanced trend-following bot that identifies and rides strong market trends using multi-timeframe analysis",
    strategy: "Analyzes EMA crossovers on multiple timeframes. Enters on confirmed trends, exits on reversals. Maximizes gains during trending markets.",
    riskLevel: "MEDIUM",
    winRate: 68.4,
    totalUsers: 756,
    avgMonthlyReturn: 22.1,
    minInvestment: 1000,
    maxInvestment: 100000,
    supportedPairs: ["BTCUSDT", "ETHUSDT", "SOLUSDT"],
  },
  {
    name: "Arbitrage Hunter",
    description: "Cross-exchange arbitrage bot that exploits price differences between multiple trading pairs and platforms",
    strategy: "Monitors price discrepancies across pairs. Executes simultaneous buy/sell orders to capture spread. Low risk, consistent profits.",
    riskLevel: "LOW",
    winRate: 91.2,
    totalUsers: 3421,
    avgMonthlyReturn: 6.8,
    minInvestment: 1000,
    maxInvestment: 200000,
    supportedPairs: ["BTCUSDT", "ETHUSDT", "BNBUSDT", "XRPUSDT", "ADAUSDT", "DOGEUSDT"],
  },
  {
    name: "Breakout Warrior",
    description: "Volatile market bot that captures explosive price movements following key support/resistance breakouts",
    strategy: "Identifies consolidation patterns and key levels. Enters on confirmed breakouts with strong volume. Targets 5-15% moves.",
    riskLevel: "HIGH",
    winRate: 64.7,
    totalUsers: 423,
    avgMonthlyReturn: 31.5,
    minInvestment: 2000,
    maxInvestment: 50000,
    supportedPairs: ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"],
  },
  {
    name: "AI Neural Network",
    description: "Machine learning-powered bot using neural networks trained on historical data to predict price movements",
    strategy: "Deep learning model analyzes 100+ indicators and patterns. Adapts to market conditions. Continuously learns from new data.",
    riskLevel: "HIGH",
    winRate: 73.9,
    totalUsers: 1089,
    avgMonthlyReturn: 27.3,
    minInvestment: 5000,
    maxInvestment: 500000,
    supportedPairs: ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"],
  },
  {
    name: "Options Hedge Fund",
    description: "Sophisticated options strategy bot that uses derivatives to hedge positions and maximize risk-adjusted returns",
    strategy: "Combines spot and options positions. Delta-neutral strategies, iron condors, and spreads. Professional-grade risk management.",
    riskLevel: "MEDIUM",
    winRate: 79.6,
    totalUsers: 612,
    avgMonthlyReturn: 19.8,
    minInvestment: 10000,
    maxInvestment: 1000000,
    supportedPairs: ["BTCUSDT", "ETHUSDT"],
  },
  {
    name: "Flash Crash Sniper",
    description: "Opportunistic bot that capitalizes on sudden market crashes and extreme price wicks for rapid profits",
    strategy: "Monitors for flash crashes and liquidation cascades. Places limit orders at extreme deviations. Captures rebounds for 10-50% gains.",
    riskLevel: "HIGH",
    winRate: 58.3,
    totalUsers: 287,
    avgMonthlyReturn: 45.7,
    minInvestment: 5000,
    maxInvestment: 100000,
    supportedPairs: ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"],
  },
];

async function main() {
  console.log('🤖 Seeding trading bots...');

  for (const botData of tradingBots) {
    const bot = await prisma.tradingBot.upsert({
      where: { name: botData.name },
      update: botData,
      create: botData,
    });
    console.log(`✅ Created/Updated bot: ${bot.name}`);
  }

  console.log('✅ Trading bots seeded successfully!');
  console.log(`📊 Total bots: ${tradingBots.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding bots:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
SCRIPT

node scripts/seed-bots-simple.js
```
