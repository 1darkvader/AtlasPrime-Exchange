"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Sparkline from "@/components/Sparkline";

interface TokenizedStock {
  id: string;
  symbol: string;
  company: string;
  sector: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

export default function StocksPage() {
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const stocks: TokenizedStock[] = [
    { id: "1", symbol: "TSLA", company: "Tesla Inc.", sector: "Technology", price: 248.50, change24h: 3.2, marketCap: 789000000000, volume24h: 15200000 },
    { id: "2", symbol: "AAPL", company: "Apple Inc.", sector: "Technology", price: 195.75, change24h: 1.8, marketCap: 3100000000000, volume24h: 42300000 },
    { id: "3", symbol: "GOOGL", company: "Alphabet Inc.", sector: "Technology", price: 142.30, change24h: -0.5, marketCap: 1800000000000, volume24h: 28500000 },
    { id: "4", symbol: "AMZN", company: "Amazon.com Inc.", sector: "Consumer", price: 178.20, change24h: 2.4, marketCap: 1850000000000, volume24h: 31200000 },
    { id: "5", symbol: "MSFT", company: "Microsoft Corp.", sector: "Technology", price: 425.15, change24h: 1.2, marketCap: 3150000000000, volume24h: 19800000 },
    { id: "6", symbol: "NVDA", company: "NVIDIA Corp.", sector: "Technology", price: 505.48, change24h: 4.7, marketCap: 1240000000000, volume24h: 45600000 },
    { id: "7", symbol: "META", company: "Meta Platforms", sector: "Technology", price: 515.25, change24h: 2.1, marketCap: 1320000000000, volume24h: 12400000 },
    { id: "8", symbol: "JPM", company: "JPMorgan Chase", sector: "Finance", price: 225.80, change24h: -1.2, marketCap: 654000000000, volume24h: 8900000 },
    { id: "9", symbol: "V", company: "Visa Inc.", sector: "Finance", price: 295.40, change24h: 0.8, marketCap: 645000000000, volume24h: 6700000 },
    { id: "10", symbol: "JNJ", company: "Johnson & Johnson", sector: "Healthcare", price: 156.90, change24h: -0.3, marketCap: 389000000000, volume24h: 5400000 },
  ];

  const sectors = ["all", "Technology", "Finance", "Healthcare", "Consumer"];

  const filteredStocks = stocks.filter(stock => {
    const matchesSector = selectedSector === "all" || stock.sector === selectedSector;
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stock.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const indices = [
    { name: "S&P 500", value: 5985.25, change: 1.24 },
    { name: "Dow Jones", value: 44296.51, change: 0.97 },
    { name: "NASDAQ", value: 19003.65, change: 1.85 },
    { name: "Russell 2000", value: 2345.12, change: -0.45 },
  ];

  const formatMarketCap = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    return `$${num.toLocaleString()}`;
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
              <div className="flex items-center space-x-3 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold">
                  Tokenized <span className="gradient-text">Stocks</span>
                </h1>
                <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-semibold">
                  NEW
                </span>
              </div>
              <p className="text-xl text-muted-foreground">
                Trade fractional shares of top US stocks 24/7 with crypto
              </p>
            </motion.div>
          </div>

          {/* Market Indices */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {indices.map((index, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-4"
              >
                <div className="text-sm text-muted-foreground mb-1">{index.name}</div>
                <div className="text-2xl font-bold mb-1">{index.value.toLocaleString()}</div>
                <div className={`text-sm font-semibold ${index.change > 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {index.change > 0 ? "+" : ""}{index.change}%
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="mb-6 glass rounded-xl p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Search */}
              <div className="w-full md:w-96">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search stocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Sector Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                {sectors.map((sector) => (
                  <button
                    key={sector}
                    onClick={() => setSelectedSector(sector)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      selectedSector === sector
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                        : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {sector.charAt(0).toUpperCase() + sector.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">🎉</div>
              <div>
                <h3 className="text-lg font-semibold mb-2">24/7 Stock Trading Now Available!</h3>
                <p className="text-muted-foreground">
                  Trade tokenized US stocks anytime with crypto. No traditional market hours, no account minimums, instant settlement. Start with as little as $1!
                </p>
              </div>
            </div>
          </div>

          {/* Stocks Table */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-card/50 border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">#</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">Company</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">Sector</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground">Price</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground">24h Change</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">24h Chart</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground hidden xl:table-cell">Market Cap</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map((stock, index) => (
                    <motion.tr
                      key={stock.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-card/30 transition-all cursor-pointer"
                    >
                      <td className="py-4 px-4 text-sm text-muted-foreground">{index + 1}</td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-semibold text-lg">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">{stock.company}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="px-3 py-1 bg-card rounded-full text-xs">
                          {stock.sector}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-lg">
                        ${stock.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`font-semibold ${stock.change24h > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stock.change24h > 0 ? '+' : ''}{stock.change24h}%
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <div className="flex justify-center">
                          <Sparkline positive={stock.change24h > 0} width={100} height={40} />
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-muted-foreground hidden xl:table-cell">
                        {formatMarketCap(stock.marketCap)}
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

            {filteredStocks.length === 0 && (
              <div className="py-16 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <div className="text-xl font-semibold mb-2">No stocks found</div>
                <div className="text-muted-foreground">Try adjusting your search or filters</div>
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="mr-2">💎</span> Fractional Shares
              </h3>
              <p className="text-sm text-muted-foreground">
                Buy any amount starting from $1. No need to purchase whole shares. Perfect for portfolio diversification.
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="mr-2">🕐</span> 24/7 Trading
              </h3>
              <p className="text-sm text-muted-foreground">
                Unlike traditional markets, trade anytime. Weekend, holidays, or after hours - your schedule, your rules.
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="mr-2">⚡</span> Instant Settlement
              </h3>
              <p className="text-sm text-muted-foreground">
                Trades settle instantly on the blockchain. No T+2 waiting period. Use your proceeds immediately.
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-orange-400 flex items-center">
              <span className="mr-2">⚠️</span> Important Disclaimer
            </h3>
            <p className="text-sm text-muted-foreground">
              Tokenized stocks are derivatives that track the price of underlying US stocks. They are not the actual shares and do not grant voting rights or dividends. Trading involves risk. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
