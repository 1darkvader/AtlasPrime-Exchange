import { NextRequest, NextResponse } from 'next/server';
import { finnhubAPI } from '@/lib/finnhub';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbols } = body;

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json(
        { error: 'Symbols array is required' },
        { status: 400 }
      );
    }

    if (symbols.length > 20) {
      return NextResponse.json(
        { error: 'Maximum 20 symbols per request' },
        { status: 400 }
      );
    }

    const quotes = await finnhubAPI.getBatchQuotes(symbols);

    // Transform data
    const result: Record<string, {
      price: number;
      change: number;
      changePercent: number;
      high: number;
      low: number;
      open: number;
    }> = {};

    for (const [symbol, quote] of Object.entries(quotes)) {
      const changePercent = quote.pc !== 0 ? ((quote.c - quote.pc) / quote.pc) * 100 : 0;
      const change = quote.c - quote.pc;

      result[symbol] = {
        price: quote.c,
        change,
        changePercent,
        high: quote.h,
        low: quote.l,
        open: quote.o,
      };
    }

    return NextResponse.json({
      success: true,
      quotes: result,
    });
  } catch (error: unknown) {
    console.error('Batch quotes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
