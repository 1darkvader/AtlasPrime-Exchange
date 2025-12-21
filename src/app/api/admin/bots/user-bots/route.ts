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

    const userBots = await prisma.userBot.findMany({
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

    // Calculate summary stats
    const totalInvested = userBots.reduce(
      (sum, bot) => sum + parseFloat(bot.investedAmount.toString()),
      0
    );

    const totalCurrentValue = userBots.reduce(
      (sum, bot) => sum + parseFloat(bot.currentValue.toString()),
      0
    );

    const totalProfit = userBots.reduce(
      (sum, bot) => sum + parseFloat(bot.totalProfit.toString()),
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
