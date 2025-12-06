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
