import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to verify JWT and get user
async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        wallets: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}

// POST /api/bots/activate - Activate a bot for user
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      botId,
      investedAmount,
      tradingPair,
      takeProfitPercent,
      stopLossPercent,
    } = body;

    // Validate required fields
    if (!botId || !investedAmount || !tradingPair) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const investedAmountNum = parseFloat(investedAmount);

    if (investedAmountNum <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid investment amount' },
        { status: 400 }
      );
    }

    // Get bot details
    const bot = await prisma.tradingBot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      return NextResponse.json(
        { success: false, message: 'Bot not found' },
        { status: 404 }
      );
    }

    // Validate investment amount
    const minInvestment = parseFloat(bot.minInvestment.toString());
    const maxInvestment = parseFloat(bot.maxInvestment.toString());

    if (investedAmountNum < minInvestment || investedAmountNum > maxInvestment) {
      return NextResponse.json(
        {
          success: false,
          message: `Investment amount must be between $${minInvestment} and $${maxInvestment}`,
        },
        { status: 400 }
      );
    }

    // Check if trading pair is supported
    if (!bot.supportedPairs.includes(tradingPair)) {
      return NextResponse.json(
        { success: false, message: 'Trading pair not supported by this bot' },
        { status: 400 }
      );
    }

    // Check user has enough stablecoin balance (USDT/USDC/BUSD)
    const stableAssets = ['USDT', 'USDC', 'BUSD'] as const;
    const stableWallets = user.wallets.filter((w) => stableAssets.includes(w.asset as any));

    const walletsAvailableMap = stableWallets.map((w) => ({
      asset: w.asset,
      available: parseFloat(w.balance.toString()) - parseFloat(w.lockedBalance.toString()),
      id: w.id,
    }));

    const totalStableAvailable = walletsAvailableMap.reduce((sum, w) => sum + w.available, 0);

    if (totalStableAvailable < investedAmountNum) {
      return NextResponse.json(
        {
          success: false,
          message: `Insufficient stablecoin balance (USDT/USDC/BUSD). Required: $${investedAmountNum}, Available: $${totalStableAvailable.toFixed(2)}`,
        },
        { status: 400 }
      );
    }

    // Choose the wallet to lock from: prefer USDT, then USDC, then BUSD
    const preferredOrder = ['USDT', 'USDC', 'BUSD'];
    const chosenWallet = preferredOrder
      .map((asset) => walletsAvailableMap.find((w) => w.asset === asset && w.available >= investedAmountNum))
      .find(Boolean) || walletsAvailableMap.find((w) => w.available >= investedAmountNum);

    if (!chosenWallet) {
      return NextResponse.json(
        { success: false, message: 'Unable to allocate funds from stablecoin wallets.' },
        { status: 400 }
      );
    }

    // Create user bot and lock funds in transaction from chosen asset
    const userBot = await prisma.$transaction(async (tx) => {
      // Lock the invested amount in the chosen stablecoin wallet
      await tx.wallet.update({
        where: { id: chosenWallet.id },
        data: {
          lockedBalance: {
            increment: investedAmountNum,
          },
        },
      });

      // Create user bot
      const newUserBot = await tx.userBot.create({
        data: {
          userId: user.id,
          botId: bot.id,
          investedAmount: investedAmountNum,
          currentValue: investedAmountNum, // Initial value = invested amount
          totalProfit: 0,
          profitPercent: 0,
          tradingPair,
          takeProfitPercent: takeProfitPercent ? parseFloat(takeProfitPercent) : null,
          stopLossPercent: stopLossPercent ? parseFloat(stopLossPercent) : null,
          status: 'ACTIVE',
          isActive: true,
        },
        include: {
          bot: true,
        },
      });

      // Increment bot's total users count
      await tx.tradingBot.update({
        where: { id: bot.id },
        data: {
          totalUsers: {
            increment: 1,
          },
        },
      });

      return newUserBot;
    });

    console.log(`✅ Bot activated: ${bot.name} for user ${user.username}, amount: $${investedAmountNum} from ${chosenWallet.asset}`);

    return NextResponse.json({
      success: true,
      message: 'Bot activated successfully',
      userBot,
    }, { status: 201 });
  } catch (error) {
    console.error('Activate bot error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to activate bot' },
      { status: 500 }
    );
  }
}
