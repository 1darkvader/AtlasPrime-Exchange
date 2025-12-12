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

    // Fetch profile, metrics, and earnings in parallel
    const [profile, metrics, earnings] = await Promise.all([
      finnhubAPI.getProfile(symbol),
      finnhubAPI.getMetrics(symbol),
      finnhubAPI.getEarnings(symbol),
    ]);

    if (!profile && !metrics) {
      return NextResponse.json(
        { error: 'Failed to fetch stock data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      symbol,
      profile: profile ? {
        name: profile.name,
        ticker: profile.ticker,
        exchange: profile.exchange,
        industry: profile.finnhubIndustry,
        country: profile.country,
        currency: profile.currency,
        marketCap: profile.marketCapitalization,
        sharesOutstanding: profile.shareOutstanding,
        logo: profile.logo,
        website: profile.weburl,
        ipo: profile.ipo,
      } : null,
      metrics: metrics?.metric ? {
        peRatio: metrics.metric.peRatio || null,
        marketCap: metrics.metric.marketCapitalization || null,
        beta: metrics.metric.beta || null,
        eps: metrics.metric.epsBasicExclExtraItemsTTM || null,
        dividendYield: metrics.metric.dividendYieldIndicatedAnnual || null,
        week52High: metrics.metric['52WeekHigh'] || null,
        week52Low: metrics.metric['52WeekLow'] || null,
        avgVolume10Day: metrics.metric['10DayAverageTradingVolume'] || null,
        revenueGrowth: metrics.metric.revenueGrowthTTMYoy || null,
      } : null,
      earnings: earnings?.earnings ? earnings.earnings.slice(0, 4) : null,
    });
  } catch (error: unknown) {
    console.error('Stock metrics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
