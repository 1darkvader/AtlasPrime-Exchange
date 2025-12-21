"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import { Shield, Key, Smartphone, Eye, EyeOff } from "lucide-react";

export default function SecurityPage() {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <ProtectedRoute>
      <Navigation />
      <main className="min-h-screen pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">Security Settings</h1>
            <p className="text-muted-foreground">Manage your account security and authentication</p>
          </motion.div>

          <div className="space-y-6">
            {/* Password Change */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Key className="w-6 h-6 text-emerald-400" />
                <h2 className="text-2xl font-bold">Change Password</h2>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Current Password</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  Update Password
                </button>
              </form>
            </motion.div>

            {/* 2FA */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-blue-400" />
                  <div>
                    <h2 className="text-2xl font-bold">Two-Factor Authentication (2FA)</h2>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                </div>
                {user?.twoFactorEnabled ? (
                  <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg font-semibold">Enabled</span>
                ) : (
                  <span className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg font-semibold">Disabled</span>
                )}
              </div>
              {!user?.twoFactorEnabled ? (
                <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all">
                  Enable 2FA
                </button>
              ) : (
                <button className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all">
                  Disable 2FA
                </button>
              )}
            </motion.div>

            {/* Active Sessions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Active Sessions</h2>
              <div className="space-y-3">
                <div className="p-4 bg-card rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Current Session</div>
                    <div className="text-sm text-muted-foreground">Chrome on Windows • Last active: Now</div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">Active</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
