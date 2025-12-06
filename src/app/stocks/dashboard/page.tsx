"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

// AI Stock symbols organized by category
const AI_STOCKS = {
  blueChip: [
    { symbol: "NVDA", name: "NVIDIA", sector: "Blue Chip AI" },
    { symbol: "MSFT", name: "Microsoft", sector: "Blue Chip AI" },
    { symbol: "GOOGL", name: "Google", sector: "Blue Chip AI" },
    { symbol: "AMD", name: "AMD", sector: "Blue Chip AI" },
  ],
  growth: [
    { symbol: "PLTR", name: "Palantir", sector: "Growth AI" },
    { symbol: "CRWD", name: "CrowdStrike", sector: "Growth AI" },
    { symbol: "META", name: "Meta", sector: "Growth AI" },
    { symbol: "TSLA", name: "Tesla", sector: "Growth AI" },
  ],
  frontier: [
    { symbol: "BKKT", name: "Bakkt", sector: "Frontier AI" },
    { symbol: "AI", name: "C3.ai", sector: "Frontier AI" },
    { symbol: "SMCI", name: "Super Micro", sector: "Frontier AI" },
    { symbol: "ARM", name: "Arm Holdings", sector: "Frontier AI" },
  ],
  techGiants: [
    { symbol: "BABA", name: "Alibaba", sector: "Tech Giants" },
    { symbol: "PYPL", name: "PayPal", sector: "FinTech" },
  ],
  space: [
    { symbol: "RKLB", name: "Rocket Lab", sector: "Space" },
    { symbol: "SPACEX", name: "SpaceX", sector: "Space" },
  ],
  quantum: [
    { symbol: "IONQ", name: "IonQ", sector: "Quantum Computing" },
  ],
  hardware: [
    { symbol: "WDC", name: "Western Digital", sector: "Hardware" },
  ],
  fintech: [
    { symbol: "SOFI", name: "SoFi", sector: "FinTech" },
    { symbol: "COIN", name: "Coinbase", sector: "Crypto Exchange" },
    { symbol: "STRIPE", name: "Stripe", sector: "FinTech" },
    { symbol: "REVOLUT", name: "Revolut", sector: "FinTech" },
    { symbol: "KALSHI", name: "Kalshi", sector: "Prediction Markets" },
    { symbol: "RIPPLE", name: "Ripple", sector: "Crypto FinTech" },
  ],
  aiStartups: [
    { symbol: "ANTHROPIC", name: "Anthropic", sector: "AI Startups" },
    { symbol: "XAI", name: "xAI", sector: "AI Startups" },
    { symbol: "PERPLEXITY", name: "Perplexity", sector: "AI Startups" },
    { symbol: "SCALEAI", name: "Scale AI", sector: "AI Startups" },
  ],
  robotics: [
    { symbol: "FIGUREAI", name: "Figure AI", sector: "Robotics" },
    { symbol: "RIPCORD", name: "Ripcord", sector: "Robotics" },
    { symbol: "NEURALINK", name: "Neuralink", sector: "BCI Tech" },
  ],
  defenseTech: [
    { symbol: "ANDURIL", name: "Anduril", sector: "Defense Tech" },
  ],
};

interface StockQuote {
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
}

interface StockMetrics {
  peRatio: number | null;
  marketCap: number | null;
  beta: number | null;
  eps: number | null;
  dividendYield: number | null;
  week52High: number | null;
  week52Low: number | null;
}

interface Portfolio {
  id: string;
  symbol: string;
  shares: string;
  averagePrice: string;
  totalInvested: string;
}

