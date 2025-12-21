import { useState, useEffect, useCallback, useRef } from "react";
import { getWebSocketManager } from "@/lib/websocket/BinanceWebSocketManager";

interface OrderBookLevel {
  price: number;
  amount: number;
  total: number;
}

interface Trade {
  price: number;
  amount: number;
  time: string;
  type: "buy" | "sell";
}

interface OrderBookData {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  lastUpdate: number;
}

interface WebSocketHookReturn {
  orderBook: OrderBookData;
  recentTrades: Trade[];
  connected: boolean;
  reconnecting: boolean;
  error: string | null;
}

export function useWebSocket(symbol: string = "BTCUSDT"): WebSocketHookReturn {
  const [orderBook, setOrderBook] = useState<OrderBookData>({
    bids: [],
    asks: [],
    lastUpdate: Date.now(),
  });
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsManager = useRef(getWebSocketManager());
  const unsubscribeDepth = useRef<(() => void) | null>(null);
  const unsubscribeTrade = useRef<(() => void) | null>(null);
  const unsubscribeStatus = useRef<(() => void) | null>(null);

  // Handle order book updates from Binance
  const handleDepthUpdate = useCallback((data: any) => {
    try {
      // Binance depth stream format
      const bids: OrderBookLevel[] = (data.bids || [])
        .slice(0, 15)
        .map(([price, amount]: [string, string]) => ({
          price: parseFloat(price),
          amount: parseFloat(amount),
          total: parseFloat(price) * parseFloat(amount),
        }));

      const asks: OrderBookLevel[] = (data.asks || [])
        .slice(0, 15)
        .reverse()
        .map(([price, amount]: [string, string]) => ({
          price: parseFloat(price),
          amount: parseFloat(amount),
          total: parseFloat(price) * parseFloat(amount),
        }));

      setOrderBook({
        bids,
        asks,
        lastUpdate: data.lastUpdateId || Date.now(),
      });
    } catch (err) {
      console.error('Error processing depth update:', err);
    }
  }, []);

  // Handle trade updates from Binance
  const handleTradeUpdate = useCallback((data: any) => {
    try {
      // Binance trade stream format
      const newTrade: Trade = {
        price: parseFloat(data.p),
        amount: parseFloat(data.q),
        time: new Date(data.T).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
        type: data.m ? "sell" : "buy", // m = true means buyer is market maker (sell)
      };

      setRecentTrades((prev) => [newTrade, ...prev.slice(0, 19)]);
    } catch (err) {
      console.error('Error processing trade update:', err);
    }
  }, []);

  // Handle connection status changes
  const handleStatusChange = useCallback((status: any) => {
    if (status.stream.includes(symbol.toUpperCase())) {
      setConnected(status.connected);

      if (status.error) {
        setError(status.error);
        setReconnecting(!status.connected);
      } else {
        setError(null);
        setReconnecting(false);
      }
    }
  }, [symbol]);

  useEffect(() => {
    // Subscribe to depth stream
    unsubscribeDepth.current = wsManager.current.subscribe({
      symbol: symbol.toUpperCase(),
      type: 'depth',
      callback: handleDepthUpdate,
    });

    // Subscribe to trade stream
    unsubscribeTrade.current = wsManager.current.subscribe({
      symbol: symbol.toUpperCase(),
      type: 'trade',
      callback: handleTradeUpdate,
    });

    // Subscribe to connection status
    unsubscribeStatus.current = wsManager.current.onStatusChange(handleStatusChange);

    // Cleanup on unmount or symbol change
    return () => {
      if (unsubscribeDepth.current) {
        unsubscribeDepth.current();
        unsubscribeDepth.current = null;
      }
      if (unsubscribeTrade.current) {
        unsubscribeTrade.current();
        unsubscribeTrade.current = null;
      }
      if (unsubscribeStatus.current) {
        unsubscribeStatus.current();
        unsubscribeStatus.current = null;
      }
    };
  }, [symbol, handleDepthUpdate, handleTradeUpdate, handleStatusChange]);

  return {
    orderBook,
    recentTrades,
    connected,
    reconnecting,
    error,
  };
}
