"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import { DEPOSIT_NETWORKS, getNetworksByToken, type DepositAddress } from "@/lib/depositWallets";
import {
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Filter,
  Download,
  Send,
  History,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  ExternalLink
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
  status: "pending" | "completed" | "failed";
  timestamp: string;
  txHash?: string;
  fee?: number;
}

export default function WalletPage() {
  const { user } = useAuth();
  const [hideBalances, setHideBalances] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "spot" | "futures" | "staking">("all");

  // Mock wallet data - will be replaced with real data from API
  const [wallets, setWallets] = useState<WalletBalance[]>([
    // Wallets will be populated from database
    { asset: "USDT", name: "Tether", balance: 0, lockedBalance: 0, usdValue: 0, change24h: 0, icon: "₮" },
    { asset: "BTC", name: "Bitcoin", balance: 0, lockedBalance: 0, usdValue: 0, change24h: 0, icon: "₿" },
    { asset: "ETH", name: "Ethereum", balance: 0, lockedBalance: 0, usdValue: 0, change24h: 0, icon: "Ξ" },
  ]);

  // Transaction history
  const [transactions, setTransactions] = useState<Transaction[]>([
    // Transactions will be populated from database
  ]);

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.usdValue, 0);
  const totalLocked = wallets.reduce((sum, wallet) => sum + (wallet.lockedBalance * wallet.usdValue / wallet.balance), 0);
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
            <button
              onClick={() => setHideBalances(!hideBalances)}
              className="p-2 hover:bg-card rounded-lg transition-all"
            >
              {hideBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
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

              <button className="p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl transition-all group">
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
                  {filteredWallets.map((wallet, index) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Transactions</h2>
              <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
            </div>

            <div className="space-y-3">
              {transactions.map((tx, index) => (
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
                        {tx.status === 'pending' && (
                          <>
                            <Clock className="w-4 h-4 text-orange-400" />
                            <span className="text-xs text-orange-400">Pending</span>
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
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDepositModal && (
          <DepositModal onClose={() => setShowDepositModal(false)} />
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <WithdrawModal onClose={() => setShowWithdrawModal(false)} />
        )}
      </AnimatePresence>

      {/* Transfer Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <TransferModal onClose={() => setShowTransferModal(false)} />
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}

// Deposit Modal Component
function DepositModal({ onClose }: { onClose: () => void }) {
  const [selectedAsset, setSelectedAsset] = useState("USDT");
  const [selectedNetwork, setSelectedNetwork] = useState<DepositAddress | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchNetwork, setSearchNetwork] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingQR, setLoadingQR] = useState(false);

  // Get available networks for selected asset
  const availableNetworks = getNetworksByToken(selectedAsset);

  // Set default network when asset changes
  useEffect(() => {
    if (availableNetworks.length > 0 && !selectedNetwork) {
      setSelectedNetwork(availableNetworks[0]);
    }
  }, [selectedAsset, availableNetworks, selectedNetwork]);

  // Generate QR code when network changes
  useEffect(() => {
    if (selectedNetwork) {
      setLoadingQR(true);
      fetch(`/api/qrcode?address=${encodeURIComponent(selectedNetwork.address)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setQrCode(data.qrCode);
          }
        })
        .catch(err => console.error('QR code error:', err))
        .finally(() => setLoadingQR(false));
    }
  }, [selectedNetwork]);

  const handleCopyAddress = () => {
    if (selectedNetwork) {
      navigator.clipboard.writeText(selectedNetwork.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNetworkSelect = (network: DepositAddress) => {
    setSelectedNetwork(network);
    setSearchNetwork("");
  };

  const filteredNetworks = availableNetworks.filter(n =>
    n.chain.toLowerCase().includes(searchNetwork.toLowerCase()) ||
    n.network.toLowerCase().includes(searchNetwork.toLowerCase())
  );

  // Popular assets
  const popularAssets = ["USDT", "USDC", "BTC", "ETH", "BNB", "SOL", "MATIC", "AVAX", "ADA", "XRP"];

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
        className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Deposit Crypto</h2>
          <button onClick={onClose} className="p-2 hover:bg-card rounded-lg transition-all">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Select Asset */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Asset</label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {popularAssets.map((asset) => (
                <button
                  key={asset}
                  onClick={() => setSelectedAsset(asset)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedAsset === asset
                      ? "bg-emerald-500 text-white"
                      : "bg-card hover:bg-card/80 text-muted-foreground"
                  }`}
                >
                  {asset}
                </button>
              ))}
            </div>
          </div>

          {/* Select Network */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Network ({availableNetworks.length} available)
            </label>

            {/* Network Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchNetwork}
                onChange={(e) => setSearchNetwork(e.target.value)}
                placeholder="Search networks..."
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Networks Grid */}
            <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
              {filteredNetworks.map((network) => (
                <button
                  key={network.chain + network.network}
                  onClick={() => handleNetworkSelect(network)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedNetwork?.chain === network.chain
                      ? "bg-emerald-500/20 border-2 border-emerald-500"
                      : "bg-card border border-border hover:bg-card/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{network.chain}</div>
                      <div className="text-xs text-muted-foreground">{network.network}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{network.chainType}</div>
                      <div className="text-xs font-mono text-emerald-400">{network.nativeCoin}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Deposit Address */}
          {selectedNetwork && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Deposit Address</label>
                <div className="p-4 bg-card border border-border rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground">
                      {selectedNetwork.chain} Network
                    </span>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded font-semibold">
                      {selectedNetwork.chainType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 p-3 bg-background rounded-lg">
                      <div className="text-xs font-mono break-all">
                        {selectedNetwork.address}
                      </div>
                    </div>
                    <button
                      onClick={handleCopyAddress}
                      className="p-3 hover:bg-background rounded-lg transition-all"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* QR Code */}
                  <div className="mt-4 flex justify-center">
                    {loadingQR ? (
                      <div className="w-64 h-64 bg-background rounded-lg flex items-center justify-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : qrCode ? (
                      <div className="p-4 bg-white rounded-lg">
                        <img
                          src={qrCode}
                          alt={`QR Code for ${selectedNetwork.address}`}
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-64 h-64 bg-background rounded-lg flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <div className="text-sm mb-2">QR Code</div>
                          <div className="text-xs">Generating...</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedNetwork.blockExplorer && (
                    <a
                      href={selectedNetwork.blockExplorer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-all mt-3"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on Block Explorer
                    </a>
                  )}
                </div>
              </div>

              {/* Supported Tokens */}
              {selectedNetwork.supportedTokens.length > 1 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Supported Tokens on {selectedNetwork.chain}</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedNetwork.supportedTokens.map((token) => (
                      <span
                        key={token}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-semibold"
                      >
                        {token}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-400">
                    <strong>Important:</strong> Only send {selectedAsset} to this address via {selectedNetwork.chain} network.
                    {selectedNetwork.chainType === 'EVM' && (
                      <span> This EVM address can receive any token that starts with 0x on {selectedNetwork.chain}.</span>
                    )}
                    {selectedNetwork.chainType !== 'EVM' && (
                      <span> Sending any other asset may result in permanent loss.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Network Info */}
              {selectedNetwork.chainId && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Chain ID: <span className="font-semibold">{selectedNetwork.chainId}</span></div>
                  {selectedNetwork.rpcUrl && (
                    <div>RPC: <span className="font-mono text-xs">{selectedNetwork.rpcUrl}</span></div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Withdraw Modal Component
function WithdrawModal({ onClose }: { onClose: () => void }) {
  const [selectedAsset, setSelectedAsset] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("ERC20");

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
          <h2 className="text-2xl font-bold">Withdraw Crypto</h2>
          <button onClick={onClose} className="p-2 hover:bg-card rounded-lg transition-all">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Select Asset */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Asset</label>
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

          {/* Withdrawal Address */}
          <div>
            <label className="block text-sm font-medium mb-2">Withdrawal Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter withdrawal address"
              className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Select Network */}
          <div>
            <label className="block text-sm font-medium mb-2">Network</label>
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ERC20">Ethereum (ERC20)</option>
              <option value="TRC20">Tron (TRC20)</option>
              <option value="BSC">BNB Smart Chain (BEP20)</option>
              <option value="Polygon">Polygon</option>
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
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300">
                Max
              </button>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Available: 10,000 {selectedAsset}
            </div>
          </div>

          {/* Fee */}
          <div className="p-4 bg-card/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Network Fee</span>
              <span className="text-sm font-semibold">0.5 {selectedAsset}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">You will receive</span>
              <span className="text-sm font-semibold">{amount ? (parseFloat(amount) - 0.5).toFixed(2) : '0.00'} {selectedAsset}</span>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-400">
                <strong>Warning:</strong> Withdrawals are irreversible. Please double-check the address and network before confirming.
              </div>
            </div>
          </div>

          <button className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            Withdraw
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Transfer Modal Component
function TransferModal({ onClose }: { onClose: () => void }) {
  const [fromWallet, setFromWallet] = useState("spot");
  const [toWallet, setToWallet] = useState("futures");
  const [selectedAsset, setSelectedAsset] = useState("USDT");
  const [amount, setAmount] = useState("");

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
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300">
                Max
              </button>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Available: 10,000 {selectedAsset}
            </div>
          </div>

          <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            Transfer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
