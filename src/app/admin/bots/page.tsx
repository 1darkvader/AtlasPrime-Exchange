'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Plus,
  X,
} from 'lucide-react';

interface UserBot {
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  bot: {
    id: string;
    name: string;
    riskLevel: string;
    winRate: number;
  };
  investedAmount: number;
  currentValue: number;
  totalProfit: number;
  profitPercent: number;
  tradingPair: string;
  status: string;
  isActive: boolean;
  startedAt: string;
  trades: any[];
}

interface Summary {
  totalInvested: number;
  totalCurrentValue: number;
  totalProfit: number;
  activeBotsCount: number;
  totalBotsCount: number;
}

export default function AdminBotsPage() {
  const [userBots, setUserBots] = useState<UserBot[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddProfitModal, setShowAddProfitModal] = useState(false);
  const [selectedBot, setSelectedBot] = useState<UserBot | null>(null);
  const [profitAmount, setProfitAmount] = useState('');
  const [profitPercent, setProfitPercent] = useState('');
  const [addingProfit, setAddingProfit] = useState(false);

  useEffect(() => {
    fetchUserBots();
  }, [statusFilter]);

  const fetchUserBots = async () => {
    try {
      const token = localStorage.getItem('atlasprime_token');
      if (!token) {
        console.error('No auth token found');
        setLoading(false);
        return;
      }

      const url = new URL('/api/admin/bots/user-bots', window.location.origin);
      if (statusFilter !== 'all') {
        url.searchParams.set('status', statusFilter);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserBots(data.userBots || []);
        setSummary(data.summary || null);
      }
    } catch (error) {
      console.error('Error fetching user bots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfit = async () => {
    if (!selectedBot) return;

    if (!profitAmount && !profitPercent) {
      alert('Please enter either profit amount or profit percent');
      return;
    }

    setAddingProfit(true);
    try {
      const token = localStorage.getItem('atlasprime_token');
      const response = await fetch('/api/admin/bots/add-profit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userBotId: selectedBot.id,
          profitAmount: profitAmount ? parseFloat(profitAmount) : null,
          profitPercent: profitPercent ? parseFloat(profitPercent) : null,
          createTrade: true,
          tradeDetails: {
            pair: selectedBot.tradingPair,
            side: 'BUY',
            entryPrice: 0,
            exitPrice: 0,
            amount: 0,
          },
        }),
      });

      if (response.ok) {
        alert('Profit added successfully!');
        setShowAddProfitModal(false);
        setProfitAmount('');
        setProfitPercent('');
        setSelectedBot(null);
        fetchUserBots();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to add profit');
      }
    } catch (error) {
      console.error('Error adding profit:', error);
      alert('Failed to add profit');
    } finally {
      setAddingProfit(false);
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

  const filteredBots = statusFilter === 'all'
    ? userBots
    : userBots.filter(bot => bot.status === statusFilter.toUpperCase());

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Trading Bots Management</h1>
            <p className="text-gray-400">
              View and manage all user trading bots
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Invested</span>
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              ${summary.totalInvested.toLocaleString()}
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Current Value</span>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              ${summary.totalCurrentValue.toLocaleString()}
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Profit</span>
              {summary.totalProfit >= 0 ? (
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className={`text-2xl font-bold ${summary.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {summary.totalProfit >= 0 ? '+' : ''}${summary.totalProfit.toFixed(2)}
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Active Bots</span>
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {summary.activeBotsCount}
            </div>
            <div className="text-xs text-gray-400">
              of {summary.totalBotsCount} total
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass rounded-xl p-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Filter by status:</span>
          <div className="flex gap-2">
            {['all', 'active', 'paused', 'stopped'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Bots Table */}
      <div className="glass rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-400 text-sm">Loading user bots...</p>
          </div>
        ) : filteredBots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Brain className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-gray-400 text-sm">No user bots found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-400 border-b border-white/10">
                <tr>
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Bot Name</th>
                  <th className="text-left py-3 px-4">Pair</th>
                  <th className="text-right py-3 px-4">Invested</th>
                  <th className="text-right py-3 px-4">Current Value</th>
                  <th className="text-right py-3 px-4">Profit/Loss</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Started</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBots.map((userBot) => (
                  <tr key={userBot.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold text-white">{userBot.user.username}</div>
                        <div className="text-xs text-gray-400">{userBot.user.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${getRiskColor(userBot.bot.riskLevel)}`}>
                          {userBot.bot.riskLevel}
                        </span>
                        <span className="text-white">{userBot.bot.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">
                        {userBot.tradingPair}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-white">
                      ${userBot.investedAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-white">
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
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        userBot.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' :
                        userBot.status === 'PAUSED' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {userBot.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-xs text-gray-400">
                      {new Date(userBot.startedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => {
                            setSelectedBot(userBot);
                            setShowAddProfitModal(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded text-xs font-semibold transition-all"
                          title="Add Profit"
                        >
                          <Plus className="w-3 h-3" />
                          Add Profit
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

      {/* Add Profit Modal */}
      {showAddProfitModal && selectedBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Add Profit</h3>
                  <p className="text-sm text-gray-400">
                    {selectedBot.user.username} - {selectedBot.bot.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProfitModal(false)}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Current Stats */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Invested</div>
                  <div className="text-lg font-bold text-white">
                    ${selectedBot.investedAmount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Current Profit</div>
                  <div className={`text-lg font-bold ${selectedBot.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedBot.totalProfit >= 0 ? '+' : ''}${selectedBot.totalProfit.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Profit Amount */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Profit Amount ($)
                </label>
                <input
                  type="number"
                  value={profitAmount}
                  onChange={(e) => {
                    setProfitAmount(e.target.value);
                    setProfitPercent(''); // Clear percent if amount is set
                  }}
                  placeholder="e.g., 50"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-white/10"></div>
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 border-t border-white/10"></div>
              </div>

              {/* Profit Percent */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Profit Percent (%)
                </label>
                <input
                  type="number"
                  value={profitPercent}
                  onChange={(e) => {
                    setProfitPercent(e.target.value);
                    setProfitAmount(''); // Clear amount if percent is set
                  }}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Preview */}
              {(profitAmount || profitPercent) && (
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <div className="text-xs text-gray-400 mb-1">New Total Profit</div>
                  <div className="text-lg font-bold text-emerald-400">
                    +${(
                      selectedBot.totalProfit +
                      (profitAmount ? parseFloat(profitAmount) : (selectedBot.investedAmount * parseFloat(profitPercent || '0') / 100))
                    ).toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={() => setShowAddProfitModal(false)}
                disabled={addingProfit}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProfit}
                disabled={addingProfit || (!profitAmount && !profitPercent)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {addingProfit ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Adding...</span>
                  </div>
                ) : (
                  'Add Profit'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