export default function StocksDashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "portfolio" | "watchlist">("overview");
  const [selectedCategory, setSelectedCategory] = useState<"blueChip" | "growth" | "frontier">("blueChip");
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [metrics, setMetrics] = useState<Record<string, StockMetrics>>({});
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [watchlist, setWatchlist] = useState<Array<{ id: string; symbol: string; alertPrice: string | null }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  // Fetch real-time quotes
  useEffect(() => {
    const fetchQuotes = async () => {
      const allSymbols = [
        ...AI_STOCKS.blueChip.map(s => s.symbol),
        ...AI_STOCKS.growth.map(s => s.symbol),
        ...AI_STOCKS.frontier.map(s => s.symbol),
      ];

      try {
        const response = await fetch('/api/stocks/batch-quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbols: allSymbols }),
        });

        if (response.ok) {
          const data = await response.json();
          setQuotes(data.quotes || {});
        }
      } catch (error) {
        console.error('Error fetching quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch portfolio and watchlist
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const [portfolioRes, watchlistRes] = await Promise.all([
          fetch('/api/stocks/portfolio'),
          fetch('/api/stocks/watchlist'),
        ]);

        if (portfolioRes.ok) {
          const data = await portfolioRes.json();
          setPortfolio(data.portfolio || []);
        }

        if (watchlistRes.ok) {
          const data = await watchlistRes.json();
          setWatchlist(data.watchlist || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Fetch metrics for selected stock
  useEffect(() => {
    if (!selectedStock) return;

    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/stocks/metrics?symbol=${selectedStock}`);
        if (response.ok) {
          const data = await response.json();
          setMetrics(prev => ({
            ...prev,
            [selectedStock]: data.metrics || {},
          }));
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    if (!metrics[selectedStock]) {
      fetchMetrics();
    }
  }, [selectedStock, metrics]);

  const addToWatchlist = async (symbol: string) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/stocks/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      });

      if (response.ok) {
        const data = await response.json();
        setWatchlist([...watchlist, data.watchlist]);
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const removeFromWatchlist = async (symbol: string) => {
    try {
      const response = await fetch('/api/stocks/watchlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      });

      if (response.ok) {
        setWatchlist(watchlist.filter(w => w.symbol !== symbol));
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.some(w => w.symbol === symbol);
  };

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  const getCurrentStocks = () => {
    return AI_STOCKS[selectedCategory];
  };

  const calculatePortfolioValue = () => {
    let totalInvested = 0;
    let currentValue = 0;

    portfolio.forEach(p => {
      const shares = parseFloat(p.shares);
      const avgPrice = parseFloat(p.averagePrice);
      const quote = quotes[p.symbol];

      totalInvested += shares * avgPrice;
      if (quote) {
        currentValue += shares * quote.price;
      }
    });

    const pnl = currentValue - totalInvested;
    const pnlPercent = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0;

    return { totalInvested, currentValue, pnl, pnlPercent };
  };

  const portfolioStats = calculatePortfolioValue();

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Stocks Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Track and trade the hottest AI stocks with real-time data
                </p>
              </div>
              <Link
                href="/stocks"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
              >
                Trade Stocks
              </Link>
            </div>

            {/* Portfolio Summary */}
            {isAuthenticated && portfolio.length > 0 && (
              <div className="glass rounded-xl p-6 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Invested</div>
                    <div className="text-2xl font-bold">{formatNumber(portfolioStats.totalInvested)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Current Value</div>
                    <div className="text-2xl font-bold">{formatNumber(portfolioStats.currentValue)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total P&L</div>
                    <div className={`text-2xl font-bold ${portfolioStats.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {portfolioStats.pnl >= 0 ? '+' : ''}{formatNumber(portfolioStats.pnl)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Return</div>
                    <div className={`text-2xl font-bold ${portfolioStats.pnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {portfolioStats.pnlPercent >= 0 ? '+' : ''}{portfolioStats.pnlPercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
              {(['overview', 'portfolio', 'watchlist'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                  {tab === 'portfolio' && portfolio.length > 0 && (
                    <span className="ml-2 text-xs">({portfolio.length})</span>
                  )}
                  {tab === 'watchlist' && watchlist.length > 0 && (
                    <span className="ml-2 text-xs">({watchlist.length})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Category Selector */}
              <div className="flex gap-3">
                {(['blueChip', 'growth', 'frontier'] as const).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'glass text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {category === 'blueChip' ? 'Blue Chip AI' :
                     category === 'growth' ? 'Growth AI' :
                     'Frontier AI'}
                  </button>
                ))}
              </div>

              {/* Stocks Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">Loading stock data...</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getCurrentStocks().map((stock) => {
                    const quote = quotes[stock.symbol];
                    const stockMetrics = metrics[stock.symbol];

                    return (
                      <motion.div
                        key={stock.symbol}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-xl p-6 hover:bg-card/80 transition-all cursor-pointer"
                        onClick={() => setSelectedStock(stock.symbol)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold">{stock.symbol}</h3>
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded font-semibold">
                                {stock.sector}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">{stock.name}</div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isInWatchlist(stock.symbol)) {
                                removeFromWatchlist(stock.symbol);
                              } else {
                                addToWatchlist(stock.symbol);
                              }
                            }}
                            className={`p-2 rounded-lg transition-all ${
                              isInWatchlist(stock.symbol)
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-card hover:bg-card/80'
                            }`}
                          >
                            <svg className="w-5 h-5" fill={isInWatchlist(stock.symbol) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                        </div>

                        {quote ? (
                          <>
                            <div className="mb-4">
                              <div className="text-3xl font-bold mb-1">
                                ${quote.price.toFixed(2)}
                              </div>
                              <div className={`text-lg font-semibold ${quote.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%)
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Open</div>
                                <div className="font-semibold">${quote.open.toFixed(2)}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">High</div>
                                <div className="font-semibold text-emerald-400">${quote.high.toFixed(2)}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Low</div>
                                <div className="font-semibold text-red-400">${quote.low.toFixed(2)}</div>
                              </div>
                              {stockMetrics?.marketCap && (
                                <div>
                                  <div className="text-muted-foreground">Market Cap</div>
                                  <div className="font-semibold">{formatNumber(stockMetrics.marketCap)}</div>
                                </div>
                              )}
                            </div>

                            {stockMetrics && (
                              <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3 text-xs">
                                {stockMetrics.peRatio && (
                                  <div>
                                    <div className="text-muted-foreground">P/E Ratio</div>
                                    <div className="font-semibold">{stockMetrics.peRatio.toFixed(2)}</div>
                                  </div>
                                )}
                                {stockMetrics.eps && (
                                  <div>
                                    <div className="text-muted-foreground">EPS</div>
                                    <div className="font-semibold">${stockMetrics.eps.toFixed(2)}</div>
                                  </div>
                                )}
                                {stockMetrics.beta && (
                                  <div>
                                    <div className="text-muted-foreground">Beta</div>
                                    <div className="font-semibold">{stockMetrics.beta.toFixed(2)}</div>
                                  </div>
                                )}
                                {stockMetrics.week52High && (
                                  <div>
                                    <div className="text-muted-foreground">52W High</div>
                                    <div className="font-semibold">${stockMetrics.week52High.toFixed(2)}</div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-border flex gap-2">
                              <Link
                                href={`/stocks?symbol=${stock.symbol}`}
                                className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold text-center transition-all"
                              >
                                Trade Now
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStock(stock.symbol);
                                }}
                                className="px-4 py-2 bg-card hover:bg-card/80 rounded-lg text-sm font-semibold transition-all"
                              >
                                Details
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            Loading price data...
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              {!isAuthenticated ? (
                <div className="glass rounded-xl p-12 text-center">
                  <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className="text-xl font-bold mb-2">Login Required</h3>
                  <p className="text-muted-foreground mb-4">Please login to view your stock portfolio</p>
                  <Link
                    href="/login"
                    className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
                  >
                    Login Now
                  </Link>
                </div>
              ) : portfolio.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center">
                  <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-xl font-bold mb-2">No Stocks Yet</h3>
                  <p className="text-muted-foreground mb-4">Start building your AI stock portfolio today</p>
                  <Link
                    href="/stocks"
                    className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
                  >
                    Browse Stocks
                  </Link>
                </div>
              ) : (
                <div className="glass rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-card border-b border-border">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm font-semibold">Symbol</th>
                        <th className="text-right py-4 px-6 text-sm font-semibold">Shares</th>
                        <th className="text-right py-4 px-6 text-sm font-semibold">Avg Price</th>
                        <th className="text-right py-4 px-6 text-sm font-semibold">Current Price</th>
                        <th className="text-right py-4 px-6 text-sm font-semibold">Total Value</th>
                        <th className="text-right py-4 px-6 text-sm font-semibold">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.map((p) => {
                        const quote = quotes[p.symbol];
                        const shares = parseFloat(p.shares);
                        const avgPrice = parseFloat(p.averagePrice);
                        const currentPrice = quote?.price || 0;
                        const currentValue = shares * currentPrice;
                        const totalInvested = parseFloat(p.totalInvested);
                        const pnl = currentValue - totalInvested;
                        const pnlPercent = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0;

                        return (
                          <tr key={p.id} className="border-b border-border/50 hover:bg-card/50">
                            <td className="py-4 px-6 font-semibold">{p.symbol}</td>
                            <td className="text-right py-4 px-6">{shares.toFixed(4)}</td>
                            <td className="text-right py-4 px-6">${avgPrice.toFixed(2)}</td>
                            <td className="text-right py-4 px-6">
                              {quote ? `$${currentPrice.toFixed(2)}` : 'Loading...'}
                            </td>
                            <td className="text-right py-4 px-6 font-semibold">
                              ${currentValue.toFixed(2)}
                            </td>
                            <td className={`text-right py-4 px-6 font-semibold ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Watchlist Tab */}
          {activeTab === 'watchlist' && (
            <div className="space-y-4">
              {!isAuthenticated ? (
                <div className="glass rounded-xl p-12 text-center">
                  <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className="text-xl font-bold mb-2">Login Required</h3>
                  <p className="text-muted-foreground mb-4">Please login to view your watchlist</p>
                  <Link
                    href="/login"
                    className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
                  >
                    Login Now
                  </Link>
                </div>
              ) : watchlist.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center">
                  <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <h3 className="text-xl font-bold mb-2">No Watchlist Items</h3>
                  <p className="text-muted-foreground mb-4">Add stocks to your watchlist to track them</p>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
                  >
                    Browse Stocks
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {watchlist.map((w) => {
                    const quote = quotes[w.symbol];
                    const stock = [
                      ...AI_STOCKS.blueChip,
                      ...AI_STOCKS.growth,
                      ...AI_STOCKS.frontier,
                    ].find(s => s.symbol === w.symbol);

                    return (
                      <div key={w.id} className="glass rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold">{w.symbol}</h3>
                              {stock && (
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded font-semibold">
                                  {stock.sector}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{stock?.name || 'Unknown'}</div>
                          </div>
                          <button
                            onClick={() => removeFromWatchlist(w.symbol)}
                            className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {quote ? (
                          <>
                            <div className="mb-4">
                              <div className="text-3xl font-bold mb-1">
                                ${quote.price.toFixed(2)}
                              </div>
                              <div className={`text-lg font-semibold ${quote.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%)
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                              <div>
                                <div className="text-muted-foreground">High</div>
                                <div className="font-semibold text-emerald-400">${quote.high.toFixed(2)}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Low</div>
                                <div className="font-semibold text-red-400">${quote.low.toFixed(2)}</div>
                              </div>
                            </div>

                            <Link
                              href={`/stocks?symbol=${w.symbol}`}
                              className="block w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold text-center transition-all"
                            >
                              Trade Now
                            </Link>
                          </>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            Loading...
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
