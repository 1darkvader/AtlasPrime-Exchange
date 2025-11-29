"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import dynamic from "next/dynamic";

const TradingChart = dynamic(() => import("@/components/TradingChart"), {
  ssr: false,
});

interface DerivativeProduct {
  id: string;
  type: "options" | "perpetual" | "inverse" | "quanto";
  symbol: string;
  underlying: string;
  strike?: number;
  expiry?: string;
  price: number;
  change24h: number;
  volume24h: number;
  openInterest: number;
  impliedVol?: number;
}

export default function DerivativesPage() {
  const [selectedType, setSelectedType] = useState<"all" | "options" | "perpetual" | "inverse">("all");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const derivatives: DerivativeProduct[] = [
    // Options
    { id: "1", type: "options", symbol: "BTC-50000-C-2024", underlying: "BTC", strike: 50000, expiry: "Dec 29, 2024", price: 41365, change24h: 12.5, volume24h: 45000000, openInterest: 125000000, impliedVol: 65.5 },
    { id: "2", type: "options", symbol: "ETH-3500-P-2024", underlying: "ETH", strike: 3500, expiry: "Dec 29, 2024", price: 480, change24h: -5.2, volume24h: 12000000, openInterest: 35000000, impliedVol: 72.3 },
    { id: "3", type: "options", symbol: "BTC-100000-C-2025", underlying: "BTC", strike: 100000, expiry: "Mar 28, 2025", price: 8500, change24h: 18.4, volume24h: 23000000, openInterest: 78000000, impliedVol: 85.2 },

    // Perpetual Swaps
    { id: "4", type: "perpetual", symbol: "BTCUSD-PERP", underlying: "BTC", price: 91365.79, change24h: 4.14, volume24h: 285000000, openInterest: 1250000000 },
    { id: "5", type: "perpetual", symbol: "ETHUSD-PERP", underlying: "ETH", price: 3020.20, change24h: 2.32, volume24h: 152000000, openInterest: 450000000 },
    { id: "6", type: "perpetual", symbol: "SOLUSD-PERP", underlying: "SOL", price: 141.98, change24h: 3.6, volume24h: 34000000, openInterest: 89000000 },

    // Inverse Contracts
    { id: "7", type: "inverse", symbol: "BTC-INVERSE", underlying: "BTC", price: 91365.79, change24h: 4.14, volume24h: 125000000, openInterest: 345000000 },
    { id: "8", type: "inverse", symbol: "ETH-INVERSE", underlying: "ETH", price: 3020.20, change24h: 2.32, volume24h: 45000000, openInterest: 125000000 },

    // Quanto
    { id: "9", type: "quanto", symbol: "BTC-QUANTO", underlying: "BTC", price: 91365.79, change24h: 4.14, volume24h: 67000000, openInterest: 189000000 },
  ];

  const filteredProducts = selectedType === "all"
    ? derivatives
    : derivatives.filter(d => d.type === selectedType);

  const stats = [
    { label: "Total Open Interest", value: "$3.8B", icon: "📊" },
    { label: "24h Volume", value: "$842M", icon: "📈" },
    { label: "Active Contracts", value: "1,234", icon: "📋" },
    { label: "Avg. Funding Rate", value: "0.01%", icon: "💰" },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Derivatives <span className="gradient-text">Trading</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Trade options, perpetual swaps, inverse contracts, and more advanced products
              </p>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Product Type Filters */}
          <div className="mb-6 flex flex-wrap gap-3">
            {([
              { id: "all" as const, label: "All Products", count: derivatives.length },
              { id: "options" as const, label: "Options", count: derivatives.filter(d => d.type === "options").length },
              { id: "perpetual" as const, label: "Perpetual Swaps", count: derivatives.filter(d => d.type === "perpetual").length },
              { id: "inverse" as const, label: "Inverse Contracts", count: derivatives.filter(d => d.type === "inverse").length },
            ]).map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedType(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedType === filter.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid gap-6">
            {/* Options */}
            {(selectedType === "all" || selectedType === "options") && derivatives.filter(d => d.type === "options").length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="mr-2">📈</span> Options Contracts
                </h2>
                <div className="glass rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-card/50 border-b border-border">
                      <tr>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">Contract</th>
                        <th className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground">Strike</th>
                        <th className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground">Expiry</th>
                        <th className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground">Price</th>
                        <th className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground">24h Change</th>
                        <th className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">IV</th>
                        <th className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">Open Interest</th>
                        <th className="text-center py-4 px-4 text-sm font-semibold text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {derivatives.filter(d => d.type === "options").map((product) => (
                        <tr key={product.id} className="border-b border-border/50 hover:bg-card/30 transition-all">
                          <td className="py-4 px-4">
                            <div className="font-semibold">{product.symbol}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.symbol.includes("-C-") ? "Call" : "Put"} Option
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right font-semibold">
                            ${product.strike?.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right text-sm">{product.expiry}</td>
                          <td className="py-4 px-4 text-right font-semibold">
                            ${product.price.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className={product.change24h > 0 ? "text-emerald-400" : "text-red-400"}>
                              {product.change24h > 0 ? "+" : ""}{product.change24h}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right hidden md:table-cell">
                            {product.impliedVol}%
                          </td>
                          <td className="py-4 px-4 text-right text-muted-foreground hidden lg:table-cell">
                            {formatNumber(product.openInterest)}
                          </td>
                          <td className="py-4 px-4">
                            <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                              Trade
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Perpetual Swaps */}
            {(selectedType === "all" || selectedType === "perpetual") && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="mr-2">🔄</span> Perpetual Swaps
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {derivatives.filter(d => d.type === "perpetual").map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">{product.symbol}</h3>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                          PERP
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="text-3xl font-bold mb-1">
                          ${product.price.toLocaleString()}
                        </div>
                        <div className={`text-sm ${product.change24h > 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {product.change24h > 0 ? "+" : ""}{product.change24h}% (24h)
                        </div>
                      </div>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">24h Volume:</span>
                          <span>{formatNumber(product.volume24h)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Open Interest:</span>
                          <span>{formatNumber(product.openInterest)}</span>
                        </div>
                      </div>

                      <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                        Trade Now
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Inverse Contracts */}
            {(selectedType === "all" || selectedType === "inverse") && derivatives.filter(d => d.type === "inverse").length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="mr-2">🔀</span> Inverse Contracts
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {derivatives.filter(d => d.type === "inverse").map((product) => (
                    <div key={product.id} className="glass rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{product.symbol}</h3>
                          <p className="text-sm text-muted-foreground">
                            Settled in {product.underlying}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">${product.price.toLocaleString()}</div>
                          <div className={`text-sm ${product.change24h > 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {product.change24h > 0 ? "+" : ""}{product.change24h}%
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">24h Volume</div>
                          <div className="font-semibold">{formatNumber(product.volume24h)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Open Interest</div>
                          <div className="font-semibold">{formatNumber(product.openInterest)}</div>
                        </div>
                      </div>

                      <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                        Trade Inverse
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="mr-2">📚</span> What are Derivatives?
              </h3>
              <p className="text-sm text-muted-foreground">
                Derivatives are financial contracts that derive their value from underlying assets like Bitcoin or Ethereum. They allow traders to speculate on price movements without owning the actual asset.
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="mr-2">⚠️</span> Risk Warning
              </h3>
              <p className="text-sm text-muted-foreground">
                Derivatives trading involves high risk and leverage. You can lose more than your initial investment. Only trade with funds you can afford to lose.
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="mr-2">💡</span> Trading Tips
              </h3>
              <p className="text-sm text-muted-foreground">
                Start with small positions, understand implied volatility for options, monitor funding rates for perpetuals, and always use stop-loss orders.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
