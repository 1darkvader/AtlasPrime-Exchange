"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Position {
  symbol: string;
  side: "long" | "short";
  size: number;
  leverage: number;
  entryPrice: number;
  markPrice: number;
  liquidationPrice: number;
  margin: number;
  pnl: number;
  roe: number;
}

interface PositionManagementProps {
  position: Position;
  onClose: () => void;
  onUpdate: (updates: Partial<Position>) => void;
}

export default function PositionManagement({
  position,
  onClose,
  onUpdate,
}: PositionManagementProps) {
  const [activeTab, setActiveTab] = useState<"adjust" | "tpsl" | "close">("adjust");
  const [newLeverage, setNewLeverage] = useState(position.leverage);
  const [addMargin, setAddMargin] = useState("");
  const [reduceMargin, setReduceMargin] = useState("");

  const [takeProfitPrice, setTakeProfitPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");
  const [tpslType, setTpslType] = useState<"mark" | "last">("mark");

  const [closeType, setCloseType] = useState<"market" | "limit">("market");
  const [closePrice, setClosePrice] = useState("");
  const [closeAmount, setCloseAmount] = useState(position.size.toString());

  const maxLeverage = 125;
  const availableMargin = 38500; // Mock data

  const handleAdjustLeverage = () => {
    onUpdate({ leverage: newLeverage });
    // Show success message
  };

  const handleAddMargin = () => {
    if (addMargin) {
      const newMarginValue = position.margin + parseFloat(addMargin);
      onUpdate({ margin: newMarginValue });
      setAddMargin("");
    }
  };

  const handleReduceMargin = () => {
    if (reduceMargin) {
      const newMarginValue = Math.max(0, position.margin - parseFloat(reduceMargin));
      onUpdate({ margin: newMarginValue });
      setReduceMargin("");
    }
  };

  const handleSetTPSL = () => {
    // Implementation for TP/SL
    console.log("Setting TP/SL:", { takeProfitPrice, stopLossPrice, tpslType });
  };

  const handleClosePosition = () => {
    // Implementation for closing position
    console.log("Closing position:", { closeType, closePrice, closeAmount });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="glass rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card/95 backdrop-blur-sm z-10">
          <div>
            <h2 className="text-lg font-bold">Manage Position</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-semibold">{position.symbol}</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                position.side === "long" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
              }`}>
                {position.side.toUpperCase()} {position.leverage}x
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-card rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Position Stats */}
        <div className="p-4 border-b border-border">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Size</div>
              <div className="font-semibold">{position.size} BTC</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Entry Price</div>
              <div className="font-semibold">${position.entryPrice.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Mark Price</div>
              <div className="font-semibold">${position.markPrice.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Margin</div>
              <div className="font-semibold">${position.margin.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">PNL</div>
              <div className={`font-semibold ${position.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">ROE</div>
              <div className={`font-semibold ${position.roe >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {position.roe >= 0 ? "+" : ""}{position.roe.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["adjust", "tpsl", "close"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                activeTab === tab
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "adjust" && "Adjust Leverage & Margin"}
              {tab === "tpsl" && "Take Profit / Stop Loss"}
              {tab === "close" && "Close Position"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === "adjust" && (
            <div className="space-y-6">
              {/* Adjust Leverage */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Adjust Leverage</h3>
                <div className="bg-card/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Leverage</span>
                    <span className="text-lg font-bold text-yellow-400">{position.leverage}x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">New Leverage</span>
                    <span className="text-lg font-bold text-blue-400">{newLeverage}x</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={maxLeverage}
                    value={newLeverage}
                    onChange={(e) => setNewLeverage(Number(e.target.value))}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1x</span>
                    <span>25x</span>
                    <span>50x</span>
                    <span>75x</span>
                    <span>125x</span>
                  </div>
                  <button
                    onClick={handleAdjustLeverage}
                    disabled={newLeverage === position.leverage}
                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-card disabled:text-muted-foreground text-white font-semibold rounded-lg transition-all"
                  >
                    Confirm Leverage Change
                  </button>
                  <div className="text-xs text-orange-400">
                    ⚠️ Changing leverage will affect your liquidation price
                  </div>
                </div>
              </div>

              {/* Add Margin */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Add Margin</h3>
                <div className="bg-card/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Available</span>
                    <span>{availableMargin.toLocaleString()} USDT</span>
                  </div>
                  <input
                    type="number"
                    value={addMargin}
                    onChange={(e) => setAddMargin(e.target.value)}
                    placeholder="Amount to add"
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleAddMargin}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all"
                  >
                    Add Margin
                  </button>
                  <div className="text-xs text-muted-foreground">
                    Adding margin reduces liquidation risk and improves health ratio
                  </div>
                </div>
              </div>

              {/* Reduce Margin */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Reduce Margin</h3>
                <div className="bg-card/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Current Margin</span>
                    <span>{position.margin.toLocaleString()} USDT</span>
                  </div>
                  <input
                    type="number"
                    value={reduceMargin}
                    onChange={(e) => setReduceMargin(e.target.value)}
                    placeholder="Amount to reduce"
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={handleReduceMargin}
                    className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                  >
                    Reduce Margin
                  </button>
                  <div className="text-xs text-orange-400">
                    ⚠️ Reducing margin increases liquidation risk
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tpsl" && (
            <div className="space-y-6">
              {/* Price Type */}
              <div className="flex gap-2">
                {(["mark", "last"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTpslType(type)}
                    className={`px-4 py-2 text-sm font-medium rounded transition-all ${
                      tpslType === type
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {type === "mark" ? "Mark Price" : "Last Price"}
                  </button>
                ))}
              </div>

              {/* Take Profit */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Take Profit
                </h3>
                <div className="bg-card/50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">TP Price (USDT)</label>
                    <input
                      type="number"
                      value={takeProfitPrice}
                      onChange={(e) => setTakeProfitPrice(e.target.value)}
                      placeholder={position.side === "long" ? "Above entry price" : "Below entry price"}
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  {takeProfitPrice && (
                    <div className="bg-emerald-500/10 rounded-lg p-3 text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">Estimated Profit:</span>
                        <span className="text-emerald-400 font-semibold">
                          +${((parseFloat(takeProfitPrice) - position.entryPrice) * position.size).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ROE at TP:</span>
                        <span className="text-emerald-400 font-semibold">
                          +{(((parseFloat(takeProfitPrice) - position.entryPrice) / position.entryPrice) * position.leverage * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stop Loss */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Stop Loss
                </h3>
                <div className="bg-card/50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">SL Price (USDT)</label>
                    <input
                      type="number"
                      value={stopLossPrice}
                      onChange={(e) => setStopLossPrice(e.target.value)}
                      placeholder={position.side === "long" ? "Below entry price" : "Above entry price"}
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  {stopLossPrice && (
                    <div className="bg-red-500/10 rounded-lg p-3 text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">Estimated Loss:</span>
                        <span className="text-red-400 font-semibold">
                          ${((parseFloat(stopLossPrice) - position.entryPrice) * position.size).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ROE at SL:</span>
                        <span className="text-red-400 font-semibold">
                          {(((parseFloat(stopLossPrice) - position.entryPrice) / position.entryPrice) * position.leverage * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSetTPSL}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
              >
                Confirm TP/SL Orders
              </button>
            </div>
          )}

          {activeTab === "close" && (
            <div className="space-y-6">
              {/* Close Type */}
              <div className="flex gap-2">
                {(["market", "limit"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCloseType(type)}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded transition-all ${
                      closeType === type
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {type === "market" ? "Market Close" : "Limit Close"}
                  </button>
                ))}
              </div>

              {/* Close Price (for limit) */}
              {closeType === "limit" && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Close Price</label>
                  <input
                    type="number"
                    value={closePrice}
                    onChange={(e) => setClosePrice(e.target.value)}
                    placeholder="Limit price"
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Close Amount */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Close Amount</label>
                <input
                  type="number"
                  value={closeAmount}
                  onChange={(e) => setCloseAmount(e.target.value)}
                  placeholder="Amount to close"
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2 mt-2">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setCloseAmount(((position.size * pct) / 100).toString())}
                      className="flex-1 px-2 py-1 bg-card hover:bg-card/80 rounded text-xs transition-all"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimated PNL */}
              <div className="bg-card/50 rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-2">Estimated PNL at Current Price</div>
                <div className={`text-2xl font-bold ${position.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
                </div>
                <div className={`text-sm ${position.roe >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  ROE: {position.roe >= 0 ? "+" : ""}{position.roe.toFixed(2)}%
                </div>
              </div>

              <button
                onClick={handleClosePosition}
                className={`w-full py-3 font-semibold rounded-lg transition-all ${
                  position.side === "long"
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white"
                }`}
              >
                {closeType === "market" ? "Close Position (Market)" : "Place Limit Close Order"}
              </button>

              <div className="text-xs text-muted-foreground text-center">
                Market orders execute immediately at current price. Limit orders wait for target price.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
