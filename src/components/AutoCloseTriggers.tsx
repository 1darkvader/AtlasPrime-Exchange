"use client";

import { useState } from "react";
import { Shield, AlertTriangle, X } from "lucide-react";
import { motion } from "framer-motion";

interface AutoCloseTrigger {
  id: string;
  type: "health_ratio" | "pnl" | "time";
  threshold: number;
  action: "close_all" | "close_50" | "add_margin";
  enabled: boolean;
}

interface AutoCloseTriggersProps {
  positionId?: string;
  currentHealthRatio: number;
}

export default function AutoCloseTriggers({ positionId, currentHealthRatio }: AutoCloseTriggersProps) {
  const [triggers, setTriggers] = useState<AutoCloseTrigger[]>([
    {
      id: "1",
      type: "health_ratio",
      threshold: 120,
      action: "close_50",
      enabled: true,
    },
    {
      id: "2",
      type: "health_ratio",
      threshold: 110,
      action: "close_all",
      enabled: true,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTrigger, setNewTrigger] = useState<Partial<AutoCloseTrigger>>({
    type: "health_ratio",
    threshold: 150,
    action: "close_50",
    enabled: true,
  });

  const handleAddTrigger = () => {
    if (newTrigger.threshold && newTrigger.action) {
      setTriggers([
        ...triggers,
        {
          id: Date.now().toString(),
          type: newTrigger.type as AutoCloseTrigger["type"],
          threshold: newTrigger.threshold,
          action: newTrigger.action as AutoCloseTrigger["action"],
          enabled: true,
        },
      ]);
      setShowAddForm(false);
      setNewTrigger({
        type: "health_ratio",
        threshold: 150,
        action: "close_50",
        enabled: true,
      });
    }
  };

  const handleToggleTrigger = (id: string) => {
    setTriggers(triggers.map(t =>
      t.id === id ? { ...t, enabled: !t.enabled } : t
    ));
  };

  const handleDeleteTrigger = (id: string) => {
    setTriggers(triggers.filter(t => t.id !== id));
  };

  const getActionLabel = (action: AutoCloseTrigger["action"]) => {
    switch (action) {
      case "close_all":
        return "Close Entire Position";
      case "close_50":
        return "Close 50% of Position";
      case "add_margin":
        return "Add Margin Alert";
    }
  };

  const getActionColor = (action: AutoCloseTrigger["action"]) => {
    switch (action) {
      case "close_all":
        return "text-red-400";
      case "close_50":
        return "text-yellow-400";
      case "add_margin":
        return "text-emerald-400";
    }
  };

  const getRiskLevel = (threshold: number) => {
    if (threshold < 120) return { color: "text-red-400", bg: "bg-red-500/10", label: "Critical" };
    if (threshold < 150) return { color: "text-orange-400", bg: "bg-orange-500/10", label: "Warning" };
    return { color: "text-yellow-400", bg: "bg-yellow-500/10", label: "Caution" };
  };

  const activeTriggers = triggers.filter(t => t.enabled && currentHealthRatio <= t.threshold);

  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold">Auto-Close Triggers</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-all"
        >
          {showAddForm ? "Cancel" : "+ Add Trigger"}
        </button>
      </div>

      {/* Current Status */}
      <div className="bg-card/50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Current Health Ratio</span>
          <span className={`text-lg font-bold ${
            currentHealthRatio > 200 ? 'text-emerald-400' :
            currentHealthRatio > 120 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {currentHealthRatio.toFixed(1)}%
          </span>
        </div>
        {activeTriggers.length > 0 && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-orange-400">
              {activeTriggers.length} trigger{activeTriggers.length > 1 ? 's' : ''} activated!
            </span>
          </div>
        )}
      </div>

      {/* Add Trigger Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card/50 rounded-lg p-4 space-y-3"
        >
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Health Ratio Threshold (%)</label>
            <input
              type="number"
              value={newTrigger.threshold}
              onChange={(e) => setNewTrigger({ ...newTrigger, threshold: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 150"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Action</label>
            <select
              value={newTrigger.action}
              onChange={(e) => setNewTrigger({ ...newTrigger, action: e.target.value as AutoCloseTrigger["action"] })}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="close_50">Close 50% of Position</option>
              <option value="close_all">Close Entire Position</option>
              <option value="add_margin">Alert to Add Margin</option>
            </select>
          </div>

          <button
            onClick={handleAddTrigger}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all"
          >
            Add Trigger
          </button>
        </motion.div>
      )}

      {/* Triggers List */}
      <div className="space-y-2">
        {triggers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No auto-close triggers set
          </div>
        ) : (
          triggers.map((trigger) => {
            const risk = getRiskLevel(trigger.threshold);
            const isActive = currentHealthRatio <= trigger.threshold;

            return (
              <motion.div
                key={trigger.id}
                layout
                className={`p-3 rounded-lg border transition-all ${
                  trigger.enabled
                    ? isActive
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : 'bg-card/50 border-border'
                    : 'bg-card/20 border-border/50 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${risk.bg} ${risk.color}`}>
                      {risk.label}
                    </div>
                    {isActive && trigger.enabled && (
                      <div className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-semibold animate-pulse">
                        ACTIVE
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleTrigger(trigger.id)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                        trigger.enabled
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-card text-muted-foreground'
                      }`}
                    >
                      {trigger.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                    <button
                      onClick={() => handleDeleteTrigger(trigger.id)}
                      className="p-1 hover:bg-red-500/20 rounded transition-all"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Threshold:</span>
                    <span className="font-semibold">Health Ratio ≤ {trigger.threshold}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Action:</span>
                    <span className={`font-semibold ${getActionColor(trigger.action)}`}>
                      {getActionLabel(trigger.action)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-400">
        ℹ️ Auto-close triggers will execute automatically when conditions are met to protect your position from liquidation.
      </div>
    </div>
  );
}
