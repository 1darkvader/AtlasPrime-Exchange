#!/bin/bash

# Create /spot page
cat > src/app/spot/page.tsx << 'EOF'
"use client";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SpotPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
            <h1 className="text-5xl font-bold gradient-text mb-4">Quick Spot Trading</h1>
            <p className="text-xl text-muted-foreground mb-8">Buy and sell crypto instantly at the best rates</p>
            <Link href="/trade/spot" className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all">
              Start Trading Now
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
EOF

# Create /forgot-password page
cat > src/app/forgot-password/page.tsx << 'EOF'
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 animated-gradient">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Forgot Password?</h1>
        <p className="text-muted-foreground text-center mb-8">Enter your email to reset your password</p>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              Send Reset Link
            </button>
            <Link href="/login" className="block text-center text-sm text-emerald-400 hover:text-emerald-300">
              Back to Login
            </Link>
          </form>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">✉️</div>
            <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
            <p className="text-muted-foreground mb-6">We've sent password reset instructions to {email}</p>
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300">Back to Login</Link>
          </div>
        )}
      </motion.div>
    </main>
  );
}
EOF

# Create /terms page
cat > src/app/terms/page.tsx << 'EOF'
"use client";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold gradient-text mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: November 29, 2024</p>
            <div className="glass rounded-xl p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">By accessing and using AtlasPrime Exchange, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
              </section>
              <section>
                <h2 className="text-2xl font-bold mb-4">2. User Responsibilities</h2>
                <p className="text-muted-foreground">Users are responsible for maintaining the confidentiality of their account credentials and for all activities under their account.</p>
              </section>
              <section>
                <h2 className="text-2xl font-bold mb-4">3. Trading Risks</h2>
                <p className="text-muted-foreground">Cryptocurrency trading involves substantial risk. Users should only trade with funds they can afford to lose.</p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
EOF

# Create /privacy page
cat > src/app/privacy/page.tsx << 'EOF'
"use client";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold gradient-text mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: November 29, 2024</p>
            <div className="glass rounded-xl p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                <p className="text-muted-foreground">We collect information you provide directly, including name, email, and trading activity.</p>
              </section>
              <section>
                <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground">Your information is used to provide services, improve our platform, and comply with legal obligations.</p>
              </section>
              <section>
                <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                <p className="text-muted-foreground">We implement industry-standard security measures to protect your personal information.</p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
EOF

echo "Created spot, forgot-password, terms, and privacy pages"
