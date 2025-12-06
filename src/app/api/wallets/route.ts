import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify session and get user
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || new Date(session.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    // Fetch user's wallets
    const wallets = await prisma.wallet.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        asset: true,
        balance: true,
        lockedBalance: true,
      },
    });

    return NextResponse.json({
      success: true,
      wallets: wallets.map((w: { asset: string; balance: any; lockedBalance: any }) => ({
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
