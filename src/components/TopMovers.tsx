"use client";

import { useState } from "react";
import { TOP_50_PAIRS } from "@/lib/tradingPairs";

type FilterType = "all" | "change" | "highs" | "fluctuation" | "volume";

export default function TopMovers() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isExpanded, setIsExpanded] = useState(true);

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "change", label: "Change" },
    { value: "highs", label: "New High/Low" },
    { value: "fluctuation", label: "Fluctuation" },
    { value: "volume", label: "Volume" },
  ];

  // Mock data for top movers
  const movers = TOP_50_PAIRS.slice(0, 10).map((pair, i) => ({
    pair: pair.pair,
    icon: pair.icon,
    time: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    tag: i % 3 === 0 ? "New 24hr Low" : i % 3 === 1 ? "New 24hr High" : "Volume Spike",
    change: (Math.random() - 0.5) * 20,
  }));

  return (
    <div className="glass rounded-xl p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Top Movers</h3>
        <div className="flex items-center gap-2">
          <a href="#" className="text-xs text-emerald-400 hover:underline">
            FAQ
          </a>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-card rounded transition-all"
          >
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-3 border-b border-border overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-3 py-1 text-xs font-medium whitespace-nowrap rounded transition-all ${
                  activeFilter === filter.value
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Movers List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {movers.map((mover, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 hover:bg-card/50 rounded transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-sm">
                    {mover.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{mover.pair}</div>
                    <div className="text-xs text-muted-foreground">{mover.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      mover.tag === "New 24hr High"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : mover.tag === "New 24hr Low"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {mover.tag}
                  </span>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-sm font-semibold ${
                        mover.change >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {mover.change >= 0 ? "+" : ""}
                      {mover.change.toFixed(2)}%
                    </span>
                    {mover.change >= 0 ? (
                      <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
