import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Swords, Trophy, Code2, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [lb, pr] = await Promise.all([
          fetch('/api/leaderboard').then((r) => r.json()),
          fetch('/api/problems').then((r) => r.json()),
        ]);
        setStats({
          competitors: lb.leaderboard?.length || 0,
          problems: pr.problems?.length || 0,
        });
      } catch {
        setStats({ competitors: 0, problems: 0 });
      }
    };
    load();
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-56px)] bg-arena-bg text-arena-text">
      
      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-arena-primary/10 border border-arena-primary/20 text-arena-primary text-xs font-semibold tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Competitive 1v1 Coding Platform</span>
          </div>

          {/* Sharp Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-sans tracking-tight leading-tight text-arena-text max-w-3xl mx-auto">
            Master Competitive Programming in <span className="text-arena-primary">1v1 Battles</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-arena-muted max-w-2xl mx-auto leading-relaxed font-normal">
            Solve curated algorithmic problems, compete head-to-head in real-time against rivals, climb Elo rank tiers from Bronze to Conqueror, and join scheduled contests.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/arena"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-arena-primary text-arena-bg font-semibold text-sm hover:bg-arena-primaryHover transition-colors flex items-center justify-center space-x-2"
            >
              <span>Start Battling</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/problems"
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-arena-border text-arena-text font-medium text-sm hover:border-arena-primary/50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Explore Problems</span>
            </Link>
          </div>

          {/* Live Data Summary Strip */}
          {stats && (
            <div className="pt-10 flex items-center justify-center space-x-8 text-xs font-mono text-arena-muted">
              <div>
                <strong className="text-arena-text text-sm font-bold">{stats.competitors}</strong> Competitors Listed
              </div>
              <div className="h-3 w-[1px] bg-arena-border" />
              <div>
                <strong className="text-arena-text text-sm font-bold">{stats.problems}</strong> Curated Problems
              </div>
              <div className="h-3 w-[1px] bg-arena-border" />
              <div>
                <strong className="text-arena-primary text-sm font-bold">24ms</strong> Judge Latency
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* KEY FEATURES STRIP - 3 Column Minimal Text Highlight (No Bulky Boxes) */}
      <section className="border-t border-arena-border/60 py-16 bg-arena-bgDeep">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-arena-primary font-semibold text-sm">
                <Swords className="w-4 h-4" />
                <span>1v1 Real-Time Code Battles</span>
              </div>
              <p className="text-xs text-arena-muted leading-relaxed">
                Match against opponents with similar Elo rating. Both competitors solve identical problems under a live timer with real-time testcase validation.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-arena-primary font-semibold text-sm">
                <Trophy className="w-4 h-4" />
                <span>Rated Rank Leaderboards</span>
              </div>
              <p className="text-xs text-arena-muted leading-relaxed">
                Climb through 8 competitive tiers from Bronze to Conqueror based on performance bonuses, submission speed, and solution accuracy.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-arena-primary font-semibold text-sm">
                <Code2 className="w-4 h-4" />
                <span>Curated Problem Sets</span>
              </div>
              <p className="text-xs text-arena-muted leading-relaxed">
                Practice data structures and algorithms modeled after top LeetCode and GeeksForGeeks questions with sandboxed execution.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
