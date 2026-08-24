import React from 'react';
import { Swords, Github, Twitter, Disc as Discord, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-arena-border bg-arena-bgDeep pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-arena-border/60">

          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-arena-primary flex items-center justify-center shadow-glow-primary">
                <Swords className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-arena-text">Code<span className="gradient-text-primary">Arena</span></span>
            </Link>
            <p className="text-sm text-arena-muted leading-relaxed">
              The premier live ranked competitive coding battlefield built for competitive programmers and engineers aiming for the top tier.
            </p>
            <div className="flex space-x-3 text-arena-muted">
              {[Github, Twitter, Discord].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-arena-card border border-arena-border flex items-center justify-center hover:text-arena-text hover:border-arena-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-arena-text mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-arena-muted font-medium">
              <li><Link to="/problems" className="hover:text-arena-text transition-colors">Problem Sets</Link></li>
              <li><Link to="/arena" className="hover:text-arena-text transition-colors">1v1 Battle Queue</Link></li>
              <li><Link to="/leaderboard" className="hover:text-arena-text transition-colors">Global Leaderboard</Link></li>
              <li><Link to="/contests" className="hover:text-arena-text transition-colors">Tournaments & Contests</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-arena-text mb-4">Competitive</h4>
            <ul className="space-y-2.5 text-sm text-arena-muted font-medium">
              <li><Link to="/ranks" className="hover:text-arena-text transition-colors">Rank Tiers</Link></li>
              <li><Link to="/ranks" className="hover:text-arena-text transition-colors">Elo Rating Algorithm</Link></li>
              <li><Link to="/dashboard" className="hover:text-arena-text transition-colors">Performance Analytics</Link></li>
              <li><a href="#" className="hover:text-arena-text transition-colors">Season 2026 Rewards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-arena-text mb-4">System Status</h4>
            <div className="p-4 rounded-xl glass-card border border-arena-border space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-arena-success">
                <span className="w-2 h-2 rounded-full bg-arena-success animate-ping"></span>
                <span>Judge Engine: Operational</span>
              </div>
              <p className="text-xs text-arena-muted">Avg execution latency: 24ms</p>
              <p className="text-xs text-arena-muted">Sandbox Node.js VM: Active</p>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-arena-muted">
          <p>© 2026 CodeArena Inc. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-arena-danger fill-current" />
            <span>for competitive programmers worldwide.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
