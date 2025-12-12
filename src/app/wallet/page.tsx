"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import { DepositModal, WithdrawModal } from "@/components/DepositWithdrawModals";
import {
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Download,
  Send,
  History,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface WalletBalance {
  asset: string;
  name: string;
  balance: number;
  lockedBalance: number;
  usdValue: number;
  change24h: number;
  icon: string;
}

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "transfer";
  asset: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "processing";
  timestamp: string;
  txHash?: string;
  fee?: number;
}

export default function WalletPage() {
  const { user } = useAuth();
  const [hideBalances, setHideBalances] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "spot" | "futures" | "staking">("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedRef = useRef(false);

  // Real wallet data from API
  const [wallets, setWallets] = useState<WalletBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Asset metadata
  const assetNames: Record<string, string> = {
    'USDT': 'Tether',
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'BNB': 'BNB',
    'SOL': 'Solana',
    'USDC': 'USD Coin',
    'XRP': 'Ripple',
    'ADA': 'Cardano',
    'DOGE': 'Dogecoin',
    'MATIC': 'Polygon',
  };

  const assetIcons: Record<string, string> = {
    'USDT': '₮',
    'BTC': '₿',
    'ETH': 'Ξ',
    'BNB': 'B',
    'SOL': '◎',
    'USDC': '$',
    'XRP': '✕',
    'ADA': '₳',
    'DOGE': 'Ð',
    'MATIC': '⬡',
  };

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
          const walletsData = data.wallets.map((w: any) => ({
            asset: w.asset,
            name: assetNames[w.asset] || w.asset,
            balance: parseFloat(w.balance),
            lockedBalance: parseFloat(w.lockedBalance),
            usdValue: parseFloat(w.usdValue) || 0, // Use API's calculated USD value
            change24h: 0, // Would need historical price data
            icon: assetIcons[w.asset] || '○',
          }));

          setWallets(walletsData);
        }
      }
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
    }
  }, []);

  // Fetch transaction history from API
  const fetchTransactions = useCallback(async () => {
    try {
      const token = localStorage.getItem('atlasprime_token');
      const response = await fetch('/api/transactions?limit=50', {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.transactions) {
          setTransactions(data.transactions);
          console.log('✅ Transactions loaded:', data.transactions.length, 'transactions');
        }
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  }, []);

  // Initial load - only once per session
  useEffect(() => {
    if (!user || hasLoadedRef.current) return;

    const loadData = async () => {
      hasLoadedRef.current = true;
      setLoading(true);
      await Promise.all([fetchWallets(), fetchTransactions()]);
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
  //     fetchTransactions();
  //   }, 30000);
  //   return () => clearInterval(interval);
  // }, [user, fetchWallets, fetchTransactions]);

  // Event listener REMOVED - use manual refresh button only
  // No automatic refreshes of any kind

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchWallets(), fetchTransactions()]);
    setRefreshing(false);
  };

  // Handle modal close - NO AUTO-REFRESH
  const handleModalClose = (modalName: string) => {
    if (modalName === 'deposit') setShowDepositModal(false);
    if (modalName === 'withdraw') setShowWithdrawModal(false);
    if (modalName === 'transfer') setShowTransferModal(false);
    // User must click manual refresh button to see updated balance
  };

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.usdValue, 0);
  const totalLocked = wallets.reduce((sum, wallet) => sum + (wallet.lockedBalance * wallet.usdValue / (wallet.balance || 1)), 0);
  const availableBalance = totalBalance - totalLocked;

  const filteredWallets = wallets.filter(wallet =>
    wallet.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wallet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return hideBalances ? "****" : `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatCrypto = (amount: number, decimals: number = 8) => {
    return hideBalances ? "****" : amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: decimals });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Navigation />
        <main className="min-h-screen pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 animate-spin text-emerald-400 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading wallet data...</p>
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
              <h1 className="text-4xl font-bold gradient-text mb-2">Wallet</h1>
              <p className="text-muted-foreground">Manage your crypto assets</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 hover:bg-card rounded-lg transition-all disabled:opacity-50"
                title="Refresh balances"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setHideBalances(!hideBalances)}
                className="p-2 hover:bg-card rounded-lg transition-all"
              >
                {hideBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>

          {/* Balance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">Total Balance</div>
                <Wallet className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold mb-2">{formatCurrency(totalBalance)}</div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">+2.45% (24h)</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">Available Balance</div>
                <CheckCircle className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold mb-2">{formatCurrency(availableBalance)}</div>
              <div className="text-sm text-muted-foreground">Ready to trade</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">In Orders</div>
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-3xl font-bold mb-2">{formatCurrency(totalLocked)}</div>
              <div className="text-sm text-muted-foreground">Locked in trades</div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-xl p-6 mb-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setShowDepositModal(true)}
                className="p-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all group"
              >
                <ArrowDownToLine className="w-6 h-6 text-emerald-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-emerald-400">Deposit</div>
              </button>

              <button
                onClick={() => setShowWithdrawModal(true)}
                className="p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-all group"
              >
                <ArrowUpFromLine className="w-6 h-6 text-red-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-red-400">Withdraw</div>
              </button>

              <button
                onClick={() => setShowTransferModal(true)}
                className="p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-all group"
              >
                <Send className="w-6 h-6 text-blue-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-blue-400">Transfer</div>
              </button>

              <button
                onClick={() => {
                  const historySection = document.getElementById('transaction-history');
                  if (historySection) {
                    historySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl transition-all group"
              >
                <History className="w-6 h-6 text-purple-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-purple-400">History</div>
              </button>
            </div>
          </motion.div>

          {/* Assets List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Assets</h2>
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Wallets</option>
                  <option value="spot">Spot</option>
                  <option value="futures">Futures</option>
                  <option value="staking">Staking</option>
                </select>
              </div>
            </div>

            {/* Assets Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Asset</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Total Balance</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Available</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">In Order</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">USD Value</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">24h Change</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWallets.length > 0 ? (
                    filteredWallets.map((wallet, index) => (
                      <motion.tr
                        key={wallet.asset}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="border-b border-border/50 hover:bg-card/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                              {wallet.icon}
                            </div>
                            <div>
                              <div className="font-semibold">{wallet.asset}</div>
                              <div className="text-xs text-muted-foreground">{wallet.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="font-semibold">{formatCrypto(wallet.balance, 8)}</div>
                          <div className="text-xs text-muted-foreground">{wallet.asset}</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="font-semibold">{formatCrypto(wallet.balance - wallet.lockedBalance, 8)}</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="font-semibold">{formatCrypto(wallet.lockedBalance, 8)}</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="font-semibold">{formatCurrency(wallet.usdValue)}</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className={`font-semibold ${wallet.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {wallet.change24h >= 0 ? '+' : ''}{wallet.change24h}%
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        No assets found. Deposit to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Transaction History */}
          <motion.div
            id="transaction-history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Transactions</h2>
              <button
                onClick={() => {
                  if (transactions.length === 0) {
                    alert('No transactions to export');
                    return;
                  }

                  // Create CSV content
                  const headers = ['Date', 'Type', 'Asset', 'Amount', 'Status', 'Transaction ID'];
                  const csvRows = [headers.join(',')];

                  transactions.forEach(tx => {
                    const row = [
                      new Date(tx.timestamp).toLocaleString(),
                      tx.type.toUpperCase(),
                      tx.asset,
                      tx.amount,
                      tx.status.toUpperCase(),
                      tx.id
                    ];
                    csvRows.push(row.join(','));
                  });

                  const csvContent = csvRows.join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
            </div>

            <div className="space-y-3">
              {transactions.length > 0 ? (
                transactions.map((tx, index) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="p-4 bg-card/30 rounded-lg hover:bg-card/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'deposit' ? 'bg-emerald-500/20 text-emerald-400' :
                          tx.type === 'withdrawal' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {tx.type === 'deposit' ? <ArrowDownToLine className="w-5 h-5" /> :
                           tx.type === 'withdrawal' ? <ArrowUpFromLine className="w-5 h-5" /> :
                           <Send className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-semibold capitalize">{tx.type}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold">
                          {tx.type === 'withdrawal' ? '-' : '+'}{tx.amount} {tx.asset}
                        </div>
                        <div className="flex items-center gap-2 justify-end mt-1">
                          {tx.status === 'completed' && (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              <span className="text-xs text-emerald-400">Completed</span>
                            </>
                          )}
                          {(tx.status === 'pending' || tx.status === 'processing') && (
                            <>
                              <Clock className="w-4 h-4 text-orange-400" />
                              <span className="text-xs text-orange-400 capitalize">{tx.status}</span>
                            </>
                          )}
                          {tx.status === 'failed' && (
                            <>
                              <XCircle className="w-4 h-4 text-red-400" />
                              <span className="text-xs text-red-400">Failed</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  No transactions yet. Make a deposit to get started!
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDepositModal && (
          <DepositModal onClose={() => handleModalClose('deposit')} />
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <WithdrawModal onClose={() => handleModalClose('withdraw')} />
        )}
      </AnimatePresence>

      {/* Transfer Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <TransferModal onClose={() => handleModalClose('transfer')} />
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}

// Transfer Modal Component
function TransferModal({ onClose }: { onClose: () => void }) {
  const [fromWallet, setFromWallet] = useState("spot");
  const [toWallet, setToWallet] = useState("futures");
  const [selectedAsset, setSelectedAsset] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch actual wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
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
            const wallet = data.wallets.find((w: any) => w.asset === selectedAsset);
            setAvailableBalance(wallet ? parseFloat(wallet.balance) : 0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [selectedAsset]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Transfer Assets</h2>
          <button onClick={onClose} className="p-2 hover:bg-card rounded-lg transition-all">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* From */}
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <select
              value={fromWallet}
              onChange={(e) => setFromWallet(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="spot">Spot Wallet</option>
              <option value="futures">Futures Wallet</option>
              <option value="staking">Staking Wallet</option>
            </select>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <select
              value={toWallet}
              onChange={(e) => setToWallet(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="futures">Futures Wallet</option>
              <option value="spot">Spot Wallet</option>
              <option value="staking">Staking Wallet</option>
            </select>
          </div>

          {/* Asset */}
          <div>
            <label className="block text-sm font-medium mb-2">Asset</label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="USDT">USDT - Tether</option>
              <option value="BTC">BTC - Bitcoin</option>
              <option value="ETH">ETH - Ethereum</option>
              <option value="BNB">BNB - BNB</option>
              <option value="SOL">SOL - Solana</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 pr-20 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => setAmount(availableBalance.toString())}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300"
                type="button"
              >
                Max
              </button>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {loading ? 'Loading...' : `Available: ${availableBalance.toLocaleString()} ${selectedAsset}`}
            </div>
          </div>

          <button
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Transfer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
