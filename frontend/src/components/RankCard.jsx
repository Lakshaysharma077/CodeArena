import React from 'react';
import { Shield, Crown, Flame, Award, Zap, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const RANK_TIERS = [
  { name: 'Bronze', minRating: 0, maxRating: 1199, icon: Shield, color: '#CD7F32', gradient: 'from-amber-700 via-amber-900 to-stone-900', borderColor: 'border-amber-700/50', badgeText: 'TIER I - III', description: 'Beginner Competitive Division' },
  { name: 'Silver', minRating: 1200, maxRating: 1399, icon: Shield, color: '#94A3B8', gradient: 'from-slate-500 via-slate-700 to-slate-900', borderColor: 'border-slate-400/50', badgeText: 'TIER I - III', description: 'Developing Problem Solver' },
  { name: 'Gold', minRating: 1400, maxRating: 1599, icon: Star, color: '#F59E0B', gradient: 'from-amber-500 via-yellow-700 to-stone-900', borderColor: 'border-yellow-400/50', badgeText: 'TIER I - III', description: 'Intermediate Tactician' },
  { name: 'Platinum', minRating: 1600, maxRating: 1799, icon: Award, color: '#c59b6c', gradient: 'from-amber-600 via-amber-800 to-stone-900', borderColor: 'border-amber-500/50', badgeText: 'TIER I - III', description: 'Advanced Competitive Coder' },
  { name: 'Diamond', minRating: 1800, maxRating: 1999, icon: Zap, color: '#d4a373', gradient: 'from-amber-700 via-stone-800 to-stone-950', borderColor: 'border-amber-400/50', badgeText: 'TIER I - III', description: 'Elite Algorithmic Specialist' },
  { name: 'Master', minRating: 2000, maxRating: 2199, icon: Flame, color: '#EC4899', gradient: 'from-pink-500 via-rose-800 to-slate-900', borderColor: 'border-pink-500/50', badgeText: 'TOP 5%', description: 'Grandmaster Level Specialist' },
  { name: 'Crown', minRating: 2200, maxRating: 2399, icon: Crown, color: '#EAB308', gradient: 'from-yellow-400 via-amber-600 to-orange-950', borderColor: 'border-amber-400/80', badgeText: 'TOP 1%', description: 'Global Champion Tier' },
  { name: 'Conqueror', minRating: 2400, maxRating: 9999, icon: Sparkles, color: '#EF4444', gradient: 'from-red-500 via-rose-700 to-purple-950', borderColor: 'border-red-500', badgeText: 'LEGENDARY TOP 500', description: 'The Apex Coder Rank' }
];

export default function RankCard({ rank, currentRating = 1680, showProgress = true }) {
  const tierInfo = RANK_TIERS.find(t => t.name.toLowerCase() === (rank || 'gold').toLowerCase()) || RANK_TIERS[2];
  const Icon = tierInfo.icon;

  const currentTierMin = tierInfo.minRating;
  const currentTierMax = tierInfo.maxRating === 9999 ? 3000 : tierInfo.maxRating;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((currentRating - currentTierMin) / (currentTierMax - currentTierMin)) * 100)));

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl border ${tierInfo.borderColor} bg-gradient-to-br ${tierInfo.gradient} p-6 text-white`}
    >
      <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-slate-950/70 border border-white/10 flex items-center justify-center">
              <Icon className="w-9 h-9" style={{ color: tierInfo.color }} />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-white/20 text-[9px] font-black tracking-wider uppercase">
              {tierInfo.name.substring(0, 3)}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-2xl font-black font-sans tracking-tight text-white">{tierInfo.name}</h3>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-extrabold uppercase tracking-wider text-slate-200 border border-white/10">
                {tierInfo.badgeText}
              </span>
            </div>
            <p className="text-xs text-white/70 mt-0.5">{tierInfo.description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold uppercase tracking-wider text-white/70 block">Rating</span>
          <span className="text-2xl font-mono font-black text-white">{currentRating}</span>
        </div>
      </div>

      {showProgress && (
        <div className="mt-6 relative z-10">
          <div className="flex justify-between items-center text-xs font-bold mb-2">
            <span className="text-white/80">Tier Progress</span>
            <span className="font-mono text-white/90">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950/80 p-0.5 border border-white/10 overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full shadow-glow-primary"
              style={{ background: `linear-gradient(90deg, ${tierInfo.color}, white)` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-white/60 mt-1.5">
            <span>{currentTierMin} RR</span>
            <span>{tierInfo.maxRating === 9999 ? '3000+ RR' : `${currentTierMax} RR`}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
