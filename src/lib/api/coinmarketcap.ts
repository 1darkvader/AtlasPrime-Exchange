// CoinMarketCap API Service for real cryptocurrency data

const CMC_API_KEY = process.env.NEXT_PUBLIC_CMC_API_KEY || process.env.CMC_API_KEY || '';
const CMC_API_URL = 'https://pro-api.coinmarketcap.com/v1';

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
}

export const cmcAPI = {
  /**
   * Get latest cryptocurrency listings
   */
  async getLatestListings(limit: number = 100): Promise<CryptoPrice[]> {
    try {
      const response = await fetch(
        `${CMC_API_URL}/cryptocurrency/listings/latest?limit=${limit}&convert=USD`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': CMC_API_KEY,
            'Accept': 'application/json',
          },
          next: { revalidate: 60 }, // Cache for 60 seconds
        }
      );

      if (!response.ok) {
        throw new Error(`CMC API error: ${response.statusText}`);
      }

      const data = await response.json();

      return data.data.map((coin: any) => ({
        symbol: coin.symbol,
        name: coin.name,
        price: coin.quote.USD.price,
        change24h: coin.quote.USD.percent_change_24h,
        change7d: coin.quote.USD.percent_change_7d,
        volume24h: coin.quote.USD.volume_24h,
        marketCap: coin.quote.USD.market_cap,
        high24h: coin.quote.USD.price * (1 + coin.quote.USD.percent_change_24h / 200), // Estimate
        low24h: coin.quote.USD.price * (1 - coin.quote.USD.percent_change_24h / 200), // Estimate
      }));
    } catch (error) {
      console.error('CMC API Error:', error);
      // Return fallback data if API fails
      return [];
    }
  },

  /**
   * Get specific cryptocurrency quotes
   */
  async getQuotes(symbols: string[]): Promise<Record<string, CryptoPrice>> {
    try {
      const response = await fetch(
        `${CMC_API_URL}/cryptocurrency/quotes/latest?symbol=${symbols.join(',')}&convert=USD`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': CMC_API_KEY,
            'Accept': 'application/json',
          },
          next: { revalidate: 30 }, // Cache for 30 seconds
        }
      );

      if (!response.ok) {
        throw new Error(`CMC API error: ${response.statusText}`);
      }

      const data = await response.json();
      const quotes: Record<string, CryptoPrice> = {};

      for (const symbol of symbols) {
        if (data.data[symbol]) {
          const coin = data.data[symbol];
          quotes[symbol] = {
            symbol: coin.symbol,
            name: coin.name,
            price: coin.quote.USD.price,
            change24h: coin.quote.USD.percent_change_24h,
            change7d: coin.quote.USD.percent_change_7d,
            volume24h: coin.quote.USD.volume_24h,
            marketCap: coin.quote.USD.market_cap,
            high24h: coin.quote.USD.price * (1 + coin.quote.USD.percent_change_24h / 200),
            low24h: coin.quote.USD.price * (1 - coin.quote.USD.percent_change_24h / 200),
          };
        }
      }

      return quotes;
    } catch (error) {
      console.error('CMC API Error:', error);
      return {};
    }
  },

  /**
   * Get global market metrics
   */
  async getGlobalMetrics() {
    try {
      const response = await fetch(
        `${CMC_API_URL}/global-metrics/quotes/latest`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': CMC_API_KEY,
            'Accept': 'application/json',
          },
          next: { revalidate: 300 }, // Cache for 5 minutes
        }
      );

      if (!response.ok) {
        throw new Error(`CMC API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        totalMarketCap: data.data.quote.USD.total_market_cap,
        total24hVolume: data.data.quote.USD.total_volume_24h,
        btcDominance: data.data.btc_dominance,
        ethDominance: data.data.eth_dominance,
        activeCryptocurrencies: data.data.active_cryptocurrencies,
      };
    } catch (error) {
      console.error('CMC API Error:', error);
      return null;
    }
  },
};
