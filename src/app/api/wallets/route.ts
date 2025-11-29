import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const authResult = await verifyAuth(request);

    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user's wallets
    const wallets = await prisma.wallet.findMany({
      where: {
        userId: authResult.user.id,
      },
      select: {
        asset: true,
        balance: true,
        lockedBalance: true,
      },
    });

    return NextResponse.json({
      success: true,
      wallets: wallets.map(w => ({
        asset: w.asset,
        balance: w.balance.toString(),
        lockedBalance: w.lockedBalance.toString(),
        available: (parseFloat(w.balance.toString()) - parseFloat(w.lockedBalance.toString())).toString(),
      })),
    });
  } catch (error: any) {
    console.error('Wallet fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallets', details: error.message },
      { status: 500 }
    );
  }
}
