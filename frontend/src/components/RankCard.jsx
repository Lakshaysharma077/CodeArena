import React from 'react';
import { Shield, Crown, Flame, Award, Zap, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const RANK_TIERS = [
  { name: 'Bronze', minRating: 0, maxRating: 1199, icon: Shield, color: '#CD7F32', badgeText: 'TIER I - III', description: 'Beginner Competitive Division' },
  { name: 'Silver', minRating: 1200, maxRating: 1399, icon: Shield, color: '#94A3B8', badgeText: 'TIER I - III', description: 'Developing Problem Solver' },
  { name: 'Gold', minRating: 1400, maxRating: 1599, icon: Star, color: '#F59E0B', badgeText: 'TIER I - III', description: 'Intermediate Tactician' },
  { name: 'Platinum', minRating: 1600, maxRating: 1799, icon: Award, color: '#0ea5e9', badgeText: 'TIER I - III', description: 'Advanced Competitive Coder' },
  { name: 'Diamond', minRating: 1800, maxRating: 1999, icon: Zap, color: '#8b5cf6', badgeText: 'TIER I - III', description: 'Elite Algorithmic Specialist' },
  { name: 'Master', minRating: 2000, maxRating: 2199, icon: Flame, color: '#ec4899', badgeText: 'TOP 5%', description: 'Grandmaster Level Specialist' },
  { name: 'Crown', minRating: 2200, maxRating: 2399, icon: Crown, color: '#f43f5e', badgeText: 'TOP 1%', description: 'Global Champion Tier' },
  { name: 'Conqueror', minRating: 2400, maxRating: 9999, icon: Sparkles, color: '#ef4444', badgeText: 'LEGENDARY TOP 500', description: 'The Apex Coder Rank' }
];

export default function RankCard({ rank, currentRating = 1680, showProgress = true }) {
  const tierInfo = RANK_TIERS.find(t => t.name.toLowerCase() === (rank || 'gold').toLowerCase()) || RANK_TIERS[2];
  const Icon = tierInfo.icon;

  const currentTierMin = tierInfo.minRating;
  const currentTierMax = tierInfo.maxRating === 9999 ? 3000 : tierInfo.maxRating;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((currentRating - currentTierMin) / (currentTierMax - currentTierMin)) * 100)));

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative overflow-hidden rounded-3xl bg-arena-card border border-arena-border p-6 shadow-sm group hover:shadow-xl transition-all duration-300"
      style={{ '--hover-border': tierInfo.color }}
    >
      {/* Background Gradient Glow (Visible on Hover) */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${tierInfo.color}, transparent 70%)` }}
      />
      
      {/* Subtle Top Border Highlight */}
      <div 
        className="absolute top-0 left-0 w-full h-[2px] opacity-20 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundColor: tierInfo.color, boxShadow: `0 0 15px ${tierInfo.color}` }}
      />

      <div className="flex flex-col space-y-6 relative z-10">
        
        {/* Top Section: Icon & Badges */}
        <div className="flex items-start justify-between">
          <div className="relative">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center border border-arena-border shadow-sm bg-arena-bgElevated"
            >
              <Icon className="w-7 h-7 drop-shadow-md transition-transform duration-300 group-hover:scale-110" style={{ color: tierInfo.color }} />
            </div>
          </div>
          <span 
            className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border border-arena-border bg-arena-bgElevated text-arena-text"
            style={{ color: tierInfo.color }}
          >
            {tierInfo.badgeText}
          </span>
        </div>

        {/* Middle Section: Title & Rating */}
        <div>
          <h3 className="text-2xl font-black font-sans tracking-tight text-arena-text mb-1">
            {tierInfo.name}
          </h3>
          <p className="text-xs text-arena-muted font-medium">
            {tierInfo.description}
          </p>
        </div>

        {/* Bottom Section: Progress Bar */}
        {showProgress && (
          <div className="pt-2">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-arena-muted">Progress</span>
              <span className="text-xl font-mono font-black text-arena-text leading-none">{currentRating} <span className="text-[10px] text-arena-muted font-sans uppercase">RR</span></span>
            </div>
            
            <div className="w-full h-2 rounded-full bg-arena-bgElevated border border-arena-border overflow-hidden relative">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 left-0 h-full rounded-full shadow-sm"
                style={{ backgroundColor: tierInfo.color, boxShadow: `0 0 10px ${tierInfo.color}80` }}
              />
            </div>
            
            <div className="flex justify-between text-[10px] font-mono text-arena-muted mt-2 font-medium">
              <span>{currentTierMin} RR</span>
              <span>{tierInfo.maxRating === 9999 ? '3000+ RR' : `${currentTierMax} RR`}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
