"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import Sparkline from "@/components/Sparkline";

const TradingChart = dynamic(() => import("@/components/TradingChart"), {
  ssr: false,
});

// Mock crypto data
const cryptoData = [
  { symbol: "BTC", name: "Bitcoin", price: 91365.79, change: 4.14, icon: "₿" },
  { symbol: "ETH", name: "Ethereum", price: 3020.20, change: 2.32, icon: "Ξ" },
  { symbol: "SOL", name: "Solana", price: 141.98, change: 3.6, icon: "◎" },
  { symbol: "BNB", name: "BNB", price: 623.45, change: -1.2, icon: "B" },
  { symbol: "XRP", name: "Ripple", price: 2.21, change: 1.03, icon: "✕" },
  { symbol: "ADA", name: "Cardano", price: 0.89, change: -0.5, icon: "₳" },
  { symbol: "DOGE", name: "Dogecoin", price: 0.32, change: 5.8, icon: "Ð" },
  { symbol: "AVAX", name: "Avalanche", price: 38.45, change: 2.1, icon: "▲" },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats] = useState({
    users: "15M+",
    volume24h: "$18.4B",
    assets: "500+",
    countries: "180+",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center glow">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="text-xl font-bold gradient-text">AtlasPrime</span>
              </motion.div>
              <div className="hidden lg:flex items-center space-x-1">
                <Link href="/markets" className="px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                  Markets
                </Link>
                <div className="relative group">
                  <button className="px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all flex items-center space-x-1">
                    <span>Trade</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 glass rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <a href="#" className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                      Spot Trading
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                      Margin Trading
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                      P2P Trading
                    </a>
                  </div>
                </div>
                <a href="#" className="px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                  Derivatives
                </a>
                <a href="#" className="px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                  Futures
                </a>
                <a href="#" className="px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                  Spot
                </a>
                <a href="#" className="px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all flex items-center space-x-1">
                  <span>Stocks</span>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-full">New</span>
                </a>
                <a href="#" className="px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                  Earn
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="hidden md:block px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="hidden md:block px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium glow hover:shadow-2xl transition-all">
                Sign up
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-muted-foreground hover:text-emerald-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden glass border-t border-border"
          >
            <div className="px-4 py-4 space-y-2">
              <Link href="/markets" className="block px-4 py-3 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                Markets
              </Link>
              <div className="space-y-1">
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">Trade</div>
                <a href="#" className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all ml-4">
                  Spot Trading
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all ml-4">
                  Margin Trading
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all ml-4">
                  P2P Trading
                </a>
              </div>
              <a href="#" className="block px-4 py-3 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                Derivatives
              </a>
              <a href="#" className="block px-4 py-3 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                Futures
              </a>
              <a href="#" className="block px-4 py-3 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                Spot
              </a>
              <a href="#" className="block px-4 py-3 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all flex items-center justify-between">
                <span>Stocks</span>
                <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-full">New</span>
              </a>
              <a href="#" className="block px-4 py-3 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                Earn
              </a>
              <div className="pt-4 mt-4 border-t border-border space-y-2">
                <Link href="/login" className="block w-full px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all text-left">
                  Log in
                </Link>
                <Link href="/signup" className="block w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium glow hover:shadow-2xl transition-all text-center">
                  Sign up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Live Stats Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-card/50 backdrop-blur-md border-b border-border">
        <div className="overflow-hidden">
          <div className="flex animate-scroll">
            {[...cryptoData, ...cryptoData].map((crypto, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 px-6 py-2 whitespace-nowrap border-r border-border/50"
              >
                <span className="text-lg">{crypto.icon}</span>
                <span className="text-sm font-medium">{crypto.symbol}</span>
                <span className="text-sm">${crypto.price.toLocaleString()}</span>
                <span className={`text-sm ${crypto.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {crypto.change > 0 ? '+' : ''}{crypto.change}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 animated-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Trade the Future with{" "}
                <span className="gradient-text glow-text">AtlasPrime</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Join millions of traders worldwide. Access 500+ cryptocurrencies with advanced tools, lightning-fast execution, and institutional-grade security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-lg font-semibold glow hover:shadow-2xl transition-all text-center">
                  Start Trading Now
                </Link>
                <Link href="/markets" className="px-8 py-4 glass text-white rounded-xl text-lg font-semibold hover:bg-white/10 transition-all text-center">
                  Explore Markets
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                {Object.entries(stats).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold gradient-text count-up">{value}</div>
                    <div className="text-sm text-muted-foreground mt-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="glass rounded-2xl p-6 card-hover">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Market Overview</h3>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                    Live
                  </span>
                </div>
                <div className="space-y-3">
                  {cryptoData.slice(0, 5).map((crypto) => (
                    <div
                      key={crypto.symbol}
                      className="flex items-center justify-between p-4 bg-background/50 rounded-xl hover:bg-background/70 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                          {crypto.icon}
                        </div>
                        <div>
                          <div className="font-semibold">{crypto.symbol}</div>
                          <div className="text-sm text-muted-foreground">{crypto.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Sparkline positive={crypto.change > 0} />
                        <div className="text-right">
                          <div className="font-semibold">${crypto.price.toLocaleString()}</div>
                          <div className={`text-sm ${crypto.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {crypto.change > 0 ? '+' : ''}{crypto.change}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background to-card/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Professional-grade tools and features for traders of all levels
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Spot Trading",
                description: "Trade over 500 cryptocurrencies with zero fees on maker orders and deep liquidity.",
                icon: "📊",
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                title: "Futures Trading",
                description: "Up to 125x leverage on perpetual and quarterly futures with advanced risk management.",
                icon: "📈",
                gradient: "from-teal-500 to-cyan-500",
              },
              {
                title: "Earn & Stake",
                description: "Grow your portfolio with flexible staking, savings, and liquidity mining programs.",
                icon: "💎",
                gradient: "from-cyan-500 to-emerald-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="glass rounded-2xl p-8 card-hover group cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Dashboard Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 animated-gradient relative overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Advanced Trading{" "}
              <span className="gradient-text">Platform</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Professional charts, real-time data, and powerful analytics
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 overflow-hidden border border-emerald-500/20"
          >
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Order Book */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                  Order Book
                </h3>
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-red-400">${(91000 - i * 50).toLocaleString()}</span>
                      <span className="text-muted-foreground">{(Math.random() * 2).toFixed(4)}</span>
                      <span className="text-muted-foreground">${(Math.random() * 100000).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-emerald-500/50 my-2 pt-2">
                    <div className="text-center text-emerald-400 font-semibold">$91,365.79</div>
                  </div>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-emerald-400">${(91000 + i * 50).toLocaleString()}</span>
                      <span className="text-muted-foreground">{(Math.random() * 2).toFixed(4)}</span>
                      <span className="text-muted-foreground">${(Math.random() * 100000).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Chart */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">BTC/USDT</h3>
                <div className="bg-background/50 rounded-xl p-4">
                  <TradingChart />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-card/50 via-background to-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Security You Can{" "}
              <span className="gradient-text">Trust</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Industry-leading protection for your assets
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Cold Storage",
                description: "95% of assets stored in offline multi-signature wallets",
                icon: "🔐",
              },
              {
                title: "Insurance Fund",
                description: "$500M protection fund to safeguard user assets",
                icon: "🛡️",
              },
              {
                title: "2FA & Biometric",
                description: "Advanced authentication with biometric security",
                icon: "🔒",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="glass rounded-2xl p-8 text-center card-hover"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 animated-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join AtlasPrime today and get up to $5,000 in welcome bonuses
            </p>
            <Link href="/signup" className="inline-block px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-lg font-semibold glow hover:shadow-2xl transition-all">
              Create Your Account
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="text-xl font-bold gradient-text">AtlasPrime</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The world's leading cryptocurrency exchange platform
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/spot" className="hover:text-emerald-400 transition-colors">Spot Trading</Link></li>
                <li><Link href="/futures" className="hover:text-emerald-400 transition-colors">Futures</Link></li>
                <li><Link href="/earn" className="hover:text-emerald-400 transition-colors">Earn</Link></li>
                <li><Link href="/nft" className="hover:text-emerald-400 transition-colors">NFT</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-emerald-400 transition-colors">Help Center</Link></li>
                <li><Link href="/trading-guide" className="hover:text-emerald-400 transition-colors">Trading Guide</Link></li>
                <li><Link href="/api-docs" className="hover:text-emerald-400 transition-colors">API Docs</Link></li>
                <li><Link href="/fees" className="hover:text-emerald-400 transition-colors">Fees</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-emerald-400 transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 AtlasPrime Exchange. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
