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
    });

    return user;
  } catch (error) {
    return null;
  }
}

// GET /api/bots/user - Get user's activated bots
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userBotsRaw = await prisma.userBot.findMany({
      where: {
        userId: user.id,
      },
      include: {
        bot: true,
        trades: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Latest 10 trades per bot
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const userBots = userBotsRaw.map((ub: any) => ({
      ...ub,
      investedAmount: parseFloat(ub.investedAmount?.toString() ?? '0'),
      currentValue: parseFloat(ub.currentValue?.toString() ?? '0'),
      totalProfit: parseFloat(ub.totalProfit?.toString() ?? '0'),
      profitPercent: parseFloat(ub.profitPercent?.toString() ?? '0'),
      trades: (ub.trades ?? []).map((t: any) => ({
        ...t,
        entryPrice: parseFloat(t.entryPrice?.toString() ?? '0'),
        exitPrice: t.exitPrice != null ? parseFloat(t.exitPrice?.toString() ?? '0') : null,
        amount: parseFloat(t.amount?.toString() ?? '0'),
        profit: parseFloat(t.profit?.toString() ?? '0'),
        profitPercent: parseFloat(t.profitPercent?.toString() ?? '0'),
      })),
      bot: ub.bot ? {
        ...ub.bot,
        winRate: parseFloat(ub.bot.winRate?.toString() ?? '0'),
        avgMonthlyReturn: parseFloat(ub.bot.avgMonthlyReturn?.toString() ?? '0'),
        minInvestment: parseFloat(ub.bot.minInvestment?.toString() ?? '0'),
        maxInvestment: parseFloat(ub.bot.maxInvestment?.toString() ?? '0'),
      } : ub.bot,
    }));

    return NextResponse.json({
      success: true,
      userBots,
    });
  } catch (error) {
    console.error('Get user bots error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user bots' },
      { status: 500 }
    );
  }
}
