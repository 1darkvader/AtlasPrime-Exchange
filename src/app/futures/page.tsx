"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import dynamic from "next/dynamic";
import MarketsList from "@/components/MarketsList";
import MarketTrades from "@/components/MarketTrades";
import TopMovers from "@/components/TopMovers";
import LiquidationCalculator from "@/components/LiquidationCalculator";
import PositionManagement from "@/components/PositionManagement";
import AnimatedPNL from "@/components/AnimatedPNL";
import FundingRateChart from "@/components/FundingRateChart";
import AutoCloseTriggers from "@/components/AutoCloseTriggers";
import AdvancedOrderTypes from "@/components/AdvancedOrderTypes";
import PNLCalculator from "@/components/PNLCalculator";
import WebSocketStatus from "@/components/WebSocketStatus";
import OrderConfirmationModal from "@/components/OrderConfirmationModal";
import { useCryptoData } from "@/hooks/useCryptoData";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/contexts/AuthContext";
import { TOP_50_PAIRS, type TradingPair } from "@/lib/tradingPairs";
import { type CreateOrderParams } from "@/lib/api/orders";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TradingViewChart = dynamic(() => import("@/components/TradingViewChart"), {
  ssr: false,
});

export default function FuturesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    console.log('🔍 Futures Auth State:', {
      isAuthenticated,
      hasUser: !!user,
      authLoading,
      userName: user?.username,
      combined: isAuthenticated && user
    });
  }, [isAuthenticated, user, authLoading]);

  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [binanceSymbol, setBinanceSymbol] = useState("BTCUSDT");
  const [timeframe, setTimeframe] = useState("1h");
  const [positionMode, setPositionMode] = useState<"cross" | "isolated">("cross");
  const [orderType, setOrderType] = useState<"limit" | "market" | "stop">("limit");
  const [chartTab, setChartTab] = useState<"chart" | "info" | "data">("chart");
  const [chartView, setChartView] = useState<"tradingview" | "depth">("tradingview");

  const [leverage, setLeverage] = useState(20);
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [total, setTotal] = useState("");

  // TP/SL State
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false);
  const [stopLossEnabled, setStopLossEnabled] = useState(false);
  const [takeProfitPrice, setTakeProfitPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");

  const [orderBookView, setOrderBookView] = useState<"both" | "bids" | "asks">("both");
  const [priceGrouping, setPriceGrouping] = useState("0.1");
  const [activeTab, setActiveTab] = useState<"positions" | "orders" | "history" | "trades" | "assets">("positions");

  // Position Management
  const [selectedPosition, setSelectedPosition] = useState<typeof openPositions[0] | null>(null);
  const [showPositionModal, setShowPositionModal] = useState(false);

  // Advanced Tools
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [activeAdvancedTab, setActiveAdvancedTab] = useState<"funding" | "auto_close" | "advanced_orders" | "pnl_calc">("funding");

  // Order confirmation modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<CreateOrderParams | null>(null);

  // Wallet state - fetch real data
  const [walletBalances, setWalletBalances] = useState<any>(null);
  const [loadingWallet, setLoadingWallet] = useState(true);

  // Orders state - NEW
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'limit' | 'market' | 'stop'>('all');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const { candleData, tickerData, loading } = useCryptoData(binanceSymbol, timeframe);
  const { orderBook, recentTrades, connected, reconnecting, error } = useWebSocket(binanceSymbol);

  const futuresMetrics = {
    markPrice: tickerData?.price || 91365.79,
    indexPrice: tickerData?.price ? tickerData.price * 0.9998 : 91347.23,
    fundingRate: 0.0100,
    fundingCountdown: "7:45:32",
    openInterest: "15.2B",
  };

  const maxLeverage = 125;

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
          console.log('💰 Futures wallet balances loaded:', data.summary);
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
      } finally {
        setLoadingWallet(false);
      }
    };

    fetchWalletBalances();
  }, [isAuthenticated]);

  // Fetch user's orders - NEW
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
          console.log('📋 Futures orders loaded:', data.orders.length);
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch orders on mount and when filter changes - NEW
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, orderFilter]);

  // Cancel order function - NEW
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

  // Calculate account stats from wallet with real USD values
  const accountStats = {
    totalWalletBalance: walletBalances?.summary?.totalUSD || 0,
    availableBalance: walletBalances?.summary?.totalAvailableUSD || 0,
    positionsMargin: 0, // Would be calculated from open positions
    marginRatio: 0,
  };

  useEffect(() => {
    if (tickerData && !price) {
      setPrice(tickerData.price.toFixed(2));
    }
  }, [tickerData, price]);

  const handlePairSelect = (pair: TradingPair) => {
    setSelectedPair(pair.pair);
    setBinanceSymbol(pair.symbol);
    setPrice("");
  };

  const handleSizeChange = (value: string) => {
    setSize(value);
    if (value && price) {
      setTotal((parseFloat(value) * parseFloat(price)).toFixed(2));
    }
  };

  const handleLongClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!size || parseFloat(size) <= 0) {
      alert('Please enter a valid position size');
      return;
    }

    const order: CreateOrderParams = {
      pair: binanceSymbol,
      type: orderType.toUpperCase() as 'MARKET' | 'LIMIT' | 'STOP_LIMIT',
      side: 'LONG',
      amount: parseFloat(size),
      leverage: leverage,
      positionMode: positionMode.toUpperCase() as 'CROSS' | 'ISOLATED',
      ...(orderType !== 'market' && { price: parseFloat(price) }),
      ...(takeProfitEnabled && takeProfitPrice && { takeProfitPrice: parseFloat(takeProfitPrice) }),
      ...(stopLossEnabled && stopLossPrice && { stopLossPrice: parseFloat(stopLossPrice) }),
    };

    setPendingOrder(order);
    setShowOrderModal(true);
  };

  const handleShortClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!size || parseFloat(size) <= 0) {
      alert('Please enter a valid position size');
      return;
    }

    const order: CreateOrderParams = {
      pair: binanceSymbol,
      type: orderType.toUpperCase() as 'MARKET' | 'LIMIT' | 'STOP_LIMIT',
      side: 'SHORT',
      amount: parseFloat(size),
      leverage: leverage,
      positionMode: positionMode.toUpperCase() as 'CROSS' | 'ISOLATED',
      ...(orderType !== 'market' && { price: parseFloat(price) }),
      ...(takeProfitEnabled && takeProfitPrice && { takeProfitPrice: parseFloat(takeProfitPrice) }),
      ...(stopLossEnabled && stopLossPrice && { stopLossPrice: parseFloat(stopLossPrice) }),
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
          console.log('✅ Futures balances refreshed after order:', data.summary);
        }

        // Refresh orders
        await fetchOrders();
        console.log('✅ Futures orders refreshed after placement');
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    }

    // Reset form
    setSize('');
    setTotal('');
    setShowOrderModal(false);
    setPendingOrder(null);
  };

  const currentPair = TOP_50_PAIRS.find(p => p.symbol === binanceSymbol) || TOP_50_PAIRS[0];

  const totalBidVolume = orderBook.bids.reduce((sum, bid) => sum + bid.total, 0);
  const totalAskVolume = orderBook.asks.reduce((sum, ask) => sum + ask.total, 0);
  const totalVolume = totalBidVolume + totalAskVolume;
  const bidPercentage = totalVolume > 0 ? (totalBidVolume / totalVolume) * 100 : 50;
  const askPercentage = totalVolume > 0 ? (totalAskVolume / totalVolume) * 100 : 50;

  const openPositions: Array<{
    symbol: string;
    side: 'long' | 'short';
    size: number;
    leverage: number;
    entryPrice: number;
    markPrice: number;
    liquidationPrice: number;
    margin: number;
    pnl: number;
    roe: number;
  }> = [];

  const renderPositionsPanel = () => {
    const tabs = [
      { value: "positions" as const, label: "Positions", count: openPositions.length },
      { value: "orders" as const, label: "Open Orders", count: orders.filter(o => o.status === 'OPEN').length },
      { value: "history" as const, label: "Order History" },
      { value: "trades" as const, label: "Trade History" },
      { value: "assets" as const, label: "Assets" },
    ];

    return (
      <div className="glass rounded-xl p-0 mt-4">
        <div className="flex items-center gap-6 px-4 pt-4 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`pb-3 text-sm font-medium transition-all ${
                activeTab === tab.value
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && <span className="ml-2 text-xs">({tab.count})</span>}
            </button>
          ))}
        </div>

        <div className="min-h-[300px]">
          {/* Positions Tab */}
          {activeTab === "positions" && (
            <>
              {openPositions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-muted-foreground border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4">Symbol</th>
                        <th className="text-left py-3 px-4">Size</th>
                        <th className="text-right py-3 px-4">Entry Price</th>
                        <th className="text-right py-3 px-4">Mark Price</th>
                        <th className="text-right py-3 px-4">Liq. Price</th>
                        <th className="text-right py-3 px-4">Margin</th>
                        <th className="text-right py-3 px-4">Unrealized PNL</th>
                        <th className="text-center py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {openPositions.map((pos, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-card/50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{pos.symbol}</span>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                pos.side === "long" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                              }`}>
                                {pos.side.toUpperCase()} {pos.leverage}x
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">{pos.size} BTC</td>
                          <td className="py-4 px-4 text-right">${pos.entryPrice.toLocaleString()}</td>
                          <td className="py-4 px-4 text-right">${pos.markPrice.toLocaleString()}</td>
                          <td className="py-4 px-4 text-right text-red-400">${pos.liquidationPrice.toLocaleString()}</td>
                          <td className="py-4 px-4 text-right">${pos.margin.toLocaleString()}</td>
                          <td className="py-4 px-4">
                            <AnimatedPNL pnl={pos.pnl} roe={pos.roe} previousPnl={pos.pnl - 50} size="sm" />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedPosition(pos);
                                  setShowPositionModal(true);
                                }}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-semibold"
                              >
                                Manage
                              </button>
                              <button className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black rounded text-xs font-semibold">Close</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-muted-foreground text-sm mb-4">No open positions</p>
                </div>
              )}
            </>
          )}

          {/* Orders Tab - ENHANCED */}
          {activeTab === "orders" && (
            <>
              {/* Filter Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrderFilter('all')}
                    className={`px-3 py-1 text-xs rounded transition-all ${orderFilter === 'all' ? 'bg-blue-500/20 text-blue-400' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setOrderFilter('limit')}
                    className={`px-3 py-1 text-xs rounded transition-all ${orderFilter === 'limit' ? 'bg-blue-500/20 text-blue-400' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Limit
                  </button>
                  <button
                    onClick={() => setOrderFilter('market')}
                    className={`px-3 py-1 text-xs rounded transition-all ${orderFilter === 'market' ? 'bg-blue-500/20 text-blue-400' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Market
                  </button>
                  <button
                    onClick={() => setOrderFilter('stop')}
                    className={`px-3 py-1 text-xs rounded transition-all ${orderFilter === 'stop' ? 'bg-blue-500/20 text-blue-400' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Stop Limit
                  </button>
                </div>
                <button className="text-xs text-red-400 hover:text-red-300">Cancel All</button>
              </div>

              {/* Orders Table */}
              {loadingOrders ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-muted-foreground text-sm">Loading orders...</p>
                </div>
              ) : orders.filter(o => o.status === 'OPEN').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-muted-foreground text-sm">No open orders</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-muted-foreground border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Pair</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Side</th>
                        <th className="text-right py-3 px-4">Entry Price</th>
                        <th className="text-right py-3 px-4">Mark Price</th>
                        <th className="text-right py-3 px-4">Amount</th>
                        <th className="text-right py-3 px-4">Unrealized P&L</th>
                        <th className="text-right py-3 px-4">Total Value</th>
                        <th className="text-center py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter(o => o.status === 'OPEN').map((order) => {
                        const orderTime = new Date(order.createdAt);
                        const amount = parseFloat(order.amount);
                        const entryPrice = parseFloat(order.price || 0);

                        // Get current market price for this pair
                        const currentPrice = order.pair === binanceSymbol && tickerData
                          ? tickerData.price
                          : entryPrice; // Fallback to entry price if not current pair

                        // Calculate unrealized P&L for LONG/SHORT positions
                        let unrealizedPnL = 0;
                        let pnlPercent = 0;
                        const leverage = order.leverage || 1;

                        if (order.side === 'LONG' && entryPrice > 0) {
                          // LONG: profit when price goes up
                          const priceDiff = currentPrice - entryPrice;
                          unrealizedPnL = (priceDiff / entryPrice) * (amount * entryPrice) * leverage;
                          pnlPercent = (priceDiff / entryPrice) * 100 * leverage;
                        } else if (order.side === 'SHORT' && entryPrice > 0) {
                          // SHORT: profit when price goes down
                          const priceDiff = entryPrice - currentPrice;
                          unrealizedPnL = (priceDiff / entryPrice) * (amount * entryPrice) * leverage;
                          pnlPercent = (priceDiff / entryPrice) * 100 * leverage;
                        }

                        const totalValue = amount * entryPrice;
                        const isLive = order.pair === binanceSymbol; // Show live indicator if current pair

                        return (
                          <tr key={order.id} className="border-b border-border/50 hover:bg-card/50">
                            <td className="py-3 px-4 text-xs text-muted-foreground">
                              {orderTime.toLocaleString('en-US', {
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              })}
                            </td>
                            <td className="py-3 px-4 font-medium">
                              {order.pair}
                              {isLive && (
                                <span className="ml-2 px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                                  LIVE
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 bg-card rounded text-xs">
                                {order.type}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`font-medium ${order.side === 'LONG' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {order.side} {leverage}x
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-mono">
                              ${entryPrice.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right font-mono">
                              <div className="flex flex-col items-end">
                                <span>${currentPrice.toFixed(2)}</span>
                                {isLive && currentPrice !== entryPrice && (
                                  <span className={`text-xs ${currentPrice > entryPrice ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {currentPrice > entryPrice ? '↑' : '↓'} ${Math.abs(currentPrice - entryPrice).toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right font-mono">{amount.toFixed(6)}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex flex-col items-end">
                                <span className={`font-bold ${unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {unrealizedPnL >= 0 ? '+' : ''}{unrealizedPnL.toFixed(2)} USD
                                </span>
                                <span className={`text-xs ${pnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right font-mono">${totalValue.toFixed(2)}</td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={cancellingOrderId === order.id}
                                className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                              >
                                {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Summary Footer */}
                  <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Total Open Orders</div>
                        <div className="text-lg font-bold text-blue-400">
                          {orders.filter(o => o.status === 'OPEN').length}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Total Position Value</div>
                        <div className="text-lg font-bold">
                          ${orders.filter(o => o.status === 'OPEN').reduce((sum, o) => {
                            return sum + (parseFloat(o.amount) * parseFloat(o.price || 0));
                          }, 0).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Total Unrealized P&L</div>
                        <div className={`text-lg font-bold ${
                          orders.filter(o => o.status === 'OPEN').reduce((sum, o) => {
                            const entryPrice = parseFloat(o.price || 0);
                            const amount = parseFloat(o.amount);
                            const currentPrice = o.pair === binanceSymbol && tickerData ? tickerData.price : entryPrice;
                            const leverage = o.leverage || 1;

                            if (o.side === 'LONG' && entryPrice > 0) {
                              const priceDiff = currentPrice - entryPrice;
                              return sum + ((priceDiff / entryPrice) * (amount * entryPrice) * leverage);
                            } else if (o.side === 'SHORT' && entryPrice > 0) {
                              const priceDiff = entryPrice - currentPrice;
                              return sum + ((priceDiff / entryPrice) * (amount * entryPrice) * leverage);
                            }
                            return sum;
                          }, 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {orders.filter(o => o.status === 'OPEN').reduce((sum, o) => {
                            const entryPrice = parseFloat(o.price || 0);
                            const amount = parseFloat(o.amount);
                            const currentPrice = o.pair === binanceSymbol && tickerData ? tickerData.price : entryPrice;
                            const leverage = o.leverage || 1;

                            if (o.side === 'LONG' && entryPrice > 0) {
                              const priceDiff = currentPrice - entryPrice;
                              return sum + ((priceDiff / entryPrice) * (amount * entryPrice) * leverage);
                            } else if (o.side === 'SHORT' && entryPrice > 0) {
                              const priceDiff = entryPrice - currentPrice;
                              return sum + ((priceDiff / entryPrice) * (amount * entryPrice) * leverage);
                            }
                            return sum;
                          }, 0) >= 0 ? '+' : ''}${orders.filter(o => o.status === 'OPEN').reduce((sum, o) => {
                            const entryPrice = parseFloat(o.price || 0);
                            const amount = parseFloat(o.amount);
                            const currentPrice = o.pair === binanceSymbol && tickerData ? tickerData.price : entryPrice;
                            const leverage = o.leverage || 1;

                            if (o.side === 'LONG' && entryPrice > 0) {
                              const priceDiff = currentPrice - entryPrice;
                              return sum + ((priceDiff / entryPrice) * (amount * entryPrice) * leverage);
                            } else if (o.side === 'SHORT' && entryPrice > 0) {
                              const priceDiff = entryPrice - currentPrice;
                              return sum + ((priceDiff / entryPrice) * (amount * entryPrice) * leverage);
                            }
                            return sum;
                          }, 0).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Live Tracking</div>
                        <div className="text-lg font-bold text-green-400">
                          {orders.filter(o => o.status === 'OPEN' && o.pair === binanceSymbol).length} / {orders.filter(o => o.status === 'OPEN').length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Other Tabs */}
          {(activeTab === "history" || activeTab === "trades" || activeTab === "assets") && (
            <div className="flex flex-col items-center justify-center py-12">
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
                  <p className="text-muted-foreground text-sm mb-4">No records</p>
                  <p className="text-xs text-gray-500">Your {activeTab} will appear here</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-[1920px] mx-auto">
          <div className="mb-4 glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-2xl">{currentPair.icon}</div>
                  <div>
                    <div className="text-xl font-bold flex items-center gap-2">
                      {currentPair.pair}
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded font-semibold">Perpetual</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{currentPair.name} Futures</div>
                  </div>
                </div>

                <div className="flex gap-6 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Mark Price</div>
                    <div className="text-2xl font-bold text-blue-400">${futuresMetrics.markPrice.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Index Price</div>
                    <div className="font-semibold">${futuresMetrics.indexPrice.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Funding / Countdown</div>
                    <div className="font-semibold flex items-center gap-2">
                      <span className="text-emerald-400">{(futuresMetrics.fundingRate * 100).toFixed(4)}%</span>
                      <span className="text-orange-400">{futuresMetrics.fundingCountdown}</span>
                    </div>
                  </div>
                  {tickerData && (
                    <>
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
                    </>
                  )}
                  <div>
                    <div className="text-xs text-muted-foreground">Open Interest</div>
                    <div className="font-semibold">{futuresMetrics.openInterest}</div>
                  </div>
                </div>
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
                    <button onClick={() => setOrderBookView("both")} className={`p-1 rounded ${orderBookView === "both" ? "bg-blue-500/20 text-blue-400" : "text-muted-foreground"}`}>
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
                    <div className="text-right">Size(BTC)</div>
                    <div className="text-right">Sum(BTC)</div>
                  </div>
                  {(orderBookView === "both" || orderBookView === "asks") && (
                    <div className="flex-1 overflow-y-auto space-y-0.5">
                      {orderBook.asks.slice(0, 15).map((ask, i) => (
                        <div key={i} className="grid grid-cols-3 gap-2 text-xs hover:bg-red-500/10 cursor-pointer p-1 rounded relative">
                          <div className="absolute right-0 top-0 bottom-0 bg-red-500/10" style={{ width: `${Math.min((ask.amount / 2) * 100, 100)}%` }} />
                          <div className="text-red-400 relative z-10">{ask.price.toFixed(2)}</div>
                          <div className="text-right relative z-10">{ask.amount.toFixed(4)}</div>
                          <div className="text-right text-muted-foreground relative z-10">{ask.total.toFixed(4)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="py-3 my-2">
                    <div className="text-2xl font-bold text-blue-400 mb-1">{tickerData ? tickerData.price.toLocaleString() : '...'}</div>
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
                          <div className="text-right text-muted-foreground relative z-10">{bid.total.toFixed(4)}</div>
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
                    {(["chart", "info", "data"] as const).map((tab) => (
                      <button key={tab} onClick={() => setChartTab(tab)} className={`pb-2 text-sm font-medium capitalize transition-all ${chartTab === tab ? "text-blue-400 border-b-2 border-blue-400" : "text-muted-foreground hover:text-foreground"}`}>
                        {tab === "data" ? "Trading Data" : tab}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <button onClick={() => setChartView("tradingview")} className={`px-3 py-1 text-xs rounded transition-all ${chartView === "tradingview" ? "bg-blue-500/20 text-blue-400" : "text-muted-foreground hover:text-foreground"}`}>TradingView</button>
                      <button onClick={() => setChartView("depth")} className={`px-3 py-1 text-xs rounded transition-all ${chartView === "depth" ? "bg-blue-500/20 text-blue-400" : "text-muted-foreground hover:text-foreground"}`}>Depth</button>
                    </div>
                    <select className="px-2 py-1 bg-card border border-border rounded text-xs">
                      <option>Original</option>
                      <option>TradingView</option>
                    </select>
                    <div className="flex gap-1">
                      {(['1m', '15m', '1h', '4h', '1d'] as const).map((tf) => (
                        <button key={tf} onClick={() => setTimeframe(tf.toLowerCase())} className={`px-2 py-1 rounded text-xs transition-all ${timeframe === tf.toLowerCase() ? "bg-blue-500 text-white" : "text-muted-foreground hover:text-foreground"}`}>{tf}</button>
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
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                  <div className="flex gap-2">
                    {(["cross", "isolated"] as const).map((mode) => (
                      <button key={mode} onClick={() => setPositionMode(mode)} className={`px-4 py-2 text-sm font-medium capitalize rounded transition-all ${positionMode === mode ? "bg-blue-500/20 text-blue-400" : "text-muted-foreground hover:text-foreground hover:bg-card"}`}>{mode}</button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Leverage:</span>
                    <div className="text-lg font-bold text-yellow-400">{leverage}x</div>
                    <select className="px-2 py-1 bg-card border border-border rounded text-xs"><option>USDT</option></select>
                  </div>
                </div>

                <div className="flex gap-2 mb-4 border-b border-border">
                  {(["limit", "market", "stop"] as const).map((type) => (
                    <button key={type} onClick={() => setOrderType(type)} className={`px-4 py-2 text-sm font-medium capitalize transition-all ${orderType === type ? "text-blue-400 border-b-2 border-blue-400" : "text-muted-foreground hover:text-foreground"}`}>
                      {type === "stop" ? "Stop Limit" : type}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-muted-foreground">Avail</span>
                  <span>{accountStats.availableBalance.toLocaleString()} USDT</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                    <h3 className="text-sm font-bold text-emerald-400 mb-3">Buy / Long</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs text-muted-foreground">Leverage</label>
                          <div className="text-base font-bold text-yellow-400">{leverage}x</div>
                        </div>
                        <input type="range" min="1" max={maxLeverage} value={leverage} onChange={(e) => setLeverage(Number(e.target.value))} className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>1x</span>
                          <span>25x</span>
                          <span>50x</span>
                          <span>125x</span>
                        </div>
                      </div>

                      {orderType !== "market" && (
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Price</label>
                          <div className="flex gap-2">
                            <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={tickerData ? tickerData.price.toFixed(2) : "0.00"} className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                            <button className="px-3 py-2 bg-card border border-border rounded-lg text-xs hover:bg-card/80 transition-all">BBO</button>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Size</label>
                        <div className="flex gap-2">
                          <input type="text" value={size} onChange={(e) => handleSizeChange(e.target.value)} placeholder="0.00" className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                          <select className="px-2 py-2 bg-card border border-border rounded-lg text-xs"><option>BTC</option></select>
                        </div>
                        <div className="mt-2">
                          <input type="range" min="0" max="100" className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Total</label>
                        <input type="text" value={total} readOnly placeholder="0.00 USDT" className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-sm" />
                      </div>

                      {/* TP/SL */}
                      <div className="space-y-2">
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

                      <div className="bg-blue-500/10 rounded-lg p-3 space-y-1 text-xs">
                        <div className="flex justify-between"><span className="text-muted-foreground">Max:</span><span>0.00 BTC</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Cost:</span><span>0.00 USDT</span></div>
                      </div>

                      <button
                        onClick={handleLongClick}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all"
                      >
                        {(isAuthenticated && user) ? `Buy/Long ${currentPair.pair.split('/')[0]}` : 'Log In to Trade'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                    <h3 className="text-sm font-bold text-red-400 mb-3">Sell / Short</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs text-muted-foreground">Leverage</label>
                          <div className="text-base font-bold text-yellow-400">{leverage}x</div>
                        </div>
                        <input type="range" min="1" max={maxLeverage} value={leverage} onChange={(e) => setLeverage(Number(e.target.value))} className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>1x</span>
                          <span>25x</span>
                          <span>50x</span>
                          <span>125x</span>
                        </div>
                      </div>

                      {orderType !== "market" && (
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Price</label>
                          <div className="flex gap-2">
                            <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={tickerData ? tickerData.price.toFixed(2) : "0.00"} className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                            <button className="px-3 py-2 bg-card border border-border rounded-lg text-xs hover:bg-card/80 transition-all">BBO</button>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Size</label>
                        <div className="flex gap-2">
                          <input type="text" value={size} onChange={(e) => handleSizeChange(e.target.value)} placeholder="0.00" className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                          <select className="px-2 py-2 bg-card border border-border rounded-lg text-xs"><option>BTC</option></select>
                        </div>
                        <div className="mt-2">
                          <input type="range" min="0" max="100" className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-red-500" />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Total</label>
                        <input type="text" value={total} readOnly placeholder="0.00 USDT" className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-sm" />
                      </div>

                      {/* TP/SL */}
                      <div className="space-y-2">
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

                      <div className="bg-blue-500/10 rounded-lg p-3 space-y-1 text-xs">
                        <div className="flex justify-between"><span className="text-muted-foreground">Max:</span><span>0.00 BTC</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Cost:</span><span>0.00 USDT</span></div>
                      </div>

                      <button
                        onClick={handleShortClick}
                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                      >
                        {(isAuthenticated && user) ? `Sell/Short ${currentPair.pair.split('/')[0]}` : 'Log In to Trade'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-xs text-orange-400">
                  ⚠️ Futures trading with leverage involves significant risk. You may lose your entire margin balance. Trade responsibly.
                </div>
              </div>

              {/* Liquidation Calculator */}
              {openPositions.length > 0 && (
                <LiquidationCalculator
                  entryPrice={openPositions[0].entryPrice}
                  leverage={openPositions[0].leverage}
                  side={openPositions[0].side}
                  margin={openPositions[0].margin}
                />
              )}

              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Account</h3>
                  <span className="text-xs text-muted-foreground">Margin Ratio: {accountStats.marginRatio}%</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wallet Balance:</span>
                    <span className="font-semibold">{accountStats.totalWalletBalance.toLocaleString()} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unrealized PNL:</span>
                    <span className={`font-semibold ${openPositions.length > 0 ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                      {openPositions.length > 0 ? '+' : ''}0.00 USDT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Margin Balance:</span>
                    <span className="font-semibold">{accountStats.positionsMargin.toLocaleString()} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-semibold">{accountStats.availableBalance.toLocaleString()} USDT</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-3 py-2 bg-card hover:bg-card/80 border border-border rounded text-xs transition-all">Transfer</button>
                  <button className="flex-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded text-xs font-semibold transition-all">Buy Crypto</button>
                </div>
              </div>

              {/* Advanced Tools Panel */}
              <div className="glass rounded-xl p-4">
                <button
                  onClick={() => setShowAdvancedTools(!showAdvancedTools)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <h3 className="text-sm font-semibold">Advanced Tools</h3>
                  <svg
                    className={`w-4 h-4 transition-transform ${showAdvancedTools ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showAdvancedTools && (
                  <div className="space-y-4">
                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
                      {[
                        { value: "funding" as const, label: "Funding" },
                        { value: "auto_close" as const, label: "Auto-Close" },
                        { value: "advanced_orders" as const, label: "Orders" },
                        { value: "pnl_calc" as const, label: "P&L Calc" },
                      ].map((tab) => (
                        <button
                          key={tab.value}
                          onClick={() => setActiveAdvancedTab(tab.value)}
                          className={`px-3 py-2 text-xs font-medium whitespace-nowrap rounded transition-all ${
                            activeAdvancedTab === tab.value
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'text-muted-foreground hover:text-foreground hover:bg-card'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    {activeAdvancedTab === "funding" && (
                      <FundingRateChart
                        symbol={binanceSymbol}
                        currentRate={futuresMetrics.fundingRate}
                        nextFundingTime={futuresMetrics.fundingCountdown}
                      />
                    )}

                    {activeAdvancedTab === "auto_close" && openPositions.length > 0 && (
                      <AutoCloseTriggers
                        positionId={openPositions[0].symbol}
                        currentHealthRatio={200}
                      />
                    )}

                    {activeAdvancedTab === "advanced_orders" && (
                      <AdvancedOrderTypes
                        symbol={binanceSymbol}
                        side="long"
                        currentPrice={tickerData?.price || futuresMetrics.markPrice}
                      />
                    )}

                    {activeAdvancedTab === "pnl_calc" && (
                      <PNLCalculator
                        symbol={binanceSymbol}
                        currentPrice={tickerData?.price || futuresMetrics.markPrice}
                        side="long"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="xl:col-span-3 space-y-4">
              <div className="h-[300px]"><MarketsList onPairSelect={handlePairSelect} selectedSymbol={binanceSymbol} /></div>
              <div className="h-[220px]"><MarketTrades trades={recentTrades} /></div>
              <div className="h-[180px]"><TopMovers /></div>
            </div>
          </div>

          {renderPositionsPanel()}
        </div>
      </main>

      {/* Position Management Modal */}
      {showPositionModal && selectedPosition && (
        <PositionManagement
          position={selectedPosition}
          onClose={() => {
            setShowPositionModal(false);
            setSelectedPosition(null);
          }}
          onUpdate={(updates) => {
            // Update position logic here
            console.log("Position updated:", updates);
            setShowPositionModal(false);
          }}
        />
      )}

      {/* Order Confirmation Modal */}
      {pendingOrder && (
        <OrderConfirmationModal
          isOpen={showOrderModal}
          onClose={() => {
            setShowOrderModal(false);
            setPendingOrder(null);
          }}
          orderData={pendingOrder}
          currentPrice={tickerData?.price || futuresMetrics.markPrice}
          onSuccess={handleOrderSuccess}
        />
      )}
    </>
  );
}
