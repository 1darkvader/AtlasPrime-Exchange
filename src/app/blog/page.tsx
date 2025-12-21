"use client";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, TrendingUp } from "lucide-react";

export default function BlogPage() {
  const featuredPost = {
    title: "Bitcoin Hits New All-Time High: What This Means for Traders",
    excerpt: "As Bitcoin reaches unprecedented levels, we analyze the market dynamics and what traders should watch for in the coming weeks.",
    category: "Market Analysis",
    date: "November 28, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
    author: "Sarah Chen",
  };

  const posts = [
    {
      title: "Complete Guide to Margin Trading on AtlasPrime Exchange",
      excerpt: "Learn how to leverage your positions safely and effectively with our comprehensive margin trading guide.",
      category: "Trading Guide",
      date: "November 27, 2024",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    },
    {
      title: "Understanding DeFi: The Future of Finance",
      excerpt: "Explore how decentralized finance is revolutionizing traditional banking and investment systems.",
      category: "Education",
      date: "November 25, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400",
    },
    {
      title: "5 Technical Indicators Every Crypto Trader Should Know",
      excerpt: "Master these essential technical analysis tools to improve your trading decisions and timing.",
      category: "Trading Tips",
      date: "November 23, 2024",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1642790551116-18e9ddfc4ab0?w=400",
    },
    {
      title: "AtlasPrime Platform Update: New Features Released",
      excerpt: "We've added advanced charting tools, portfolio analytics, and faster order execution to enhance your trading experience.",
      category: "Platform Updates",
      date: "November 20, 2024",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400",
    },
    {
      title: "Ethereum 2.0: What You Need to Know About The Merge",
      excerpt: "A deep dive into Ethereum's transition to Proof of Stake and its implications for the entire crypto ecosystem.",
      category: "Market Analysis",
      date: "November 18, 2024",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400",
    },
    {
      title: "Security Best Practices for Cryptocurrency Traders",
      excerpt: "Protect your assets with these essential security measures every crypto trader must implement.",
      category: "Security",
      date: "November 15, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400",
    },
  ];

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
            <h1 className="text-5xl font-bold gradient-text mb-4">AtlasPrime Blog</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Insights, analysis, and news from the world of cryptocurrency trading
            </p>
          </motion.div>

          {/* Featured Post */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl overflow-hidden mb-12 hover:glow transition-all cursor-pointer group"
          >
            <div className="md:flex">
              <div className="md:w-1/2 relative h-64 md:h-auto bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-24 h-24 text-emerald-400 opacity-50" />
              </div>
              <div className="md:w-1/2 p-8">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl font-bold mt-4 mb-4 group-hover:text-emerald-400 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">By {featuredPost.author}</span>
                  <button className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold">
                    Read More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Posts */}
          <h2 className="text-3xl font-bold mb-6">Recent Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="glass rounded-xl overflow-hidden hover:glow transition-all cursor-pointer group"
              >
                <div className="h-48 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                  <TrendingUp className="w-16 h-16 text-emerald-400 opacity-50" />
                </div>
                <div className="p-6">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold mt-3 mb-3 group-hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 glass hover:bg-card rounded-lg font-semibold transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
