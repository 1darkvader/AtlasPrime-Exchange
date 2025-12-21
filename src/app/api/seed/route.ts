import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🌱 Starting database seed...');

    // Hash the password
    const hashedPassword = await bcrypt.hash('Admin@AtlasPrime2024!', 10);

    // Create or update admin user
    const user = await prisma.user.upsert({
      where: { email: 'admin@atlasprime.trade' },
      update: {
        passwordHash: hashedPassword,
        role: 'SUPER_ADMIN',
        emailVerified: true,
        kycStatus: 'VERIFIED',
      },
      create: {
        email: 'admin@atlasprime.trade',
        username: 'admin',
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'SUPER_ADMIN',
        emailVerified: true,
        kycStatus: 'VERIFIED',
      },
    });

    console.log('✅ Admin user created:', user.email);

    // Create wallets with zero balances
    const wallets = [
      { asset: 'USDT', balance: 0 },
      { asset: 'BTC', balance: 0 },
      { asset: 'ETH', balance: 0 },
      { asset: 'BNB', balance: 0 },
      { asset: 'SOL', balance: 0 },
    ];

    for (const wallet of wallets) {
      await prisma.wallet.upsert({
        where: {
          userId_asset: {
            userId: user.id,
            asset: wallet.asset,
          },
        },
        update: {
          balance: wallet.balance,
        },
        create: {
          userId: user.id,
          asset: wallet.asset,
          balance: wallet.balance,
          lockedBalance: 0,
        },
      });
    }

    console.log('✅ Wallets created');

    // Seed trading bots
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

    for (const botData of tradingBots) {
      await prisma.tradingBot.upsert({
        where: { name: botData.name },
        update: botData,
        create: botData,
      });
    }
    console.log('✅ Trading bots seeded');

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      user: {
        email: user.email,
        username: user.username,
        role: user.role,
      },
      botsSeeded: tradingBots.length,
    });
  } catch (error: any) {
    console.error('❌ Seed error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
