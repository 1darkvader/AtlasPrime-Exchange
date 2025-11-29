#!/bin/bash

# Update /terms page with professional content
cat > src/app/terms/page.tsx << 'EOF'
"use client";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold gradient-text mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-2">Last updated: November 29, 2024</p>
            <p className="text-sm text-muted-foreground mb-8">Effective Date: November 29, 2024</p>
            
            <div className="glass rounded-xl p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground mb-4">
                  By accessing and using AtlasPrime Exchange ("the Platform", "we", "us", or "our"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.
                </p>
                <p className="text-muted-foreground">
                  These Terms constitute a legally binding agreement between you and AtlasPrime Exchange regarding your use of our cryptocurrency trading platform, services, and features.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
                <p className="text-muted-foreground mb-3">To use AtlasPrime Exchange, you must:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Be at least 18 years old or the age of majority in your jurisdiction</li>
                  <li>Have the legal capacity to enter into a binding contract</li>
                  <li>Not be located in a restricted jurisdiction</li>
                  <li>Comply with all applicable laws and regulations in your jurisdiction</li>
                  <li>Not be listed on any sanctions list or prohibited from using our services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Account Registration and Security</h2>
                <h3 className="text-xl font-semibold mb-3 text-emerald-400">3.1 Account Creation</h3>
                <p className="text-muted-foreground mb-4">
                  You must create an account to access certain features. You agree to provide accurate, current, and complete information during registration and to update such information as necessary.
                </p>
                <h3 className="text-xl font-semibold mb-3 text-emerald-400">3.2 Account Security</h3>
                <p className="text-muted-foreground mb-3">You are responsible for:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                  <li>Implementing strong passwords and two-factor authentication</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Trading and Financial Terms</h2>
                <h3 className="text-xl font-semibold mb-3 text-emerald-400">4.1 Trading Risks</h3>
                <p className="text-muted-foreground mb-4">
                  Cryptocurrency trading involves substantial risk of loss. You acknowledge that:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
                  <li>Cryptocurrency markets are highly volatile</li>
                  <li>You may lose all or part of your investment</li>
                  <li>Past performance does not guarantee future results</li>
                  <li>You should only trade with funds you can afford to lose</li>
                </ul>
                <h3 className="text-xl font-semibold mb-3 text-emerald-400">4.2 Fees and Charges</h3>
                <p className="text-muted-foreground mb-2">
                  We charge fees for trading and other services. All fees are disclosed on our <Link href="/fees" className="text-emerald-400 hover:text-emerald-300">Fees page</Link>. We reserve the right to modify fees with reasonable notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. User Conduct</h2>
                <p className="text-muted-foreground mb-3">You agree not to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Engage in market manipulation or fraudulent trading</li>
                  <li>Use the Platform for money laundering or illegal activities</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the Platform's operation</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Create multiple accounts to circumvent restrictions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. KYC and AML Compliance</h2>
                <p className="text-muted-foreground mb-4">
                  We are committed to preventing money laundering and terrorist financing. You agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Provide accurate identity verification documents when requested</li>
                  <li>Undergo Know Your Customer (KYC) verification</li>
                  <li>Comply with Anti-Money Laundering (AML) requirements</li>
                  <li>Allow us to report suspicious activities to authorities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  All content, trademarks, logos, and intellectual property on the Platform are owned by AtlasPrime Exchange or our licensors. You may not copy, reproduce, or distribute our content without written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
                <p className="text-muted-foreground mb-4">
                  To the maximum extent permitted by law, AtlasPrime Exchange shall not be liable for:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Any indirect, incidental, or consequential damages</li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Market volatility or cryptocurrency value fluctuations</li>
                  <li>Technical failures or service interruptions</li>
                  <li>Third-party actions or blockchain network issues</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Termination</h2>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate your account at any time for violation of these Terms, suspicious activity, or other legitimate reasons. Upon termination, you may withdraw your funds subject to applicable laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Dispute Resolution</h2>
                <p className="text-muted-foreground mb-4">
                  Any disputes arising from these Terms shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You waive your right to participate in class action lawsuits.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We may modify these Terms at any time. We will notify you of material changes via email or Platform notification. Continued use of the Platform after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-card rounded-lg">
                  <p className="text-muted-foreground">Email: legal@atlasprime.com</p>
                  <p className="text-muted-foreground">Address: AtlasPrime Exchange Legal Department</p>
                </div>
              </section>

              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  By using AtlasPrime Exchange, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
EOF

echo "Terms page updated successfully!"
