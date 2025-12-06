"use client";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  UserPlus,
  ShoppingCart,
  BarChart3,
  Shield,
  Target,
  LineChart,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function TradingGuidePage() {
  const sections = [
    {
      icon: UserPlus,
      title: "1. Getting Started: Account Setup",
      color: "emerald",
      content: (
        <>
          <h3 className="text-xl font-semibold mb-4 text-emerald-400">Creating Your Account</h3>
          <p className="text-muted-foreground mb-4">
            Begin your crypto trading journey by setting up your AtlasPrime Exchange account:
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex gap-3 p-4 bg-card rounded-lg">
              <div className="text-emerald-400 font-bold text-lg">1</div>
              <div>
                <h4 className="font-semibold mb-1">Sign Up</h4>
                <p className="text-sm text-muted-foreground">
                  Click "Sign Up" and enter your email and password. Verify your email through the confirmation link.
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-card rounded-lg">
              <div className="text-emerald-400 font-bold text-lg">2</div>
              <div>
                <h4 className="font-semibold mb-1">Enable 2FA Security</h4>
                <p className="text-sm text-muted-foreground">
                  Secure your account with two-factor authentication using Google Authenticator or Authy.
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-card rounded-lg">
              <div className="text-emerald-400 font-bold text-lg">3</div>
              <div>
                <h4 className="font-semibold mb-1">Complete KYC Verification</h4>
                <p className="text-sm text-muted-foreground">
                  Upload your ID and proof of address for full account privileges (required for withdrawals over $1,000/day).
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-card rounded-lg">
              <div className="text-emerald-400 font-bold text-lg">4</div>
              <div>
                <h4 className="font-semibold mb-1">Fund Your Account</h4>
                <p className="text-sm text-muted-foreground">
                  Deposit crypto or fiat currency via bank transfer, card payment, or crypto deposit.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-emerald-400">Pro Tip:</strong> Complete all verification steps before depositing
              to avoid any delays in trading or withdrawals.
            </p>
          </div>
        </>
      ),
    },
    {
      icon: ShoppingCart,
      title: "2. Making Your First Trade",
      color: "blue",
      content: (
        <>
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Step-by-Step Trading Process</h3>
          <p className="text-muted-foreground mb-4">
            Follow this simple guide to execute your first cryptocurrency trade:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 glass rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                Select Your Trading Pair
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Navigate to Markets and choose your desired trading pair (e.g., BTC/USD, ETH/BTC).
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• BTC/USD - Bitcoin to US Dollar</li>
                <li>• ETH/USD - Ethereum to US Dollar</li>
                <li>• SOL/USD - Solana to US Dollar</li>
              </ul>
            </div>
            <div className="p-4 glass rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                Choose Order Type
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Select between Market or Limit order based on your strategy.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Market: Instant execution</li>
                <li>• Limit: Execute at specific price</li>
                <li>• Stop-Loss: Risk management</li>
              </ul>
            </div>
            <div className="p-4 glass rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                Enter Amount
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Specify how much you want to buy or sell. Use percentage sliders for quick selection.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• 25% - Quarter position</li>
                <li>• 50% - Half position</li>
                <li>• 100% - Full position</li>
              </ul>
            </div>
            <div className="p-4 glass rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                Review & Execute
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Double-check order details, fees, and total cost before confirming.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Verify price and amount</li>
                <li>• Check trading fees</li>
                <li>• Click "Buy" or "Sell"</li>
              </ul>
            </div>
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-blue-400">Beginner Tip:</strong> Start with small amounts to familiarize yourself
              with the platform. Practice with our demo mode before risking real funds.
            </p>
          </div>
        </>
      ),
    },
    {
      icon: BarChart3,
      title: "3. Understanding Order Types",
      color: "purple",
      content: (
        <>
          <h3 className="text-xl font-semibold mb-4 text-purple-400">Master Different Order Types</h3>
          <p className="text-muted-foreground mb-6">
            Each order type serves a specific purpose in your trading strategy:
          </p>
          <div className="space-y-4">
            <div className="p-5 glass rounded-lg border-l-4 border-purple-400">
              <h4 className="font-bold text-lg mb-2">Market Order</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Executes immediately at the best available current market price. Best for quick entry/exit.
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-emerald-400 font-semibold mb-1">✓ Advantages</p>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Instant execution</li>
                    <li>• Guaranteed fill</li>
                    <li>• Simple to use</li>
                  </ul>
                </div>
                <div>
                  <p className="text-red-400 font-semibold mb-1">✗ Disadvantages</p>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Price uncertainty</li>
                    <li>• Higher fees (taker)</li>
                    <li>• Slippage on large orders</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-5 glass rounded-lg border-l-4 border-purple-400">
              <h4 className="font-bold text-lg mb-2">Limit Order</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Executes only at your specified price or better. Ideal for patient traders targeting specific prices.
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-emerald-400 font-semibold mb-1">✓ Advantages</p>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Price control</li>
                    <li>• Lower fees (maker)</li>
                    <li>• No slippage</li>
                  </ul>
                </div>
                <div>
                  <p className="text-red-400 font-semibold mb-1">✗ Disadvantages</p>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• May not fill</li>
                    <li>• Requires waiting</li>
                    <li>• Missed opportunities</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-5 glass rounded-lg border-l-4 border-purple-400">
              <h4 className="font-bold text-lg mb-2">Stop-Loss Order</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Automatically sells when price drops to your stop price, limiting losses on a position.
              </p>
              <div className="bg-card p-3 rounded-lg mt-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Example:</strong> You buy BTC at $90,000. Set stop-loss at $85,000 to limit max loss to 5.5%.
                </p>
              </div>
            </div>

            <div className="p-5 glass rounded-lg border-l-4 border-purple-400">
              <h4 className="font-bold text-lg mb-2">Stop-Limit Order</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Combines stop and limit orders. Triggers a limit order when stop price is reached.
              </p>
              <div className="bg-card p-3 rounded-lg mt-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Use Case:</strong> Better price control than stop-loss, but may not execute in fast markets.
                </p>
              </div>
            </div>

            <div className="p-5 glass rounded-lg border-l-4 border-purple-400">
              <h4 className="font-bold text-lg mb-2">OCO (One-Cancels-Other)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Places two orders simultaneously. When one executes, the other automatically cancels.
              </p>
              <div className="bg-card p-3 rounded-lg mt-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Strategy:</strong> Set a take-profit limit order above and stop-loss below current price.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: Shield,
      title: "4. Risk Management Essentials",
      color: "red",
      content: (
        <>
          <h3 className="text-xl font-semibold mb-4 text-red-400">Protect Your Capital</h3>
          <p className="text-muted-foreground mb-6">
            Effective risk management is the foundation of successful trading. Follow these critical principles:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h4 className="font-bold">Never Risk More Than 1-2%</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                The golden rule: Never risk more than 1-2% of your total capital on a single trade.
              </p>
              <div className="bg-card p-3 rounded text-sm">
                <p className="text-muted-foreground">
                  <strong>Example:</strong> With $10,000 capital, risk max $100-200 per trade.
                </p>
              </div>
            </div>

            <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-6 h-6 text-red-400" />
                <h4 className="font-bold">Use Stop-Loss Orders</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Always set stop-losses before entering a trade. This is non-negotiable.
              </p>
              <div className="bg-card p-3 rounded text-sm">
                <p className="text-muted-foreground">
                  <strong>Tip:</strong> Place stops below support levels or use ATR indicator.
                </p>
              </div>
            </div>

            <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-6 h-6 text-red-400" />
                <h4 className="font-bold">Position Sizing</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Calculate proper position size based on your risk tolerance and stop-loss distance.
              </p>
              <div className="bg-card p-3 rounded text-sm">
                <p className="text-muted-foreground">
                  <strong>Formula:</strong> Position Size = (Account × Risk%) ÷ (Entry - Stop)
                </p>
              </div>
            </div>

            <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-red-400" />
                <h4 className="font-bold">Diversification</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Don't put all eggs in one basket. Spread risk across multiple assets.
              </p>
              <div className="bg-card p-3 rounded text-sm">
                <p className="text-muted-foreground">
                  <strong>Allocation:</strong> 40% BTC, 30% ETH, 20% Top 10, 10% Small caps
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 glass rounded-lg">
            <h4 className="font-bold mb-3">Risk/Reward Ratio</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Always aim for at least a 1:2 risk/reward ratio. Risk $100 to potentially make $200+.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-card">
                  <tr>
                    <th className="text-left p-3">Ratio</th>
                    <th className="text-left p-3">Risk</th>
                    <th className="text-left p-3">Reward</th>
                    <th className="text-left p-3">Win Rate Needed</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-t border-border">
                    <td className="p-3">1:1</td>
                    <td className="p-3">$100</td>
                    <td className="p-3">$100</td>
                    <td className="p-3 text-red-400">50%+</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">1:2</td>
                    <td className="p-3">$100</td>
                    <td className="p-3">$200</td>
                    <td className="p-3 text-emerald-400">33%+</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">1:3</td>
                    <td className="p-3">$100</td>
                    <td className="p-3">$300</td>
                    <td className="p-3 text-emerald-400">25%+</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: LineChart,
      title: "5. Technical Analysis Basics",
      color: "cyan",
      content: (
        <>
          <h3 className="text-xl font-semibold mb-4 text-cyan-400">Read the Charts</h3>
          <p className="text-muted-foreground mb-6">
            Technical analysis helps predict future price movements by studying historical data:
          </p>

          <div className="space-y-5">
            <div className="p-5 glass rounded-lg">
              <h4 className="font-bold text-lg mb-3">Support & Resistance</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Key price levels where buying or selling pressure tends to emerge.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg">
                  <p className="font-semibold text-emerald-400 mb-2">Support</p>
                  <p className="text-xs text-muted-foreground">
                    Price level where buying interest prevents further decline. Traders often buy near support.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg">
                  <p className="font-semibold text-red-400 mb-2">Resistance</p>
                  <p className="text-xs text-muted-foreground">
                    Price level where selling pressure prevents further rise. Traders often sell near resistance.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 glass rounded-lg">
              <h4 className="font-bold text-lg mb-3">Essential Indicators</h4>
              <div className="space-y-3">
                <div className="p-3 bg-card rounded-lg">
                  <p className="font-semibold mb-1">Moving Averages (MA)</p>
                  <p className="text-sm text-muted-foreground">
                    Smooths price data to identify trends. Popular: 50 MA, 100 MA, 200 MA. Price above MA = bullish.
                  </p>
                </div>
                <div className="p-3 bg-card rounded-lg">
                  <p className="font-semibold mb-1">RSI (Relative Strength Index)</p>
                  <p className="text-sm text-muted-foreground">
                    Measures momentum. Above 70 = overbought, below 30 = oversold. Helps identify reversals.
                  </p>
                </div>
                <div className="p-3 bg-card rounded-lg">
                  <p className="font-semibold mb-1">MACD (Moving Average Convergence Divergence)</p>
                  <p className="text-sm text-muted-foreground">
                    Shows trend direction and momentum. MACD crossing signal line indicates potential entry/exit.
                  </p>
                </div>
                <div className="p-3 bg-card rounded-lg">
                  <p className="font-semibold mb-1">Bollinger Bands</p>
                  <p className="text-sm text-muted-foreground">
                    Measures volatility. Price touching upper band = potentially overbought, lower band = oversold.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 glass rounded-lg">
              <h4 className="font-bold text-lg mb-3">Chart Patterns</h4>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-card rounded-lg text-center">
                  <p className="font-semibold mb-2 text-emerald-400">Head & Shoulders</p>
                  <p className="text-xs text-muted-foreground">Reversal pattern</p>
                </div>
                <div className="p-3 bg-card rounded-lg text-center">
                  <p className="font-semibold mb-2 text-emerald-400">Double Top/Bottom</p>
                  <p className="text-xs text-muted-foreground">Reversal pattern</p>
                </div>
                <div className="p-3 bg-card rounded-lg text-center">
                  <p className="font-semibold mb-2 text-emerald-400">Triangles</p>
                  <p className="text-xs text-muted-foreground">Continuation pattern</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: Zap,
      title: "6. Advanced Trading Strategies",
      color: "yellow",
      content: (
        <>
          <h3 className="text-xl font-semibold mb-4 text-yellow-400">Level Up Your Trading</h3>
          <p className="text-muted-foreground mb-6">
            Once you've mastered the basics, explore these advanced strategies:
          </p>

          <div className="space-y-4">
            <div className="p-5 glass rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2">Scalping</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Ultra-short-term strategy involving dozens of trades per day to capture small price movements.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-card p-3 rounded">
                      <p className="font-semibold mb-1">Best For:</p>
                      <p className="text-muted-foreground">High-volume traders, liquid markets</p>
                    </div>
                    <div className="bg-card p-3 rounded">
                      <p className="font-semibold mb-1">Time Frame:</p>
                      <p className="text-muted-foreground">1-5 minute charts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 glass rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2">Swing Trading</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Hold positions for several days to weeks, capitalizing on expected upward or downward market shifts.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-card p-3 rounded">
                      <p className="font-semibold mb-1">Best For:</p>
                      <p className="text-muted-foreground">Part-time traders, trend followers</p>
                    </div>
                    <div className="bg-card p-3 rounded">
                      <p className="font-semibold mb-1">Time Frame:</p>
                      <p className="text-muted-foreground">4-hour to daily charts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 glass rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Target className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2">Breakout Trading</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Enter positions when price breaks through key support or resistance levels with strong volume.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-card p-3 rounded">
                      <p className="font-semibold mb-1">Entry Signal:</p>
                      <p className="text-muted-foreground">Price closes above resistance + volume spike</p>
                    </div>
                    <div className="bg-card p-3 rounded">
                      <p className="font-semibold mb-1">Risk:</p>
                      <p className="text-muted-foreground">False breakouts, use confirmation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 glass rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <LineChart className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2">Trend Following</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Ride established trends using moving averages and momentum indicators. "The trend is your friend."
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-card p-3 rounded">
                      <p className="font-semibold mb-1">Strategy:</p>
                      <p className="text-muted-foreground">Buy dips in uptrends, sell rallies in downtrends</p>
                    </div>
                    <div className="bg-card p-3 rounded">
                      <p className="font-semibold mb-1">Exit:</p>
                      <p className="text-muted-foreground">When trend reverses or MA crossover</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 glass rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Shield className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2">Hedging</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Reduce risk by taking offsetting positions. Use futures or options to protect your portfolio.
                  </p>
                  <div className="bg-card p-3 rounded text-sm">
                    <p className="font-semibold mb-1">Example:</p>
                    <p className="text-muted-foreground">
                      Hold 10 BTC spot + short 5 BTC futures to hedge against 50% price drop
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mt-6">
            <p className="text-sm text-muted-foreground">
              <strong className="text-yellow-400">Remember:</strong> No strategy works 100% of the time.
              Combine multiple strategies, adapt to market conditions, and always manage your risk.
            </p>
          </div>
        </>
      ),
    },
  ];

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
              <BookOpen className="w-10 h-10 text-emerald-400" />
            </motion.div>
            <h1 className="text-5xl font-bold gradient-text mb-4">Trading Guide</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              Your complete guide to mastering cryptocurrency trading on AtlasPrime Exchange
            </p>
            <p className="text-sm text-muted-foreground">
              From beginner fundamentals to advanced strategies
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8 mb-12"
          >
            <h2 className="text-2xl font-bold mb-4">Welcome to Crypto Trading</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cryptocurrency trading offers unprecedented opportunities for profit, but it also comes with risks.
              This comprehensive guide will walk you through everything you need to know to become a successful
              trader on AtlasPrime Exchange.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you're a complete beginner or looking to refine your strategy, this guide covers essential
              topics from account setup to advanced trading techniques. Take your time to understand each section
              before moving forward.
            </p>
          </motion.div>

          {/* Main Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glass rounded-2xl p-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-4 bg-${section.color}-500/10 rounded-xl`}>
                    <section.icon className={`w-8 h-8 text-${section.color}-400`} />
                  </div>
                  <h2 className="text-3xl font-bold flex-1 pt-2">{section.title}</h2>
                </div>
                <div>{section.content}</div>
              </motion.div>
            ))}
          </div>

          {/* Trading Psychology */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="glass rounded-2xl p-8 mt-8"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 bg-purple-500/10 rounded-xl">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold flex-1 pt-2">7. Trading Psychology & Discipline</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Technical skills alone won't make you profitable. Master these psychological principles:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-card rounded-lg">
                <h4 className="font-semibold mb-2 text-purple-400">Control Your Emotions</h4>
                <p className="text-sm text-muted-foreground">
                  Fear and greed are your worst enemies. Stick to your plan even when emotions run high.
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h4 className="font-semibold mb-2 text-purple-400">Accept Losses</h4>
                <p className="text-sm text-muted-foreground">
                  Losses are part of trading. The goal is to win more than you lose over time.
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h4 className="font-semibold mb-2 text-purple-400">Keep a Trading Journal</h4>
                <p className="text-sm text-muted-foreground">
                  Document every trade with entry/exit reasons. Review monthly to identify patterns.
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h4 className="font-semibold mb-2 text-purple-400">Avoid Overtrading</h4>
                <p className="text-sm text-muted-foreground">
                  Quality over quantity. Wait for high-probability setups instead of forcing trades.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="glass rounded-2xl p-8 mt-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Start Trading?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Apply what you've learned and start your trading journey. Remember to start small,
              practice consistently, and never stop learning.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-colors flex items-center gap-2">
                Open Trading Account
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-3 glass hover:bg-card rounded-lg font-semibold transition-colors">
                Explore Demo Mode
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
