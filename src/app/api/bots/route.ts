import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/bots - Get all available trading bots
export async function GET(request: NextRequest) {
  try {
    const botsRaw = await prisma.tradingBot.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        totalUsers: 'desc', // Sort by most popular
      },
    });

    const bots = botsRaw.map((b: any) => ({
      ...b,
      winRate: parseFloat(b.winRate?.toString() ?? '0'),
      avgMonthlyReturn: parseFloat(b.avgMonthlyReturn?.toString() ?? '0'),
      minInvestment: parseFloat(b.minInvestment?.toString() ?? '0'),
      maxInvestment: parseFloat(b.maxInvestment?.toString() ?? '0'),
    }));

    return NextResponse.json({
      success: true,
      bots,
    });
  } catch (error) {
    console.error('Get bots error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bots' },
      { status: 500 }
    );
  }
}
