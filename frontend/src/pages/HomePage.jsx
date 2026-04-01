import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Package, TrendingUp } from 'lucide-react';
import GlassButton from '../components/GlassButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { containerVariants, itemVariants } from '../utils/animations';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-7xl mx-auto px-4 py-20"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-7xl mb-6"
          >
            🧭
          </motion.div>
          <h1 className="text-6xl font-bold text-white mb-6">Lost & Found</h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Find what you've lost. Help others find their belongings. One community, one solution.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <GlassButton
              onClick={() => window.location.href = '/lost-items'}
              size="lg"
            >
              Browse Lost Items
            </GlassButton>
            <GlassButton
              onClick={() => window.location.href = '/found-items'}
              variant="secondary"
              size="lg"
            >
              Browse Found Items
            </GlassButton>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {[
            { icon: Package, label: 'Items Reported', value: '500+' },
            { icon: Users, label: 'Active Users', value: '1200+' },
            { icon: TrendingUp, label: 'Success Rate', value: '85%' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 text-center hover:border-blue-500/50 transition-all"
            >
              <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <p className="text-slate-300 text-sm font-medium mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Report Lost Item',
                desc: 'Tell us what you lost with photos and details',
                icon: '📋',
              },
              {
                title: 'Smart Matching',
                desc: 'Our system matches lost & found items',
                icon: '🎯',
              },
              {
                title: 'Connect',
                desc: 'Chat safely with the other person',
                icon: '💬',
              },
              {
                title: 'Return',
                desc: 'Safely retrieve your item',
                icon: '✨',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:border-purple-500/50 transition-all group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Lost something? Found something?
          </h2>
          <p className="text-slate-300 mb-6">
            Join our community and help bring lost items back to their owners
          </p>
          <GlassButton
            onClick={() => window.location.href = '/register'}
            size="lg"
          >
            Get Started
          </GlassButton>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
