"use client";

import { useState } from "react";
import { TrendingDown, GitBranch, Layers } from "lucide-react";

interface AdvancedOrderTypesProps {
  symbol: string;
  side: "long" | "short";
  currentPrice: number;
}

export default function AdvancedOrderTypes({ symbol, side, currentPrice }: AdvancedOrderTypesProps) {
  const [orderType, setOrderType] = useState<"trailing_stop" | "oco" | "iceberg">("trailing_stop");

  // Trailing Stop
  const [trailingStopType, setTrailingStopType] = useState<"percentage" | "amount">("percentage");
  const [trailingStopValue, setTrailingStopValue] = useState("");
  const [trailingActivationPrice, setTrailingActivationPrice] = useState("");

  // OCO
  const [ocoStopPrice, setOcoStopPrice] = useState("");
  const [ocoStopLimitPrice, setOcoStopLimitPrice] = useState("");
  const [ocoLimitPrice, setOcoLimitPrice] = useState("");
  const [ocoAmount, setOcoAmount] = useState("");

  // Iceberg
  const [icebergTotalAmount, setIcebergTotalAmount] = useState("");
  const [icebergVisibleAmount, setIcebergVisibleAmount] = useState("");
  const [icebergPrice, setIcebergPrice] = useState("");
  const [icebergVariance, setIcebergVariance] = useState("0");

  const orderTypes = [
    {
      value: "trailing_stop" as const,
      label: "Trailing Stop",
      icon: TrendingDown,
      description: "Stop order that trails the market price"
    },
    {
      value: "oco" as const,
      label: "OCO",
      icon: GitBranch,
      description: "One-Cancels-Other: Two orders, one executes"
    },
    {
      value: "iceberg" as const,
      label: "Iceberg",
      icon: Layers,
      description: "Hide large orders in small visible chunks"
    },
  ];

  const handleSubmitOrder = () => {
    console.log("Submitting advanced order:", {
      type: orderType,
      symbol,
      side,
      // Add relevant parameters based on order type
    });
  };

  const calculateTrailingStop = () => {
    if (!trailingStopValue) return null;

    if (trailingStopType === "percentage") {
      const percentage = parseFloat(trailingStopValue);
      const stopPrice = side === "long"
        ? currentPrice * (1 - percentage / 100)
        : currentPrice * (1 + percentage / 100);
      return stopPrice.toFixed(2);
    } else {
      const amount = parseFloat(trailingStopValue);
      const stopPrice = side === "long"
        ? currentPrice - amount
        : currentPrice + amount;
      return stopPrice.toFixed(2);
    }
  };

  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-semibold">Advanced Order Types</h3>

      {/* Order Type Selector */}
      <div className="grid grid-cols-3 gap-2">
        {orderTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.value}
              onClick={() => setOrderType(type.value)}
              className={`p-3 rounded-lg border transition-all ${
                orderType === type.value
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                  : 'bg-card border-border text-muted-foreground hover:border-border/80'
              }`}
            >
              <Icon className={`w-5 h-5 mx-auto mb-2 ${orderType === type.value ? 'text-blue-400' : ''}`} />
              <div className="text-xs font-medium">{type.label}</div>
            </button>
          );
        })}
      </div>

      {/* Order Type Description */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-400">
        {orderTypes.find(t => t.value === orderType)?.description}
      </div>

      {/* Trailing Stop Form */}
      {orderType === "trailing_stop" && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Trailing Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setTrailingStopType("percentage")}
                className={`flex-1 px-3 py-2 rounded text-sm transition-all ${
                  trailingStopType === "percentage"
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-card text-muted-foreground border border-border'
                }`}
              >
                Percentage %
              </button>
              <button
                onClick={() => setTrailingStopType("amount")}
                className={`flex-1 px-3 py-2 rounded text-sm transition-all ${
                  trailingStopType === "amount"
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-card text-muted-foreground border border-border'
                }`}
              >
                Amount ($)
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Trailing Distance {trailingStopType === "percentage" ? "(%)" : "(USDT)"}
            </label>
            <input
              type="number"
              value={trailingStopValue}
              onChange={(e) => setTrailingStopValue(e.target.value)}
              placeholder={trailingStopType === "percentage" ? "e.g., 2.5" : "e.g., 500"}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Activation Price (Optional)
            </label>
            <input
              type="number"
              value={trailingActivationPrice}
              onChange={(e) => setTrailingActivationPrice(e.target.value)}
              placeholder="Leave empty for immediate activation"
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {trailingStopValue && (
            <div className="bg-card/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Current Stop Price</div>
              <div className="text-lg font-bold text-blue-400">${calculateTrailingStop()}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Adjusts automatically as market price moves {side === "long" ? "up" : "down"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* OCO Form */}
      {orderType === "oco" && (
        <div className="space-y-3">
          <div className="bg-card/50 rounded-lg p-3 mb-3">
            <div className="text-xs font-semibold mb-2">Order 1: Stop-Limit</div>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Stop Price</label>
                <input
                  type="number"
                  value={ocoStopPrice}
                  onChange={(e) => setOcoStopPrice(e.target.value)}
                  placeholder="Trigger price"
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Limit Price</label>
                <input
                  type="number"
                  value={ocoStopLimitPrice}
                  onChange={(e) => setOcoStopLimitPrice(e.target.value)}
                  placeholder="Execution price"
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-card/50 rounded-lg p-3">
            <div className="text-xs font-semibold mb-2">Order 2: Limit</div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Limit Price</label>
              <input
                type="number"
                value={ocoLimitPrice}
                onChange={(e) => setOcoLimitPrice(e.target.value)}
                placeholder="Target price"
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Amount (BTC)</label>
            <input
              type="number"
              value={ocoAmount}
              onChange={(e) => setOcoAmount(e.target.value)}
              placeholder="Order amount"
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs">
            <div className="font-semibold text-blue-400 mb-1">How it works:</div>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Stop-Limit triggers at ${ocoStopPrice || "___"}, executes at ${ocoStopLimitPrice || "___"}</li>
              <li>Limit order executes at ${ocoLimitPrice || "___"}</li>
              <li>When one order fills, the other cancels automatically</li>
            </ul>
          </div>
        </div>
      )}

      {/* Iceberg Form */}
      {orderType === "iceberg" && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Total Order Amount</label>
            <input
              type="number"
              value={icebergTotalAmount}
              onChange={(e) => setIcebergTotalAmount(e.target.value)}
              placeholder="e.g., 10 BTC"
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Visible Amount (Per Order)</label>
            <input
              type="number"
              value={icebergVisibleAmount}
              onChange={(e) => setIcebergVisibleAmount(e.target.value)}
              placeholder="e.g., 0.5 BTC"
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Price</label>
            <input
              type="number"
              value={icebergPrice}
              onChange={(e) => setIcebergPrice(e.target.value)}
              placeholder="Limit price"
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Price Variance (Optional %)
            </label>
            <input
              type="number"
              value={icebergVariance}
              onChange={(e) => setIcebergVariance(e.target.value)}
              placeholder="e.g., 0.1"
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Randomly vary price by ±{icebergVariance}% to avoid detection
            </div>
          </div>

          {icebergTotalAmount && icebergVisibleAmount && (
            <div className="bg-card/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Hidden Amount</span>
                <span className="font-semibold">
                  {(parseFloat(icebergTotalAmount) - parseFloat(icebergVisibleAmount)).toFixed(4)} BTC
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Number of Orders</span>
                <span className="font-semibold">
                  {Math.ceil(parseFloat(icebergTotalAmount) / parseFloat(icebergVisibleAmount))} orders
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground mb-2">Order Book Visibility</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-blue-500/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(parseFloat(icebergVisibleAmount) / parseFloat(icebergTotalAmount)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs">
                    {((parseFloat(icebergVisibleAmount) / parseFloat(icebergTotalAmount)) * 100).toFixed(1)}% visible
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmitOrder}
        className={`w-full py-3 font-semibold rounded-lg transition-all ${
          side === "long"
            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
      >
        Place {orderTypes.find(t => t.value === orderType)?.label} Order
      </button>

      {/* Order Type Info */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div className="font-semibold mb-2">Tips:</div>
        {orderType === "trailing_stop" && (
          <ul className="space-y-1 ml-4 list-disc">
            <li>Locks in profits as price moves favorably</li>
            <li>Automatically adjusts stop price</li>
            <li>Never moves against the position</li>
          </ul>
        )}
        {orderType === "oco" && (
          <ul className="space-y-1 ml-4 list-disc">
            <li>Set both profit target and stop loss</li>
            <li>Whichever triggers first cancels the other</li>
            <li>Ideal for managing risk while capturing profits</li>
          </ul>
        )}
        {orderType === "iceberg" && (
          <ul className="space-y-1 ml-4 list-disc">
            <li>Hides large orders to avoid market impact</li>
            <li>Only visible portion shows in order book</li>
            <li>Useful for institutional-size orders</li>
          </ul>
        )}
      </div>
    </div>
  );
}
