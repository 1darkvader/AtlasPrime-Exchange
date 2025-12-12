"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Bell, Shield, Globe, Mail, Phone, Camera } from "lucide-react";

export default function AccountPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    username: user?.username || "",
    phone: "",
    country: "",
    timezone: "",
  });

  const [notifications, setNotifications] = useState({
    emailTrades: true,
    emailDeposits: true,
    emailWithdrawals: true,
    emailNews: false,
    pushTrades: true,
    pushPriceAlerts: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser(formData);
    setIsEditing(false);
  };

  return (
    <ProtectedRoute>
      <Navigation />
      <main className="min-h-screen pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold gradient-text mb-2">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and security</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-4"
            >
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === "profile"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "hover:bg-card text-muted-foreground"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-semibold">Profile</span>
                </button>

                <Link
                  href="/account/security"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-card text-muted-foreground"
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Security</span>
                </Link>

                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === "notifications"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "hover:bg-card text-muted-foreground"
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="font-semibold">Notifications</span>
                </button>

                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === "preferences"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "hover:bg-card text-muted-foreground"
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  <span className="font-semibold">Preferences</span>
                </button>
              </nav>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Profile Information</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all"
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-all">
                          <Camera className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{user?.username}</h3>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {(user?.kycStatus === "verified" || user?.kycStatus === "VERIFIED") ? (
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
                            ✓ Verified
                          </span>
                        ) : (
                          <Link
                            href="/kyc"
                            className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold hover:bg-orange-500/30"
                          >
                            Complete KYC
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">First Name</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                          placeholder="John"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Last Name</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                          placeholder="Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Username</label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg opacity-50"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Contact support to change email
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Country</label>
                        <select
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                        >
                          <option value="">Select country</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="CA">Canada</option>
                          <option value="AU">Australia</option>
                        </select>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 bg-card border border-border rounded-lg font-semibold hover:bg-card/80 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}

              {activeTab === "notifications" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-6"
                >
                  <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
                      <div className="space-y-3">
                        {[
                          { key: "emailTrades", label: "Trade Confirmations" },
                          { key: "emailDeposits", label: "Deposit Confirmations" },
                          { key: "emailWithdrawals", label: "Withdrawal Confirmations" },
                          { key: "emailNews", label: "News & Updates" },
                        ].map((item) => (
                          <label key={item.key} className="flex items-center justify-between p-4 bg-card rounded-lg cursor-pointer hover:bg-card/80">
                            <span>{item.label}</span>
                            <input
                              type="checkbox"
                              checked={notifications[item.key as keyof typeof notifications]}
                              onChange={(e) =>
                                setNotifications({ ...notifications, [item.key]: e.target.checked })
                              }
                              className="w-5 h-5 rounded border-border text-emerald-500 focus:ring-2 focus:ring-emerald-500"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
                      <div className="space-y-3">
                        {[
                          { key: "pushTrades", label: "Trade Executions" },
                          { key: "pushPriceAlerts", label: "Price Alerts" },
                        ].map((item) => (
                          <label key={item.key} className="flex items-center justify-between p-4 bg-card rounded-lg cursor-pointer hover:bg-card/80">
                            <span>{item.label}</span>
                            <input
                              type="checkbox"
                              checked={notifications[item.key as keyof typeof notifications]}
                              onChange={(e) =>
                                setNotifications({ ...notifications, [item.key]: e.target.checked })
                              }
                              className="w-5 h-5 rounded border-border text-emerald-500 focus:ring-2 focus:ring-emerald-500"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      Save Notification Settings
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "preferences" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-6"
                >
                  <h2 className="text-2xl font-bold mb-6">Preferences</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Language</label>
                      <select className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Timezone</label>
                      <select className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option>UTC</option>
                        <option>EST</option>
                        <option>PST</option>
                        <option>GMT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Currency Display</label>
                      <select className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                        <option>JPY</option>
                      </select>
                    </div>

                    <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      Save Preferences
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
