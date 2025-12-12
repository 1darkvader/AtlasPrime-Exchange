import { NextResponse } from 'next/server';
import { cmcAPI } from '@/lib/api/coinmarketcap';

export async function GET() {
  try {
    // Get top 20 cryptocurrencies
    const prices = await cmcAPI.getLatestListings(20);

    return NextResponse.json({
      success: true,
      data: prices,
    });
  } catch (error) {
    console.error('Prices API error:', error);

    // Return fallback data if CMC API fails
    return NextResponse.json({
      success: false,
      data: [
        { symbol: 'BTC', name: 'Bitcoin', price: 91365.79, change24h: 4.14, volume24h: 28500000000, marketCap: 1800000000000, high24h: 92000, low24h: 88000 },
        { symbol: 'ETH', name: 'Ethereum', price: 3020.20, change24h: 2.32, volume24h: 15200000000, marketCap: 362000000000, high24h: 3050, low24h: 2950 },
        { symbol: 'SOL', name: 'Solana', price: 141.98, change24h: 3.6, volume24h: 3400000000, marketCap: 67000000000, high24h: 145, low24h: 137 },
        { symbol: 'BNB', name: 'BNB', price: 623.45, change24h: -1.2, volume24h: 1200000000, marketCap: 93000000000, high24h: 635, low24h: 620 },
        { symbol: 'XRP', name: 'Ripple', price: 2.21, change24h: 1.03, volume24h: 5600000000, marketCap: 125000000000, high24h: 2.25, low24h: 2.18 },
      ],
    });
  }
}

export const revalidate = 60; // Revalidate every 60 seconds
