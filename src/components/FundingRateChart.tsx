"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, TrendingDown, Bell } from "lucide-react";

interface FundingRateChartProps {
  symbol: string;
  currentRate: number;
  nextFundingTime: string; // Time until next funding (e.g., "7:45:32")
}

export default function FundingRateChart({ symbol, currentRate, nextFundingTime }: FundingRateChartProps) {
  const [timeLeft, setTimeLeft] = useState(nextFundingTime);
  const [showNotification, setShowNotification] = useState(false);

  // Mock funding rate history data (in production, fetch from API)
  const fundingHistory = [
    { time: "00:00", rate: 0.0095 },
    { time: "08:00", rate: 0.0102 },
    { time: "16:00", rate: 0.0098 },
    { time: "00:00", rate: 0.0105 },
    { time: "08:00", rate: 0.0100 },
    { time: "16:00", rate: 0.0092 },
    { time: "00:00", rate: 0.0097 },
    { time: "08:00", rate: currentRate },
  ];

  const avgRate = fundingHistory.reduce((sum, item) => sum + item.rate, 0) / fundingHistory.length;
  const maxRate = Math.max(...fundingHistory.map(item => item.rate));
  const minRate = Math.min(...fundingHistory.map(item => item.rate));

  useEffect(() => {
    // Countdown timer
    const interval = setInterval(() => {
      const [hours, minutes, seconds] = timeLeft.split(':').map(Number);
      let totalSeconds = hours * 3600 + minutes * 60 + seconds;

      if (totalSeconds > 0) {
        totalSeconds--;
        const newHours = Math.floor(totalSeconds / 3600);
        const newMinutes = Math.floor((totalSeconds % 3600) / 60);
        const newSeconds = totalSeconds % 60;
        setTimeLeft(`${newHours}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`);

        // Show notification when 5 minutes left
        if (totalSeconds === 300) {
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 5000);
        }
      } else {
        setTimeLeft("8:00:00"); // Reset to 8 hours
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const isPositiveRate = currentRate >= 0;

  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Funding Rate History</h3>
        <button className="p-1.5 hover:bg-card rounded transition-all">
          <Bell className={`w-4 h-4 ${showNotification ? 'text-orange-400 animate-pulse' : 'text-muted-foreground'}`} />
        </button>
      </div>

      {/* Current Funding Rate & Countdown */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            {isPositiveRate ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className="text-xs text-muted-foreground">Current Rate</span>
          </div>
          <div className={`text-2xl font-bold ${isPositiveRate ? 'text-emerald-400' : 'text-red-400'}`}>
            {(currentRate * 100).toFixed(4)}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Every 8 hours
          </div>
        </div>

        <div className="bg-card/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground">Next Funding</span>
          </div>
          <div className="text-2xl font-bold text-blue-400 font-mono">
            {timeLeft}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Countdown
          </div>
        </div>
      </div>

      {/* Funding Rate Chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Last 24h History</span>
          <div className="flex gap-3 text-xs">
            <span className="text-muted-foreground">Avg: <span className="text-foreground">{(avgRate * 100).toFixed(4)}%</span></span>
          </div>
        </div>

        <div className="relative h-32 bg-card/30 rounded-lg p-2">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pr-2">
            <span>{(maxRate * 100).toFixed(3)}%</span>
            <span>{(avgRate * 100).toFixed(3)}%</span>
            <span>{(minRate * 100).toFixed(3)}%</span>
          </div>

          {/* Chart bars */}
          <div className="absolute left-12 right-2 top-2 bottom-8 flex items-end justify-between gap-1">
            {fundingHistory.map((item, i) => {
              const heightPercent = ((item.rate - minRate) / (maxRate - minRate)) * 100;
              const isPositive = item.rate >= avgRate;

              return (
                <motion.div
                  key={i}
                  className="flex-1 group relative"
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div
                    className={`w-full h-full rounded-t transition-all ${
                      isPositive ? 'bg-emerald-500/60 hover:bg-emerald-500' : 'bg-red-500/60 hover:bg-red-500'
                    }`}
                  />

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-card border border-border rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                      <div className="font-semibold">{item.time}</div>
                      <div className={isPositive ? 'text-emerald-400' : 'text-red-400'}>
                        {(item.rate * 100).toFixed(4)}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="absolute left-12 right-2 bottom-0 flex justify-between text-xs text-muted-foreground">
            {fundingHistory.filter((_, i) => i % 2 === 0).map((item, i) => (
              <span key={i}>{item.time}</span>
            ))}
          </div>

          {/* Average line */}
          <div className="absolute left-12 right-2 border-t border-dashed border-yellow-500/30" style={{ bottom: `${((avgRate - minRate) / (maxRate - minRate)) * 100}%` + 8 }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-card/30 rounded p-2">
          <div className="text-muted-foreground mb-1">24h High</div>
          <div className="font-semibold text-emerald-400">{(maxRate * 100).toFixed(4)}%</div>
        </div>
        <div className="bg-card/30 rounded p-2">
          <div className="text-muted-foreground mb-1">24h Low</div>
          <div className="font-semibold text-red-400">{(minRate * 100).toFixed(4)}%</div>
        </div>
        <div className="bg-card/30 rounded p-2">
          <div className="text-muted-foreground mb-1">Avg Rate</div>
          <div className="font-semibold">{(avgRate * 100).toFixed(4)}%</div>
        </div>
      </div>

      {/* Notification Toast */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-4 right-4 bg-orange-500/20 border border-orange-500/30 rounded-lg p-3 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-400" />
            <div>
              <div className="text-sm font-semibold text-orange-400">Funding Alert</div>
              <div className="text-xs text-muted-foreground">Next funding in 5 minutes</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
