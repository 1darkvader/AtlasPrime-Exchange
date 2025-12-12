import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth-middleware';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required. Please login as admin.' },
        { status: 401 }
      );
    }

    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Get table counts
    const [
      userCount,
      walletCount,
      orderCount,
      transactionCount,
      stockPortfolioCount,
      stockWatchlistCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.wallet.count(),
      prisma.order.count(),
      prisma.transaction.count(),
      prisma.stockPortfolio.count().catch(() => 0), // May not exist yet
      prisma.stockWatchlist.count().catch(() => 0), // May not exist yet
    ]);

    return NextResponse.json({
      success: true,
      connected: true,
      timestamp: new Date().toISOString(),
      tables: {
        users: userCount,
        wallets: walletCount,
        orders: orderCount,
        transactions: transactionCount,
        stockPortfolio: stockPortfolioCount,
        stockWatchlist: stockWatchlistCount,
      },
    });
  } catch (error: any) {
    console.error('Database status error:', error);

    return NextResponse.json(
      {
        success: false,
        connected: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
