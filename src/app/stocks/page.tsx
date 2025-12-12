"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import dynamic from "next/dynamic";
import MarketsList from "@/components/MarketsList";
import MarketTrades from "@/components/MarketTrades";
import OrderConfirmationModal from "@/components/OrderConfirmationModal";
import WebSocketStatus from "@/components/WebSocketStatus";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useCryptoData } from "@/hooks/useCryptoData";
import { useAuth } from "@/contexts/AuthContext";
import { type CreateOrderParams } from "@/lib/api/orders";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TradingViewChart = dynamic(() => import("@/components/TradingViewChart"), {
  ssr: false,
});

interface TokenizedStock {
  symbol: string;
  binanceSymbol: string;
  company: string;
  sector: string;
}

// Stocks and FX Trading Pairs
const STOCK_PAIRS: TokenizedStock[] = [
  // Blue Chip AI Stocks (Tokenized)
  { symbol: "NVDA", binanceSymbol: "BTCUSDT", company: "NVIDIA", sector: "Blue Chip AI" },
  { symbol: "MSFT", binanceSymbol: "ETHUSDT", company: "Microsoft", sector: "Blue Chip AI" },
  { symbol: "GOOGL", binanceSymbol: "BNBUSDT", company: "Google (Alphabet)", sector: "Blue Chip AI" },
  { symbol: "AMD", binanceSymbol: "SOLUSDT", company: "Advanced Micro Devices", sector: "Blue Chip AI" },

  // Growth / High-Upside AI Stocks
  { symbol: "PLTR", binanceSymbol: "AVAXUSDT", company: "Palantir Technologies", sector: "Growth AI" },
  { symbol: "CRWD", binanceSymbol: "ADAUSDT", company: "CrowdStrike", sector: "Growth AI" },
  { symbol: "META", binanceSymbol: "DOTUSDT", company: "Meta Platforms", sector: "Growth AI" },
  { symbol: "TSLA", binanceSymbol: "MATICUSDT", company: "Tesla", sector: "Growth AI" },

  // High-Risk / High-Reward Frontier AI
  { symbol: "BKKT", binanceSymbol: "ATOMUSDT", company: "Bakkt Holdings", sector: "Frontier AI" },
  { symbol: "AI", binanceSymbol: "NEARUSDT", company: "C3.ai", sector: "Frontier AI" },
  { symbol: "SMCI", binanceSymbol: "ALGOUSDT", company: "Super Micro Computer", sector: "Frontier AI" },
  { symbol: "ARM", binanceSymbol: "ARBUSDT", company: "Arm Holdings", sector: "Frontier AI" },

  // Tech Giants & E-Commerce
  { symbol: "BABA", binanceSymbol: "LTCUSDT", company: "Alibaba", sector: "Tech Giants" },
  { symbol: "PYPL", binanceSymbol: "BCHUSDT", company: "PayPal", sector: "FinTech" },
  { symbol: "AAPL", binanceSymbol: "XRPUSDT", company: "Apple Inc", sector: "Tech Giants" },
  { symbol: "AMZN", binanceSymbol: "LINKUSDT", company: "Amazon", sector: "E-Commerce" },
  { symbol: "NFLX", binanceSymbol: "UNIUSDT", company: "Netflix", sector: "Streaming" },

  // Space & Aerospace
  { symbol: "RKLB", binanceSymbol: "FILUSDT", company: "Rocket Lab", sector: "Space" },
  { symbol: "SPACEX", binanceSymbol: "AAVEUSDT", company: "SpaceX", sector: "Space" },

  // Quantum Computing
  { symbol: "IONQ", binanceSymbol: "QNTUSDT", company: "IonQ Inc", sector: "Quantum" },

  // Hardware & Storage
  { symbol: "WDC", binanceSymbol: "ARUSDT", company: "Western Digital", sector: "Hardware" },

  // FinTech & Banking
  { symbol: "SOFI", binanceSymbol: "APEUSDT", company: "SoFi Technologies", sector: "FinTech" },
  { symbol: "STRIPE", binanceSymbol: "AXSUSDT", company: "Stripe", sector: "FinTech" },
  { symbol: "REVOLUT", binanceSymbol: "MANAUSDT", company: "Revolut", sector: "FinTech" },
  { symbol: "KALSHI", binanceSymbol: "GALAUSDT", company: "Kalshi", sector: "Prediction Markets" },
  { symbol: "COIN", binanceSymbol: "INJUSDT", company: "Coinbase", sector: "Crypto Exchange" },

  // AI Startups (Pre-IPO/Tokenized)
  { symbol: "ANTHROPIC", binanceSymbol: "RENDERUSDT", company: "Anthropic", sector: "AI Startups" },
  { symbol: "XAI", binanceSymbol: "FETUSDT", company: "xAI", sector: "AI Startups" },
  { symbol: "PERPLEXITY", binanceSymbol: "AGIXUSDT", company: "Perplexity", sector: "AI Startups" },
  { symbol: "SCALEAI", binanceSymbol: "OCEANUSDT", company: "Scale AI", sector: "AI Startups" },

  // Robotics & Automation
  { symbol: "FIGUREAI", binanceSymbol: "STXUSDT", company: "Figure AI", sector: "Robotics" },
  { symbol: "RIPCORD", binanceSymbol: "ROSEUSDT", company: "Ripcord", sector: "Robotics" },
  { symbol: "NEURALINK", binanceSymbol: "WLDUSDT", company: "Neuralink", sector: "BCI Tech" },

  // Defense & Security
  { symbol: "ANDURIL", binanceSymbol: "GRTUSDT", company: "Anduril", sector: "Defense Tech" },

  // Semiconductors
  { symbol: "INTC", binanceSymbol: "MKRUSDT", company: "Intel", sector: "Semiconductors" },
  { symbol: "TSM", binanceSymbol: "COMPUSDT", company: "Taiwan Semiconductor", sector: "Semiconductors" },
  { symbol: "QCOM", binanceSymbol: "CRVUSDT", company: "Qualcomm", sector: "Semiconductors" },

  // Cloud & Software
  { symbol: "CRM", binanceSymbol: "SUSHIUSDT", company: "Salesforce", sector: "Cloud" },
  { symbol: "SNOW", binanceSymbol: "SNXUSDT", company: "Snowflake", sector: "Cloud" },
  { symbol: "DDOG", binanceSymbol: "YFIUSDT", company: "Datadog", sector: "Cloud" },

  // Electric Vehicles
  { symbol: "NIO", binanceSymbol: "1INCHUSDT", company: "NIO Inc", sector: "EV" },
  { symbol: "RIVN", binanceSymbol: "FTMUSDT", company: "Rivian", sector: "EV" },
  { symbol: "LCID", binanceSymbol: "ICPUSDT", company: "Lucid Motors", sector: "EV" },

  // Healthcare & Biotech
  { symbol: "JNJ", binanceSymbol: "EOSUSDT", company: "Johnson & Johnson", sector: "Healthcare" },
  { symbol: "PFE", binanceSymbol: "XTZUSDT", company: "Pfizer", sector: "Pharma" },
  { symbol: "MRNA", binanceSymbol: "VETUSDT", company: "Moderna", sector: "Biotech" },

  // Finance & Banking
  { symbol: "JPM", binanceSymbol: "APTUSDT", company: "JPMorgan Chase", sector: "Banking" },
  { symbol: "BAC", binanceSymbol: "SUIUSDT", company: "Bank of America", sector: "Banking" },
  { symbol: "GS", binanceSymbol: "OPUSDT", company: "Goldman Sachs", sector: "Banking" },

  // Energy
  { symbol: "TSLA", binanceSymbol: "SEIUSDT", company: "Tesla Energy", sector: "Clean Energy" },
  { symbol: "ENPH", binanceSymbol: "TIAUSDT", company: "Enphase Energy", sector: "Solar" },

  // FX Trading - Major Currency Pairs
  { symbol: "EUR/USD", binanceSymbol: "EURUSDT", company: "Euro / US Dollar", sector: "Forex" },
  { symbol: "GBP/USD", binanceSymbol: "GBPUSDT", company: "British Pound / USD", sector: "Forex" },
  { symbol: "AUD/USD", binanceSymbol: "AUDUSDT", company: "Australian Dollar / USD", sector: "Forex" },
  { symbol: "USD/BRL", binanceSymbol: "BRLUSDT", company: "US Dollar / Brazilian Real", sector: "Forex" },
  { symbol: "USD/TRY", binanceSymbol: "TRYUSDT", company: "US Dollar / Turkish Lira", sector: "Forex" },
  { symbol: "USD/RUB", binanceSymbol: "RUBUSDT", company: "US Dollar / Russian Ruble", sector: "Forex" },
  { symbol: "USD/ZAR", binanceSymbol: "ZARUSDT", company: "US Dollar / South African Rand", sector: "Forex" },
  { symbol: "USD/UAH", binanceSymbol: "UAHUSDT", company: "US Dollar / Ukrainian Hryvnia", sector: "Forex" },
  { symbol: "USD/NGN", binanceSymbol: "NGNUSDT", company: "US Dollar / Nigerian Naira", sector: "Forex" },
  { symbol: "USD/ARS", binanceSymbol: "ARSUSDT", company: "US Dollar / Argentine Peso", sector: "Forex" },
  { symbol: "USD/PLN", binanceSymbol: "PLNUSDT", company: "US Dollar / Polish Zloty", sector: "Forex" },
  { symbol: "USD/RON", binanceSymbol: "RONUSDT", company: "US Dollar / Romanian Leu", sector: "Forex" },
  { symbol: "USD/JPY", binanceSymbol: "HBARUSDT", company: "US Dollar / Japanese Yen", sector: "Forex" },
  { symbol: "USD/CAD", binanceSymbol: "RUNEUSDT", company: "US Dollar / Canadian Dollar", sector: "Forex" },
  { symbol: "USD/CHF", binanceSymbol: "KASUSDT", company: "US Dollar / Swiss Franc", sector: "Forex" },
  { symbol: "NZD/USD", binanceSymbol: "BEAMUSDT", company: "New Zealand Dollar / USD", sector: "Forex" },
  { symbol: "USD/SEK", binanceSymbol: "CFXUSDT", company: "US Dollar / Swedish Krona", sector: "Forex" },
  { symbol: "USD/NOK", binanceSymbol: "PYTHUSDT", company: "US Dollar / Norwegian Krone", sector: "Forex" },
  { symbol: "USD/DKK", binanceSymbol: "JUPUSDT", company: "US Dollar / Danish Krone", sector: "Forex" },
  { symbol: "USD/SGD", binanceSymbol: "PENDLEUSDT", company: "US Dollar / Singapore Dollar", sector: "Forex" },
  { symbol: "USD/HKD", binanceSymbol: "WOOUSDT", company: "US Dollar / Hong Kong Dollar", sector: "Forex" },
  { symbol: "USD/KRW", binanceSymbol: "BLURUSDT", company: "US Dollar / Korean Won", sector: "Forex" },
  { symbol: "USD/MXN", binanceSymbol: "MAGICUSDT", company: "US Dollar / Mexican Peso", sector: "Forex" },
  { symbol: "USD/INR", binanceSymbol: "GMXUSDT", company: "US Dollar / Indian Rupee", sector: "Forex" },
  { symbol: "USD/CNY", binanceSymbol: "DYMUSDT", company: "US Dollar / Chinese Yuan", sector: "Forex" },
];

