"use client";

import { useState, useEffect } from "react";

interface LiquidationCalculatorProps {
  entryPrice: number;
  leverage: number;
  side: "long" | "short";
  margin: number;
}

export default function LiquidationCalculator({
  entryPrice,
  leverage,
  side,
  margin,
}: LiquidationCalculatorProps) {
  const [currentPrice, setCurrentPrice] = useState(entryPrice);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [healthRatio, setHealthRatio] = useState(100);
  const [riskLevel, setRiskLevel] = useState<"safe" | "warning" | "danger">("safe");
  const [distanceToLiquidation, setDistanceToLiquidation] = useState(0);

  useEffect(() => {
    // Calculate liquidation price based on position
    const maintenanceMarginRate = 0.005; // 0.5%

    let liqPrice = 0;
    if (side === "long") {
      liqPrice = entryPrice * (1 - (1 / leverage) + maintenanceMarginRate);
    } else {
      liqPrice = entryPrice * (1 + (1 / leverage) - maintenanceMarginRate);
    }

    setLiquidationPrice(liqPrice);

    // Calculate health ratio
    const priceChange = Math.abs(currentPrice - entryPrice) / entryPrice;
    const unrealizedPnL = side === "long"
      ? (currentPrice - entryPrice) * (margin * leverage / entryPrice)
      : (entryPrice - currentPrice) * (margin * leverage / entryPrice);

    const equity = margin + unrealizedPnL;
    const maintenanceMargin = (margin * leverage * maintenanceMarginRate);
    const health = (equity / maintenanceMargin) * 100;

    setHealthRatio(Math.max(0, Math.min(300, health)));

    // Calculate distance to liquidation
    const distance = Math.abs((currentPrice - liqPrice) / entryPrice) * 100;
    setDistanceToLiquidation(distance);

    // Set risk level
    if (health > 200) {
      setRiskLevel("safe");
    } else if (health > 120) {
      setRiskLevel("warning");
    } else {
      setRiskLevel("danger");
    }
  }, [entryPrice, leverage, side, margin, currentPrice]);

  const getRiskColor = () => {
    if (riskLevel === "safe") return "text-emerald-400";
    if (riskLevel === "warning") return "text-yellow-400";
    return "text-red-400";
  };

  const getRiskBg = () => {
    if (riskLevel === "safe") return "bg-emerald-500";
    if (riskLevel === "warning") return "bg-yellow-500";
    return "bg-red-500";
  };

  const healthPercentage = Math.min(100, (healthRatio / 300) * 100);

  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Liquidation Calculator</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          riskLevel === "safe" ? "bg-emerald-500/20 text-emerald-400" :
          riskLevel === "warning" ? "bg-yellow-500/20 text-yellow-400" :
          "bg-red-500/20 text-red-400"
        }`}>
          {riskLevel.toUpperCase()}
        </div>
      </div>

      {/* Current Price Input */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Simulate Current Price</label>
        <input
          type="number"
          value={currentPrice}
          onChange={(e) => setCurrentPrice(Number(e.target.value))}
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Health Ratio Meter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Health Ratio</span>
          <span className={`text-lg font-bold ${getRiskColor()}`}>
            {healthRatio.toFixed(1)}%
          </span>
        </div>
        <div className="relative h-3 bg-background rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-500 ${getRiskBg()}`}
            style={{ width: `${healthPercentage}%` }}
          />
          {/* Danger zone marker */}
          <div className="absolute left-[40%] top-0 bottom-0 w-px bg-red-500/50" />
          <div className="absolute left-[66.67%] top-0 bottom-0 w-px bg-yellow-500/50" />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Liquidation</span>
          <span>Warning</span>
          <span>Safe</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Entry Price</div>
          <div className="text-base font-semibold">${entryPrice.toLocaleString()}</div>
        </div>
        <div className="bg-card/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Liquidation Price</div>
          <div className="text-base font-semibold text-red-400">${liquidationPrice.toFixed(2)}</div>
        </div>
        <div className="bg-card/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Distance to Liq.</div>
          <div className={`text-base font-semibold ${getRiskColor()}`}>
            {distanceToLiquidation.toFixed(2)}%
          </div>
        </div>
        <div className="bg-card/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Leverage</div>
          <div className="text-base font-semibold text-yellow-400">{leverage}x</div>
        </div>
      </div>

      {/* Risk Warning */}
      {riskLevel === "danger" && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-400 animate-pulse">
          ⚠️ <strong>High Risk!</strong> Your position is close to liquidation. Consider reducing leverage or adding margin.
        </div>
      )}
      {riskLevel === "warning" && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-xs text-yellow-400">
          ⚡ <strong>Caution:</strong> Monitor your position closely. Market volatility could trigger liquidation.
        </div>
      )}
    </div>
  );
}
