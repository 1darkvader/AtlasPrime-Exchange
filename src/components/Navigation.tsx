"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Debug: Log auth state in Navigation
  useEffect(() => {
    console.log('🔍 Navigation Auth State:', {
      isAuthenticated,
      hasUser: !!user,
      userName: user?.username,
      combined: isAuthenticated && user
    });
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center glow">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                  <span className="text-xl font-bold gradient-text">AtlasPrime</span>
                </motion.div>
              </Link>
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
                    <Link href="/trade/spot" className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                      Spot Trading
                    </Link>
                    <Link href="/trade/margin" className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                      Margin Trading
                    </Link>
                    <Link href="/trade/p2p" className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                      P2P Trading
                    </Link>
                  </div>
                </div>
                <Link href="/derivatives" className="px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                  Derivatives
                </Link>
                <Link href="/futures" className="px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                  Futures
                </Link>
                <Link href="/spot" className="px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                  Spot
                </Link>
                <div className="relative group">
                  <button className="px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all flex items-center space-x-1">
                    <span>Stocks</span>
                    <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-full">New</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-56 glass rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link href="/stocks" className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                      Trade Stocks
                    </Link>
                    <Link href="/stocks/dashboard" className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center justify-between">
                      <span>AI Stocks Dashboard</span>
                      <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">NEW</span>
                    </Link>
                  </div>
                </div>
                <Link href="/earn" className="px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                  Earn
                </Link>
                <Link href="/bot" className="px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all flex items-center space-x-1">
                  <span>Bot</span>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">AI</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>


                  {/* User Menu (Desktop) */}
                  <div className="hidden md:block relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-card/50 rounded-lg transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold">{user.username}</div>
                        <div className="text-xs text-muted-foreground">
                          {(user.kycStatus === "verified" || user.kycStatus === "VERIFIED") ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Verified
                            </span>
                          ) : (
                            "Not Verified"
                          )}
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-64 glass rounded-xl py-2 shadow-xl border border-border"
                        >
                          <div className="px-4 py-3 border-b border-border">
                            <div className="font-semibold">{user.username}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                          <Link href="/portfolio" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                            Portfolio
                          </Link>
                          <Link href="/wallet" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                            Wallet
                          </Link>
                          <Link href="/orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                            Orders
                          </Link>
                          <Link href="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                            Account Settings
                          </Link>
                          {(user.kycStatus !== "verified" && user.kycStatus !== "VERIFIED") && (
                            <Link href="/kyc" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-orange-400 hover:bg-orange-500/10 transition-colors">
                              Complete KYC Verification
                            </Link>
                          )}
                          <div className="border-t border-border mt-2 pt-2">
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="hidden md:block px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Log in
                  </Link>
                  <Link href="/signup" className="hidden md:block px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium glow hover:shadow-2xl transition-all">
                    Sign up
                  </Link>
                </>
              )}
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
                <Link href="/trade/spot" className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all ml-4">
                  Spot Trading
                </Link>
                <Link href="/trade/margin" className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all ml-4">
                  Margin Trading
                </Link>
                <Link href="/trade/p2p" className="block px-4 py-2 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all ml-4">
                  P2P Trading
                </Link>
              </div>
              <Link href="/derivatives" className="block px-4 py-3 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                Derivatives
              </Link>
              <Link href="/futures" className="block px-4 py-3 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                Futures
              </Link>
              <Link href="/spot" className="block px-4 py-3 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                Spot
              </Link>
              <Link href="/stocks" className="block px-4 py-3 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all flex items-center justify-between">
                <span>Stocks</span>
                <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-full">New</span>
              </Link>
              <Link href="/earn" className="block px-4 py-3 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                Earn
              </Link>
              <div className="pt-4 mt-4 border-t border-border space-y-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-3 bg-card/30 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold">{user.username}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>

                    </div>
                    <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                      Portfolio
                    </Link>
                    <Link href="/wallet" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                      Wallet
                    </Link>
                    <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                      Orders
                    </Link>
                    <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                      Account Settings
                    </Link>
                    {(user.kycStatus !== "verified" && user.kycStatus !== "VERIFIED") && (
                      <Link href="/kyc" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm text-orange-400 hover:bg-orange-500/10 rounded-lg transition-all">
                        Complete KYC Verification
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all text-left">
                      Log in
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium glow hover:shadow-2xl transition-all text-center">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Live Stats Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-card/50 backdrop-blur-md border-b border-border">
        <div className="overflow-hidden">
          <div className="flex animate-scroll">
            {[
              { symbol: "BTC", price: 91365.79, change: 4.14, icon: "₿" },
              { symbol: "ETH", price: 3020.20, change: 2.32, icon: "Ξ" },
              { symbol: "SOL", price: 141.98, change: 3.6, icon: "◎" },
              { symbol: "BNB", price: 623.45, change: -1.2, icon: "B" },
              { symbol: "XRP", price: 2.21, change: 1.03, icon: "✕" },
              { symbol: "ADA", price: 0.89, change: -0.5, icon: "₳" },
              { symbol: "DOGE", price: 0.32, change: 5.8, icon: "Ð" },
              { symbol: "AVAX", price: 38.45, change: 2.1, icon: "▲" },
            ].concat([
              { symbol: "BTC", price: 91365.79, change: 4.14, icon: "₿" },
              { symbol: "ETH", price: 3020.20, change: 2.32, icon: "Ξ" },
              { symbol: "SOL", price: 141.98, change: 3.6, icon: "◎" },
              { symbol: "BNB", price: 623.45, change: -1.2, icon: "B" },
              { symbol: "XRP", price: 2.21, change: 1.03, icon: "✕" },
              { symbol: "ADA", price: 0.89, change: -0.5, icon: "₳" },
              { symbol: "DOGE", price: 0.32, change: 5.8, icon: "Ð" },
              { symbol: "AVAX", price: 38.45, change: 2.1, icon: "▲" },
            ]).map((crypto, index) => (
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
    </>
  );
}
