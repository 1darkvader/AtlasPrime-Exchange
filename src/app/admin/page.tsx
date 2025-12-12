'use client';

import { useEffect, useState } from 'react';
import { Users, FileCheck, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  pendingKYC: number;
  todayVolume: number;
  activeTrades: number;
  newUsersToday: number;
  completedTransactions: number;
}

interface AdminWalletSummary {
  totalBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  assetsCount: number;
}

interface RecentUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  kycStatus: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [adminWallet, setAdminWallet] = useState<AdminWalletSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('atlasprime_token');
      if (!token) {
        console.error('No auth token found');
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const [statsRes, usersRes, walletRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/users?limit=5', { headers }),
        fetch('/api/admin/wallet', { headers })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setRecentUsers(usersData.users || []);
      }

      if (walletRes.ok) {
        const walletData = await walletRes.json();
        if (walletData.success) {
          setAdminWallet(walletData.summary);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Platform Balance',
      value: adminWallet ? `${(adminWallet.totalBalance / 1000000).toFixed(2)}M` : '$0.00',
      change: `${adminWallet?.assetsCount || 0} assets • Net: ${adminWallet ? ((adminWallet.totalDeposits - adminWallet.totalWithdrawals) / 1000000).toFixed(2) : '0'}M`,
      icon: DollarSign,
      color: 'from-emerald-500 to-green-500',
      trend: 'up'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: `+${stats?.newUsersToday || 0} today`,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      trend: 'up'
    },
    {
      title: 'Pending KYC',
      value: stats?.pendingKYC || 0,
      change: 'Requires review',
      icon: FileCheck,
      color: 'from-orange-500 to-yellow-500',
      trend: 'neutral'
    },
    {
      title: "Today's Volume",
      value: `$${(stats?.todayVolume || 0).toLocaleString()}`,
      change: '+12.5% from yesterday',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      trend: 'up'
    },
    {
      title: 'Active Trades',
      value: stats?.activeTrades || 0,
      change: `${stats?.completedTransactions || 0} completed`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      trend: 'up'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} bg-opacity-20`}>
                  <Icon className="text-white" size={24} />
                </div>
                {card.trend === 'up' && (
                  <ArrowUpRight className="text-green-500" size={20} />
                )}
                {card.trend === 'down' && (
                  <ArrowDownRight className="text-red-500" size={20} />
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-white mb-2">{card.value}</h3>
                <p className="text-xs text-gray-500">{card.change}</p>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Users</h2>
            <Link
              href="/admin/users"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No recent users</p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.username}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      user.kycStatus === 'VERIFIED'
                        ? 'bg-green-500/20 text-green-400'
                        : user.kycStatus === 'PENDING'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.kycStatus}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending KYC */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Pending KYC</h2>
            <Link
              href="/admin/kyc"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.pendingKYC === 0 ? (
              <div className="text-center py-8">
                <FileCheck className="mx-auto mb-3 text-gray-500" size={48} />
                <p className="text-gray-400">No pending KYC requests</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/20 mb-4">
                  <FileCheck className="text-orange-400" size={40} />
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">{stats?.pendingKYC}</h3>
                <p className="text-gray-400">Documents waiting for review</p>
                <Link
                  href="/admin/kyc"
                  className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Review Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:border-blue-500/50 transition-all text-center group"
          >
            <Users className="mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" size={32} />
            <div className="text-white font-medium">Manage Users</div>
          </Link>
          <Link
            href="/admin/kyc"
            className="p-4 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 hover:border-orange-500/50 transition-all text-center group"
          >
            <FileCheck className="mx-auto mb-2 text-orange-400 group-hover:scale-110 transition-transform" size={32} />
            <div className="text-white font-medium">Review KYC</div>
          </Link>
          <Link
            href="/admin/transactions"
            className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:border-green-500/50 transition-all text-center group"
          >
            <DollarSign className="mx-auto mb-2 text-green-400 group-hover:scale-110 transition-transform" size={32} />
            <div className="text-white font-medium">Transactions</div>
          </Link>
          <Link
            href="/admin/analytics"
            className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-all text-center group"
          >
            <TrendingUp className="mx-auto mb-2 text-purple-400 group-hover:scale-110 transition-transform" size={32} />
            <div className="text-white font-medium">Analytics</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
