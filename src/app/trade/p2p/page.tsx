"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";

interface P2POffer {
  id: string;
  merchant: string;
  rating: number;
  trades: number;
  type: "buy" | "sell";
  asset: string;
  fiatCurrency: string;
  price: number;
  available: number;
  limit: { min: number; max: number };
  paymentMethods: string[];
  verified: boolean;
}

export default function P2PTradingPage() {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [selectedFiat, setSelectedFiat] = useState("USD");
  const [amount, setAmount] = useState("");

  const offers: P2POffer[] = [
    { id: "1", merchant: "CryptoKing24", rating: 4.9, trades: 1250, type: "sell", asset: "BTC", fiatCurrency: "USD", price: 91500, available: 2.5, limit: { min: 500, max: 50000 }, paymentMethods: ["Bank Transfer", "PayPal", "Wise"], verified: true },
    { id: "2", merchant: "TrustTrader", rating: 5.0, trades: 890, type: "sell", asset: "BTC", fiatCurrency: "USD", price: 91450, available: 1.8, limit: { min: 1000, max: 25000 }, paymentMethods: ["Bank Transfer", "Venmo"], verified: true },
    { id: "3", merchant: "QuickExchange", rating: 4.8, trades: 2340, type: "sell", asset: "BTC", fiatCurrency: "USD", price: 91600, available: 5.2, limit: { min: 100, max: 100000 }, paymentMethods: ["Bank Transfer", "PayPal", "Zelle"], verified: true },
    { id: "4", merchant: "SafeTrades", rating: 4.7, trades: 650, type: "sell", asset: "BTC", fiatCurrency: "USD", price: 91550, available: 0.95, limit: { min: 200, max: 15000 }, paymentMethods: ["Bank Transfer"], verified: false },
    { id: "5", merchant: "FastCrypto", rating: 4.9, trades: 1820, type: "sell", asset: "BTC", fiatCurrency: "USD", price: 91480, available: 3.1, limit: { min: 500, max: 40000 }, paymentMethods: ["Bank Transfer", "PayPal", "Cash App"], verified: true },
  ];

  const filteredOffers = offers.filter(
    offer => offer.type === (tradeType === "buy" ? "sell" : "buy")
  );

  const assets = ["BTC", "ETH", "USDT", "BNB"];
  const fiats = ["USD", "EUR", "GBP", "JPY", "AUD"];

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
                P2P <span className="gradient-text">Trading</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Trade directly with other users using your preferred payment method
              </p>
            </motion.div>
          </div>

          {/* Trading Interface */}
          <div className="glass rounded-2xl p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Buy/Sell Selector */}
              <div>
                <label className="text-sm text-muted-foreground mb-3 block">I want to</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTradeType("buy")}
                    className={`flex-1 py-4 rounded-lg font-semibold transition-all ${
                      tradeType === "buy"
                        ? "bg-emerald-500 text-white"
                        : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Buy Crypto
                  </button>
                  <button
                    onClick={() => setTradeType("sell")}
                    className={`flex-1 py-4 rounded-lg font-semibold transition-all ${
                      tradeType === "sell"
                        ? "bg-red-500 text-white"
                        : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sell Crypto
                  </button>
                </div>
              </div>

              {/* Asset/Fiat Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-3 block">Crypto</label>
                  <select
                    value={selectedAsset}
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    className="w-full px-4 py-4 bg-card border border-border rounded-lg text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {assets.map(asset => (
                      <option key={asset} value={asset}>{asset}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-3 block">Fiat Currency</label>
                  <select
                    value={selectedFiat}
                    onChange={(e) => setSelectedFiat(e.target.value)}
                    className="w-full px-4 py-4 bg-card border border-border rounded-lg text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {fiats.map(fiat => (
                      <option key={fiat} value={fiat}>{fiat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mt-6">
              <label className="text-sm text-muted-foreground mb-3 block">Amount ({selectedFiat})</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount..."
                className="w-full px-4 py-4 bg-card border border-border rounded-lg text-foreground text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* How it Works */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="glass rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-2xl mb-4">
                1️⃣
              </div>
              <h3 className="text-lg font-semibold mb-2">Select an Offer</h3>
              <p className="text-sm text-muted-foreground">
                Browse offers and choose the best price and payment method for you
              </p>
            </div>
            <div className="glass rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-2xl mb-4">
                2️⃣
              </div>
              <h3 className="text-lg font-semibold mb-2">Place Order</h3>
              <p className="text-sm text-muted-foreground">
                Crypto is held in escrow. Complete payment within the time limit
              </p>
            </div>
            <div className="glass rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-2xl mb-4">
                3️⃣
              </div>
              <h3 className="text-lg font-semibold mb-2">Receive Crypto</h3>
              <p className="text-sm text-muted-foreground">
                Seller confirms payment and crypto is released from escrow
              </p>
            </div>
          </div>

          {/* Available Offers */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {filteredOffers.length} Offers Available
            </h2>
            <div className="flex gap-2 text-sm">
              <button className="px-4 py-2 bg-card hover:bg-card/80 rounded-lg transition-all">
                Price ↓
              </button>
              <button className="px-4 py-2 bg-card hover:bg-card/80 rounded-lg transition-all">
                Completion Rate
              </button>
            </div>
          </div>

          {/* Offers List */}
          <div className="space-y-4">
            {filteredOffers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <div className="grid md:grid-cols-12 gap-4 items-center">
                  {/* Merchant Info */}
                  <div className="md:col-span-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-xl font-bold">
                        {offer.merchant[0]}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{offer.merchant}</span>
                          {offer.verified && (
                            <span className="text-emerald-400" title="Verified">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            {offer.rating}
                          </span>
                          <span>|</span>
                          <span>{offer.trades} trades</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price & Available */}
                  <div className="md:col-span-2">
                    <div className="text-sm text-muted-foreground mb-1">Price</div>
                    <div className="text-xl font-bold text-emerald-400">
                      ${offer.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="text-sm text-muted-foreground mb-1">Available</div>
                    <div className="font-semibold">
                      {offer.available} {offer.asset}
                    </div>
                  </div>

                  {/* Limits */}
                  <div className="md:col-span-2">
                    <div className="text-sm text-muted-foreground mb-1">Limits</div>
                    <div className="text-sm font-semibold">
                      ${offer.limit.min.toLocaleString()} - ${offer.limit.max.toLocaleString()}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="md:col-span-2">
                    <div className="text-sm text-muted-foreground mb-1">Payment</div>
                    <div className="flex flex-wrap gap-1">
                      {offer.paymentMethods.slice(0, 2).map((method, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-card rounded text-xs"
                        >
                          {method}
                        </span>
                      ))}
                      {offer.paymentMethods.length > 2 && (
                        <span className="px-2 py-1 bg-card rounded text-xs">
                          +{offer.paymentMethods.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="md:col-span-1">
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      {tradeType === "buy" ? "Buy" : "Sell"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Safety Tips */}
          <div className="mt-8 glass rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">🛡️</span> Safety Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <span className="text-muted-foreground">
                  Always check merchant's rating and completion rate before trading
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <span className="text-muted-foreground">
                  Use only the payment methods listed in the offer
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <span className="text-muted-foreground">
                  Never release crypto before confirming payment received
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <span className="text-muted-foreground">
                  Report suspicious activity to customer support immediately
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
