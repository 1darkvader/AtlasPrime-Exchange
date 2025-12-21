import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth-middleware';

// GET /api/admin/bots/user-bots - Get all user bots for admin management
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const botId = searchParams.get('botId');

    // Build query filters
    const where: any = {};

    if (status) {
      where.status = status.toUpperCase();
    }

    if (userId) {
      where.userId = userId;
    }

    if (botId) {
      where.botId = botId;
    }

    const userBotsRaw = await prisma.userBot.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        bot: true,
        trades: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Latest 5 trades
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

    // Calculate summary stats
    const totalInvested = userBots.reduce(
      (sum, bot) => sum + (bot.investedAmount ?? 0),
      0
    );

    const totalCurrentValue = userBots.reduce(
      (sum, bot) => sum + (bot.currentValue ?? 0),
      0
    );

    const totalProfit = userBots.reduce(
      (sum, bot) => sum + (bot.totalProfit ?? 0),
      0
    );

    const activeBotsCount = userBots.filter(bot => bot.isActive).length;

    return NextResponse.json({
      success: true,
      userBots,
      summary: {
        totalInvested,
        totalCurrentValue,
        totalProfit,
        activeBotsCount,
        totalBotsCount: userBots.length,
      },
    });
  } catch (error) {
    console.error('Get user bots error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user bots' },
      { status: 500 }
    );
  }
}
