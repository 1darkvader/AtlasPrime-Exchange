import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth-middleware';
import { getBatchPrices, getUSDValue } from '@/lib/priceService';

export async function GET() {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    // Fetch all admin wallets
    const adminWallets = await prisma.adminWallet.findMany({
      orderBy: {
        asset: 'asc',
      },
    });

    // Get real-time prices for all assets
    const symbols = adminWallets
      .filter(w => w.asset !== 'USDT' && w.asset !== 'USDC' && w.asset !== 'BUSD')
      .map(w => `${w.asset}USDT`);

    const prices = await getBatchPrices(symbols);

    // Calculate USD values with real-time prices
    const walletsWithUSD = await Promise.all(
      adminWallets.map(async (wallet) => {
        const balance = parseFloat(wallet.balance.toString());
        let usdValue = balance;

        // Get USD value based on asset type
        if (wallet.asset === 'USDT' || wallet.asset === 'USDC' || wallet.asset === 'BUSD') {
          usdValue = balance;
        } else {
          const price = prices[`${wallet.asset}USDT`] || 0;
          usdValue = balance * price;
        }

        return {
          asset: wallet.asset,
          balance: wallet.balance.toString(),
          balanceNum: balance,
          usdValue,
          totalDeposits: wallet.totalDeposits.toString(),
          totalWithdrawals: wallet.totalWithdrawals.toString(),
          updatedAt: wallet.updatedAt,
        };
      })
    );

    // Calculate summary with real USD values
    const totalBalance = walletsWithUSD.reduce((sum, w) => sum + w.usdValue, 0);
    const totalDeposits = walletsWithUSD.reduce(
      (sum, w) => sum + parseFloat(w.totalDeposits),
      0
    );
    const totalWithdrawals = walletsWithUSD.reduce(
      (sum, w) => sum + parseFloat(w.totalWithdrawals),
      0
    );

    return NextResponse.json({
      success: true,
      wallets: walletsWithUSD,
      summary: {
        totalBalance,
        totalDeposits,
        totalWithdrawals,
        assetsCount: adminWallets.length,
        netFlow: totalDeposits - totalWithdrawals,
      },
      prices, // Include current prices for reference
    });
  } catch (error: any) {
    console.error('Admin wallet fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch admin wallets', details: error.message },
      { status: 500 }
    );
  }
}
