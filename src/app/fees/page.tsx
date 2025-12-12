"use client";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { DollarSign, TrendingDown, ArrowUpDown, Wallet, CreditCard, Trophy, CheckCircle2 } from "lucide-react";

export default function FeesPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-6"
            >
              <DollarSign className="w-10 h-10 text-emerald-400" />
            </motion.div>
            <h1 className="text-5xl font-bold gradient-text mb-4">Fee Structure</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Transparent, competitive fees with VIP tier benefits
            </p>
          </motion.div>

          {/* Trading Fees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <ArrowUpDown className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold">Trading Fees</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Our competitive fee structure rewards high-volume traders with significant discounts.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-card">
                  <tr>
                    <th className="text-left p-4">VIP Level</th>
                    <th className="text-left p-4">30-Day Volume (USD)</th>
                    <th className="text-left p-4">Maker Fee</th>
                    <th className="text-left p-4">Taker Fee</th>
                    <th className="text-left p-4">Savings</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-t border-border">
                    <td className="p-4 font-semibold">Standard</td>
                    <td className="p-4">$0 - $100,000</td>
                    <td className="p-4 text-emerald-400">0.10%</td>
                    <td className="p-4 text-blue-400">0.20%</td>
                    <td className="p-4">—</td>
                  </tr>
                  <tr className="border-t border-border bg-emerald-500/5">
                    <td className="p-4 font-semibold">VIP 1</td>
                    <td className="p-4">&gt; $100,000</td>
                    <td className="p-4 text-emerald-400">0.08%</td>
                    <td className="p-4 text-blue-400">0.16%</td>
                    <td className="p-4 text-emerald-400">20% off</td>
                  </tr>
                  <tr className="border-t border-border bg-emerald-500/5">
                    <td className="p-4 font-semibold">VIP 2</td>
                    <td className="p-4">&gt; $500,000</td>
                    <td className="p-4 text-emerald-400">0.06%</td>
                    <td className="p-4 text-blue-400">0.12%</td>
                    <td className="p-4 text-emerald-400">40% off</td>
                  </tr>
                  <tr className="border-t border-border bg-emerald-500/5">
                    <td className="p-4 font-semibold">VIP 3</td>
                    <td className="p-4">&gt; $1,000,000</td>
                    <td className="p-4 text-emerald-400">0.04%</td>
                    <td className="p-4 text-blue-400">0.08%</td>
                    <td className="p-4 text-emerald-400">60% off</td>
                  </tr>
                  <tr className="border-t border-border bg-emerald-500/5">
                    <td className="p-4 font-semibold">VIP 4</td>
                    <td className="p-4">&gt; $5,000,000</td>
                    <td className="p-4 text-emerald-400">0.02%</td>
                    <td className="p-4 text-blue-400">0.04%</td>
                    <td className="p-4 text-emerald-400">80% off</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong className="text-emerald-400">Maker vs Taker:</strong> Maker fees apply when you add liquidity (limit orders that don't execute immediately). 
                Taker fees apply when you remove liquidity (market orders or limit orders that execute immediately).
              </p>
            </div>
          </motion.div>

          {/* Deposit Fees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Wallet className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold">Deposit Fees</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold mb-3">Cryptocurrency Deposits</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bitcoin (BTC)</span>
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ethereum (ETH)</span>
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">All Cryptocurrencies</span>
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Network fees apply at blockchain level</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold mb-3">Fiat Deposits</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Transfer (ACH/SEPA)</span>
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wire Transfer</span>
                    <span className="text-yellow-400 font-semibold">$10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credit/Debit Card</span>
                    <span className="text-yellow-400 font-semibold">3.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PayPal/Stripe</span>
                    <span className="text-yellow-400 font-semibold">4.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Withdrawal Fees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingDown className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold">Withdrawal Fees</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold mb-3">Cryptocurrency Withdrawals</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bitcoin (BTC)</span>
                    <span className="font-mono">0.0005 BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ethereum (ETH)</span>
                    <span className="font-mono">0.005 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Litecoin (LTC)</span>
                    <span className="font-mono">0.001 LTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ripple (XRP)</span>
                    <span className="font-mono">0.25 XRP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Solana (SOL)</span>
                    <span className="font-mono">0.01 SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">USDT (ERC-20)</span>
                    <span className="font-mono">10 USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">USDT (TRC-20)</span>
                    <span className="font-mono">1 USDT</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Fees adjusted based on network congestion</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold mb-3">Fiat Withdrawals</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Transfer (ACH)</span>
                    <span>$5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Transfer (SEPA)</span>
                    <span>€3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wire Transfer (Domestic)</span>
                    <span>$25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wire Transfer (International)</span>
                    <span>$50</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    VIP 3+ members receive 50% off fiat withdrawal fees
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* VIP Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold">VIP Member Benefits</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Beyond reduced fees, VIP members enjoy exclusive benefits and premium services.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 glass rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-3" />
                <h3 className="font-semibold mb-2">Priority Support</h3>
                <p className="text-sm text-muted-foreground">
                  Dedicated account manager and 24/7 premium support access
                </p>
              </div>
              <div className="p-4 glass rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-semibold mb-2">Higher Limits</h3>
                <p className="text-sm text-muted-foreground">
                  Increased withdrawal limits up to $1M/day for VIP 4 members
                </p>
              </div>
              <div className="p-4 glass rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="font-semibold mb-2">API Access</h3>
                <p className="text-sm text-muted-foreground">
                  Higher rate limits and priority API execution
                </p>
              </div>
              <div className="p-4 glass rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-cyan-400 mb-3" />
                <h3 className="font-semibold mb-2">Early Access</h3>
                <p className="text-sm text-muted-foreground">
                  First access to new listings, features, and exclusive events
                </p>
              </div>
              <div className="p-4 glass rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-yellow-400 mb-3" />
                <h3 className="font-semibold mb-2">Referral Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Higher commission rates on referrals (up to 40%)
                </p>
              </div>
              <div className="p-4 glass rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-red-400 mb-3" />
                <h3 className="font-semibold mb-2">OTC Services</h3>
                <p className="text-sm text-muted-foreground">
                  Access to over-the-counter trading desk for large orders
                </p>
              </div>
            </div>
          </motion.div>

          {/* Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">Compare with Competitors</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-card">
                  <tr>
                    <th className="text-left p-4">Exchange</th>
                    <th className="text-left p-4">Maker Fee</th>
                    <th className="text-left p-4">Taker Fee</th>
                    <th className="text-left p-4">Withdrawal (BTC)</th>
                    <th className="text-left p-4">Card Deposit</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-t border-border bg-emerald-500/10">
                    <td className="p-4 font-bold text-emerald-400">AtlasPrime Exchange</td>
                    <td className="p-4 text-emerald-400">0.10%</td>
                    <td className="p-4 text-emerald-400">0.20%</td>
                    <td className="p-4 text-emerald-400">0.0005 BTC</td>
                    <td className="p-4 text-emerald-400">3.5%</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">Binance</td>
                    <td className="p-4">0.10%</td>
                    <td className="p-4">0.10%</td>
                    <td className="p-4">0.0005 BTC</td>
                    <td className="p-4">4.5%</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">Coinbase</td>
                    <td className="p-4">0.40%</td>
                    <td className="p-4">0.60%</td>
                    <td className="p-4">FREE</td>
                    <td className="p-4">3.99%</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">Kraken</td>
                    <td className="p-4">0.16%</td>
                    <td className="p-4">0.26%</td>
                    <td className="p-4">0.00015 BTC</td>
                    <td className="p-4">3.75%</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">Crypto.com</td>
                    <td className="p-4">0.075%</td>
                    <td className="p-4">0.075%</td>
                    <td className="p-4">0.0004 BTC</td>
                    <td className="p-4">2.99%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              *Fees as of November 2024. Competitor fees subject to change. Our VIP program offers the most competitive rates in the industry.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Start Trading?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join AtlasPrime Exchange and enjoy industry-leading low fees
            </p>
            <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-colors">
              Create Free Account
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
