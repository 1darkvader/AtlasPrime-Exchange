import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { getBatchPrices } from '@/lib/priceService';

export async function GET(request: Request) {
  try {
    // Get auth token from cookies or Authorization header
    const cookieStore = await cookies();
    let token = cookieStore.get('auth_token')?.value;

    // Try Authorization header if no cookie
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      console.log('❌ No token found in cookies or Authorization header');
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

    // Get real-time prices for all assets
    const symbols = wallets
      .filter(w => w.asset !== 'USDT' && w.asset !== 'USDC' && w.asset !== 'BUSD')
      .map(w => `${w.asset}USDT`);

    console.log(`📊 Fetching prices for user wallets: ${symbols.join(', ')}`);
    const prices = await getBatchPrices(symbols);
    console.log(`✅ Got prices:`, prices);
    console.log(`✅ Got prices:`, prices);

    // Calculate USD values with real-time prices
    const walletsWithUSD = wallets.map((w: { asset: string; balance: any; lockedBalance: any }) => {
      const balance = parseFloat(w.balance.toString());
      const lockedBalance = parseFloat(w.lockedBalance.toString());
      const available = balance - lockedBalance;

      let usdValue = balance;
      let availableUSD = available;

      // Get USD value based on asset type
      if (w.asset === 'USDT' || w.asset === 'USDC' || w.asset === 'BUSD') {
        usdValue = balance;
        availableUSD = available;
      } else {
        const priceKey = `${w.asset}USDT`;
        const price = prices[priceKey] || 0;
        usdValue = balance * price;
        availableUSD = available * price;

        // Debug logging for user wallets
        console.log(`💵 User wallet: ${w.asset} | Balance: ${balance} | Price: ${price} | USD: ${usdValue.toLocaleString()}`);
      }

      return {
        asset: w.asset,
        balance: w.balance.toString(),
        lockedBalance: w.lockedBalance.toString(),
        available: available.toString(),
        usdValue,
        availableUSD,
      };
    });

    // Calculate total USD value
    const totalUSD = walletsWithUSD.reduce((sum, w) => sum + w.usdValue, 0);
    const totalAvailableUSD = walletsWithUSD.reduce((sum, w) => sum + w.availableUSD, 0);

    return NextResponse.json({
      success: true,
      wallets: walletsWithUSD,
      summary: {
        totalUSD,
        totalAvailableUSD,
        walletsCount: wallets.length,
      },
      prices, // Include current prices for reference
    });
  } catch (error: any) {
    console.error('Wallet fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallets', details: error.message },
      { status: 500 }
    );
  }
}
