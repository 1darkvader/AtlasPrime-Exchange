"use client";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, DollarSign, Heart, Zap, Users, TrendingUp } from "lucide-react";

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior Backend Engineer",
      department: "Engineering",
      location: "New York, NY / Remote",
      type: "Full-time",
      salary: "$150K - $200K",
    },
    {
      title: "Product Designer",
      department: "Product",
      location: "London, UK / Remote",
      type: "Full-time",
      salary: "£80K - £120K",
    },
    {
      title: "Blockchain Developer",
      department: "Engineering",
      location: "Singapore / Remote",
      type: "Full-time",
      salary: "$130K - $180K",
    },
    {
      title: "Customer Success Manager",
      department: "Support",
      location: "Remote",
      type: "Full-time",
      salary: "$70K - $90K",
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "New York, NY",
      type: "Full-time",
      salary: "$100K - $130K",
    },
    {
      title: "Security Engineer",
      department: "Security",
      location: "Remote",
      type: "Full-time",
      salary: "$140K - $190K",
    },
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Salary",
      description: "Market-leading compensation plus equity options",
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Premium health, dental, and vision insurance",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Work-life balance with flexible schedule",
    },
    {
      icon: MapPin,
      title: "Remote-First",
      description: "Work from anywhere in the world",
    },
    {
      icon: Zap,
      title: "Learning Budget",
      description: "$5000/year for courses and conferences",
    },
    {
      icon: Users,
      title: "Amazing Team",
      description: "Work with world-class talent",
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-6"
            >
              <Briefcase className="w-10 h-10 text-emerald-400" />
            </motion.div>
            <h1 className="text-5xl font-bold gradient-text mb-4">Careers at AtlasPrime</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join our mission to democratize cryptocurrency trading
            </p>
          </motion.div>

          {/* Why Join */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <h2 className="text-3xl font-bold mb-6">Why Join AtlasPrime?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-card rounded-lg">
                <TrendingUp className="w-8 h-8 text-emerald-400 mb-3" />
                <h3 className="font-bold mb-2">High Growth</h3>
                <p className="text-sm text-muted-foreground">
                  Be part of one of the fastest-growing crypto exchanges
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <Users className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-bold mb-2">World-Class Team</h3>
                <p className="text-sm text-muted-foreground">
                  Work with talented individuals from top tech companies
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <Zap className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="font-bold mb-2">Cutting-Edge Tech</h3>
                <p className="text-sm text-muted-foreground">
                  Build the future of finance with latest technologies
                </p>
              </div>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <h2 className="text-3xl font-bold mb-6">Benefits & Perks</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Open Positions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <h2 className="text-3xl font-bold mb-6">Open Positions ({openPositions.length})</h2>
            <div className="space-y-4">
              {openPositions.map((position, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="p-6 bg-card rounded-xl hover:bg-card/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-emerald-400 transition-colors">
                        {position.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{position.department}</p>
                    </div>
                    <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-colors">
                      Apply
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {position.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {position.type}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {position.salary}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Culture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <h2 className="text-3xl font-bold mb-6">Our Culture</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-emerald-400">Innovation First</h3>
                <p className="text-muted-foreground">
                  We encourage experimentation and embrace new ideas. Every team member has a voice and the opportunity to shape our products.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-400">Diversity & Inclusion</h3>
                <p className="text-muted-foreground">
                  We believe diverse teams build better products. We're committed to creating an inclusive environment where everyone can thrive.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-purple-400">Continuous Learning</h3>
                <p className="text-muted-foreground">
                  We invest in our people. Regular training, conferences, and a generous learning budget help you grow your skills.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-cyan-400">Work-Life Balance</h3>
                <p className="text-muted-foreground">
                  We value sustainable performance. Flexible hours, remote work options, and generous PTO keep our team healthy and happy.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Don't See a Fit?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're always looking for exceptional talent. Send us your resume and let us know how you can contribute.
            </p>
            <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-colors">
              Send General Application
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
