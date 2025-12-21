"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { RefreshCw } from "lucide-react";

export default function PortfolioPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wallets, setWallets] = useState<any[]>([]);
  const hasLoadedRef = useRef(false);

  // Fetch wallet balances from API
  const fetchWallets = useCallback(async () => {
    try {
      const token = localStorage.getItem('atlasprime_token');
      const response = await fetch('/api/wallets', {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.wallets) {
          setWallets(data.wallets);
        }
      }
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
    }
  }, []);

  // Initial load - only once per session
  useEffect(() => {
    const loadData = async () => {
      if (!user || hasLoadedRef.current) return;

      hasLoadedRef.current = true;
      setLoading(true);
      await fetchWallets();
      setLoading(false);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only depend on user ID, not entire user object

  // Auto-refresh REMOVED - user can use manual refresh button
  // useEffect(() => {
  //   if (!user) return;
  //   const interval = setInterval(() => {
  //     fetchWallets();
  //   }, 30000);
  //   return () => clearInterval(interval);
  // }, [user, fetchWallets]);

  // Event listener REMOVED - use manual refresh button only
  // No automatic refreshes of any kind

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWallets();
    setRefreshing(false);
  };

  // Calculate portfolio stats from real data with USD values
  const totalBalance = wallets.reduce((sum, w) => sum + (parseFloat(w.usdValue) || 0), 0);
  const totalLocked = wallets.reduce((sum, w) => {
    const locked = parseFloat(w.lockedBalance) || 0;
    const total = parseFloat(w.balance) || 0;
    const usdValue = parseFloat(w.usdValue) || 0;
    return sum + (total > 0 ? (locked / total) * usdValue : 0);
  }, 0);
  const availableBalance = totalBalance - totalLocked;

  // Mock portfolio data
  const portfolioStats = {
    totalBalance,
    totalPNL: 0,
    pnlPercentage: 0,
    availableBalance,
    inOrders: totalLocked,
  };

  const holdings = wallets.filter(w => parseFloat(w.balance) > 0).map(w => ({
    asset: w.asset,
    balance: parseFloat(w.balance),
    lockedBalance: parseFloat(w.lockedBalance),
  }));

  const recentActivities = [
    {
      id: 1,
      type: "account_created",
      description: "Account created and verified",
      timestamp: user?.createdAt || new Date().toISOString(),
    },
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <Navigation />
        <main className="min-h-screen pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 animate-spin text-emerald-400 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading portfolio data...</p>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navigation />
      <main className="min-h-screen pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Portfolio Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.username}!</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-card rounded-lg transition-all disabled:opacity-50"
              title="Refresh portfolio"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </motion.div>

          {/* Account Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">Total Balance</div>
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="text-3xl font-bold">${portfolioStats.totalBalance.toLocaleString()}</div>
              <div className="text-sm text-emerald-400 mt-2">+{portfolioStats.pnlPercentage.toFixed(2)}%</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">Available</div>
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold">${portfolioStats.availableBalance.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-2">Ready to trade</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">In Orders</div>
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-3xl font-bold">${portfolioStats.inOrders.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-2">Active orders</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">Total P&L</div>
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-emerald-400">+${portfolioStats.totalPNL.toLocaleString()}</div>
              <div className="text-sm text-emerald-400 mt-2">All time</div>
            </motion.div>
          </div>

          {/* Account Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-xl p-6 mb-8"
          >
            <h2 className="text-xl font-bold mb-4">Account Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Email Verification</div>
                <div className="flex items-center gap-2">
                  {user?.emailVerified ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-emerald-400 font-semibold">Verified</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-orange-400 font-semibold">Pending</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">KYC Status</div>
                <div className="flex items-center gap-2">
                  {(user?.kycStatus === "verified" || user?.kycStatus === "VERIFIED") ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-emerald-400 font-semibold">Verified</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-orange-400 font-semibold">Not Verified</span>
                      <Link href="/kyc" className="ml-2 text-xs text-blue-400 hover:underline">
                        Complete KYC
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">2FA Security</div>
                <div className="flex items-center gap-2">
                  {user?.twoFactorEnabled ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-emerald-400 font-semibold">Enabled</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-red-400 font-semibold">Disabled</span>
                      <Link href="/account/security" className="ml-2 text-xs text-blue-400 hover:underline">
                        Enable
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Holdings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-4">Holdings</h2>
              {holdings.length > 0 ? (
                <div className="space-y-3">
                  {/* Holdings will be listed here */}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-muted-foreground mb-4">No holdings yet</p>
                  <Link href="/trade/spot" className="inline-block px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                    Start Trading
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-card/30 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 glass rounded-xl p-6"
          >
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/trade/spot" className="p-4 bg-card hover:bg-card/80 rounded-lg transition-all text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div className="font-semibold">Spot Trading</div>
              </Link>

              <Link href="/futures" className="p-4 bg-card hover:bg-card/80 rounded-lg transition-all text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <div className="font-semibold">Futures</div>
              </Link>

              <Link href="/earn" className="p-4 bg-card hover:bg-card/80 rounded-lg transition-all text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="font-semibold">Earn</div>
              </Link>

              <Link href="/account" className="p-4 bg-card hover:bg-card/80 rounded-lg transition-all text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="font-semibold">Settings</div>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
