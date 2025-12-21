"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface Trade {
  price: number;
  amount: number;
  time: string;
  type: "buy" | "sell";
}

interface UserTrade {
  id: string;
  pair: string;
  side: string;
  price: number;
  amount: number;
  createdAt: string;
}

interface MarketTradesProps {
  trades: Trade[];
}

export default function MarketTrades({ trades }: MarketTradesProps) {
  const [activeTab, setActiveTab] = useState<"market" | "my">("market");
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [userTrades, setUserTrades] = useState<UserTrade[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(false);

  // Fetch user's trades when tab is active and user is authenticated
  useEffect(() => {
    const fetchUserTrades = async () => {
      if (!isAuthenticated || activeTab !== 'my') return;

      setLoadingTrades(true);
      try {
        const token = localStorage.getItem('atlasprime_token');
        const response = await fetch('/api/orders?status=FILLED', {
          headers: token ? {
            'Authorization': `Bearer ${token}`,
          } : {},
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.orders) {
            // Convert orders to trade format
            const convertedTrades = data.orders.map((order: any) => ({
              id: order.id,
              pair: order.pair,
              side: order.side,
              price: parseFloat(order.price || 0),
              amount: parseFloat(order.amount),
              createdAt: order.completedAt || order.createdAt,
            }));
            setUserTrades(convertedTrades);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user trades:', error);
      } finally {
        setLoadingTrades(false);
      }
    };

    fetchUserTrades();
  }, [isAuthenticated, activeTab]);

  return (
    <div className="glass rounded-xl p-4 h-full flex flex-col">
      {/* Tabs */}
      <div className="flex gap-4 mb-3 border-b border-border">
        <button
          onClick={() => setActiveTab("market")}
          className={`pb-2 text-sm font-medium transition-all ${
            activeTab === "market"
              ? "text-emerald-400 border-b-2 border-emerald-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Market Trades
        </button>
        <button
          onClick={() => setActiveTab("my")}
          className={`pb-2 text-sm font-medium transition-all ${
            activeTab === "my"
              ? "text-emerald-400 border-b-2 border-emerald-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          My Trades
        </button>
      </div>

      {activeTab === "market" ? (
        <>
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-2 px-2 py-2 text-xs text-muted-foreground border-b border-border">
            <div>Price(USDT)</div>
            <div className="text-right">Amount(BTC)</div>
            <div className="text-right">Time</div>
          </div>

          {/* Trades List */}
          <div className="flex-1 overflow-y-auto">
            {trades.slice(0, 20).map((trade, i) => (
              <div
                key={i}
                className="grid grid-cols-3 gap-2 px-2 py-1 text-xs hover:bg-card/50 transition-all"
              >
                <div className={trade.type === "buy" ? "text-emerald-400" : "text-red-400"}>
                  {trade.price.toFixed(2)}
                </div>
                <div className="text-right">{trade.amount.toFixed(6)}</div>
                <div className="text-right text-muted-foreground">{trade.time}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {authLoading || loadingTrades ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-3"></div>
                <p className="text-muted-foreground text-sm">Loading...</p>
              </div>
            </div>
          ) : !(isAuthenticated && user) ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-3">
                  Log in or Register Now to trade
                </p>
                <div className="flex gap-2 justify-center">
                  <Link href="/login" className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded text-sm transition-all">
                    Log In
                  </Link>
                  <Link href="/signup" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded text-sm transition-all">
                    Register Now
                  </Link>
                </div>
              </div>
            </div>
          ) : userTrades.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-12 h-12 text-muted-foreground mb-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-muted-foreground text-sm">No trades yet</p>
                <p className="text-xs text-gray-500 mt-1">Your trade history will appear here</p>
              </div>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-2 px-2 py-2 text-xs text-muted-foreground border-b border-border">
                <div>Price(USDT)</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Time</div>
              </div>

              {/* My Trades List */}
              <div className="flex-1 overflow-y-auto">
                {userTrades.map((trade) => {
                  const tradeTime = new Date(trade.createdAt);
                  const timeStr = `${tradeTime.getHours().toString().padStart(2, '0')}:${tradeTime.getMinutes().toString().padStart(2, '0')}:${tradeTime.getSeconds().toString().padStart(2, '0')}`;

                  return (
                    <div
                      key={trade.id}
                      className="grid grid-cols-3 gap-2 px-2 py-1 text-xs hover:bg-card/50 transition-all"
                    >
                      <div className={trade.side === "BUY" ? "text-emerald-400" : "text-red-400"}>
                        {trade.price.toFixed(2)}
                      </div>
                      <div className="text-right">{trade.amount.toFixed(6)}</div>
                      <div className="text-right text-muted-foreground">{timeStr}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
