"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";

interface StakingPool {
  id: string;
  asset: string;
  icon: string;
  apy: number;
  duration: string;
  minStake: number;
  totalStaked: number;
  rewards: string;
  type: "flexible" | "locked";
}

interface LiquidityPool {
  id: string;
  pair: string;
  apy: number;
  tvl: number;
  volume24h: number;
  fees24h: number;
}

export default function EarnPage() {
  const [selectedTab, setSelectedTab] = useState<"staking" | "savings" | "liquidity">("staking");
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedPool, setSelectedPool] = useState<string | null>(null);

  const stakingPools: StakingPool[] = [
    { id: "1", asset: "BTC", icon: "₿", apy: 5.2, duration: "Flexible", minStake: 0.001, totalStaked: 12500, rewards: "BTC", type: "flexible" },
    { id: "2", asset: "ETH", icon: "Ξ", apy: 6.8, duration: "30 Days", minStake: 0.1, totalStaked: 45000, rewards: "ETH", type: "locked" },
    { id: "3", asset: "SOL", icon: "◎", apy: 12.5, duration: "60 Days", minStake: 10, totalStaked: 250000, rewards: "SOL", type: "locked" },
    { id: "4", asset: "BNB", icon: "B", apy: 8.3, duration: "90 Days", minStake: 1, totalStaked: 78000, rewards: "BNB + BGB", type: "locked" },
    { id: "5", asset: "USDT", icon: "₮", apy: 10.5, duration: "Flexible", minStake: 100, totalStaked: 5000000, rewards: "USDT", type: "flexible" },
    { id: "6", asset: "ADA", icon: "₳", apy: 14.2, duration: "120 Days", minStake: 100, totalStaked: 125000, rewards: "ADA", type: "locked" },
  ];

  const liquidityPools: LiquidityPool[] = [
    { id: "1", pair: "BTC/USDT", apy: 45.2, tvl: 125000000, volume24h: 28500000, fees24h: 14250 },
    { id: "2", pair: "ETH/USDT", apy: 38.5, tvl: 85000000, volume24h: 15200000, fees24h: 7600 },
    { id: "3", pair: "SOL/USDT", apy: 52.8, tvl: 12000000, volume24h: 3400000, fees24h: 1700 },
    { id: "4", pair: "BNB/USDT", apy: 28.3, tvl: 45000000, volume24h: 1800000, fees24h: 900 },
  ];

  const totalEarnings = {
    today: 23.45,
    month: 1234.56,
    total: 5678.90,
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Earn Crypto <span className="gradient-text">Rewards</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Grow your assets with staking, savings, and liquidity mining
              </p>
            </motion.div>
          </div>

          {/* Earnings Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Today's Earnings", value: totalEarnings.today, icon: "📅" },
              { label: "This Month", value: totalEarnings.month, icon: "📊" },
              { label: "Total Earned", value: totalEarnings.total, icon: "💰" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
                <div className="text-3xl font-bold gradient-text">
                  ${stat.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-4 border-b border-border">
            {([
              { id: "staking" as const, label: "Staking", icon: "🔒" },
              { id: "savings" as const, label: "Savings", icon: "💎" },
              { id: "liquidity" as const, label: "Liquidity Mining", icon: "💧" },
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all ${
                  selectedTab === tab.id
                    ? "text-emerald-400 border-b-2 border-emerald-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Staking Tab */}
          {selectedTab === "staking" && (
            <div>
              <div className="glass rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-2">What is Staking?</h3>
                <p className="text-muted-foreground">
                  Lock your crypto assets to earn rewards. Choose between flexible staking (withdraw anytime) or locked staking (higher APY, fixed duration).
                </p>
              </div>

              <div className="grid gap-4">
                {stakingPools.map((pool, i) => (
                  <motion.div
                    key={pool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setSelectedPool(pool.id)}
                  >
                    <div className="grid md:grid-cols-6 gap-4 items-center">
                      {/* Asset */}
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-2xl">
                          {pool.icon}
                        </div>
                        <div>
                          <div className="font-semibold">{pool.asset} Staking</div>
                          <div className="text-sm text-muted-foreground">
                            {pool.type === "flexible" ? "Flexible" : pool.duration}
                          </div>
                        </div>
                      </div>

                      {/* APY */}
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Est. APY</div>
                        <div className="text-2xl font-bold text-emerald-400">{pool.apy}%</div>
                      </div>

                      {/* Min Stake */}
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Min. Stake</div>
                        <div className="font-semibold">{pool.minStake} {pool.asset}</div>
                      </div>

                      {/* Total Staked */}
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Total Staked</div>
                        <div className="font-semibold">{pool.totalStaked.toLocaleString()} {pool.asset}</div>
                      </div>

                      {/* Rewards */}
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Rewards</div>
                        <div className="font-semibold">{pool.rewards}</div>
                      </div>

                      {/* Action */}
                      <div className="flex justify-end">
                        <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                          Stake Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Savings Tab */}
          {selectedTab === "savings" && (
            <div>
              <div className="glass rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-2">Flexible Savings</h3>
                <p className="text-muted-foreground">
                  Earn daily interest on your idle crypto assets. Deposit and withdraw anytime with no lock-up period.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stakingPools.filter(p => p.type === "flexible").map((pool, i) => (
                  <motion.div
                    key={pool.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-xl p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-3xl">
                        {pool.icon}
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-emerald-400">{pool.apy}%</div>
                        <div className="text-sm text-muted-foreground">APY</div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{pool.asset} Savings</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Earn {pool.apy}% annually with daily interest distribution
                    </p>

                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min. Amount:</span>
                        <span>{pool.minStake} {pool.asset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Saved:</span>
                        <span>{pool.totalStaked.toLocaleString()} {pool.asset}</span>
                      </div>
                    </div>

                    <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      Subscribe
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Liquidity Mining Tab */}
          {selectedTab === "liquidity" && (
            <div>
              <div className="glass rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-2">Liquidity Mining</h3>
                <p className="text-muted-foreground">
                  Provide liquidity to trading pairs and earn trading fees plus bonus rewards. Higher APY with more risk.
                </p>
              </div>

              <div className="grid gap-4">
                {liquidityPools.map((pool, i) => (
                  <motion.div
                    key={pool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-xl p-6 hover:shadow-lg transition-all"
                  >
                    <div className="grid md:grid-cols-6 gap-4 items-center">
                      <div>
                        <div className="text-xl font-bold mb-1">{pool.pair}</div>
                        <div className="text-sm text-muted-foreground">Trading Pair</div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground mb-1">APY</div>
                        <div className="text-2xl font-bold text-emerald-400">{pool.apy}%</div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground mb-1">TVL</div>
                        <div className="font-semibold">{formatNumber(pool.tvl)}</div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground mb-1">24h Volume</div>
                        <div className="font-semibold">{formatNumber(pool.volume24h)}</div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground mb-1">24h Fees</div>
                        <div className="font-semibold text-emerald-400">${pool.fees24h.toLocaleString()}</div>
                      </div>

                      <div className="flex justify-end">
                        <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                          Add Liquidity
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
