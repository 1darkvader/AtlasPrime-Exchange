"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import dynamic from "next/dynamic";
import MarketsList from "@/components/MarketsList";
import MarketTrades from "@/components/MarketTrades";
import TopMovers from "@/components/TopMovers";
import OrderManagementPanel from "@/components/OrderManagementPanel";
import WebSocketStatus from "@/components/WebSocketStatus";
import OrderConfirmationModal from "@/components/OrderConfirmationModal";
import { useCryptoData } from "@/hooks/useCryptoData";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/contexts/AuthContext";
import { TOP_50_PAIRS, type TradingPair } from "@/lib/tradingPairs";
import { type CreateOrderParams } from "@/lib/api/orders";
import { useRouter } from "next/navigation";

const TradingViewChart = dynamic(() => import("@/components/TradingViewChart"), {
  ssr: false,
});

export default function MarginTradingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [binanceSymbol, setBinanceSymbol] = useState("BTCUSDT");
  const [timeframe, setTimeframe] = useState("1h");
  const [marginMode, setMarginMode] = useState<"cross" | "isolated">("cross");
  const [orderType, setOrderType] = useState<"limit" | "market" | "stop">("limit");
  const [chartTab, setChartTab] = useState<"chart" | "info" | "data" | "square">("chart");
  const [chartView, setChartView] = useState<"tradingview" | "depth">("tradingview");

  const [buyPrice, setBuyPrice] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [buyLeverage, setBuyLeverage] = useState(3);
  const [buyTotal, setBuyTotal] = useState("");

  const [sellPrice, setSellPrice] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [sellLeverage, setSellLeverage] = useState(3);
  const [sellTotal, setSellTotal] = useState("");

  const [orderBookView, setOrderBookView] = useState<"both" | "bids" | "asks">("both");
  const [priceGrouping, setPriceGrouping] = useState("0.01");

  // Order confirmation modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<CreateOrderParams | null>(null);

  // Wallet state
  const [walletBalances, setWalletBalances] = useState<any>(null);
  const [loadingWallet, setLoadingWallet] = useState(true);

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const { candleData, tickerData, loading } = useCryptoData(binanceSymbol, timeframe);
  const { orderBook, recentTrades, connected, reconnecting, error } = useWebSocket(binanceSymbol);

  const maxLeverage = 10;
  const accountStats = {
    totalAssets: 25000,
    totalBorrowed: 12000,
    marginLevel: 208.33,
    healthRatio: 2.45,
  };

  // Fetch wallet balances
  useEffect(() => {
    const fetchWalletBalances = async () => {
      if (!isAuthenticated) {
        setLoadingWallet(false);
        return;
      }

      try {
        const token = localStorage.getItem('atlasprime_token');
        const response = await fetch('/api/wallets', {
          headers: token ? {
            'Authorization': `Bearer ${token}`,
          } : {},
        });
        if (response.ok) {
          const data = await response.json();
          setWalletBalances(data);
          console.log('💰 Margin wallet balances loaded:', data.summary);
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
      } finally {
        setLoadingWallet(false);
      }
    };

    fetchWalletBalances();
  }, [isAuthenticated]);

  // Fetch user's orders
  const fetchOrders = async () => {
    if (!isAuthenticated) return;

    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('atlasprime_token');
      const response = await fetch('/api/orders', {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
          console.log('📋 Margin orders loaded:', data.orders.length);
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (tickerData && !buyPrice) {
      setBuyPrice(tickerData.price.toFixed(2));
      setSellPrice(tickerData.price.toFixed(2));
    }
  }, [tickerData, buyPrice]);

  const handlePairSelect = (pair: TradingPair) => {
    setSelectedPair(pair.pair);
    setBinanceSymbol(pair.symbol);
    setBuyPrice("");
    setSellPrice("");
  };

  const handleBuyAmountChange = (value: string) => {
    setBuyAmount(value);
    if (value && buyPrice) {
      setBuyTotal((parseFloat(value) * parseFloat(buyPrice) * buyLeverage).toFixed(2));
    }
  };

  const handleSellAmountChange = (value: string) => {
    setSellAmount(value);
    if (value && sellPrice) {
      setSellTotal((parseFloat(value) * parseFloat(sellPrice) * sellLeverage).toFixed(2));
    }
  };

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const order: CreateOrderParams = {
      pair: binanceSymbol,
      type: orderType.toUpperCase() as 'MARKET' | 'LIMIT' | 'STOP_LIMIT',
      side: 'BUY',
      amount: parseFloat(buyAmount),
      leverage: buyLeverage,
      positionMode: marginMode.toUpperCase() as 'CROSS' | 'ISOLATED',
      ...(orderType !== 'market' && { price: parseFloat(buyPrice) }),
    };

    setPendingOrder(order);
    setShowOrderModal(true);
  };

  const handleSellClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const order: CreateOrderParams = {
      pair: binanceSymbol,
      type: orderType.toUpperCase() as 'MARKET' | 'LIMIT' | 'STOP_LIMIT',
      side: 'SELL',
      amount: parseFloat(sellAmount),
      leverage: sellLeverage,
      positionMode: marginMode.toUpperCase() as 'CROSS' | 'ISOLATED',
      ...(orderType !== 'market' && { price: parseFloat(sellPrice) }),
    };

    setPendingOrder(order);
    setShowOrderModal(true);
  };

  const handleOrderSuccess = async () => {
    // Refresh wallet balances and orders after successful order
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('atlasprime_token');

        // Refresh wallet
        const walletResponse = await fetch('/api/wallets', {
          headers: token ? {
            'Authorization': `Bearer ${token}`,
          } : {},
        });
        if (walletResponse.ok) {
          const data = await walletResponse.json();
          setWalletBalances(data);
          console.log('✅ Margin balances refreshed after order:', data.summary);
        }

        // Refresh orders
        await fetchOrders();
        console.log('✅ Margin orders refreshed after placement');
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    }

    // Reset form
    setBuyAmount('');
    setBuyTotal('');
    setSellAmount('');
    setSellTotal('');
    setShowOrderModal(false);
    setPendingOrder(null);
  };

  const currentPair = TOP_50_PAIRS.find(p => p.symbol === binanceSymbol) || TOP_50_PAIRS[0];

  const totalBidVolume = orderBook.bids.reduce((sum, bid) => sum + bid.total, 0);
  const totalAskVolume = orderBook.asks.reduce((sum, ask) => sum + ask.total, 0);
  const totalVolume = totalBidVolume + totalAskVolume;
  const bidPercentage = totalVolume > 0 ? (totalBidVolume / totalVolume) * 100 : 50;
  const askPercentage = totalVolume > 0 ? (totalAskVolume / totalVolume) * 100 : 50;

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-[1920px] mx-auto">
          <div className="mb-4 glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                    {currentPair.icon}
                  </div>
                  <div>
                    <div className="text-xl font-bold flex items-center gap-2">
                      {currentPair.pair}
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                        {marginMode === "cross" ? "Cross" : "Isolated"} {maxLeverage}x
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{currentPair.name} Margin</div>
                  </div>
                </div>
                {tickerData && (
                  <div className="flex gap-6">
                    <div>
                      <div className="text-xs text-muted-foreground">24h High</div>
                      <div className="text-emerald-400 font-semibold">${tickerData.high24h.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">24h Low</div>
                      <div className="text-red-400 font-semibold">${tickerData.low24h.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Margin Level</div>
                      <div className="text-purple-400 font-semibold">{accountStats.marginLevel}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Health Ratio</div>
                      <div className={`font-semibold ${accountStats.healthRatio > 2 ? 'text-emerald-400' : accountStats.healthRatio > 1.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {accountStats.healthRatio.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <WebSocketStatus
                connected={connected}
                reconnecting={reconnecting}
                error={error}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-2">
              <div className="glass rounded-xl p-4 h-[700px] flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Order Book</h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setOrderBookView("both")} className={`p-1 rounded ${orderBookView === "both" ? "bg-purple-500/20 text-purple-400" : "text-muted-foreground"}`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4h14M3 8h14M3 12h14M3 16h14" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                    </button>
                    <select value={priceGrouping} onChange={(e) => setPriceGrouping(e.target.value)} className="px-2 py-1 bg-card border border-border rounded text-xs">
                      <option value="0.01">0.01</option>
                      <option value="0.1">0.1</option>
                      <option value="1">1</option>
                      <option value="10">10</option>
                    </select>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-2 pb-2 border-b border-border">
                    <div>Price(USDT)</div>
                    <div className="text-right">Amount</div>
                    <div className="text-right">Total</div>
                  </div>
                  {(orderBookView === "both" || orderBookView === "asks") && (
                    <div className="flex-1 overflow-y-auto space-y-0.5">
                      {orderBook.asks.slice(0, 15).map((ask, i) => (
                        <div key={i} className="grid grid-cols-3 gap-2 text-xs hover:bg-red-500/10 cursor-pointer p-1 rounded relative">
                          <div className="absolute right-0 top-0 bottom-0 bg-red-500/10" style={{ width: `${Math.min((ask.amount / 2) * 100, 100)}%` }} />
                          <div className="text-red-400 relative z-10">{ask.price.toFixed(2)}</div>
                          <div className="text-right relative z-10">{ask.amount.toFixed(4)}</div>
                          <div className="text-right text-muted-foreground relative z-10">{ask.total.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="py-3 my-2">
                    <div className="text-2xl font-bold text-purple-400 mb-1">{tickerData ? tickerData.price.toLocaleString() : '...'}</div>
                    <div className="text-xs">
                      <span className={tickerData && tickerData.change24h >= 0 ? "text-emerald-400" : "text-red-400"}>
                        {tickerData ? `${tickerData.change24h >= 0 ? '+' : ''}${tickerData.change24h.toFixed(2)}%` : '...'}
                      </span>
                    </div>
                  </div>
                  {(orderBookView === "both" || orderBookView === "bids") && (
                    <div className="flex-1 overflow-y-auto space-y-0.5">
                      {orderBook.bids.slice(0, 15).map((bid, i) => (
                        <div key={i} className="grid grid-cols-3 gap-2 text-xs hover:bg-emerald-500/10 cursor-pointer p-1 rounded relative">
                          <div className="absolute right-0 top-0 bottom-0 bg-emerald-500/10" style={{ width: `${Math.min((bid.amount / 2) * 100, 100)}%` }} />
                          <div className="text-emerald-400 relative z-10">{bid.price.toFixed(2)}</div>
                          <div className="text-right relative z-10">{bid.amount.toFixed(4)}</div>
                          <div className="text-right text-muted-foreground relative z-10">{bid.total.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-emerald-400">{bidPercentage.toFixed(1)}%</span>
                      <div className="flex-1 h-1 bg-background rounded overflow-hidden flex">
                        <div className="bg-emerald-500" style={{ width: `${bidPercentage}%` }} />
                        <div className="bg-red-500" style={{ width: `${askPercentage}%` }} />
                      </div>
                      <span className="text-xs text-red-400">{askPercentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-7 space-y-4">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-3 border-b border-border">
                  <div className="flex gap-4">
                    {(["chart", "info", "data", "square"] as const).map((tab) => (
                      <button key={tab} onClick={() => setChartTab(tab)} className={`pb-2 text-sm font-medium capitalize transition-all ${chartTab === tab ? "text-purple-400 border-b-2 border-purple-400" : "text-muted-foreground hover:text-foreground"}`}>
                        {tab === "data" ? "Trading Data" : tab}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <button onClick={() => setChartView("tradingview")} className={`px-3 py-1 text-xs rounded transition-all ${chartView === "tradingview" ? "bg-purple-500/20 text-purple-400" : "text-muted-foreground hover:text-foreground"}`}>TradingView</button>
                      <button onClick={() => setChartView("depth")} className={`px-3 py-1 text-xs rounded transition-all ${chartView === "depth" ? "bg-purple-500/20 text-purple-400" : "text-muted-foreground hover:text-foreground"}`}>Depth</button>
                    </div>
                    <select className="px-2 py-1 bg-card border border-border rounded text-xs">
                      <option>Original</option>
                      <option>TradingView</option>
                    </select>
                    <div className="flex gap-1">
                      {(['1m', '15m', '1h', '4h', '1d'] as const).map((tf) => (
                        <button key={tf} onClick={() => setTimeframe(tf.toLowerCase())} className={`px-2 py-1 rounded text-xs transition-all ${timeframe === tf.toLowerCase() ? "bg-purple-500 text-white" : "text-muted-foreground hover:text-foreground"}`}>{tf}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-[400px] bg-card/50 rounded-lg">
                  {loading ? (
                    <div className="flex items-center justify-center h-full"><div className="text-muted-foreground">Loading chart...</div></div>
                  ) : candleData.length > 0 && chartView === "tradingview" ? (
                    <TradingViewChart data={candleData} symbol={selectedPair} indicators={[]} />
                  ) : (
                    <div className="flex items-center justify-center h-full"><div className="text-muted-foreground">Depth chart view</div></div>
                  )}
                </div>
                {tickerData && (
                  <div className="mt-3 pt-3 border-t border-border flex gap-6 text-xs">
                    <div><span className="text-muted-foreground">Open: </span><span className="font-semibold">{tickerData.price.toFixed(2)}</span></div>
                    <div><span className="text-muted-foreground">High: </span><span className="text-emerald-400 font-semibold">{tickerData.high24h.toFixed(2)}</span></div>
                    <div><span className="text-muted-foreground">Low: </span><span className="text-red-400 font-semibold">{tickerData.low24h.toFixed(2)}</span></div>
                    <div><span className="text-muted-foreground">Close: </span><span className="font-semibold">{tickerData.price.toFixed(2)}</span></div>
                    <div><span className="text-muted-foreground">Vol(USDT): </span><span className="font-semibold">{tickerData.volume24h}</span></div>
                  </div>
                )}
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex gap-2 mb-4 border-b border-border pb-3">
                  {(["cross", "isolated"] as const).map((mode) => (
                    <button key={mode} onClick={() => setMarginMode(mode)} className={`px-4 py-2 text-sm font-medium capitalize rounded transition-all ${marginMode === mode ? "bg-purple-500/20 text-purple-400" : "text-muted-foreground hover:text-foreground hover:bg-card"}`}>
                      {mode} Margin
                    </button>
                  ))}
                  <div className="ml-auto flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Max Leverage:</span>
                    <span className="text-purple-400 font-semibold">{maxLeverage}x</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-4 border-b border-border">
                  {(["limit", "market", "stop"] as const).map((type) => (
                    <button key={type} onClick={() => setOrderType(type)} className={`px-4 py-2 text-sm font-medium capitalize transition-all ${orderType === type ? "text-purple-400 border-b-2 border-purple-400" : "text-muted-foreground hover:text-foreground"}`}>
                      {type === "stop" ? "Stop Limit" : type}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                    <h3 className="text-lg font-bold text-emerald-400 mb-4">Buy / Long {currentPair.pair.split('/')[0]}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Avbl</span>
                        <span>
                          {loadingWallet
                            ? <span className="text-muted-foreground">...</span>
                            : walletBalances?.summary?.USDT?.available
                              ? `${parseFloat(walletBalances.summary.USDT.available).toLocaleString()} USDT`
                              : `${accountStats.totalAssets.toLocaleString()} USDT`
                          }
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs text-muted-foreground">Leverage</label>
                          <div className="text-lg font-bold text-purple-400">{buyLeverage}x</div>
                        </div>
                        <input type="range" min="1" max={maxLeverage} value={buyLeverage} onChange={(e) => setBuyLeverage(Number(e.target.value))} className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-purple-500" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>1x</span>
                          <span>{Math.floor(maxLeverage/2)}x</span>
                          <span>{maxLeverage}x</span>
                        </div>
                      </div>
                      {orderType !== "market" && (
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Price</label>
                          <input type="text" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} placeholder={tickerData ? tickerData.price.toFixed(2) : "0.00"} className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                      )}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
                        <input type="text" value={buyAmount} onChange={(e) => handleBuyAmountChange(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <div className="mt-2">
                          <input type="range" min="0" max="100" className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
                        </div>
                      </div>
                      <div className="bg-purple-500/10 rounded-lg p-3 space-y-1 text-xs">
                        <div className="flex justify-between"><span className="text-muted-foreground">Est. Borrow:</span><span>{buyAmount ? (parseFloat(buyAmount) * (buyLeverage - 1)).toFixed(4) : '0.00'} BTC</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Hourly Interest:</span><span className="text-orange-400">0.02%</span></div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Total (with leverage)</label>
                        <input type="text" value={buyTotal} readOnly placeholder="0.00" className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-sm" />
                      </div>
                      <button
                        onClick={handleBuyClick}
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all"
                      >
                        {isAuthenticated ? `Buy ${currentPair.pair.split('/')[0]}` : 'Log In to Trade'}
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                    <h3 className="text-lg font-bold text-red-400 mb-4">Sell / Short {currentPair.pair.split('/')[0]}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Avbl</span>
                        <span>
                          {loadingWallet
                            ? <span className="text-muted-foreground">...</span>
                            : walletBalances?.summary?.[currentPair.pair.split('/')[0]]?.available
                              ? `${parseFloat(walletBalances.summary[currentPair.pair.split('/')[0]].available).toLocaleString()} ${currentPair.pair.split('/')[0]}`
                              : `0.00 ${currentPair.pair.split('/')[0]}`
                          }
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs text-muted-foreground">Leverage</label>
                          <div className="text-lg font-bold text-purple-400">{sellLeverage}x</div>
                        </div>
                        <input type="range" min="1" max={maxLeverage} value={sellLeverage} onChange={(e) => setSellLeverage(Number(e.target.value))} className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-purple-500" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>1x</span>
                          <span>{Math.floor(maxLeverage/2)}x</span>
                          <span>{maxLeverage}x</span>
                        </div>
                      </div>
                      {orderType !== "market" && (
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Price</label>
                          <input type="text" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder={tickerData ? tickerData.price.toFixed(2) : "0.00"} className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                      )}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
                        <input type="text" value={sellAmount} onChange={(e) => handleSellAmountChange(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <div className="mt-2">
                          <input type="range" min="0" max="100" className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-red-500" />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
                        </div>
                      </div>
                      <div className="bg-purple-500/10 rounded-lg p-3 space-y-1 text-xs">
                        <div className="flex justify-between"><span className="text-muted-foreground">Est. Borrow:</span><span>{sellAmount ? (parseFloat(sellAmount) * (sellLeverage - 1)).toFixed(4) : '0.00'} BTC</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Hourly Interest:</span><span className="text-orange-400">0.02%</span></div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Total (with leverage)</label>
                        <input type="text" value={sellTotal} readOnly placeholder="0.00" className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-sm" />
                      </div>
                      <button
                        onClick={handleSellClick}
                        className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all"
                      >
                        {isAuthenticated ? `Sell ${currentPair.pair.split('/')[0]}` : 'Log In to Trade'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-xs text-orange-400">
                  ⚠️ Margin trading amplifies both profits and losses. Monitor your margin level and health ratio to avoid liquidation.
                </div>
              </div>
            </div>

            <div className="xl:col-span-3 space-y-4">
              <div className="h-[300px]"><MarketsList onPairSelect={handlePairSelect} selectedSymbol={binanceSymbol} /></div>
              <div className="h-[220px]"><MarketTrades trades={recentTrades} /></div>
              <div className="h-[180px]"><TopMovers /></div>
            </div>
          </div>

          <OrderManagementPanel
            orders={orders}
            loadingOrders={loadingOrders}
            onRefreshOrders={fetchOrders}
            tickerData={tickerData}
            binanceSymbol={binanceSymbol}
            onCancelOrder={async (orderId: string) => {
              if (!confirm('Are you sure you want to cancel this order?')) return;
              try {
                const token = localStorage.getItem('atlasprime_token');
                const response = await fetch(`/api/orders/${orderId}`, {
                  method: 'DELETE',
                  headers: token ? {
                    'Authorization': `Bearer ${token}`,
                  } : {},
                });
                if (response.ok) {
                  await Promise.all([fetchOrders(), handleOrderSuccess()]);
                } else {
                  alert('Failed to cancel order');
                }
              } catch (error) {
                console.error('Failed to cancel order:', error);
                alert('Failed to cancel order');
              }
            }}
          />
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
