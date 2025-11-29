"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import { Search, Filter, Download, X, CheckCircle, Clock, XCircle } from "lucide-react";

interface Order {
  id: string;
  pair: string;
  type: "limit" | "market" | "stop-limit";
  side: "buy" | "sell";
  price: number;
  amount: number;
  filled: number;
  total: number;
  status: "open" | "filled" | "cancelled" | "partially-filled";
  timestamp: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"open" | "history">("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPair, setFilterPair] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Mock data
  const openOrders: Order[] = [
    {
      id: "1",
      pair: "BTC/USDT",
      type: "limit",
      side: "buy",
      price: 90000,
      amount: 0.05,
      filled: 0,
      total: 4500,
      status: "open",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      pair: "ETH/USDT",
      type: "limit",
      side: "sell",
      price: 3100,
      amount: 2,
      filled: 0.5,
      total: 6200,
      status: "partially-filled",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  const orderHistory: Order[] = [
    {
      id: "3",
      pair: "BTC/USDT",
      type: "market",
      side: "buy",
      price: 91000,
      amount: 0.01,
      filled: 0.01,
      total: 910,
      status: "filled",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "4",
      pair: "SOL/USDT",
      type: "limit",
      side: "sell",
      price: 140,
      amount: 10,
      filled: 0,
      total: 1400,
      status: "cancelled",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  const currentOrders = activeTab === "open" ? openOrders : orderHistory;
  const filteredOrders = currentOrders.filter((order) => {
    const matchesSearch = order.pair.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPair = filterPair === "all" || order.pair === filterPair;
    const matchesType = filterType === "all" || order.type === filterType;
    return matchesSearch && matchesPair && matchesType;
  });

  const handleCancelOrder = (orderId: string) => {
    console.log("Cancelling order:", orderId);
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
            className="mb-8"
          >
            <h1 className="text-4xl font-bold gradient-text mb-2">Orders</h1>
            <p className="text-muted-foreground">Manage your trading orders</p>
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
              <div className="text-3xl font-bold text-emerald-400">5</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-6"
            >
              <div className="text-sm text-muted-foreground mb-2">Cancelled</div>
              <div className="text-3xl font-bold text-red-400">2</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6"
            >
              <div className="text-sm text-muted-foreground mb-2">Total Volume</div>
              <div className="text-3xl font-bold">$12.5K</div>
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
                            {new Date(order.timestamp).toLocaleString()}
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
                              order.side === "buy"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {order.side}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-semibold">
                          ${order.price.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right">{order.amount}</td>
                        <td className="py-4 px-4 text-right">
                          <div>{order.filled}</div>
                          <div className="text-xs text-muted-foreground">
                            {((order.filled / order.amount) * 100).toFixed(1)}%
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-semibold">
                          ${order.total.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {order.status === "filled" && (
                              <>
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-400 text-sm">Filled</span>
                              </>
                            )}
                            {order.status === "open" && (
                              <>
                                <Clock className="w-4 h-4 text-blue-400" />
                                <span className="text-blue-400 text-sm">Open</span>
                              </>
                            )}
                            {order.status === "cancelled" && (
                              <>
                                <XCircle className="w-4 h-4 text-red-400" />
                                <span className="text-red-400 text-sm">Cancelled</span>
                              </>
                            )}
                            {order.status === "partially-filled" && (
                              <>
                                <Clock className="w-4 h-4 text-orange-400" />
                                <span className="text-orange-400 text-sm">Partial</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {order.status === "open" || order.status === "partially-filled" ? (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-3 py-1 text-sm text-red-400 hover:bg-red-500/10 rounded transition-all"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </motion.tr>
                    ))
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
