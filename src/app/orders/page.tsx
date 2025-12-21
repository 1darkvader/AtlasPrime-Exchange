"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import { Search, Filter, Download, X, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";

interface Order {
  id: string;
  pair: string;
  type: string;
  side: string;
  price: number | null;
  amount: number;
  filled: number | null;
  total: number;
  status: string;
  createdAt: string;
  completedAt: string | null;
}

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"open" | "history">("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPair, setFilterPair] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    if (!isAuthenticated) return;

    try {
      const token = localStorage.getItem('atlasprime_token');
      const response = await fetch('/api/orders', {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Cancel order
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setCancellingOrderId(orderId);
    try {
      const token = localStorage.getItem('atlasprime_token');
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });

      if (response.ok) {
        await fetchOrders();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Split orders into open and history
  const openOrders = orders.filter(o => o.status === 'OPEN');
  const orderHistory = orders.filter(o => o.status !== 'OPEN');

  const currentOrders = activeTab === "open" ? openOrders : orderHistory;
  const filteredOrders = currentOrders.filter((order) => {
    const matchesSearch = order.pair.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPair = filterPair === "all" || order.pair === filterPair;
    const matchesType = filterType === "all" || order.type.toLowerCase() === filterType;
    return matchesSearch && matchesPair && matchesType;
  });

  // Calculate stats
  const filledToday = orderHistory.filter(o => {
    if (o.status !== 'FILLED' || !o.completedAt) return false;
    const today = new Date().setHours(0, 0, 0, 0);
    const completedDate = new Date(o.completedAt).setHours(0, 0, 0, 0);
    return completedDate === today;
  }).length;

  const cancelledCount = orderHistory.filter(o => o.status === 'CANCELLED').length;

  const totalVolume = orders.reduce((sum, o) => {
    if (o.status === 'FILLED' && o.price) {
      return sum + (o.price * o.amount);
    }
    return sum;
  }, 0);

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
              <h1 className="text-4xl font-bold gradient-text mb-2">Orders</h1>
              <p className="text-muted-foreground">Manage your trading orders</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-card rounded-lg transition-all disabled:opacity-50"
              title="Refresh orders"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <div className="text-sm text-muted-foreground mb-2">Open Orders</div>
              <div className="text-3xl font-bold">{openOrders.length}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <div className="text-sm text-muted-foreground mb-2">Filled Today</div>
              <div className="text-3xl font-bold text-emerald-400">{filledToday}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-6"
            >
              <div className="text-sm text-muted-foreground mb-2">Cancelled</div>
              <div className="text-3xl font-bold text-red-400">{cancelledCount}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6"
            >
              <div className="text-sm text-muted-foreground mb-2">Total Volume</div>
              <div className="text-3xl font-bold">${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </motion.div>
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-xl p-6"
          >
            {/* Tabs */}
            <div className="flex items-center justify-between mb-6 border-b border-border">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("open")}
                  className={`pb-4 px-2 font-semibold transition-all relative ${
                    activeTab === "open" ? "text-emerald-400" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Open Orders ({openOrders.length})
                  {activeTab === "open" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`pb-4 px-2 font-semibold transition-all relative ${
                    activeTab === "history" ? "text-emerald-400" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Order History
                  {activeTab === "history" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />
                  )}
                </button>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search pairs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={filterPair}
                onChange={(e) => setFilterPair(e.target.value)}
                className="px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Pairs</option>
                <option value="BTC/USDT">BTC/USDT</option>
                <option value="ETH/USDT">ETH/USDT</option>
                <option value="SOL/USDT">SOL/USDT</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Types</option>
                <option value="limit">Limit</option>
                <option value="market">Market</option>
                <option value="stop-limit">Stop Limit</option>
              </select>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Pair</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Side</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Price</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Amount</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Filled</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="border-b border-border/50 hover:bg-card/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="font-semibold">{order.pair}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-semibold uppercase">
                            {order.type}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                              order.side === "BUY"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {order.side}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-semibold">
                          {order.price ? `${order.price.toLocaleString()}` : 'Market'}
                        </td>
                        <td className="py-4 px-4 text-right">{order.amount}</td>
                        <td className="py-4 px-4 text-right">
                          <div>{order.filled || 0}</div>
                          <div className="text-xs text-muted-foreground">
                            {order.amount > 0 ? ((parseFloat(order.filled || '0') / order.amount) * 100).toFixed(1) : 0}%
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-semibold">
                          ${((order.price || 0) * order.amount).toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {order.status === "FILLED" && (
                              <>
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-400 text-sm">Filled</span>
                              </>
                            )}
                            {order.status === "OPEN" && (
                              <>
                                <Clock className="w-4 h-4 text-blue-400" />
                                <span className="text-blue-400 text-sm">Open</span>
                              </>
                            )}
                            {order.status === "CANCELLED" && (
                              <>
                                <XCircle className="w-4 h-4 text-red-400" />
                                <span className="text-red-400 text-sm">Cancelled</span>
                              </>
                            )}
                            {order.status === "PARTIALLY_FILLED" && (
                              <>
                                <Clock className="w-4 h-4 text-orange-400" />
                                <span className="text-orange-400 text-sm">Partial</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {order.status === "OPEN" || order.status === "PARTIALLY_FILLED" ? (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={cancellingOrderId === order.id}
                              className="px-3 py-1 text-sm text-red-400 hover:bg-red-500/10 rounded transition-all disabled:opacity-50"
                            >
                              {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel'}
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  ) : loading ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center">
                        <div className="flex flex-col items-center">
                          <RefreshCw className="w-8 h-8 animate-spin text-emerald-400 mb-4" />
                          <p className="text-muted-foreground">Loading orders...</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-12 text-center">
                        <div className="text-muted-foreground">
                          <div className="text-4xl mb-4">📋</div>
                          <div className="text-lg font-semibold mb-2">No orders found</div>
                          <div className="text-sm">
                            {activeTab === "open"
                              ? "You don't have any open orders"
                              : "No order history available"}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
