"use client";

import { useState, useEffect } from "react";
import { Calculator, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface PNLCalculatorProps {
  symbol: string;
  currentPrice: number;
  side: "long" | "short";
}

interface Scenario {
  exitPrice: number;
  pnl: number;
  pnlPercent: number;
  roe: number;
  fees: number;
  netPnl: number;
}

export default function PNLCalculator({ symbol, currentPrice, side }: PNLCalculatorProps) {
  const [entryPrice, setEntryPrice] = useState(currentPrice.toString());
  const [positionSize, setPositionSize] = useState("0.5");
  const [leverage, setLeverage] = useState("20");
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const calculateScenarios = () => {
    const entry = parseFloat(entryPrice);
    const size = parseFloat(positionSize);
    const lev = parseFloat(leverage);

    if (!entry || !size || !lev) return [];

    const priceChanges = [-10, -5, -2, 0, 2, 5, 10, 20, 50];
    const feeRate = 0.0005; // 0.05% per side
    const margin = (entry * size) / lev;

    return priceChanges.map(changePercent => {
      const exitPrice = entry * (1 + changePercent / 100);

      let pnl = 0;
      if (side === "long") {
        pnl = (exitPrice - entry) * size;
      } else {
        pnl = (entry - exitPrice) * size;
      }

      const openFee = entry * size * feeRate;
      const closeFee = exitPrice * size * feeRate;
      const totalFees = openFee + closeFee;
      const netPnl = pnl - totalFees;
      const pnlPercent = (netPnl / margin) * 100;
      const roe = pnlPercent; // ROE = PNL% when using leverage

      return {
        exitPrice,
        pnl,
        pnlPercent,
        roe,
        fees: totalFees,
        netPnl,
      };
    });
  };

  useEffect(() => {
    setScenarios(calculateScenarios());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryPrice, positionSize, leverage, side]);

  const maxLeverage = 125;

  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="w-5 h-5 text-blue-400" />
        <h3 className="text-sm font-semibold">P&L Calculator</h3>
      </div>

      {/* Input Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Entry Price (USDT)</label>
          <input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Position Size (BTC)</label>
          <input
            type="number"
            value={positionSize}
            onChange={(e) => setPositionSize(e.target.value)}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Leverage</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
              min="1"
              max={maxLeverage}
              className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-yellow-400 font-semibold">
              {leverage}x
            </span>
          </div>
        </div>
      </div>

      {/* Position Info */}
      <div className="grid grid-cols-3 gap-2 bg-card/50 rounded-lg p-3">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Position Value</div>
          <div className="font-semibold">
            ${(parseFloat(entryPrice || "0") * parseFloat(positionSize || "0")).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Margin Required</div>
          <div className="font-semibold">
            ${((parseFloat(entryPrice || "0") * parseFloat(positionSize || "0")) / parseFloat(leverage || "1")).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Direction</div>
          <div className={`font-semibold ${side === "long" ? "text-emerald-400" : "text-red-400"}`}>
            {side.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Scenarios Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold">Exit Price Scenarios</span>
          <span className="text-xs text-muted-foreground">Fees: 0.05% per side</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left py-2 px-2">Change</th>
                <th className="text-right py-2 px-2">Exit Price</th>
                <th className="text-right py-2 px-2">Gross P&L</th>
                <th className="text-right py-2 px-2">Fees</th>
                <th className="text-right py-2 px-2">Net P&L</th>
                <th className="text-right py-2 px-2">ROE %</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario, i) => {
                const changePercent = ((scenario.exitPrice - parseFloat(entryPrice)) / parseFloat(entryPrice)) * 100;
                const isProfit = scenario.netPnl > 0;
                const isCurrentPrice = Math.abs(scenario.exitPrice - currentPrice) < 1;

                return (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`border-b border-border/50 hover:bg-card/30 transition-all ${
                      isCurrentPrice ? 'bg-blue-500/10 border-blue-500/30' : ''
                    }`}
                  >
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-1">
                        {changePercent > 0 ? (
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                        ) : changePercent < 0 ? (
                          <TrendingDown className="w-3 h-3 text-red-400" />
                        ) : null}
                        <span className={changePercent > 0 ? 'text-emerald-400' : changePercent < 0 ? 'text-red-400' : ''}>
                          {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-right font-semibold">
                      ${scenario.exitPrice.toLocaleString()}
                      {isCurrentPrice && (
                        <span className="ml-1 px-1 bg-blue-500/20 text-blue-400 rounded text-xs">NOW</span>
                      )}
                    </td>
                    <td className={`py-2 px-2 text-right ${scenario.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {scenario.pnl >= 0 ? '+' : ''}${scenario.pnl.toFixed(2)}
                    </td>
                    <td className="py-2 px-2 text-right text-orange-400">
                      -${scenario.fees.toFixed(2)}
                    </td>
                    <td className={`py-2 px-2 text-right font-semibold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                      {scenario.netPnl >= 0 ? '+' : ''}${scenario.netPnl.toFixed(2)}
                    </td>
                    <td className={`py-2 px-2 text-right font-bold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                      {scenario.roe >= 0 ? '+' : ''}{scenario.roe.toFixed(2)}%
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Best Case (+50%)</div>
          <div className="text-lg font-bold text-emerald-400">
            {scenarios.length > 0 && `+$${scenarios[scenarios.length - 1].netPnl.toFixed(2)}`}
          </div>
          <div className="text-xs text-emerald-400">
            ROE: +{scenarios.length > 0 && scenarios[scenarios.length - 1].roe.toFixed(2)}%
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Worst Case (-10%)</div>
          <div className="text-lg font-bold text-red-400">
            {scenarios.length > 0 && `${scenarios[0].netPnl.toFixed(2) < '0' ? '' : '+'}$${scenarios[0].netPnl.toFixed(2)}`}
          </div>
          <div className="text-xs text-red-400">
            ROE: {scenarios.length > 0 && scenarios[0].roe.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Leverage Impact */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-orange-400">Leverage Impact:</span>
        </div>
        <div className="text-muted-foreground space-y-1">
          <div>• {leverage}x leverage amplifies both gains and losses</div>
          <div>• A {(100 / parseFloat(leverage || "1")).toFixed(2)}% adverse move could liquidate your position</div>
          <div>• Consider using stop-loss orders to manage risk</div>
        </div>
      </div>
    </div>
  );
}
