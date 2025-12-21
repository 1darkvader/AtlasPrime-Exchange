import { NextRequest, NextResponse } from 'next/server';
import { finnhubAPI } from '@/lib/finnhub';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    const quote = await finnhubAPI.getQuote(symbol);

    if (!quote) {
      return NextResponse.json(
        { error: 'Failed to fetch quote data' },
        { status: 500 }
      );
    }

    // Calculate additional metrics
    const changePercent = quote.pc !== 0 ? ((quote.c - quote.pc) / quote.pc) * 100 : 0;
    const change = quote.c - quote.pc;

    return NextResponse.json({
      success: true,
      symbol,
      quote: {
        price: quote.c,
        high: quote.h,
        low: quote.l,
        open: quote.o,
        previousClose: quote.pc,
        change,
        changePercent,
        timestamp: quote.t,
      },
    });
  } catch (error: unknown) {
    console.error('Stock quote error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
