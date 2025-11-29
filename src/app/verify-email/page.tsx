"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 animated-gradient">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass rounded-2xl p-8 text-center">
        <div className="text-6xl mb-6">✉️</div>
        <h1 className="text-3xl font-bold mb-4">Email Verification</h1>
        <p className="text-muted-foreground mb-8">We've sent a verification link to your email</p>
        <Link href="/login" className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          Back to Login
        </Link>
      </motion.div>
    </main>
  );
}
