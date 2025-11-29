import { useState, useEffect, useCallback } from "react";

interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface TickerData {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
}

export function useCryptoData(symbol: string = "BTCUSDT", interval: string = "1h") {
  const [candleData, setCandleData] = useState<CandlestickData[]>([]);
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandleData = useCallback(async () => {
    try {
      // Binance public API - no auth required
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`
      );

      if (!response.ok) throw new Error("Failed to fetch candle data");

      const data = await response.json();

      const formattedData: CandlestickData[] = data.map((candle: (string | number)[]) => ({
        time: Math.floor(Number(candle[0]) / 1000), // Convert to seconds
        open: typeof candle[1] === 'string' ? parseFloat(candle[1]) : candle[1],
        high: typeof candle[2] === 'string' ? parseFloat(candle[2]) : candle[2],
        low: typeof candle[3] === 'string' ? parseFloat(candle[3]) : candle[3],
        close: typeof candle[4] === 'string' ? parseFloat(candle[4]) : candle[4],
      }));

      setCandleData(formattedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching candle data:", err);
    }
  }, [symbol, interval]);

  const fetchTickerData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
      );

      if (!response.ok) throw new Error("Failed to fetch ticker data");

      const data = await response.json();

      setTickerData({
        symbol: data.symbol,
        price: parseFloat(data.lastPrice),
        change24h: parseFloat(data.priceChangePercent),
        high24h: parseFloat(data.highPrice),
        low24h: parseFloat(data.lowPrice),
        volume24h: (parseFloat(data.volume) / 1000000).toFixed(2) + "M",
      });

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
      console.error("Error fetching ticker data:", err);
    }
  }, [symbol]);

  useEffect(() => {
    fetchCandleData();
    fetchTickerData();

    // Update every 10 seconds
    const interval = setInterval(() => {
      fetchCandleData();
      fetchTickerData();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchCandleData, fetchTickerData]);

  return { candleData, tickerData, loading, error, refetch: fetchCandleData };
}
