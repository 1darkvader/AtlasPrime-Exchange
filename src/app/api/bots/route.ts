import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/bots - Get all available trading bots
export async function GET(request: NextRequest) {
  try {
    const bots = await prisma.tradingBot.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        totalUsers: 'desc', // Sort by most popular
      },
    });

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
