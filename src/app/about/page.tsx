"use client";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { Building2, Target, Eye, Users, Trophy, Globe, TrendingUp, Shield } from "lucide-react";

export default function AboutPage() {
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
              <Building2 className="w-10 h-10 text-emerald-400" />
            </motion.div>
            <h1 className="text-5xl font-bold gradient-text mb-4">About AtlasPrime</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Building the future of cryptocurrency trading since 2018
            </p>
          </motion.div>

          {/* Our Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2018 by a team of fintech veterans and blockchain enthusiasts, AtlasPrime Exchange was born from a vision to create a 
                cryptocurrency trading platform that combines institutional-grade security with an intuitive user experience. Our founders recognized 
                that the crypto industry needed a platform that could serve both newcomers and professional traders with equal excellence.
              </p>
              <p>
                What started as a small team of 10 passionate individuals has grown into a global organization of over 500 professionals serving 
                15 million users across 180 countries. We've processed over $500 billion in trading volume and continue to innovate at the intersection 
                of traditional finance and decentralized technologies.
              </p>
              <p>
                Today, AtlasPrime Exchange stands as one of the world's most trusted cryptocurrency platforms, offering spot trading, futures, margin 
                trading, staking, and soon, an NFT marketplace. Our commitment to security, transparency, and user-first design has earned us the trust 
                of millions worldwide.
              </p>
            </div>
          </motion.div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-emerald-400" />
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To democratize access to cryptocurrency markets by providing a secure, transparent, and user-friendly trading platform that empowers 
                individuals and institutions to participate in the digital economy. We believe financial freedom should be accessible to everyone, 
                everywhere.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-8 h-8 text-blue-400" />
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To become the world's most trusted and innovative cryptocurrency exchange by 2030, bridging traditional and decentralized finance 
                while maintaining the highest standards of security, compliance, and customer service. We envision a future where crypto is 
                mainstream and accessible to all.
              </p>
            </motion.div>
          </div>

          {/* Core Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="font-bold mb-2">Security First</h3>
                <p className="text-sm text-muted-foreground">
                  Your assets and data are protected with bank-level security and insurance
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-bold mb-2">User-Centric</h3>
                <p className="text-sm text-muted-foreground">
                  Every decision we make prioritizes our users' experience and success
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-bold mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  We continuously evolve and adopt cutting-edge technologies
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="font-bold mb-2">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  We operate with complete honesty and clarity in all our dealings
                </p>
              </div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-8 h-8 text-emerald-400" />
              <h2 className="text-3xl font-bold">Our Achievements</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-card rounded-lg text-center">
                <div className="text-4xl font-bold gradient-text mb-2">15M+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="p-6 bg-card rounded-lg text-center">
                <div className="text-4xl font-bold gradient-text mb-2">180+</div>
                <div className="text-sm text-muted-foreground">Countries Served</div>
              </div>
              <div className="p-6 bg-card rounded-lg text-center">
                <div className="text-4xl font-bold gradient-text mb-2">$500B+</div>
                <div className="text-sm text-muted-foreground">Trading Volume</div>
              </div>
              <div className="p-6 bg-card rounded-lg text-center">
                <div className="text-4xl font-bold gradient-text mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Trading Pairs</div>
              </div>
            </div>
          </motion.div>

          {/* Global Presence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <h2 className="text-3xl font-bold mb-6">Global Presence</h2>
            <p className="text-muted-foreground mb-6">
              With offices across five continents, we provide localized support and services to users worldwide.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-bold mb-2">🇺🇸 North America</h3>
                <p className="text-sm text-muted-foreground">Headquarters: New York, USA</p>
                <p className="text-sm text-muted-foreground">Regional Office: Toronto, Canada</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-bold mb-2">🇪🇺 Europe</h3>
                <p className="text-sm text-muted-foreground">London, United Kingdom</p>
                <p className="text-sm text-muted-foreground">Berlin, Germany</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-bold mb-2">🌏 Asia-Pacific</h3>
                <p className="text-sm text-muted-foreground">Singapore</p>
                <p className="text-sm text-muted-foreground">Tokyo, Japan</p>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <h2 className="text-3xl font-bold mb-6">Why Choose AtlasPrime Exchange?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="text-emerald-400 text-2xl">✓</div>
                <div>
                  <h3 className="font-bold mb-2">Industry-Leading Security</h3>
                  <p className="text-sm text-muted-foreground">
                    95% cold storage, multi-signature wallets, insurance coverage, and SOC 2 Type II compliance
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-emerald-400 text-2xl">✓</div>
                <div>
                  <h3 className="font-bold mb-2">Low Fees</h3>
                  <p className="text-sm text-muted-foreground">
                    Starting at 0.10% maker / 0.20% taker with VIP discounts up to 80% off
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-emerald-400 text-2xl">✓</div>
                <div>
                  <h3 className="font-bold mb-2">24/7 Customer Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Multilingual support team available around the clock via chat, email, and phone
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-emerald-400 text-2xl">✓</div>
                <div>
                  <h3 className="font-bold mb-2">Advanced Trading Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    Professional charting, API access, margin trading, and algorithmic trading support
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-emerald-400 text-2xl">✓</div>
                <div>
                  <h3 className="font-bold mb-2">Regulatory Compliance</h3>
                  <p className="text-sm text-muted-foreground">
                    Licensed and regulated in major jurisdictions with full KYC/AML compliance
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-emerald-400 text-2xl">✓</div>
                <div>
                  <h3 className="font-bold mb-2">Fast & Reliable</h3>
                  <p className="text-sm text-muted-foreground">
                    99.99% uptime, lightning-fast order execution, and instant deposits
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="glass rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Join the AtlasPrime Community</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Be part of the future of finance. Start trading with confidence on AtlasPrime Exchange today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-colors">
                Create Account
              </button>
              <button className="px-8 py-3 glass hover:bg-card rounded-lg font-semibold transition-colors">
                Explore Markets
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
