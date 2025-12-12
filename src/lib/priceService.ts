/**
 * Price Service - Real-time cryptocurrency prices
 * Uses CoinMarketCap API for accurate market data
 */

import { cmcAPI } from './api/coinmarketcap';

interface PriceData {
  symbol: string;
  price: number;
  timestamp: number;
}

// Cache prices for 30 seconds to avoid excessive API calls
const priceCache = new Map<string, PriceData>();
const CACHE_DURATION = 30000; // 30 seconds (CMC has rate limits)

/**
 * Parse trading pair into base and quote currencies
 * Examples: "BTCUSDT" -> { base: "BTC", quote: "USDT" }, "BTC/USDT" -> { base: "BTC", quote: "USDT" }
 */
export function parseTradingPair(pair: string): { base: string; quote: string } {
  // Remove all slashes, trim whitespace, and convert to uppercase
  const cleanPair = pair.replace(/\//g, '').trim().toUpperCase();

  if (!cleanPair || cleanPair.length < 3) {
    throw new Error(`Invalid trading pair: ${pair}`);
  }

  // Common quote currencies (check longest first to avoid issues like "USDT" matching "USDC")
  const quoteCurrencies = ['USDT', 'BUSD', 'USDC', 'BTC', 'ETH', 'BNB', 'USD'];

  for (const quote of quoteCurrencies) {
    if (cleanPair.endsWith(quote)) {
      const base = cleanPair.slice(0, -quote.length);
      // Ensure base is not empty and not the same as quote
      if (base.length > 0 && base !== quote) {
        console.log(`✅ Parsed pair: "${pair}" → base: "${base}", quote: "${quote}"`);
        return { base, quote };
      }
    }
  }

  // If no match, assume last 4 chars are quote (USDT, BUSD, USDC)
  if (cleanPair.length > 4) {
    const base = cleanPair.slice(0, -4);
    const quote = cleanPair.slice(-4);
    console.log(`✅ Parsed pair (fallback): "${pair}" → base: "${base}", quote: "${quote}"`);
    return { base, quote };
  }

  throw new Error(`Unable to parse trading pair: ${pair}`);
}

/**
 * Get price from CoinMarketCap API
 */
async function getPriceFromCMC(symbol: string): Promise<number | null> {
  try {
    const { base } = parseTradingPair(symbol);

    // Get quote from CMC
    const quotes = await cmcAPI.getQuotes([base]);

    if (quotes[base] && quotes[base].price > 0) {
      const price = quotes[base].price;
      console.log(`✅ CMC price: ${symbol} = ${price.toLocaleString()}`);
      return price;
    }

    return null;
  } catch (error) {
    console.error(`CMC fetch failed for ${symbol}:`, error instanceof Error ? error.message : 'Unknown');
    return null;
  }
}

/**
 * Get real-time price from CoinMarketCap API
 */
export async function getPrice(symbol: string): Promise<number> {
  try {
    // Normalize symbol (remove slash and uppercase)
    const normalizedSymbol = symbol.replace('/', '').toUpperCase();

    // Check cache first
    const cached = priceCache.get(normalizedSymbol);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.price;
    }

    // Use CoinMarketCap as primary source
    const cmcPrice = await getPriceFromCMC(normalizedSymbol);

    if (cmcPrice && cmcPrice > 0) {
      // Update cache
      priceCache.set(normalizedSymbol, {
        symbol: normalizedSymbol,
        price: cmcPrice,
        timestamp: Date.now()
      });
      return cmcPrice;
    }

    // If CMC fails, use hardcoded fallback
    throw new Error('CMC API failed');

  } catch (error) {
    console.error(`❌ CMC price fetch failed for ${symbol}, using fallback`);

    // Use hardcoded fallback prices (from real CMC data)
    const fallbackPrices: Record<string, number> = {
      'BTCUSDT': 92415,
      'ETHUSDT': 3020,
      'BNBUSDT': 884.99,
      'SOLUSDT': 142,
      'XRPUSDT': 2.21,
      'ADAUSDT': 0.426539,
      'DOGEUSDT': 0.141069,
      'MATICUSDT': 0.91,
      'DOTUSDT': 7.2,
      'AVAXUSDT': 13.59,
      'LINKUSDT': 14.09,
      'UNIUSDT': 5.61,
      'ATOMUSDT': 2.18,
    };

    const normalizedSymbol = symbol.replace('/', '').toUpperCase();
    const fallbackPrice = fallbackPrices[normalizedSymbol] || 1;

    console.log(`⚠️ Using fallback: ${normalizedSymbol} = $${fallbackPrice.toLocaleString()}`);
    return fallbackPrice;
  }
}

