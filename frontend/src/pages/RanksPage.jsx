import React from 'react';
import { Zap, ArrowUpRight, Award } from 'lucide-react';
import RankCard, { RANK_TIERS } from '../components/RankCard';

export default function RanksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-4 py-1.5 rounded-full bg-arena-primary/10 border border-arena-primary/30 text-arena-primary text-xs font-bold uppercase tracking-wider inline-block">
          Valorant Competitive System Engine
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-arena-text font-sans tracking-tight">
          Competitive <span className="gradient-text-conqueror">Rank Tier Hierarchy</span>
        </h1>
        <p className="text-base text-arena-muted font-medium leading-relaxed">
          CodeArena features a competitive rating (RR) system designed to accurately benchmark algorithmic prowess, execution efficiency, and battle resilience.
        </p>
      </div>

      {/* Grid of All 8 Rank Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {RANK_TIERS.map((tier, idx) => (
          <RankCard key={idx} rank={tier.name} currentRating={tier.minRating + 60} />
        ))}
      </div>

      {/* Rating & Performance Mechanics Breakdown */}
      <div className="p-10 rounded-3xl glass-panel border border-arena-border bg-arena-card space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold text-arena-text flex items-center space-x-3">
            <Zap className="w-6 h-6 text-arena-warning" />
            <span>Elo Rating Adjustment Rules & Bonuses</span>
          </h2>
          <p className="text-sm text-arena-muted mt-1">
            After every 1v1 battle, rating RR is dynamically computed based on relative opponent rating and solution performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Base Rating Delta Table */}
          <div className="p-6 rounded-2xl bg-arena-bgElevated border border-arena-border space-y-4">
            <h3 className="text-base font-bold text-arena-text uppercase tracking-wider flex items-center space-x-2">
              <ArrowUpRight className="w-4 h-4 text-arena-success" />
              <span>Base Match Outcomes</span>
            </h3>
            
            <ul className="space-y-3 text-xs font-mono">
              <li className="p-3 rounded-xl bg-arena-bg border border-arena-border flex justify-between items-center">
                <span className="text-arena-text">Win against higher rated player (+100 RR)</span>
                <span className="font-extrabold text-arena-success text-sm">+35 RR</span>
              </li>
              <li className="p-3 rounded-xl bg-arena-bg border border-arena-border flex justify-between items-center">
                <span className="text-arena-text">Win against equal rated opponent</span>
                <span className="font-extrabold text-arena-success text-sm">+25 RR</span>
              </li>
              <li className="p-3 rounded-xl bg-arena-bg border border-arena-border flex justify-between items-center">
                <span className="text-arena-text">Lose against lower rated player</span>
                <span className="font-extrabold text-arena-danger text-sm">-30 RR</span>
              </li>
              <li className="p-3 rounded-xl bg-arena-bg border border-arena-border flex justify-between items-center">
                <span className="text-arena-text">Lose against higher rated opponent</span>
                <span className="font-extrabold text-arena-danger text-sm">-10 RR</span>
              </li>
            </ul>
          </div>

          {/* Performance Bonus Breakdown */}
          <div className="p-6 rounded-2xl bg-arena-bgElevated border border-arena-border space-y-4">
            <h3 className="text-base font-bold text-arena-text uppercase tracking-wider flex items-center space-x-2">
              <Award className="w-4 h-4 text-arena-warning" />
              <span>Performance Bonuses & Penalties</span>
            </h3>
            
            <ul className="space-y-3 text-xs font-mono">
              <li className="p-3 rounded-xl bg-arena-bg border border-arena-border flex justify-between items-center">
                <span className="text-arena-primary">Fast Execution Runtime (&lt; 50ms)</span>
                <span className="font-extrabold text-arena-warning text-sm">+5 Bonus RR</span>
              </li>
              <li className="p-3 rounded-xl bg-arena-bg border border-arena-border flex justify-between items-center">
                <span className="text-arena-muted">Low Memory Footprint (&lt; 25MB)</span>
                <span className="font-extrabold text-arena-warning text-sm">+5 Bonus RR</span>
              </li>
              <li className="p-3 rounded-xl bg-arena-bg border border-arena-border flex justify-between items-center">
                <span className="text-arena-success">First Submission Accepted (Clean AC)</span>
                <span className="font-extrabold text-arena-warning text-sm">+10 Bonus RR</span>
              </li>
              <li className="p-3 rounded-xl bg-arena-bg border border-arena-border flex justify-between items-center">
                <span className="text-arena-danger">Failed Testcase Wrong Attempt</span>
                <span className="font-extrabold text-arena-danger text-sm">-3 RR / attempt</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}
