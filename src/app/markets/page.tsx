"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Sparkline from "@/components/Sparkline";
import Link from "next/link";
import Navigation from "@/components/Navigation";

interface CryptoMarket {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  category: string;
}

const marketData: CryptoMarket[] = [
  { id: "btc", symbol: "BTC", name: "Bitcoin", icon: "₿", price: 91365.79, change24h: 4.14, volume24h: 28500000000, marketCap: 1780000000000, high24h: 92100, low24h: 87900, category: "Layer 1" },
  { id: "eth", symbol: "ETH", name: "Ethereum", icon: "Ξ", price: 3020.20, change24h: 2.32, volume24h: 15200000000, marketCap: 363000000000, high24h: 3080, low24h: 2950, category: "Layer 1" },
  { id: "sol", symbol: "SOL", name: "Solana", icon: "◎", price: 141.98, change24h: 3.6, volume24h: 3400000000, marketCap: 67000000000, high24h: 145, low24h: 137, category: "Layer 1" },
  { id: "bnb", symbol: "BNB", name: "BNB", icon: "B", price: 623.45, change24h: -1.2, volume24h: 1800000000, marketCap: 93000000000, high24h: 635, low24h: 618, category: "Exchange" },
  { id: "xrp", symbol: "XRP", name: "Ripple", icon: "✕", price: 2.21, change24h: 1.03, volume24h: 4200000000, marketCap: 125000000000, high24h: 2.28, low24h: 2.18, category: "Payment" },
  { id: "ada", symbol: "ADA", name: "Cardano", icon: "₳", price: 0.89, change24h: -0.5, volume24h: 980000000, marketCap: 31000000000, high24h: 0.91, low24h: 0.87, category: "Layer 1" },
  { id: "doge", symbol: "DOGE", name: "Dogecoin", icon: "Ð", price: 0.32, change24h: 5.8, volume24h: 2100000000, marketCap: 47000000000, high24h: 0.34, low24h: 0.30, category: "Meme" },
  { id: "avax", symbol: "AVAX", name: "Avalanche", icon: "▲", price: 38.45, change24h: 2.1, volume24h: 720000000, marketCap: 15000000000, high24h: 39.5, low24h: 37.2, category: "Layer 1" },
  { id: "matic", symbol: "MATIC", name: "Polygon", icon: "⬡", price: 0.78, change24h: 1.8, volume24h: 450000000, marketCap: 7200000000, high24h: 0.81, low24h: 0.76, category: "Layer 2" },
  { id: "dot", symbol: "DOT", name: "Polkadot", icon: "●", price: 7.12, change24h: -2.1, volume24h: 280000000, marketCap: 9800000000, high24h: 7.35, low24h: 6.98, category: "Layer 0" },
  { id: "link", symbol: "LINK", name: "Chainlink", icon: "◬", price: 22.45, change24h: 3.2, volume24h: 890000000, marketCap: 14000000000, high24h: 23.1, low24h: 21.8, category: "Oracle" },
  { id: "atom", symbol: "ATOM", name: "Cosmos", icon: "⚛", price: 9.87, change24h: 0.9, volume24h: 340000000, marketCap: 3900000000, high24h: 10.1, low24h: 9.65, category: "Layer 0" },
];

const categories = ["All", "Layer 1", "Layer 2", "DeFi", "Meme", "Exchange", "Payment", "Oracle", "Layer 0"];

export default function MarketsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"price" | "change" | "volume" | "marketCap">("marketCap");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredMarkets = useMemo(() => {
    let filtered = marketData;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (market) =>
          market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          market.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((market) => market.category === selectedCategory);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortBy === "change" ? "change24h" : sortBy === "volume" ? "volume24h" : sortBy === "marketCap" ? "marketCap" : "price"];
      const bVal = b[sortBy === "change" ? "change24h" : sortBy === "volume" ? "volume24h" : sortBy === "marketCap" ? "marketCap" : "price"];

      return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, sortOrder]);

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32">
      {/* Header */}
      <section className="bg-gradient-to-b from-background via-card/30 to-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cryptocurrency{" "}
              <span className="gradient-text">Markets</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore 500+ cryptocurrencies with real-time prices and market data
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-96">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                      : "bg-card text-muted-foreground hover:text-foreground hover:bg-card/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Total Market Cap</div>
              <div className="text-xl md:text-2xl font-bold gradient-text">$2.8T</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">24h Volume</div>
              <div className="text-xl md:text-2xl font-bold gradient-text">$142B</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">BTC Dominance</div>
              <div className="text-xl md:text-2xl font-bold gradient-text">63.5%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Active Markets</div>
              <div className="text-xl md:text-2xl font-bold gradient-text">500+</div>
            </div>
          </div>
        </div>
      </section>

      {/* Markets Table */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-card/50 border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">#</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">Asset</th>
                    <th
                      className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground cursor-pointer hover:text-emerald-400"
                      onClick={() => handleSort("price")}
                    >
                      Price {sortBy === "price" && (sortOrder === "desc" ? "↓" : "↑")}
                    </th>
                    <th
                      className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground cursor-pointer hover:text-emerald-400"
                      onClick={() => handleSort("change")}
                    >
                      24h Change {sortBy === "change" && (sortOrder === "desc" ? "↓" : "↑")}
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">24h Chart</th>
                    <th
                      className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground cursor-pointer hover:text-emerald-400 hidden md:table-cell"
                      onClick={() => handleSort("volume")}
                    >
                      24h Volume {sortBy === "volume" && (sortOrder === "desc" ? "↓" : "↑")}
                    </th>
                    <th
                      className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground cursor-pointer hover:text-emerald-400 hidden xl:table-cell"
                      onClick={() => handleSort("marketCap")}
                    >
                      Market Cap {sortBy === "marketCap" && (sortOrder === "desc" ? "↓" : "↑")}
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMarkets.map((market, index) => (
                    <motion.tr
                      key={market.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-card/30 transition-all cursor-pointer"
                    >
                      <td className="py-4 px-4 text-sm text-muted-foreground">{index + 1}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-xl">
                            {market.icon}
                          </div>
                          <div>
                            <div className="font-semibold">{market.symbol}</div>
                            <div className="text-sm text-muted-foreground">{market.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold">
                        ${market.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`font-semibold ${market.change24h > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {market.change24h > 0 ? '+' : ''}{market.change24h}%
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <div className="flex justify-center">
                          <Sparkline positive={market.change24h > 0} width={100} height={40} />
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-muted-foreground hidden md:table-cell">
                        {formatLargeNumber(market.volume24h)}
                      </td>
                      <td className="py-4 px-4 text-right text-muted-foreground hidden xl:table-cell">
                        {formatLargeNumber(market.marketCap)}
                      </td>
                      <td className="py-4 px-4">
                        <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                          Trade
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMarkets.length === 0 && (
              <div className="py-16 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <div className="text-xl font-semibold mb-2">No markets found</div>
                <div className="text-muted-foreground">Try adjusting your search or filters</div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
