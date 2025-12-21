"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import dynamic from "next/dynamic";
import MarketsList from "@/components/MarketsList";
import MarketTrades from "@/components/MarketTrades";
import TopMovers from "@/components/TopMovers";

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

export default function SpotTradingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [binanceSymbol, setBinanceSymbol] = useState("BTCUSDT");
  const [timeframe, setTimeframe] = useState("1h");
  const [tradingMode, setTradingMode] = useState<"spot" | "cross" | "isolated" | "grid">("spot");
  const [orderType, setOrderType] = useState<"limit" | "market" | "stop">("limit");
  const [chartTab, setChartTab] = useState<"chart" | "info" | "data" | "square">("chart");
  const [chartView, setChartView] = useState<"tradingview" | "depth">("tradingview");

  const [buyPrice, setBuyPrice] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [buyTotal, setBuyTotal] = useState("");
  const [buyTPSL, setBuyTPSL] = useState(false);

  const [sellPrice, setSellPrice] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [sellTotal, setSellTotal] = useState("");
  const [sellTPSL, setSellTPSL] = useState(false);

  const [orderBookView, setOrderBookView] = useState<"both" | "bids" | "asks">("both");
  const [priceGrouping, setPriceGrouping] = useState("0.01");

  // Order confirmation modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<CreateOrderParams | null>(null);

  // Wallet balances state
  const [walletBalances, setWalletBalances] = useState<Record<string, number>>({});
  const [loadingBalances, setLoadingBalances] = useState(true);

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'limit' | 'market' | 'stop'>('all');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const { candleData, tickerData, loading } = useCryptoData(binanceSymbol, timeframe);
  const { orderBook, recentTrades, connected, reconnecting, error } = useWebSocket(binanceSymbol);

  // Fetch wallet balances
  useEffect(() => {
    const fetchBalances = async () => {
      if (!isAuthenticated) {
        setLoadingBalances(false);
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
          if (data.success && data.wallets) {
            const balances: Record<string, number> = {};
            data.wallets.forEach((w: any) => {
              balances[w.asset] = parseFloat(w.available); // Use available balance, not total
            });
            setWalletBalances(balances);
            console.log('💰 Wallet balances loaded:', balances);
          }
        }
      } catch (error) {
        console.error('Failed to fetch balances:', error);
      } finally {
        setLoadingBalances(false);
      }
    };

    fetchBalances();
  }, [isAuthenticated]);

  // Fetch user's orders
  const fetchOrders = async () => {
    if (!isAuthenticated) return;

    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('atlasprime_token');
      const url = new URL('/api/orders', window.location.origin);

      // Add filters if needed
      if (orderFilter !== 'all') {
        url.searchParams.set('type', orderFilter.toUpperCase());
      }

      const response = await fetch(url.toString(), {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
          console.log('📋 Orders loaded:', data.orders.length);
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch orders on mount and when filter changes
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, orderFilter]);

  // Cancel order function
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setCancellingOrderId(orderId);
    try {
      const token = localStorage.getItem('atlasprime_token');
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });

      if (response.ok) {
        console.log('✅ Order cancelled successfully');
        // Refresh orders and balances
        await Promise.all([fetchOrders(), handleOrderSuccess()]);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Get base and quote currencies
  const [baseCurrency, quoteCurrency] = selectedPair.split('/');
  const baseBalance = walletBalances[baseCurrency] || 0;
  const quoteBalance = walletBalances[quoteCurrency] || 0;

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
      setBuyTotal((parseFloat(value) * parseFloat(buyPrice)).toFixed(2));
    }
  };

  const handleSellAmountChange = (value: string) => {
    setSellAmount(value);
    if (value && sellPrice) {
      setSellTotal((parseFloat(value) * parseFloat(sellPrice)).toFixed(2));
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
      ...(orderType !== 'market' && { price: parseFloat(sellPrice) }),
    };

    setPendingOrder(order);
    setShowOrderModal(true);
  };

  const handleOrderSuccess = async () => {
    // Refresh wallet balances and orders after successful order placement
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('atlasprime_token');

        // Refresh balances
        const walletResponse = await fetch('/api/wallets', {
          headers: token ? {
            'Authorization': `Bearer ${token}`,
          } : {},
        });

        if (walletResponse.ok) {
          const data = await walletResponse.json();
          if (data.success && data.wallets) {
            const balances: Record<string, number> = {};
            data.wallets.forEach((w: any) => {
              balances[w.asset] = parseFloat(w.available);
            });
            setWalletBalances(balances);
            console.log('✅ Balances refreshed after order:', balances);
          }
        }

        // Refresh orders to show the new order immediately
        await fetchOrders();
        console.log('✅ Orders refreshed after placement');

      } catch (error) {
        console.error('Failed to refresh after order:', error);
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
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-2xl">
                    {currentPair.icon}
                  </div>
                  <div>
                    <div className="text-xl font-bold">{currentPair.pair}</div>
                    <div className="text-xs text-muted-foreground">{currentPair.name}</div>
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
                      <div className="text-xs text-muted-foreground">24h Volume</div>
                      <div className="font-semibold">{tickerData.volume24h}</div>
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
                    <button onClick={() => setOrderBookView("both")} className={`p-1 rounded ${orderBookView === "both" ? "bg-emerald-500/20 text-emerald-400" : "text-muted-foreground"}`}>
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
                    <div className="text-2xl font-bold text-emerald-400 mb-1">{tickerData ? tickerData.price.toLocaleString() : '...'}</div>
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
                      <button key={tab} onClick={() => setChartTab(tab)} className={`pb-2 text-sm font-medium capitalize transition-all ${chartTab === tab ? "text-emerald-400 border-b-2 border-emerald-400" : "text-muted-foreground hover:text-foreground"}`}>
                        {tab === "data" ? "Trading Data" : tab}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <button onClick={() => setChartView("tradingview")} className={`px-3 py-1 text-xs rounded transition-all ${chartView === "tradingview" ? "bg-emerald-500/20 text-emerald-400" : "text-muted-foreground hover:text-foreground"}`}>TradingView</button>
                      <button onClick={() => setChartView("depth")} className={`px-3 py-1 text-xs rounded transition-all ${chartView === "depth" ? "bg-emerald-500/20 text-emerald-400" : "text-muted-foreground hover:text-foreground"}`}>Depth</button>
                    </div>
                    <select className="px-2 py-1 bg-card border border-border rounded text-xs">
                      <option>Original</option>
                      <option>TradingView</option>
                    </select>
                    <div className="flex gap-1">
                      {(['1m', '15m', '1h', '4h', '1d'] as const).map((tf) => (
                        <button key={tf} onClick={() => setTimeframe(tf.toLowerCase())} className={`px-2 py-1 rounded text-xs transition-all ${timeframe === tf.toLowerCase() ? "bg-emerald-500 text-white" : "text-muted-foreground hover:text-foreground"}`}>{tf}</button>
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
                  {(["spot", "cross", "isolated", "grid"] as const).map((mode) => (
                    <button key={mode} onClick={() => setTradingMode(mode)} className={`px-4 py-2 text-sm font-medium capitalize rounded transition-all ${tradingMode === mode ? "bg-emerald-500/20 text-emerald-400" : "text-muted-foreground hover:text-foreground hover:bg-card"}`}>{mode}</button>
                  ))}
                </div>
                <div className="flex gap-2 mb-4 border-b border-border">
                  {(["limit", "market", "stop"] as const).map((type) => (
                    <button key={type} onClick={() => setOrderType(type)} className={`px-4 py-2 text-sm font-medium capitalize transition-all ${orderType === type ? "text-emerald-400 border-b-2 border-emerald-400" : "text-muted-foreground hover:text-foreground"}`}>
                      {type === "stop" ? "Stop Limit" : type}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                    <h3 className="text-lg font-bold text-emerald-400 mb-4">Buy {currentPair.pair.split('/')[0]}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Avbl</span><span>0.00 USDT</span></div>
                      {orderType !== "market" && (
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Price</label>
                          <div className="flex gap-2">
                            <input type="text" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} placeholder={tickerData ? tickerData.price.toFixed(2) : "0.00"} className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                            <button className="px-3 py-2 bg-card border border-border rounded-lg text-xs hover:bg-card/80 transition-all">BBO</button>
                            <select className="px-2 py-2 bg-card border border-border rounded-lg text-xs"><option>USDT</option></select>
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
                        <div className="flex gap-2">
                          <input type="text" value={buyAmount} onChange={(e) => handleBuyAmountChange(e.target.value)} placeholder="0.00" className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                          <select className="px-2 py-2 bg-card border border-border rounded-lg text-xs"><option>{baseCurrency}</option></select>
                        </div>
                        <div className="mt-2">
                          <input type="range" min="0" max="100" className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="buy-tpsl" checked={buyTPSL} onChange={(e) => setBuyTPSL(e.target.checked)} className="w-4 h-4 rounded border-border text-emerald-500 focus:ring-emerald-500" />
                        <label htmlFor="buy-tpsl" className="text-xs text-muted-foreground">TP/SL</label>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Total</label>
                        <input type="text" value={buyTotal} readOnly placeholder="0.00" className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-sm" />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Max Buy</span>
                        <span className="text-emerald-400">
                          {loadingBalances ? 'Loading...' : `${quoteBalance.toLocaleString()} ${quoteCurrency}`}
                        </span>
                      </div>
                      <button
                        onClick={handleBuyClick}
                        disabled={!isAuthenticated || loadingBalances || quoteBalance <= 0}
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAuthenticated ? `Buy ${currentPair.pair.split('/')[0]}` : 'Log In to Trade'}
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                    <h3 className="text-lg font-bold text-red-400 mb-4">Sell {currentPair.pair.split('/')[0]}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Avbl</span>
                        <span>{loadingBalances ? 'Loading...' : `${baseBalance.toLocaleString()} ${baseCurrency}`}</span>
                      </div>
                      {orderType !== "market" && (
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Price</label>
                          <div className="flex gap-2">
                            <input type="text" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder={tickerData ? tickerData.price.toFixed(2) : "0.00"} className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                            <button className="px-3 py-2 bg-card border border-border rounded-lg text-xs hover:bg-card/80 transition-all">BBO</button>
                            <select className="px-2 py-2 bg-card border border-border rounded-lg text-xs"><option>USDT</option></select>
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
                        <div className="flex gap-2">
                          <input type="text" value={sellAmount} onChange={(e) => handleSellAmountChange(e.target.value)} placeholder="0.00" className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                          <select className="px-2 py-2 bg-card border border-border rounded-lg text-xs"><option>{baseCurrency}</option></select>
                        </div>
                        <div className="mt-2">
                          <input type="range" min="0" max="100" className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-red-500" />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="sell-tpsl" checked={sellTPSL} onChange={(e) => setSellTPSL(e.target.checked)} className="w-4 h-4 rounded border-border text-red-500 focus:ring-red-500" />
                        <label htmlFor="sell-tpsl" className="text-xs text-muted-foreground">TP/SL</label>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Total</label>
                        <input type="text" value={sellTotal} readOnly placeholder="0.00" className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-sm" />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Max Sell</span>
                        <span className="text-red-400">
                          {loadingBalances ? 'Loading...' : `${baseBalance.toLocaleString()} ${baseCurrency}`}
                        </span>
                      </div>
                      <button
                        onClick={handleSellClick}
                        disabled={!isAuthenticated || loadingBalances || baseBalance <= 0}
                        className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAuthenticated ? `Sell ${currentPair.pair.split('/')[0]}` : 'Log In to Trade'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-3 space-y-4">
              <div className="h-[300px]"><MarketsList onPairSelect={handlePairSelect} selectedSymbol={binanceSymbol} /></div>
              <div className="h-[220px]"><MarketTrades trades={recentTrades} /></div>
              <div className="h-[180px]"><TopMovers /></div>
            </div>
          </div>

          {/* Order History Section */}
          <div className="glass rounded-xl p-4 mt-4">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
              <div className="flex gap-4">
                <button className="px-4 py-2 text-sm font-medium text-emerald-400 border-b-2 border-emerald-400">
                  Open Orders ({orders.filter(o => o.status === 'OPEN').length})
                </button>
                <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Order History
                </button>
                <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Trade History
                </button>
                <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Funds
                </button>
                <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Bots
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setOrderFilter('all')}
                  className={`px-3 py-1 text-xs rounded transition-all ${orderFilter === 'all' ? 'bg-emerald-500/20 text-emerald-400' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setOrderFilter('limit')}
                  className={`px-3 py-1 text-xs rounded transition-all ${orderFilter === 'limit' ? 'bg-emerald-500/20 text-emerald-400' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Limit
                </button>
                <button
                  onClick={() => setOrderFilter('market')}
                  className={`px-3 py-1 text-xs rounded transition-all ${orderFilter === 'market' ? 'bg-emerald-500/20 text-emerald-400' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Market
                </button>
                <button
                  onClick={() => setOrderFilter('stop')}
                  className={`px-3 py-1 text-xs rounded transition-all ${orderFilter === 'stop' ? 'bg-emerald-500/20 text-emerald-400' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Stop Limit
                </button>
                <button className="px-3 py-1 text-xs text-emerald-400 hover:text-emerald-300">
                  Hide all pairs
                </button>
                <button className="px-3 py-1 text-xs text-emerald-400 hover:text-emerald-300">
                  Cancel All
                </button>
              </div>
            </div>

            {/* Orders Table */}
            {loadingOrders ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground">Loading orders...</div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 opacity-20">
                  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor">
                    <rect x="8" y="8" width="48" height="48" strokeWidth="2" rx="4" />
                    <line x1="20" y1="24" x2="44" y2="24" strokeWidth="2" />
                    <line x1="20" y1="32" x2="44" y2="32" strokeWidth="2" />
                    <line x1="20" y1="40" x2="36" y2="40" strokeWidth="2" />
                  </svg>
                </div>
                <p className="text-muted-foreground">No records</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-muted-foreground border-b border-border">
                      <th className="text-left py-2 px-2">Date</th>
                      <th className="text-left py-2 px-2">Pair</th>
                      <th className="text-left py-2 px-2">Type</th>
                      <th className="text-left py-2 px-2">Side</th>
                      <th className="text-right py-2 px-2">Price</th>
                      <th className="text-right py-2 px-2">Amount</th>
                      <th className="text-right py-2 px-2">Filled</th>
                      <th className="text-right py-2 px-2">Total</th>
                      <th className="text-left py-2 px-2">Status</th>
                      <th className="text-center py-2 px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const orderTime = new Date(order.createdAt);
                      const filled = parseFloat(order.filled || 0);
                      const amount = parseFloat(order.amount);
                      const price = parseFloat(order.price || 0);
                      const total = price * amount;
                      const filledPercent = amount > 0 ? (filled / amount) * 100 : 0;

                      return (
                        <tr key={order.id} className="border-b border-border/50 hover:bg-card/50">
                          <td className="py-3 px-2 text-xs text-muted-foreground">
                            {orderTime.toLocaleString('en-US', {
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                            })}
                          </td>
                          <td className="py-3 px-2 font-medium">{order.pair}</td>
                          <td className="py-3 px-2">
                            <span className="px-2 py-0.5 bg-card rounded text-xs">
                              {order.type}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`font-medium ${order.side === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {order.side}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            {order.type === 'MARKET' ? 'Market' : price.toFixed(2)}
                          </td>
                          <td className="py-3 px-2 text-right">{amount.toFixed(6)}</td>
                          <td className="py-3 px-2 text-right">
                            {filled.toFixed(6)}
                            {amount > 0 && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({filledPercent.toFixed(0)}%)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-right">{total.toFixed(2)}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              order.status === 'FILLED' ? 'bg-emerald-500/20 text-emerald-400' :
                              order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                              order.status === 'OPEN' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-card text-muted-foreground'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            {order.status === 'OPEN' && (
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={cancellingOrderId === order.id}
                                className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                              >
                                {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
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
