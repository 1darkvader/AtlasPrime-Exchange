'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, Activity, ArrowUp, ArrowDown } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Trading Volume (24h)',
      value: `$${(stats?.todayVolume || 0).toLocaleString()}`,
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Active Traders',
      value: stats?.activeTrades || 0,
      change: '+5.7%',
      trend: 'up',
      icon: Activity,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'New Users (Today)',
      value: stats?.newUsersToday || 0,
      change: '+23.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-orange-500 to-yellow-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-gray-400 mt-2">Platform performance and insights</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} bg-opacity-20`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  {metric.change}
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">{metric.title}</p>
                <h3 className="text-3xl font-bold text-white">{metric.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">User Growth</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart visualization coming soon
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Trading Volume</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart visualization coming soon
          </div>
        </div>
      </div>

      {/* Top Trading Pairs */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Top Trading Pairs</h2>
        <div className="space-y-3">
          {['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT'].map((pair, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-gray-500">#{i + 1}</div>
                <div>
                  <div className="text-white font-medium">{pair}</div>
                  <div className="text-sm text-gray-400">24h Volume</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">
                  ${(Math.random() * 1000000).toFixed(0).toLocaleString()}
                </div>
                <div className="text-sm text-green-400">+{(Math.random() * 10).toFixed(2)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
