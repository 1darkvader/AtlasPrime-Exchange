import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Verify admin access
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required. Please login as admin.' },
        { status: 401 }
      );
    }

    // Get total users
    const totalUsers = await prisma.user.count();

    // Get pending KYC count
    const pendingKYC = await prisma.kYCDocument.count({
      where: { status: 'PENDING' }
    });

    // Get new users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await prisma.user.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });

    // Get active trades
    const activeTrades = await prisma.order.count({
      where: {
        status: {
          in: ['OPEN', 'PARTIALLY_FILLED']
        }
      }
    });

    // Get completed transactions today
    const completedTransactions = await prisma.transaction.count({
      where: {
        status: 'COMPLETED',
        completedAt: {
          gte: today
        }
      }
    });

    // Get today's volume (sum of completed transactions)
    const todayTransactions = await prisma.transaction.findMany({
      where: {
        status: 'COMPLETED',
        completedAt: {
          gte: today
        },
        asset: 'USDT'
      }
    });

    const todayVolume = todayTransactions.reduce((sum: number, tx: any) => {
      return sum + Number(tx.amount);
    }, 0);

    return NextResponse.json({
      totalUsers,
      pendingKYC,
      newUsersToday,
      activeTrades,
      completedTransactions,
      todayVolume: Math.round(todayVolume)
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 401 }
    );
  }
}
