"use client";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { Sparkles, Clock, Bell, CheckCircle2 } from "lucide-react";

export default function NFTPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-purple-500/20 mb-8 relative"
            >
              <Sparkles className="w-16 h-16 text-emerald-400 animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/20 to-purple-500/20 blur-xl"></div>
            </motion.div>
            <h1 className="text-6xl font-bold gradient-text mb-6">NFT Marketplace</h1>
            <p className="text-2xl text-muted-foreground mb-4">Coming Soon</p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get ready to explore, buy, and sell unique digital assets on AtlasPrime's upcoming NFT marketplace
            </p>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8 mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">What's Coming</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Multi-Chain Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Trade NFTs across Ethereum, Polygon, Solana, and more blockchains
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Low Fees</h3>
                  <p className="text-sm text-muted-foreground">
                    Competitive marketplace fees starting at just 2.5%
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Creator Royalties</h3>
                  <p className="text-sm text-muted-foreground">
                    Automated royalty distribution to original creators on every sale
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Advanced Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time price charts, rarity rankings, and collection insights
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Lazy Minting</h3>
                  <p className="text-sm text-muted-foreground">
                    Create NFTs without upfront gas fees - pay only when sold
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Verified Collections</h3>
                  <p className="text-sm text-muted-foreground">
                    Blue check verification for authentic projects and creators
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Launch Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-8 mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-emerald-400" />
              <h2 className="text-3xl font-bold">Launch Timeline</h2>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-xl font-bold">
                    ✓
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-bold mb-1">Q4 2024 - Beta Testing</h3>
                  <p className="text-sm text-muted-foreground">
                    Limited beta access for VIP members and select creators
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold">
                    2
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-bold mb-1">Q1 2025 - Public Launch</h3>
                  <p className="text-sm text-muted-foreground">
                    Full marketplace launch with curated collections
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-xl font-bold">
                    3
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-bold mb-1">Q2 2025 - Creator Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced minting tools, collection management, and analytics
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notify Me */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-8 text-center"
          >
            <Bell className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Get Early Access</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Be among the first to explore our NFT marketplace. Sign up for early access and exclusive launch benefits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-colors whitespace-nowrap">
                Notify Me
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Join 50,000+ people waiting for launch
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
