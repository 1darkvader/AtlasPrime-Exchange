"use client";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MessageCircle, MapPin, Send, Clock, Globe } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

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
              <MessageCircle className="w-10 h-10 text-emerald-400" />
            </motion.div>
            <h1 className="text-5xl font-bold gradient-text mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get in touch with our team. We're here to help 24/7
            </p>
          </motion.div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-6 text-center hover:glow transition-all cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Instant support available 24/7
              </p>
              <button className="text-emerald-400 hover:text-emerald-300 font-semibold">
                Start Chat →
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6 text-center hover:glow transition-all cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                support@atlasprime.com
              </p>
              <p className="text-xs text-muted-foreground">Response within 4 hours</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-xl p-6 text-center hover:glow transition-all cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Phone Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                +1 (800) 555-0199
              </p>
              <p className="text-xs text-muted-foreground">VIP members only</p>
            </motion.div>
          </div>

          {/* Contact Form & Info */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-emerald-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-emerald-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="trading">Trading Support</option>
                    <option value="account">Account Issues</option>
                    <option value="security">Security Concerns</option>
                    <option value="partnership">Partnership</option>
                    <option value="media">Media/Press</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={5}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-emerald-500 resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-6"
            >
              {/* Office Locations */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-bold">Office Locations</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-card rounded-lg">
                    <h4 className="font-semibold mb-1">🇺🇸 Headquarters</h4>
                    <p className="text-sm text-muted-foreground">
                      123 Crypto Boulevard, Suite 500<br />
                      New York, NY 10013, USA
                    </p>
                  </div>
                  <div className="p-4 bg-card rounded-lg">
                    <h4 className="font-semibold mb-1">🇬🇧 European Office</h4>
                    <p className="text-sm text-muted-foreground">
                      45 Fintech Street<br />
                      London EC2A 3PQ, United Kingdom
                    </p>
                  </div>
                  <div className="p-4 bg-card rounded-lg">
                    <h4 className="font-semibold mb-1">🇸🇬 Asia-Pacific</h4>
                    <p className="text-sm text-muted-foreground">
                      1 Marina Boulevard, #28-00<br />
                      Singapore 018989
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold">Support Hours</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-card rounded">
                    <span>Live Chat</span>
                    <span className="text-emerald-400">24/7</span>
                  </div>
                  <div className="flex justify-between p-2 bg-card rounded">
                    <span>Email Support</span>
                    <span className="text-emerald-400">24/7</span>
                  </div>
                  <div className="flex justify-between p-2 bg-card rounded">
                    <span>Phone (VIP)</span>
                    <span className="text-muted-foreground">9 AM - 6 PM EST</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold">Follow Us</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 bg-card hover:bg-card/80 rounded-lg transition-colors text-center">
                    <span className="text-2xl mb-1 block">𝕏</span>
                    <span className="text-xs">Twitter</span>
                  </button>
                  <button className="p-3 bg-card hover:bg-card/80 rounded-lg transition-colors text-center">
                    <span className="text-2xl mb-1 block">📘</span>
                    <span className="text-xs">Facebook</span>
                  </button>
                  <button className="p-3 bg-card hover:bg-card/80 rounded-lg transition-colors text-center">
                    <span className="text-2xl mb-1 block">📱</span>
                    <span className="text-xs">Telegram</span>
                  </button>
                  <button className="p-3 bg-card hover:bg-card/80 rounded-lg transition-colors text-center">
                    <span className="text-2xl mb-1 block">📷</span>
                    <span className="text-xs">Instagram</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
