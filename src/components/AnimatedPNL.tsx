"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AnimatedPNLProps {
  pnl: number;
  roe: number;
  previousPnl?: number;
  size?: "sm" | "md" | "lg";
}

export default function AnimatedPNL({
  pnl,
  roe,
  previousPnl = 0,
  size = "md",
}: AnimatedPNLProps) {
  const [showChange, setShowChange] = useState(false);
  const [change, setChange] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(true);

  useEffect(() => {
    if (previousPnl !== pnl) {
      const diff = pnl - previousPnl;
      setChange(diff);
      setIsIncreasing(diff > 0);
      setShowChange(true);

      const timer = setTimeout(() => {
        setShowChange(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [pnl, previousPnl]);

  const isProfit = pnl >= 0;
  const textColor = isProfit ? "text-emerald-400" : "text-red-400";
  const bgColor = isProfit ? "bg-emerald-500/10" : "bg-red-500/10";
  const borderColor = isProfit ? "border-emerald-500/20" : "border-red-500/20";

  const getSizeClasses = () => {
    if (size === "sm") {
      return { pnl: "text-sm", roe: "text-xs", icon: "w-3 h-3" };
    }
    if (size === "lg") {
      return { pnl: "text-3xl", roe: "text-lg", icon: "w-6 h-6" };
    }
    return { pnl: "text-xl", roe: "text-sm", icon: "w-4 h-4" };
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className="relative">
      <motion.div
        className={`${bgColor} ${borderColor} border rounded-lg p-3 relative overflow-hidden`}
        animate={{
          scale: showChange ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated background pulse */}
        <AnimatePresence>
          {showChange && (
            <motion.div
              className={`absolute inset-0 ${isIncreasing ? "bg-emerald-500/20" : "bg-red-500/20"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Unrealized PNL</span>
            {isProfit ? (
              <TrendingUp className={`${sizeClasses.icon} ${textColor}`} />
            ) : (
              <TrendingDown className={`${sizeClasses.icon} ${textColor}`} />
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <motion.div
              key={pnl}
              className={`${sizeClasses.pnl} font-bold ${textColor}`}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
            </motion.div>

            <motion.div
              key={roe}
              className={`${sizeClasses.roe} font-semibold ${textColor}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              ({roe >= 0 ? "+" : ""}{roe.toFixed(2)}%)
            </motion.div>
          </div>

          {/* Change indicator */}
          <AnimatePresence>
            {showChange && Math.abs(change) > 0.01 && (
              <motion.div
                className={`mt-2 text-xs font-medium ${isIncreasing ? "text-emerald-400" : "text-red-400"}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.3 }}
              >
                {isIncreasing ? "▲" : "▼"} {Math.abs(change).toFixed(2)} USDT
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Floating change indicator */}
      <AnimatePresence>
        {showChange && Math.abs(change) > 0.01 && (
          <motion.div
            className={`absolute -top-8 right-0 px-3 py-1 rounded-full font-semibold text-xs ${
              isIncreasing
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            {isIncreasing ? "+" : ""}{change.toFixed(2)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
