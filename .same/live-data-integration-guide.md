# Live Data Integration Guide

## ✅ Completed Setup

### 1. Dependencies Installed
```bash
bun add lightweight-charts react-use
```

### 2. Components Created
- `src/components/TradingViewChart.tsx` - Professional candlestick chart
- `src/hooks/useCryptoData.ts` - Real Binance API integration
- `src/hooks/useWebSocket.ts` - Live order book & trades

## 🔌 Integration Points

### TradingView Chart Component
```tsx
import TradingViewChart from "@/components/TradingViewChart";

// In your component:
const { candleData } = useCryptoData("BTCUSDT", "1h");

<TradingViewChart data={candleData} symbol="BTC/USDT" />
```

### Real Crypto Data Hook
```tsx
import { useCryptoData } from "@/hooks/useCryptoData";

const { candleData, tickerData, loading, error } = useCryptoData(
  "BTCUSDT",  // symbol
  "1h"        // interval: 1m, 5m, 15m, 1h, 4h, 1d
);

// tickerData contains:
// - symbol, price, change24h, high24h, low24h, volume24h
```

### WebSocket Live Updates
```tsx
import { useWebSocket } from "@/hooks/useWebSocket";

const { orderBook, recentTrades, connected } = useWebSocket("BTCUSDT");

// orderBook contains: { bids, asks, lastUpdate }
// recentTrades: array of recent trades with price, amount, time, type
// connected: WebSocket connection status
```

## 📝 Next Steps to Complete Integration

### Update spot-trade/page.tsx:

1. **Import hooks and components**
```tsx
import { useCryptoData } from "@/hooks/useCryptoData";
import { useWebSocket } from "@/hooks/useWebSocket";
import dynamic from "next/dynamic";

const TradingViewChart = dynamic(() => import("@/components/TradingViewChart"), {
  ssr: false,
});
```

2. **Replace mock data with real data**
```tsx
const [binanceSymbol, setBinanceSymbol] = useState("BTCUSDT");
const [timeframe, setTimeframe] = useState("1h");

const { candleData, tickerData } = useCryptoData(binanceSymbol, timeframe);
const { orderBook, recentTrades, connected } = useWebSocket(binanceSymbol);

// Use tickerData for: price, change24h, high24h, low24h, volume24h
// Use orderBook.bids and orderBook.asks for order book
// Use recentTrades for recent trades panel
```

3. **Update chart canvas section**
```tsx
<div className="flex-1 bg-card/50 rounded-lg min-h-0">
  {candleData.length > 0 ? (
    <TradingViewChart data={candleData} symbol={selectedPair} />
  ) : (
    <div className="flex items-center justify-center h-full">
      <div className="text-muted-foreground">Loading chart...</div>
    </div>
  )}
</div>
```

4. **Add connection indicator**
```tsx
<div className="flex items-center space-x-2">
  <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
  <span className="text-muted-foreground text-xs">
    {connected ? 'Live' : 'Disconnected'}
  </span>
</div>
```

## 🎯 API Endpoints Used

### Binance Public API (No Auth Required)
- Candlestick Data: `https://api.binance.com/api/v3/klines`
- 24h Ticker: `https://api.binance.com/api/v3/ticker/24hr`
- Order Book: `https://api.binance.com/api/v3/depth`

### WebSocket Streams (Future)
```javascript
// Uncomment in useWebSocket.ts when ready for real WebSocket:
wss://stream.binance.com:9443/ws/btcusdt@depth@100ms
wss://stream.binance.com:9443/ws/btcusdt@trade
```

## 🛠️ Backend API Structure (To Build)

### Endpoints Needed:
```
POST /api/orders/place
POST /api/orders/cancel
GET  /api/orders/open
GET  /api/orders/history
GET  /api/user/balance
GET  /api/user/portfolio
POST /api/auth/login
POST /api/auth/register
```

### Database Schema:
- Users (id, email, password_hash, created_at)
- Balances (user_id, asset, amount, locked)
- Orders (id, user_id, symbol, type, side, price, amount, status)
- Trades (id, order_id, price, amount, fee, timestamp)

## ⚡ Performance Optimizations

- Chart updates: Throttle to 1 update per second
- Order book: Update max every 100ms
- Trades: Limit to last 20 trades
- API calls: Cache for 10 seconds

## 🔐 Security Considerations

- Never store API keys in frontend code
- All order placement must go through backend API
- Validate all inputs before sending to backend
- Use HTTPS only for all requests
- Implement rate limiting on backend

## 📊 Testing Checklist

- [ ] Chart loads with real data
- [ ] Chart updates when timeframe changes
- [ ] Order book updates in real-time
- [ ] Recent trades appear and update
- [ ] Price ticker shows correct values
- [ ] Pair switching works correctly
- [ ] All numbers formatted correctly
- [ ] Error handling for API failures
- [ ] Loading states display properly
- [ ] WebSocket reconnects on disconnect

## 🚀 Deployment Notes

- Set environment variables for API endpoints
- Enable CORS for Binance API requests
- Configure rate limiting
- Add error tracking (Sentry)
- Monitor WebSocket connections
- Set up health checks

## 📚 Resources

- Binance API Docs: https://binance-docs.github.io/apidocs/spot/en/
- Lightweight Charts: https://tradingview.github.io/lightweight-charts/
- WebSocket Best Practices: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
