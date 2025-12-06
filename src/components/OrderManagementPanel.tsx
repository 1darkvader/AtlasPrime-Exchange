"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

type TabType = "open" | "history" | "trades" | "funds" | "bots";

export default function OrderManagementPanel() {
  const [activeTab, setActiveTab] = useState<TabType>("open");
  const { isAuthenticated } = useAuth();
  const isLoggedIn = isAuthenticated; // Use real auth state

  const tabs: { value: TabType; label: string; count?: number }[] = [
    { value: "open", label: "Open Orders", count: 0 },
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
            <div className="flex items-center justify-between mb-4 px-4">
              <div className="flex gap-4">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  All
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  Limit
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  Market
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  Stop Limit
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-emerald-400 hover:underline">
                  Hide all pairs
                </button>
                <button className="text-xs text-emerald-400 hover:underline">
                  Cancel All
                </button>
              </div>
            </div>
            {renderEmptyState()}
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
