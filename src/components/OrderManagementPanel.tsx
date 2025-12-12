"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

type TabType = "open" | "history" | "trades" | "funds" | "bots";

interface OrderManagementPanelProps {
  orders: any[];
  loadingOrders: boolean;
  onRefreshOrders: () => Promise<void>;
  tickerData?: { price: number } | null;
  binanceSymbol?: string;
  onCancelOrder?: (orderId: string) => Promise<void>;
  cancellingOrderId?: string | null;
}

export default function OrderManagementPanel({
  orders = [],
  loadingOrders = false,
  onRefreshOrders,
  tickerData = null,
  binanceSymbol = '',
  onCancelOrder,
  cancellingOrderId = null,
}: OrderManagementPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("open");
  const [orderFilter, setOrderFilter] = useState<'all' | 'limit' | 'market' | 'stop'>('all');
  const { isAuthenticated } = useAuth();
  const isLoggedIn = isAuthenticated; // Use real auth state

  const openOrders = orders.filter(o => o.status === 'OPEN');
  const filteredOrders = orderFilter === 'all'
    ? openOrders
    : openOrders.filter(o => o.type.toLowerCase() === orderFilter);

  const tabs: { value: TabType; label: string; count?: number }[] = [
    { value: "open", label: "Open Orders", count: openOrders.length },
    { value: "history", label: "Order History" },
    { value: "trades", label: "Trade History" },
    { value: "funds", label: "Funds" },
    { value: "bots", label: "Bots" },
  ];

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p className="text-muted-foreground text-sm mb-4">
        {isLoggedIn ? "No records" : "Log in or Register Now to trade"}
      </p>
      {!isLoggedIn && (
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded transition-all"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-all"
          >
            Register Now
          </Link>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "open":
        return (
          <>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex gap-2">
                <button
                  onClick={() => setOrderFilter('all')}
                  className={`px-3 py-1 text-xs rounded transition-all ${orderFilter === 'all' ? 'bg-purple-500/20 text-purple-400' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setOrderFilter('limit')}
                  className={`px-3 py-1 text-xs rounded transition-all ${orderFilter === 'limit' ? 'bg-purple-500/20 text-purple-400' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Limit
                </button>
                <button
                  onClick={() => setOrderFilter('market')}
                  className={`px-3 py-1 text-xs rounded transition-all ${orderFilter === 'market' ? 'bg-purple-500/20 text-purple-400' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Market
                </button>
                <button
                  onClick={() => setOrderFilter('stop')}
                  className={`px-3 py-1 text-xs rounded transition-all ${orderFilter === 'stop' ? 'bg-purple-500/20 text-purple-400' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Stop Limit
                </button>
              </div>
              <button className="text-xs text-red-400 hover:text-red-300">
                Cancel All
              </button>
            </div>

            {loadingOrders ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-muted-foreground text-sm">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Pair</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Side</th>
                      <th className="text-right py-3 px-4">Entry Price</th>
                      <th className="text-right py-3 px-4">Mark Price</th>
                      <th className="text-right py-3 px-4">Amount</th>
                      <th className="text-right py-3 px-4">Unrealized P&L</th>
                      <th className="text-right py-3 px-4">Total Value</th>
                      <th className="text-center py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order: any) => {
                      const orderTime = new Date(order.createdAt);
                      const amount = parseFloat(order.amount);
                      const entryPrice = parseFloat(order.price || 0);

                      // Get current market price for this pair
                      const currentPrice = order.pair === binanceSymbol && tickerData
                        ? tickerData.price
                        : entryPrice;

                      // Calculate unrealized P&L
                      let unrealizedPnL = 0;
                      let pnlPercent = 0;
                      const leverage = order.leverage || 1;

                      if (order.side === 'LONG' && entryPrice > 0) {
                        const priceDiff = currentPrice - entryPrice;
                        unrealizedPnL = (priceDiff / entryPrice) * (amount * entryPrice) * leverage;
                        pnlPercent = (priceDiff / entryPrice) * 100 * leverage;
                      } else if (order.side === 'SHORT' && entryPrice > 0) {
                        const priceDiff = entryPrice - currentPrice;
                        unrealizedPnL = (priceDiff / entryPrice) * (amount * entryPrice) * leverage;
                        pnlPercent = (priceDiff / entryPrice) * 100 * leverage;
                      }

                      const totalValue = amount * entryPrice;
                      const isLive = order.pair === binanceSymbol;

                      return (
                        <tr key={order.id} className="border-b border-border/50 hover:bg-card/50">
                          <td className="py-3 px-4 text-xs text-muted-foreground">
                            {orderTime.toLocaleString('en-US', {
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                            })}
                          </td>
                          <td className="py-3 px-4 font-medium">
                            {order.pair}
                            {isLive && (
                              <span className="ml-2 px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                                LIVE
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 bg-card rounded text-xs">
                              {order.type}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${order.side === 'LONG' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {order.side} {leverage}x
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            ${entryPrice.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            <div className="flex flex-col items-end">
                              <span>${currentPrice.toFixed(2)}</span>
                              {isLive && currentPrice !== entryPrice && (
                                <span className={`text-xs ${currentPrice > entryPrice ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {currentPrice > entryPrice ? '↑' : '↓'} ${Math.abs(currentPrice - entryPrice).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono">{amount.toFixed(6)}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex flex-col items-end">
                              <span className={`font-bold ${unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {unrealizedPnL >= 0 ? '+' : ''}{unrealizedPnL.toFixed(2)} USD
                              </span>
                              <span className={`text-xs ${pnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono">${totalValue.toFixed(2)}</td>
                          <td className="py-3 px-4 text-center">
                            {onCancelOrder && (
                              <button
                                onClick={() => onCancelOrder(order.id)}
                                disabled={cancellingOrderId === order.id}
                                className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                              >
                                {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Summary Footer */}
                <div className="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Total Open Orders</div>
                      <div className="text-lg font-bold text-purple-400">
                        {openOrders.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Total Position Value</div>
                      <div className="text-lg font-bold">
                        ${openOrders.reduce((sum: number, o: any) => {
                          return sum + (parseFloat(o.amount) * parseFloat(o.price || 0));
                        }, 0).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Total Unrealized P&L</div>
                      <div className={`text-lg font-bold ${
                        openOrders.reduce((sum: number, o: any) => {
                          const entryPrice = parseFloat(o.price || 0);
                          const amount = parseFloat(o.amount);
                          const currentPrice = o.pair === binanceSymbol && tickerData ? tickerData.price : entryPrice;
                          const leverage = o.leverage || 1;

                          if (o.side === 'LONG' && entryPrice > 0) {
                            const priceDiff = currentPrice - entryPrice;
                            return sum + ((priceDiff / entryPrice) * (amount * entryPrice) * leverage);
                          } else if (o.side === 'SHORT' && entryPrice > 0) {
                            const priceDiff = entryPrice - currentPrice;
                            return sum + ((priceDiff / entryPrice) * (amount * entryPrice) * leverage);
                          }
                          return sum;
                        }, 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {openOrders.reduce((sum: number, o: any) => {
                          const entryPrice = parseFloat(o.price || 0);
                          const amount = parseFloat(o.amount);
                          const currentPrice = o.pair === binanceSymbol && tickerData ? tickerData.price : entryPrice;
                          const leverage = o.leverage || 1;

                          if (o.side === 'LONG' && entryPrice > 0) {
                            const priceDiff = currentPrice - entryPrice;
                            return sum + ((priceDiff / entryPrice) * (amount * entryPrice) * leverage);
                          } else if (o.side === 'SHORT' && entryPrice > 0) {
                            const priceDiff = entryPrice - currentPrice;
                            return sum + ((priceDiff / entryPrice) * (amount * entryPrice) * leverage);
                          }
                          return sum;
                        }, 0) >= 0 ? '+' : ''}${openOrders.reduce((sum: number, o: any) => {
                          const entryPrice = parseFloat(o.price || 0);
                          const amount = parseFloat(o.amount);
                          const currentPrice = o.pair === binanceSymbol && tickerData ? tickerData.price : entryPrice;
                          const leverage = o.leverage || 1;

                          if (o.side === 'LONG' && entryPrice > 0) {
                            const priceDiff = currentPrice - entryPrice;
                            return sum + ((priceDiff / entryPrice) * (amount * entryPrice) * leverage);
                          } else if (o.side === 'SHORT' && entryPrice > 0) {
                            const priceDiff = entryPrice - currentPrice;
                            return sum + ((priceDiff / entryPrice) * (amount * entryPrice) * leverage);
                          }
                          return sum;
                        }, 0).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Live Tracking</div>
                      <div className="text-lg font-bold text-green-400">
                        {openOrders.filter(o => o.pair === binanceSymbol).length} / {openOrders.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case "history":
        return (
          <>
            <div className="flex items-center justify-between mb-4 px-4">
              <div className="flex gap-4">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  All
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  Spot
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  Margin
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="px-3 py-1 bg-card border border-border rounded text-xs"
                />
                <span className="text-muted-foreground">to</span>
                <input
                  type="date"
                  className="px-3 py-1 bg-card border border-border rounded text-xs"
                />
              </div>
            </div>
            {renderEmptyState()}
          </>
        );

      case "trades":
        return (
          <>
            <div className="flex items-center justify-between mb-4 px-4">
              <div className="flex gap-4">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  All
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  Buy
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  Sell
                </button>
              </div>
              <button className="text-xs text-emerald-400 hover:underline">
                Export Complete Trade History
              </button>
            </div>
            {renderEmptyState()}
          </>
        );

      case "funds":
        return (
          <div className="px-4">
            {renderEmptyState()}
          </div>
        );

      case "bots":
        return (
          <div className="px-4">
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-muted-foreground text-sm mb-2">No trading bots active</p>
              <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-sm transition-all">
                Create Bot
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="glass rounded-xl p-0 mt-4">
      {/* Tabs */}
      <div className="flex items-center gap-6 px-4 pt-4 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`pb-3 text-sm font-medium transition-all ${
              activeTab === tab.value
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 text-xs">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {renderTabContent()}
      </div>
    </div>
  );
}
