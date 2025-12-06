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

interface DerivativeContract {
  symbol: string;
  binanceSymbol: string;
  type: "perpetual" | "inverse" | "options";
  underlying: string;
  fundingRate?: number;
  strike?: number;
  expiry?: string;
}

export default function DerivativesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [selectedContract, setSelectedContract] = useState("BTC/USDT-PERP");
  const [binanceSymbol, setBinanceSymbol] = useState("BTCUSDT");
  const [contractType, setContractType] = useState<"perpetual" | "inverse" | "options">("perpetual");
  const [timeframe, setTimeframe] = useState("1h");
  const [orderType, setOrderType] = useState<"limit" | "market" | "stop">("limit");

  const [leverage, setLeverage] = useState(10);
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [total, setTotal] = useState("");

  // Order confirmation modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<CreateOrderParams | null>(null);

  // Derivative contracts available
  const contracts: DerivativeContract[] = [
    { symbol: "BTC/USDT-PERP", binanceSymbol: "BTCUSDT", type: "perpetual", underlying: "BTC", fundingRate: 0.0100 },
    { symbol: "ETH/USDT-PERP", binanceSymbol: "ETHUSDT", type: "perpetual", underlying: "ETH", fundingRate: 0.0095 },
    { symbol: "SOL/USDT-PERP", binanceSymbol: "SOLUSDT", type: "perpetual", underlying: "SOL", fundingRate: 0.0105 },
    { symbol: "BNB/USDT-PERP", binanceSymbol: "BNBUSDT", type: "perpetual", underlying: "BNB", fundingRate: 0.0098 },
    { symbol: "BTC-INVERSE", binanceSymbol: "BTCUSDT", type: "inverse", underlying: "BTC" },
    { symbol: "ETH-INVERSE", binanceSymbol: "ETHUSDT", type: "inverse", underlying: "ETH" },
  ];

  const { candleData, tickerData, loading } = useCryptoData(binanceSymbol, timeframe);
  const { orderBook, recentTrades, connected, reconnecting, error } = useWebSocket(binanceSymbol);

  useEffect(() => {
    if (tickerData && !price) {
      setPrice(tickerData.price.toFixed(2));
    }
  }, [tickerData, price]);

  const currentContract = contracts.find(c => c.binanceSymbol === binanceSymbol && c.type === contractType) || contracts[0];
  const maxLeverage = 125;

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
      ...(orderType !== 'market' && { price: parseFloat(price) }),
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
      ...(orderType !== 'market' && { price: parseFloat(price) }),
    };

    setPendingOrder(order);
    setShowOrderModal(true);
  };

  const handleOrderSuccess = () => {
    setSize('');
    setTotal('');
    setShowOrderModal(false);
    setPendingOrder(null);
  };

  const filteredContracts = contracts.filter(c => c.type === contractType);

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
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">📊</div>
                  <div>
                    <div className="text-xl font-bold flex items-center gap-2">
                      {currentContract.symbol}
                      <span className={`px-2 py-1 text-xs rounded font-semibold ${
                        contractType === "perpetual" ? "bg-purple-500/20 text-purple-400" :
                        contractType === "inverse" ? "bg-pink-500/20 text-pink-400" :
                        "bg-blue-500/20 text-blue-400"
                      }`}>
                        {contractType.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{currentContract.underlying} Derivative</div>
                  </div>
                </div>

                {tickerData && (
                  <div className="flex gap-6 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Mark Price</div>
                      <div className="text-2xl font-bold text-purple-400">${tickerData.price.toLocaleString()}</div>
                    </div>
                    {currentContract.fundingRate && (
                      <div>
                        <div className="text-xs text-muted-foreground">Funding Rate</div>
                        <div className="text-lg font-semibold text-emerald-400">
                          {(currentContract.fundingRate * 100).toFixed(4)}%
                        </div>
                      </div>
                    )}
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

          {/* Contract Type Selector */}
          <div className="mb-4 glass rounded-xl p-4">
            <div className="flex gap-2">
              {(["perpetual", "inverse", "options"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setContractType(type);
                    const contract = contracts.find(c => c.type === type);
                    if (contract) {
                      setSelectedContract(contract.symbol);
                      setBinanceSymbol(contract.binanceSymbol);
                      setPrice("");
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    contractType === type
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type}
                </button>
              ))}
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
                    <div className="text-right">Size</div>
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
                    <div className="text-2xl font-bold text-purple-400">{tickerData ? tickerData.price.toLocaleString() : '...'}</div>
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
                          timeframe === tf.toLowerCase() ? "bg-purple-500 text-white" : "text-muted-foreground hover:text-foreground"
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
                    <TradingViewChart data={candleData} symbol={selectedContract} indicators={[]} />
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
                  {(["limit", "market", "stop"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`px-4 py-2 text-sm font-medium capitalize transition-all ${
                        orderType === type ? "text-purple-400 border-b-2 border-purple-400" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {type === "stop" ? "Stop Limit" : type}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Long Form */}
                  <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                    <h3 className="text-sm font-bold text-emerald-400 mb-3">Long {currentContract.underlying}</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs text-muted-foreground">Leverage</label>
                          <div className="text-base font-bold text-yellow-400">{leverage}x</div>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max={maxLeverage}
                          value={leverage}
                          onChange={(e) => setLeverage(Number(e.target.value))}
                          className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-yellow-500"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>1x</span>
                          <span>50x</span>
                          <span>125x</span>
                        </div>
                      </div>

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
                        <label className="text-xs text-muted-foreground mb-1 block">Size</label>
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

                      <button
                        onClick={handleLongClick}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all"
                      >
                        {isAuthenticated ? `Long ${currentContract.underlying}` : 'Log In to Trade'}
                      </button>
                    </div>
                  </div>

                  {/* Short Form */}
                  <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                    <h3 className="text-sm font-bold text-red-400 mb-3">Short {currentContract.underlying}</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs text-muted-foreground">Leverage</label>
                          <div className="text-base font-bold text-yellow-400">{leverage}x</div>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max={maxLeverage}
                          value={leverage}
                          onChange={(e) => setLeverage(Number(e.target.value))}
                          className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-yellow-500"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>1x</span>
                          <span>50x</span>
                          <span>125x</span>
                        </div>
                      </div>

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
                        <label className="text-xs text-muted-foreground mb-1 block">Size</label>
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

                      <button
                        onClick={handleShortClick}
                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                      >
                        {isAuthenticated ? `Short ${currentContract.underlying}` : 'Log In to Trade'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-xs text-orange-400">
                  ⚠️ Derivatives trading with leverage involves significant risk. You may lose your entire investment.
                </div>
              </div>
            </div>

            {/* Right: Contracts + Trades */}
            <div className="xl:col-span-3 space-y-4">
              <div className="glass rounded-xl p-4">
                <h3 className="text-sm font-semibold mb-3">Available Contracts</h3>
                <div className="space-y-2">
                  {filteredContracts.map((contract) => (
                    <button
                      key={contract.symbol}
                      onClick={() => {
                        setSelectedContract(contract.symbol);
                        setBinanceSymbol(contract.binanceSymbol);
                        setContractType(contract.type);
                        setPrice("");
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        binanceSymbol === contract.binanceSymbol && contractType === contract.type
                          ? 'bg-purple-500/20 border border-purple-500/30'
                          : 'bg-card hover:bg-card/80 border border-border'
                      }`}
                    >
                      <div className="font-semibold">{contract.symbol}</div>
                      <div className="text-xs text-muted-foreground">{contract.underlying}</div>
                      {contract.fundingRate && (
                        <div className="text-xs text-emerald-400 mt-1">
                          Funding: {(contract.fundingRate * 100).toFixed(4)}%
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[400px]">
                <MarketTrades trades={recentTrades} />
              </div>
            </div>
          </div>

          {/* Positions Panel */}
          <div className="glass rounded-xl p-4 mt-4">
            <div className="flex items-center gap-6 px-4 pt-4 border-b border-border">
              <button className="pb-3 text-sm font-medium text-purple-400 border-b-2 border-purple-400">Positions</button>
              <button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground">Open Orders</button>
              <button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground">Order History</button>
              <button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground">Trade History</button>
            </div>
            <div className="min-h-[200px] flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-muted-foreground text-sm mb-4">
                {isAuthenticated ? "No open positions" : "Log in or Register Now to trade"}
              </p>
              {!isAuthenticated && (
                <div className="flex gap-3">
                  <Link href="/login" className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded transition-all">
                    Log In
                  </Link>
                  <Link href="/signup" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded transition-all">
                    Register Now
                  </Link>
                </div>
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
