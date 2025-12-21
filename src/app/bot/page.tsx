"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  DollarSign,
  Play,
  Pause,
  StopCircle,
  Settings,
  BarChart3,
  Shield,
  Zap,
  Brain,
} from "lucide-react";

interface TradingBot {
  id: string;
  name: string;
  description: string;
  strategy: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  winRate: number;
  totalUsers: number;
  avgMonthlyReturn: number;
  minInvestment: number;
  maxInvestment: number;
  supportedPairs: string[];
  isActive: boolean;
}

interface UserBot {
  id: string;
  botId: string;
  bot: TradingBot;
  investedAmount: number;
  currentValue: number;
  totalProfit: number;
  profitPercent: number;
  tradingPair: string;
  status: "ACTIVE" | "PAUSED" | "STOPPED";
  isActive: boolean;
  startedAt: string;
  trades: BotTrade[];
}

interface BotTrade {
  id: string;
  pair: string;
  side: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number | null;
  amount: number;
  profit: number;
  profitPercent: number;
  status: "OPEN" | "CLOSED";
  createdAt: string;
  closedAt: string | null;
}

export default function BotTradingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"marketplace" | "my-bots">("marketplace");
  const [availableBots, setAvailableBots] = useState<TradingBot[]>([]);
  const [userBots, setUserBots] = useState<UserBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBot, setSelectedBot] = useState<TradingBot | null>(null);
  const [showActivateModal, setShowActivateModal] = useState(false);

  // Activate bot state
  const [investAmount, setInvestAmount] = useState("");
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [takeProfitPercent, setTakeProfitPercent] = useState("");
  const [stopLossPercent, setStopLossPercent] = useState("");
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    fetchBots();
    if (isAuthenticated) {
      fetchUserBots();
    }
  }, [isAuthenticated]);

  const fetchBots = async () => {
    try {
      const response = await fetch('/api/bots');
      if (response.ok) {
        const data = await response.json();
        setAvailableBots(data.bots || []);
      }
    } catch (error) {
      console.error('Failed to fetch bots:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBots = async () => {
    try {
      const token = localStorage.getItem('atlasprime_token');
      const response = await fetch('/api/bots/user', {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });
      if (response.ok) {
        const data = await response.json();
        setUserBots(data.userBots || []);
      }
    } catch (error) {
      console.error('Failed to fetch user bots:', error);
    }
  };

  const handleActivateBot = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!investAmount || parseFloat(investAmount) <= 0) {
      alert('Please enter a valid investment amount');
      return;
    }

    setActivating(true);
    try {
      const token = localStorage.getItem('atlasprime_token');
      const response = await fetch('/api/bots/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          botId: selectedBot?.id,
          investedAmount: parseFloat(investAmount),
          tradingPair: selectedPair,
          takeProfitPercent: takeProfitPercent ? parseFloat(takeProfitPercent) : null,
          stopLossPercent: stopLossPercent ? parseFloat(stopLossPercent) : null,
        }),
      });

      if (response.ok) {
        alert('Bot activated successfully!');
        setShowActivateModal(false);
        setInvestAmount("");
        setTakeProfitPercent("");
        setStopLossPercent("");
        fetchUserBots();
        setActiveTab("my-bots");
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to activate bot');
      }
    } catch (error) {
      console.error('Failed to activate bot:', error);
      alert('Failed to activate bot');
    } finally {
      setActivating(false);
    }
  };

  const handleStopBot = async (userBotId: string) => {
    if (!confirm('Are you sure you want to stop this bot?')) return;

    try {
      const token = localStorage.getItem('atlasprime_token');
      const response = await fetch(`/api/bots/user/${userBotId}/stop`, {
        method: 'POST',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });

      if (response.ok) {
        alert('Bot stopped successfully!');
        fetchUserBots();
      } else {
        alert('Failed to stop bot');
      }
    } catch (error) {
      console.error('Failed to stop bot:', error);
      alert('Failed to stop bot');
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "LOW": return "text-emerald-400 bg-emerald-500/20";
      case "MEDIUM": return "text-yellow-400 bg-yellow-500/20";
      case "HIGH": return "text-red-400 bg-red-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "LOW": return <Shield className="w-4 h-4" />;
      case "MEDIUM": return <Activity className="w-4 h-4" />;
      case "HIGH": return <Zap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Calculate total stats from user bots
  const totalInvested = userBots.reduce((sum, bot) => sum + bot.investedAmount, 0);
  const totalCurrentValue = userBots.reduce((sum, bot) => sum + bot.currentValue, 0);
  const totalProfit = userBots.reduce((sum, bot) => sum + bot.totalProfit, 0);
  const totalProfitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
  const activeBots = userBots.filter(bot => bot.isActive).length;

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">AI Trading Bots</h1>
                <p className="text-muted-foreground">
                  Automate your trading with sophisticated AI-powered strategies
                </p>
              </div>
            </div>
          </div>

          {/* Stats Dashboard - Only show if user has bots */}
          {isAuthenticated && userBots.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Invested</span>
                  <DollarSign className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Current Value</span>
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold">${totalCurrentValue.toLocaleString()}</div>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Profit</span>
                  {totalProfit >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
                </div>
                <div className={`text-xs ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totalProfit >= 0 ? '+' : ''}{totalProfitPercent.toFixed(2)}%
                </div>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Active Bots</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold">{activeBots}</div>
                <div className="text-xs text-muted-foreground">of {userBots.length} total</div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="glass rounded-xl p-0 mb-6">
            <div className="flex items-center gap-6 px-4 pt-4 border-b border-border">
              <button
                onClick={() => setActiveTab("marketplace")}
                className={`pb-3 text-sm font-medium transition-all ${
                  activeTab === "marketplace"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Bot Marketplace
              </button>
              <button
                onClick={() => setActiveTab("my-bots")}
                className={`pb-3 text-sm font-medium transition-all ${
                  activeTab === "my-bots"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                My Bots ({userBots.length})
              </button>
            </div>

            <div className="p-6">
              {/* Bot Marketplace */}
              {activeTab === "marketplace" && (
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                      <p className="text-muted-foreground text-sm">Loading bots...</p>
                    </div>
                  ) : availableBots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Brain className="w-16 h-16 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-sm">No bots available</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableBots.map((bot) => (
                        <motion.div
                          key={bot.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="glass rounded-xl p-6 hover:border-purple-500/50 transition-all cursor-pointer"
                          onClick={() => {
                            setSelectedBot(bot);
                            setSelectedPair(bot.supportedPairs[0]);
                            setShowActivateModal(true);
                          }}
                        >
                          {/* Bot Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold mb-1">{bot.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {bot.description}
                              </p>
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${getRiskColor(bot.riskLevel)}`}>
                              {getRiskIcon(bot.riskLevel)}
                              {bot.riskLevel}
                            </div>
                          </div>

                          {/* Bot Stats */}
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Win Rate</div>
                              <div className="text-lg font-bold text-emerald-400">
                                {bot.winRate}%
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Avg Return</div>
                              <div className="text-lg font-bold text-purple-400">
                                +{bot.avgMonthlyReturn}%
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Users</div>
                              <div className="text-lg font-bold flex items-center gap-1">
                                <Users className="w-4 h-4 text-blue-400" />
                                {bot.totalUsers.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          {/* Strategy */}
                          <div className="mb-4">
                            <div className="text-xs text-muted-foreground mb-1">Strategy</div>
                            <p className="text-xs text-foreground/80 line-clamp-3">
                              {bot.strategy}
                            </p>
                          </div>

                          {/* Investment Range */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                            <span>Min: ${bot.minInvestment}</span>
                            <span>•</span>
                            <span>Max: ${bot.maxInvestment.toLocaleString()}</span>
                          </div>

                          {/* Supported Pairs */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {bot.supportedPairs.slice(0, 4).map((pair) => (
                              <span
                                key={pair}
                                className="px-2 py-1 bg-card rounded text-xs text-muted-foreground"
                              >
                                {pair}
                              </span>
                            ))}
                            {bot.supportedPairs.length > 4 && (
                              <span className="px-2 py-1 bg-card rounded text-xs text-muted-foreground">
                                +{bot.supportedPairs.length - 4} more
                              </span>
                            )}
                          </div>

                          {/* Activate Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBot(bot);
                              setSelectedPair(bot.supportedPairs[0]);
                              setShowActivateModal(true);
                            }}
                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all"
                          >
                            Activate Bot
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* My Bots */}
              {activeTab === "my-bots" && (
                <div className="space-y-4">
                  {authLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                      <p className="text-muted-foreground text-sm">Loading...</p>
                    </div>
                  ) : !isAuthenticated ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Brain className="w-16 h-16 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-sm mb-4">
                        Log in to view your active bots
                      </p>
                      <div className="flex gap-3">
                        <Link
                          href="/login"
                          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded transition-all"
                        >
                          Log In
                        </Link>
                        <Link
                          href="/signup"
                          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded transition-all"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  ) : userBots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Brain className="w-16 h-16 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-sm mb-4">
                        You haven't activated any bots yet
                      </p>
                      <button
                        onClick={() => setActiveTab("marketplace")}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded transition-all"
                      >
                        Browse Bots
                      </button>
                    </div>
                  ) : (
                    // Table view for user bots
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="text-xs text-muted-foreground border-b border-border">
                          <tr>
                            <th className="text-left py-3 px-4">Bot Name</th>
                            <th className="text-left py-3 px-4">Pair</th>
                            <th className="text-right py-3 px-4">Invested</th>
                            <th className="text-right py-3 px-4">Current Value</th>
                            <th className="text-right py-3 px-4">Profit/Loss</th>
                            <th className="text-right py-3 px-4">Win Rate</th>
                            <th className="text-center py-3 px-4">Status</th>
                            <th className="text-center py-3 px-4">Started</th>
                            <th className="text-center py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userBots.map((userBot) => (
                            <tr key={userBot.id} className="border-b border-border/50 hover:bg-card/50">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <div className={`p-1 rounded ${getRiskColor(userBot.bot.riskLevel)}`}>
                                    {getRiskIcon(userBot.bot.riskLevel)}
                                  </div>
                                  <div>
                                    <div className="font-semibold">{userBot.bot.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {userBot.bot.riskLevel} Risk
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="px-2 py-1 bg-card rounded text-xs">
                                  {userBot.tradingPair}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right font-mono">
                                ${userBot.investedAmount.toLocaleString()}
                              </td>
                              <td className="py-4 px-4 text-right font-mono">
                                ${userBot.currentValue.toLocaleString()}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className={`font-bold ${userBot.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {userBot.totalProfit >= 0 ? '+' : ''}${userBot.totalProfit.toFixed(2)}
                                </div>
                                <div className={`text-xs ${userBot.profitPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {userBot.profitPercent >= 0 ? '+' : ''}{userBot.profitPercent.toFixed(2)}%
                                </div>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="text-emerald-400 font-semibold">
                                  {userBot.bot.winRate}%
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  userBot.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' :
                                  userBot.status === 'PAUSED' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {userBot.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center text-xs text-muted-foreground">
                                {new Date(userBot.startedAt).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center justify-center gap-2">
                                  {userBot.isActive && (
                                    <button
                                      onClick={() => handleStopBot(userBot.id)}
                                      className="p-2 hover:bg-red-500/20 rounded transition-all"
                                      title="Stop Bot"
                                    >
                                      <StopCircle className="w-4 h-4 text-red-400" />
                                    </button>
                                  )}
                                  <button
                                    className="p-2 hover:bg-blue-500/20 rounded transition-all"
                                    title="View Details"
                                  >
                                    <BarChart3 className="w-4 h-4 text-blue-400" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Activate Bot Modal */}
      {showActivateModal && selectedBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Activate {selectedBot.name}
                  </h3>
                  <p className="text-sm text-gray-400">{selectedBot.description}</p>
                </div>
                <button
                  onClick={() => setShowActivateModal(false)}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Investment Amount */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Investment Amount (USDT)
                </label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  placeholder={`Min: ${selectedBot.minInvestment} - Max: ${selectedBot.maxInvestment}`}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                  <span>Min: ${selectedBot.minInvestment}</span>
                  <span>Max: ${selectedBot.maxInvestment.toLocaleString()}</span>
                </div>
              </div>

              {/* Trading Pair */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Trading Pair</label>
                <select
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {selectedBot.supportedPairs.map((pair) => (
                    <option key={pair} value={pair} className="bg-gray-900">
                      {pair}
                    </option>
                  ))}
                </select>
              </div>

              {/* Take Profit */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Take Profit (%) - Optional
                </label>
                <input
                  type="number"
                  value={takeProfitPercent}
                  onChange={(e) => setTakeProfitPercent(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Stop Loss */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Stop Loss (%) - Optional
                </label>
                <input
                  type="number"
                  value={stopLossPercent}
                  onChange={(e) => setStopLossPercent(e.target.value)}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Bot Stats */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Win Rate</div>
                  <div className="text-lg font-bold text-emerald-400">
                    {selectedBot.winRate}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Avg Return</div>
                  <div className="text-lg font-bold text-purple-400">
                    +{selectedBot.avgMonthlyReturn}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Risk</div>
                  <div className={`text-lg font-bold ${
                    selectedBot.riskLevel === 'LOW' ? 'text-emerald-400' :
                    selectedBot.riskLevel === 'MEDIUM' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {selectedBot.riskLevel}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={() => setShowActivateModal(false)}
                disabled={activating}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleActivateBot}
                disabled={activating}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {activating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Activating...</span>
                  </div>
                ) : (
                  'Activate Bot'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
