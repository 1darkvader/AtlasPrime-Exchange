"use client";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  HelpCircle,
  Search,
  ChevronDown,
  BookOpen,
  TrendingUp,
  Shield,
  Wallet,
  DollarSign,
  Headphones,
  MessageCircle,
  Mail,
  Phone
} from "lucide-react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqCategories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      color: "emerald",
      faqs: [
        {
          id: "gs1",
          question: "How do I create an account on AtlasPrime Exchange?",
          answer: "Creating an account is simple: Click the 'Sign Up' button in the top right corner, enter your email address and create a strong password, verify your email through the confirmation link sent to your inbox, complete your profile with basic information, and optionally enable two-factor authentication (2FA) for enhanced security. Your account will be created instantly, though KYC verification is required for higher withdrawal limits."
        },
        {
          id: "gs2",
          question: "What is KYC and why is it required?",
          answer: "KYC (Know Your Customer) is a verification process required by financial regulations to prevent fraud, money laundering, and other illegal activities. To complete KYC, you'll need to provide a government-issued ID (passport, driver's license), proof of address (utility bill, bank statement), and a selfie verification photo. KYC verification typically takes 15 minutes to 24 hours and is required for withdrawals above certain limits."
        },
        {
          id: "gs3",
          question: "Is AtlasPrime Exchange available in my country?",
          answer: "AtlasPrime Exchange operates in over 180 countries worldwide. However, we are restricted from serving users in certain jurisdictions due to regulatory requirements. To check if your country is supported, visit our 'Supported Countries' page or contact our support team. You can also attempt to create an account - the platform will notify you if your region is restricted."
        },
        {
          id: "gs4",
          question: "How do I navigate the trading interface?",
          answer: "Our trading interface includes several key sections: the price chart (center) showing real-time price movements, the order book (left) displaying buy and sell orders, the order panel (bottom) for placing trades, recent trades (right) showing market activity, and your portfolio (top right) with balances and positions. We recommend using our demo mode to practice before trading with real funds."
        }
      ]
    },
    {
      icon: TrendingUp,
      title: "Trading",
      color: "blue",
      faqs: [
        {
          id: "t1",
          question: "What types of orders can I place?",
          answer: "AtlasPrime Exchange supports multiple order types: Market Orders (instant execution at current price), Limit Orders (execution at a specific price or better), Stop-Loss Orders (automatic sell when price drops to protect profits), Stop-Limit Orders (combination of stop and limit), OCO Orders (One-Cancels-Other for simultaneous buy/sell), and Iceberg Orders (large orders split into smaller chunks). Each order type serves different trading strategies."
        },
        {
          id: "t2",
          question: "What are maker and taker fees?",
          answer: "Maker fees apply when you add liquidity to the order book by placing a limit order that doesn't execute immediately (0.10% fee). Taker fees apply when you remove liquidity by placing an order that executes immediately against existing orders (0.20% fee). Our VIP program offers reduced fees based on 30-day trading volume, with rates as low as 0.02% maker / 0.04% taker for the highest tier."
        },
        {
          id: "t3",
          question: "How do I use margin trading?",
          answer: "Margin trading allows you to borrow funds to increase your position size. To start: Navigate to the Margin Trading section, transfer collateral to your margin wallet, select your leverage (up to 10x), place your trade with borrowed funds. Important: Margin trading carries significant risk - you can lose more than your initial investment if the market moves against you. Always use stop-loss orders and manage your risk carefully."
        },
        {
          id: "t4",
          question: "Can I cancel or modify my orders?",
          answer: "Yes, you can cancel or modify open orders anytime before they're executed. Go to 'Open Orders' in your account, click the order you want to modify, select 'Cancel' to remove or 'Modify' to change the price/quantity. Note: Market orders execute immediately and cannot be cancelled. Partially filled orders can be cancelled for the remaining quantity."
        },
        {
          id: "t5",
          question: "What is the minimum trade amount?",
          answer: "Minimum trade amounts vary by trading pair. For BTC pairs: 0.0001 BTC (~$9), for ETH pairs: 0.001 ETH (~$3), for altcoin pairs: minimum $5 equivalent. These minimums ensure efficient order matching and reduce network spam. Check the specific trading pair details for exact minimum requirements."
        }
      ]
    },
    {
      icon: Shield,
      title: "Account & Security",
      color: "purple",
      faqs: [
        {
          id: "as1",
          question: "How do I enable two-factor authentication (2FA)?",
          answer: "To enable 2FA: Go to Account Settings > Security, click 'Enable 2FA', download Google Authenticator or Authy app on your phone, scan the QR code shown on screen, enter the 6-digit code from your app, save the backup codes in a secure location. 2FA is highly recommended as it adds an extra layer of security to your account by requiring both your password and a time-based code."
        },
        {
          id: "as2",
          question: "What should I do if I forgot my password?",
          answer: "Click 'Forgot Password' on the login page, enter your registered email address, check your inbox for a password reset link, click the link and create a new strong password, log in with your new credentials. If you don't receive the email within 5 minutes, check your spam folder or contact support. For security, password reset links expire after 1 hour."
        },
        {
          id: "as3",
          question: "How does AtlasPrime secure my funds?",
          answer: "We employ industry-leading security measures: 95% of funds stored in offline cold wallets, multi-signature wallet technology requiring multiple approvals, 24/7 security monitoring and threat detection, regular third-party security audits, SSL encryption for all data transmission, withdrawal whitelist for approved addresses only, and insurance coverage for digital assets. Your security is our top priority."
        },
        {
          id: "as4",
          question: "How can I secure my account further?",
          answer: "Additional security measures: Enable 2FA on your account, use a strong, unique password (12+ characters), enable withdrawal whitelist, set up anti-phishing codes, use a hardware security key if available, never share your credentials, beware of phishing emails and fake websites, regularly review your login history, and enable email notifications for all account activities."
        }
      ]
    },
    {
      icon: Wallet,
      title: "Deposits & Withdrawals",
      color: "cyan",
      faqs: [
        {
          id: "dw1",
          question: "How do I deposit cryptocurrency?",
          answer: "To deposit crypto: Navigate to Wallet > Deposit, select the cryptocurrency you want to deposit, copy your unique deposit address or scan the QR code, send crypto from your external wallet to this address, wait for network confirmations (varies by cryptocurrency). Important: Always double-check the address and network (e.g., ERC20, BEP20) before sending. Deposits to wrong addresses cannot be recovered."
        },
        {
          id: "dw2",
          question: "How long do deposits take?",
          answer: "Deposit times depend on the blockchain network: Bitcoin (BTC): 30-60 minutes (3 confirmations), Ethereum (ETH): 5-15 minutes (12 confirmations), Litecoin (LTC): 15-30 minutes (6 confirmations), Ripple (XRP): 1-2 minutes (1 confirmation), Solana (SOL): 1-2 minutes (1 confirmation). During network congestion, times may be longer. Funds appear in your account after the required confirmations."
        },
        {
          id: "dw3",
          question: "What are the withdrawal limits?",
          answer: "Withdrawal limits depend on your verification level: Unverified Account: $1,000/day, Basic KYC: $10,000/day, Advanced KYC: $100,000/day, VIP Members: Custom limits up to $1,000,000/day. You can request limit increases by contacting support with additional documentation. Limits reset at midnight UTC daily."
        },
        {
          id: "dw4",
          question: "Why is my withdrawal pending?",
          answer: "Withdrawals may be pending due to: Security review (first-time withdrawal or large amount), incomplete KYC verification, insufficient funds or locked balances, network congestion on the blockchain, scheduled maintenance on the withdrawal system. Most withdrawals are processed within 15 minutes. If pending for over 2 hours, contact our support team."
        },
        {
          id: "dw5",
          question: "Can I deposit fiat currency?",
          answer: "Yes, we support fiat deposits via: Bank transfer (ACH, SEPA, wire transfer), credit/debit card (Visa, Mastercard), payment processors (PayPal, Stripe - selected regions), P2P trading. Fiat deposit methods vary by region. Card deposits are instant but have higher fees (3.5%). Bank transfers are free but take 1-5 business days. Check available methods in your Wallet > Deposit Fiat section."
        }
      ]
    },
    {
      icon: DollarSign,
      title: "Fees",
      color: "yellow",
      faqs: [
        {
          id: "f1",
          question: "What are the trading fees?",
          answer: "Standard trading fees: Maker Fee: 0.10% (adding liquidity), Taker Fee: 0.20% (taking liquidity). VIP tier discounts: Level 1 (>$100K volume): 0.08% / 0.16%, Level 2 (>$500K): 0.06% / 0.12%, Level 3 (>$1M): 0.04% / 0.08%, Level 4 (>$5M): 0.02% / 0.04%. Fees are calculated as a percentage of your total trade value and deducted automatically."
        },
        {
          id: "f2",
          question: "Are there deposit or withdrawal fees?",
          answer: "Deposit fees: Cryptocurrency deposits are FREE. Fiat deposits: Bank transfer (FREE), Credit/Debit card (3.5%), PayPal (4.5%). Withdrawal fees: Cryptocurrency varies by network (e.g., BTC: 0.0005, ETH: 0.005), Fiat withdrawals: Bank transfer ($5-25), Wire transfer ($25-50). Network fees for crypto are adjusted based on blockchain congestion."
        },
        {
          id: "f3",
          question: "How can I reduce my trading fees?",
          answer: "Several ways to lower fees: Increase your 30-day trading volume to reach higher VIP tiers, use limit orders instead of market orders (lower maker fee), hold platform tokens for fee discounts (up to 25% off), refer friends to earn commission rebates, participate in trading competitions for fee vouchers. Visit our Fees page for the complete VIP tier structure."
        },
        {
          id: "f4",
          question: "Are there any hidden fees?",
          answer: "No, AtlasPrime is transparent about all fees. All fees are clearly displayed: Before placing any trade, on the Fees page, in your transaction history, in monthly account statements. The only variable fees are blockchain network fees for crypto withdrawals, which fluctuate based on network conditions. We never charge hidden fees or surprise charges."
        }
      ]
    },
    {
      icon: Headphones,
      title: "Technical Support",
      color: "red",
      faqs: [
        {
          id: "ts1",
          question: "How do I contact customer support?",
          answer: "Multiple support channels available: Live Chat (24/7): Click the chat icon in bottom right, Email Support: support@atlasprime.com (response within 4 hours), Phone Support: +1 (800) 555-0199 (VIP members only), Support Ticket: Submit through your account dashboard, Social Media: @AtlasPrimeEx on Twitter. For urgent security issues, contact security@atlasprime.com immediately."
        },
        {
          id: "ts2",
          question: "What if I'm experiencing technical issues?",
          answer: "If you encounter technical problems: Clear your browser cache and cookies, try a different browser (Chrome, Firefox recommended), disable VPN if active, check our Status Page for known issues, try the mobile app if web version isn't working, contact support with screenshots and error messages. Most issues are resolved within 30 minutes. Check our Help Center for common troubleshooting guides."
        },
        {
          id: "ts3",
          question: "Can I use the platform on mobile?",
          answer: "Yes! AtlasPrime is available on: iOS App (Download from App Store - iOS 13+ required), Android App (Download from Google Play - Android 8+ required), Mobile Web (Fully responsive mobile browser version). The mobile apps offer full functionality including trading, deposits, withdrawals, and account management. Enable biometric login for quick access."
        },
        {
          id: "ts4",
          question: "What browsers are supported?",
          answer: "Supported browsers: Google Chrome (recommended - v90+), Mozilla Firefox (v88+), Safari (v14+), Microsoft Edge (v90+), Brave (latest version). We recommend using the latest version of Chrome for the best experience. Internet Explorer is NOT supported. Enable JavaScript and cookies for full functionality."
        }
      ]
    }
  ];

  const supportChannels = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Available 24/7",
      action: "Start Chat",
      color: "emerald"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "support@atlasprime.com",
      action: "Send Email",
      color: "blue"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+1 (800) 555-0199",
      action: "Call Now",
      color: "purple"
    }
  ];

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

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
              <HelpCircle className="w-10 h-10 text-emerald-400" />
            </motion.div>
            <h1 className="text-5xl font-bold gradient-text mb-4">Help Center</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find answers to common questions and get the support you need
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8 mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl focus:outline-none focus:border-emerald-500 text-lg"
              />
            </div>
          </motion.div>

          {/* Support Channels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {supportChannels.map((channel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="glass rounded-xl p-6 hover:glow transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-lg bg-${channel.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <channel.icon className={`w-6 h-6 text-${channel.color}-400`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{channel.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{channel.description}</p>
                <button className={`text-sm font-semibold text-${channel.color}-400 hover:text-${channel.color}-300`}>
                  {channel.action} →
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFaqs.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 bg-${category.color}-500/10 rounded-lg`}>
                    <category.icon className={`w-6 h-6 text-${category.color}-400`} />
                  </div>
                  <h2 className="text-3xl font-bold">{category.title}</h2>
                </div>

                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + categoryIndex * 0.1 + faqIndex * 0.05 }}
                      className="glass rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                        className="w-full p-6 text-left flex items-start justify-between hover:bg-card/50 transition-colors"
                      >
                        <span className="font-semibold text-lg pr-4">{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-emerald-400 flex-shrink-0 mt-1 transition-transform ${
                            expandedFaq === faq.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {expandedFaq === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-6"
                        >
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Still Need Help */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="glass rounded-2xl p-8 mt-12 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is available 24/7 to assist you with any questions or issues
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-colors">
                Contact Support
              </button>
              <button className="px-6 py-3 glass hover:bg-card rounded-lg font-semibold transition-colors">
                View Tutorials
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
