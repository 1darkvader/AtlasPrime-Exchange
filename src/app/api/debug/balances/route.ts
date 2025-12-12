import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getBatchPrices } from '@/lib/priceService';

/**
 * Debug endpoint to check balances and prices
 * Only for development - remove in production
 */
export async function GET() {
  try {
    // Get all admin wallets
    const adminWallets = await prisma.adminWallet.findMany({
      orderBy: { asset: 'asc' }
    });

    // Get all symbols for price fetching
    const symbols = adminWallets
      .filter(w => w.asset !== 'USDT' && w.asset !== 'USDC' && w.asset !== 'BUSD')
      .map(w => `${w.asset}USDT`);

    console.log('🔍 Fetching prices for:', symbols);

    // Fetch prices
    const prices = await getBatchPrices(symbols);

    console.log('💰 Prices received:', prices);

    // Calculate balances with USD values
    const balances = adminWallets.map(w => {
      const balance = parseFloat(w.balance.toString());
      let usdValue = balance;

      if (w.asset === 'USDT' || w.asset === 'USDC' || w.asset === 'BUSD') {
        usdValue = balance;
      } else {
        const price = prices[`${w.asset}USDT`] || 0;
        usdValue = balance * price;
      }

      return {
        asset: w.asset,
        balance,
        price: prices[`${w.asset}USDT`] || (w.asset === 'USDT' ? 1 : 0),
        usdValue,
      };
    });

    const totalUSD = balances.reduce((sum, b) => sum + b.usdValue, 0);

    return NextResponse.json({
      success: true,
      totalUSD: totalUSD.toLocaleString(),
      totalAssets: adminWallets.length,
      balances,
      prices,
      debug: {
        pricesFetched: Object.keys(prices).length,
        expectedPrices: symbols.length,
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