export default function StocksPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Debug: Log auth state
  useEffect(() => {
    console.log('🔍 Stocks Auth State:', {
      isAuthenticated,
      hasUser: !!user,
      authLoading,
      userName: user?.username,
      combined: isAuthenticated && user
    });
  }, [isAuthenticated, user, authLoading]);

  const [selectedStock, setSelectedStock] = useState("NVDA");
  const [binanceSymbol, setBinanceSymbol] = useState("BTCUSDT");
  const [timeframe, setTimeframe] = useState("1h");
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [total, setTotal] = useState("");

  // TP/SL State
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false);
  const [stopLossEnabled, setStopLossEnabled] = useState(false);
  const [takeProfitPrice, setTakeProfitPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");

  // Order confirmation modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<CreateOrderParams | null>(null);

  // Tab state for Orders Panel
  const [activeTab, setActiveTab] = useState<"open" | "history" | "trades">("open");

  const { candleData, tickerData, loading } = useCryptoData(binanceSymbol, timeframe);
  const { orderBook, recentTrades, connected, reconnecting, error } = useWebSocket(binanceSymbol);

  useEffect(() => {
    if (tickerData && !price) {
      setPrice(tickerData.price.toFixed(2));
    }
  }, [tickerData, price]);

  // Get unique sectors
  const sectors = ["all", ...Array.from(new Set(STOCK_PAIRS.map(s => s.sector)))];

  // Filter stocks
  const filteredStocks = STOCK_PAIRS.filter(stock => {
    const matchesSector = selectedSector === "all" || stock.sector === selectedSector;
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stock.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const currentStock = STOCK_PAIRS.find(s => s.binanceSymbol === binanceSymbol) || STOCK_PAIRS[0];

  const handleSizeChange = (value: string) => {
    setSize(value);
    if (value && price) {
      setTotal((parseFloat(value) * parseFloat(price)).toFixed(2));
    }
  };

  const handleBuyClick = () => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    if (!size || parseFloat(size) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const order: CreateOrderParams = {
      pair: binanceSymbol,
      type: orderType.toUpperCase() as 'MARKET' | 'LIMIT',
      side: 'BUY',
      amount: parseFloat(size),
      ...(orderType !== 'market' && { price: parseFloat(price) }),
      ...(takeProfitEnabled && takeProfitPrice && { takeProfitPrice: parseFloat(takeProfitPrice) }),
      ...(stopLossEnabled && stopLossPrice && { stopLossPrice: parseFloat(stopLossPrice) }),
    };

    setPendingOrder(order);
    setShowOrderModal(true);
  };

  const handleSellClick = () => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    if (!size || parseFloat(size) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const order: CreateOrderParams = {
      pair: binanceSymbol,
      type: orderType.toUpperCase() as 'MARKET' | 'LIMIT',
      side: 'SELL',
      amount: parseFloat(size),
      ...(orderType !== 'market' && { price: parseFloat(price) }),
      ...(takeProfitEnabled && takeProfitPrice && { takeProfitPrice: parseFloat(takeProfitPrice) }),
      ...(stopLossEnabled && stopLossPrice && { stopLossPrice: parseFloat(stopLossPrice) }),
    };

    setPendingOrder(order);
    setShowOrderModal(true);
  };

  const handleOrderSuccess = () => {
    setSize('');
    setTotal('');
    setTakeProfitPrice('');
    setStopLossPrice('');
    setTakeProfitEnabled(false);
    setStopLossEnabled(false);
    setShowOrderModal(false);
    setPendingOrder(null);
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-[1920px] mx-auto">
          {/* Header */}
          <div className="mb-4 glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-2xl">📈</div>
                  <div>
                    <div className="text-xl font-bold flex items-center gap-2">
                      {currentStock.symbol}
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded font-semibold">{currentStock.sector}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{currentStock.company}</div>
                  </div>
                </div>

                {tickerData && (
                  <div className="flex gap-6 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Price</div>
                      <div className="text-2xl font-bold text-blue-400">${tickerData.price.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">24h Change</div>
                      <div className={`text-lg font-semibold ${tickerData.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tickerData.change24h >= 0 ? '+' : ''}{tickerData.change24h.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">24h High</div>
                      <div className="text-emerald-400 font-semibold">${tickerData.high24h.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">24h Low</div>
                      <div className="text-red-400 font-semibold">${tickerData.low24h.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">24h Volume</div>
                      <div className="font-semibold">{tickerData.volume24h}</div>
                    </div>
                  </div>
                )}
              </div>
              <WebSocketStatus connected={connected} reconnecting={reconnecting} error={error} />
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            {/* Left: Order Book */}
            <div className="xl:col-span-2">
              <div className="glass rounded-xl p-4 h-[600px] flex flex-col">
                <h3 className="text-sm font-semibold mb-3">Order Book</h3>
                <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-2 pb-2 border-b border-border">
                    <div>Price(USDT)</div>
                    <div className="text-right">Amount</div>
                    <div className="text-right">Total</div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-0.5">
                    {orderBook.asks.slice(0, 10).map((ask, i) => (
                      <div key={i} className="grid grid-cols-3 gap-2 text-xs hover:bg-red-500/10 cursor-pointer p-1 rounded relative">
                        <div className="absolute right-0 top-0 bottom-0 bg-red-500/10" style={{ width: `${Math.min((ask.amount / 2) * 100, 100)}%` }} />
                        <div className="text-red-400 relative z-10">{ask.price.toFixed(2)}</div>
                        <div className="text-right relative z-10">{ask.amount.toFixed(4)}</div>
                        <div className="text-right text-muted-foreground relative z-10">{ask.total.toFixed(4)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="py-3 my-2 text-center">
                    <div className="text-2xl font-bold text-blue-400">{tickerData ? tickerData.price.toLocaleString() : '...'}</div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-0.5">
                    {orderBook.bids.slice(0, 10).map((bid, i) => (
                      <div key={i} className="grid grid-cols-3 gap-2 text-xs hover:bg-emerald-500/10 cursor-pointer p-1 rounded relative">
                        <div className="absolute right-0 top-0 bottom-0 bg-emerald-500/10" style={{ width: `${Math.min((bid.amount / 2) * 100, 100)}%` }} />
                        <div className="text-emerald-400 relative z-10">{bid.price.toFixed(2)}</div>
                        <div className="text-right relative z-10">{bid.amount.toFixed(4)}</div>
                        <div className="text-right text-muted-foreground relative z-10">{bid.total.toFixed(4)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Chart + Order Forms */}
            <div className="xl:col-span-7 space-y-4">
              {/* Chart */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">TradingView Chart</h3>
                  <div className="flex gap-1">
                    {(['1m', '15m', '1h', '4h', '1d'] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf.toLowerCase())}
                        className={`px-2 py-1 rounded text-xs transition-all ${
                          timeframe === tf.toLowerCase() ? "bg-blue-500 text-white" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-[400px] bg-card/50 rounded-lg">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-muted-foreground">Loading chart...</div>
                    </div>
                  ) : candleData.length > 0 ? (
                    <TradingViewChart data={candleData} symbol={selectedStock} indicators={[]} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-muted-foreground">No chart data available</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Forms */}
              <div className="glass rounded-xl p-4">
                <div className="flex gap-2 mb-4 border-b border-border">
                  {(["limit", "market"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`px-4 py-2 text-sm font-medium capitalize transition-all ${
                        orderType === type ? "text-blue-400 border-b-2 border-blue-400" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Buy Form */}
                  <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                    <h3 className="text-sm font-bold text-emerald-400 mb-3">Buy {currentStock.symbol.split('/')[0]}</h3>
                    <div className="space-y-3">
                      {orderType !== "market" && (
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Price</label>
                          <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder={tickerData ? tickerData.price.toFixed(2) : "0.00"}
                            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      )}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
                        <input
                          type="text"
                          value={size}
                          onChange={(e) => handleSizeChange(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Total</label>
                        <input
                          type="text"
                          value={total}
                          readOnly
                          placeholder="0.00 USDT"
                          className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-sm"
                        />
                      </div>

                      {/* TP/SL */}
                      <div className="space-y-2 pt-2 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="buy-tp"
                            checked={takeProfitEnabled}
                            onChange={(e) => setTakeProfitEnabled(e.target.checked)}
                            className="w-4 h-4 rounded border-border text-emerald-500 focus:ring-emerald-500"
                          />
                          <label htmlFor="buy-tp" className="text-xs text-muted-foreground">Take Profit</label>
                        </div>
                        {takeProfitEnabled && (
                          <input
                            type="number"
                            value={takeProfitPrice}
                            onChange={(e) => setTakeProfitPrice(e.target.value)}
                            placeholder="TP Price"
                            className="w-full px-3 py-1.5 bg-card border border-emerald-500/30 rounded text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        )}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="buy-sl"
                            checked={stopLossEnabled}
                            onChange={(e) => setStopLossEnabled(e.target.checked)}
                            className="w-4 h-4 rounded border-border text-red-500 focus:ring-red-500"
                          />
                          <label htmlFor="buy-sl" className="text-xs text-muted-foreground">Stop Loss</label>
                        </div>
                        {stopLossEnabled && (
                          <input
                            type="number"
                            value={stopLossPrice}
                            onChange={(e) => setStopLossPrice(e.target.value)}
                            placeholder="SL Price"
                            className="w-full px-3 py-1.5 bg-card border border-red-500/30 rounded text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        )}
                      </div>

                      <button
                        onClick={handleBuyClick}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all"
                      >
                        {isAuthenticated && user ? `Buy ${currentStock.symbol.split('/')[0]}` : 'Log In to Trade'}
                      </button>
                    </div>
                  </div>

                  {/* Sell Form */}
                  <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                    <h3 className="text-sm font-bold text-red-400 mb-3">Sell {currentStock.symbol.split('/')[0]}</h3>
                    <div className="space-y-3">
                      {orderType !== "market" && (
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Price</label>
                          <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder={tickerData ? tickerData.price.toFixed(2) : "0.00"}
                            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      )}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
                        <input
                          type="text"
                          value={size}
                          onChange={(e) => handleSizeChange(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Total</label>
                        <input
                          type="text"
                          value={total}
                          readOnly
                          placeholder="0.00 USDT"
                          className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-sm"
                        />
                      </div>

                      {/* TP/SL for Sell */}
                      <div className="space-y-2 pt-2 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="sell-tp"
                            checked={takeProfitEnabled}
                            onChange={(e) => setTakeProfitEnabled(e.target.checked)}
                            className="w-4 h-4 rounded border-border text-emerald-500 focus:ring-emerald-500"
                          />
                          <label htmlFor="sell-tp" className="text-xs text-muted-foreground">Take Profit</label>
                        </div>
                        {takeProfitEnabled && (
                          <input
                            type="number"
                            value={takeProfitPrice}
                            onChange={(e) => setTakeProfitPrice(e.target.value)}
                            placeholder="TP Price"
                            className="w-full px-3 py-1.5 bg-card border border-emerald-500/30 rounded text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        )}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="sell-sl"
                            checked={stopLossEnabled}
                            onChange={(e) => setStopLossEnabled(e.target.checked)}
                            className="w-4 h-4 rounded border-border text-red-500 focus:ring-red-500"
                          />
                          <label htmlFor="sell-sl" className="text-xs text-muted-foreground">Stop Loss</label>
                        </div>
                        {stopLossEnabled && (
                          <input
                            type="number"
                            value={stopLossPrice}
                            onChange={(e) => setStopLossPrice(e.target.value)}
                            placeholder="SL Price"
                            className="w-full px-3 py-1.5 bg-card border border-red-500/30 rounded text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        )}
                      </div>

                      <button
                        onClick={handleSellClick}
                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                      >
                        {isAuthenticated && user ? `Sell ${currentStock.symbol.split('/')[0]}` : 'Log In to Trade'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Markets + Trades */}
            <div className="xl:col-span-3 space-y-4">
              <div className="glass rounded-xl p-4 max-h-[600px] overflow-hidden flex flex-col">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold mb-2">Available Pairs ({STOCK_PAIRS.length})</h3>

                  {/* Search */}
                  <input
                    type="text"
                    placeholder="Search pairs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Sector Filter */}
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sectors.map(sector => (
                      <option key={sector} value={sector}>
                        {sector === "all" ? "All Sectors" : sector}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                  {filteredStocks.map((stock) => (
                    <button
                      key={stock.binanceSymbol}
                      onClick={() => {
                        setSelectedStock(stock.symbol);
                        setBinanceSymbol(stock.binanceSymbol);
                        setPrice("");
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        binanceSymbol === stock.binanceSymbol
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'bg-card hover:bg-card/80 border border-border'
                      }`}
                    >
                      <div className="font-semibold">{stock.symbol}</div>
                      <div className="text-xs text-muted-foreground">{stock.company}</div>
                      <div className="text-xs text-blue-400 mt-1">{stock.sector}</div>
                    </button>
                  ))}
                  {filteredStocks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No pairs found
                    </div>
                  )}
                </div>
              </div>
              <div className="h-[400px]">
                <MarketTrades trades={recentTrades} />
              </div>
            </div>
          </div>

          {/* Orders Panel */}
          <div className="glass rounded-xl p-4 mt-4">
            <div className="flex items-center gap-6 px-4 pt-4 border-b border-border">
              <button
                onClick={() => setActiveTab("open")}
                className={`pb-3 text-sm font-medium transition-all ${
                  activeTab === "open"
                    ? "text-emerald-400 border-b-2 border-emerald-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Open Orders
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`pb-3 text-sm font-medium transition-all ${
                  activeTab === "history"
                    ? "text-emerald-400 border-b-2 border-emerald-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Order History
              </button>
              <button
                onClick={() => setActiveTab("trades")}
                className={`pb-3 text-sm font-medium transition-all ${
                  activeTab === "trades"
                    ? "text-emerald-400 border-b-2 border-emerald-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                My Trades
              </button>
            </div>
            <div className="min-h-[200px] flex flex-col items-center justify-center py-12">
              {authLoading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-muted-foreground text-sm">Loading...</p>
                </div>
              ) : !(isAuthenticated && user) ? (
                <>
                  <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-muted-foreground text-sm mb-4">
                    Log in or Register Now to trade
                  </p>
                  <div className="flex gap-3">
                    <Link href="/login" className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded transition-all">
                      Log In
                    </Link>
                    <Link href="/signup" className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-all">
                      Register Now
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-muted-foreground text-sm mb-4">
                    No {activeTab === "open" ? "open orders" : activeTab === "history" ? "order history" : "trades"} yet
                  </p>
                  <p className="text-xs text-gray-500">
                    {activeTab === "open"
                      ? "Your open orders will appear here"
                      : activeTab === "history"
                      ? "Your order history will appear here"
                      : "Your trade history will appear here"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Order Confirmation Modal */}
      {pendingOrder && (
        <OrderConfirmationModal
          isOpen={showOrderModal}
          onClose={() => {
            setShowOrderModal(false);
            setPendingOrder(null);
          }}
          orderData={pendingOrder}
          currentPrice={tickerData?.price || 0}
          onSuccess={handleOrderSuccess}
        />
      )}
    </>
  );
}
