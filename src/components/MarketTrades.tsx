"use client";

import { useState } from "react";

interface Trade {
  price: number;
  amount: number;
  time: string;
  type: "buy" | "sell";
}

interface MarketTradesProps {
  trades: Trade[];
}

export default function MarketTrades({ trades }: MarketTradesProps) {
  const [activeTab, setActiveTab] = useState<"market" | "my">("market");

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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-3">
              Log in or Register Now to trade
            </p>
            <div className="flex gap-2 justify-center">
              <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded text-sm transition-all">
                Log In
              </button>
              <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded text-sm transition-all">
                Register Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