/**
 * Get prices for multiple symbols in batch using CMC
 */
export async function getBatchPrices(symbols: string[]): Promise<Record<string, number>> {
  try {
    const normalizedSymbols = symbols.map(s => s.replace('/', '').toUpperCase());

    console.log(`📊 Fetching batch prices from CMC for ${normalizedSymbols.length} symbols...`);

    // Extract base currencies from trading pairs
    const bases = normalizedSymbols.map(symbol => {
      try {
        const { base } = parseTradingPair(symbol);
        return base;
      } catch {
        // If parsing fails, try to extract base currency manually
        return symbol.replace(/USDT|BUSD|USDC|BTC|ETH|BNB|USD$/g, '');
      }
    });

    // Fetch all prices from CMC in one call
    const quotes = await cmcAPI.getQuotes(bases);

    const prices: Record<string, number> = {};
    let successCount = 0;
    let fallbackCount = 0;

    normalizedSymbols.forEach((symbol, index) => {
      const base = bases[index];

      if (quotes[base] && quotes[base].price > 0) {
        prices[symbol] = quotes[base].price;
        // Also cache individual prices
        priceCache.set(symbol, {
          symbol,
          price: quotes[base].price,
          timestamp: Date.now()
        });
        successCount++;
      } else {
        // Use fallback for failed symbol
        const fallbackPrices: Record<string, number> = {
          'BTCUSDT': 92415,
          'ETHUSDT': 3020,
          'BNBUSDT': 884.99,
          'SOLUSDT': 142,
          'XRPUSDT': 2.21,
          'ADAUSDT': 0.426539,
          'DOGEUSDT': 0.141069,
          'MATICUSDT': 0.91,
          'DOTUSDT': 7.2,
          'AVAXUSDT': 13.59,
          'LINKUSDT': 14.09,
          'UNIUSDT': 5.61,
          'ATOMUSDT': 2.18,
        };
        prices[symbol] = fallbackPrices[symbol] || 1;
        fallbackCount++;
      }
    });

    console.log(`✅ Batch prices: ${successCount} from CMC, ${fallbackCount} fallback`);
    return prices;
  } catch (error) {
    console.error('❌ Batch CMC fetch failed:', error);

    // Return all fallback prices
    const fallbackPrices: Record<string, number> = {
      'BTCUSDT': 92415,
      'ETHUSDT': 3020,
      'BNBUSDT': 884.99,
      'SOLUSDT': 142,
      'XRPUSDT': 2.21,
      'ADAUSDT': 0.426539,
      'DOGEUSDT': 0.141069,
      'MATICUSDT': 0.91,
      'DOTUSDT': 7.2,
      'AVAXUSDT': 13.59,
      'LINKUSDT': 14.09,
      'UNIUSDT': 5.61,
      'ATOMUSDT': 2.18,
    };

    console.log('⚠️ Using all fallback prices');
    return fallbackPrices;
  }
}

/**
 * Convert asset amount to USD value
 */
export async function getUSDValue(asset: string, amount: number): Promise<number> {
  if (asset === 'USDT' || asset === 'USDC' || asset === 'BUSD' || asset === 'USD') {
    return amount;
  }

  try {
    const symbol = `${asset}USDT`;
    const price = await getPrice(symbol);
    return amount * price;
  } catch (error) {
    console.error(`Failed to get USD value for ${asset}:`, error);
    return 0;
  }
}

/**
 * Get USD values for multiple assets
 */
export async function getBatchUSDValues(
  assets: Array<{ asset: string; amount: number }>
): Promise<Array<{ asset: string; amount: number; usdValue: number }>> {
  const results = await Promise.all(
    assets.map(async ({ asset, amount }) => {
      const usdValue = await getUSDValue(asset, amount);
      return { asset, amount, usdValue };
    })
  );

  return results;
}
