// Finnhub API Client for Real-time Stock Data
// Free tier: 60 API calls/minute
// https://finnhub.io/docs/api

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

export interface StockQuote {
  c: number; // Current price
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
  dp: number; // Change percentage
  d: number; // Change
}

export interface StockProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

export interface StockMetrics {
  metric: {
    '10DayAverageTradingVolume': number;
    '52WeekHigh': number;
    '52WeekLow': number;
    '52WeekHighDate': string;
    '52WeekLowDate': string;
    beta: number;
    marketCapitalization: number;
    peRatio: number;
    dividendYieldIndicatedAnnual: number;
    epsBasicExclExtraItemsTTM: number;
    revenueGrowthTTMYoy: number;
  };
}

export interface EarningsData {
  symbol: string;
  earnings: Array<{
    actual: number;
    estimate: number;
    period: string;
    quarter: number;
    surprise: number;
    surprisePercent: number;
    year: number;
  }>;
}

export const finnhubAPI = {
  /**
   * Get real-time stock quote
   */
  async getQuote(symbol: string): Promise<StockQuote | null> {
    try {
      if (!FINNHUB_API_KEY) {
        console.warn('Finnhub API key not configured');
        return null;
      }

      const response = await fetch(
        `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  },

  /**
   * Get stock profile/company info
   */
  async getProfile(symbol: string): Promise<StockProfile | null> {
    try {
      if (!FINNHUB_API_KEY) {
        console.warn('Finnhub API key not configured');
        return null;
      }

      const response = await fetch(
        `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching profile for ${symbol}:`, error);
      return null;
    }
  },

  /**
   * Get stock metrics (P/E ratio, market cap, etc.)
   */
  async getMetrics(symbol: string): Promise<StockMetrics | null> {
    try {
      if (!FINNHUB_API_KEY) {
        console.warn('Finnhub API key not configured');
        return null;
      }

      const response = await fetch(
        `${FINNHUB_BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching metrics for ${symbol}:`, error);
      return null;
    }
  },

  /**
   * Get earnings data
   */
  async getEarnings(symbol: string): Promise<EarningsData | null> {
    try {
      if (!FINNHUB_API_KEY) {
        console.warn('Finnhub API key not configured');
        return null;
      }

      const response = await fetch(
        `${FINNHUB_BASE_URL}/stock/earnings?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching earnings for ${symbol}:`, error);
      return null;
    }
  },

  /**
   * Get multiple quotes at once
   */
  async getBatchQuotes(symbols: string[]): Promise<Record<string, StockQuote>> {
    const quotes: Record<string, StockQuote> = {};

    // Rate limiting: max 60 calls/minute for free tier
    // Batch with delay
    for (const symbol of symbols) {
      const quote = await this.getQuote(symbol);
      if (quote) {
        quotes[symbol] = quote;
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return quotes;
  },
};
