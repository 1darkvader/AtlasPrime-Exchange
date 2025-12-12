"use client";

import { useState } from "react";
import { TOP_50_PAIRS, type TradingPair } from "@/lib/tradingPairs";

interface MarketsListProps {
  onPairSelect: (pair: TradingPair) => void;
  selectedSymbol: string;
}

const CATEGORY_TABS = ["New", "USDC", "USDT", "FDUSD", "USD", "BNB"] as const;

export default function MarketsList({ onPairSelect, selectedSymbol }: MarketsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<typeof CATEGORY_TABS[number]>("USDT");

  // Filter pairs based on search and tab
  const filteredPairs = TOP_50_PAIRS.filter((pair) => {
    const matchesSearch = searchQuery === "" ||
      pair.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pair.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = selectedTab === "USDT" ? pair.pair.endsWith("/USDT") :
                       selectedTab === "BNB" ? pair.pair.endsWith("/BNB") :
                       selectedTab === "New" ? pair.rank <= 10 : true;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="glass rounded-xl p-4 h-full flex flex-col">
      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 mb-3 border-b border-border overflow-x-auto">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-all ${
              selectedTab === tab
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-3 gap-2 px-2 py-2 text-xs text-muted-foreground border-b border-border">
        <div>Pair</div>
        <div className="text-right">Last Price</div>
        <div className="text-right">Change</div>
      </div>

      {/* Pairs List */}
      <div className="flex-1 overflow-y-auto">
        {filteredPairs.map((pair) => {
          const isSelected = pair.symbol === selectedSymbol;
          const priceChange = (Math.random() - 0.5) * 10; // Mock data
          const lastPrice = (Math.random() * 100000).toFixed(2);
          const hasLeverage = Math.random() > 0.7;

          return (
            <button
              key={pair.symbol}
              onClick={() => onPairSelect(pair)}
              className={`w-full grid grid-cols-3 gap-2 px-2 py-2 text-sm hover:bg-card/50 transition-all ${
                isSelected ? "bg-emerald-500/10" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">{pair.pair.replace("/USDT", "")}</span>
                {hasLeverage && (
                  <span className="px-1 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                    {Math.floor(Math.random() * 10 + 3)}x
                  </span>
                )}
              </div>
              <div className="text-right">{lastPrice}</div>
              <div className={`text-right ${priceChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
