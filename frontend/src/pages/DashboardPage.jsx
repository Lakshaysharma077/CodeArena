import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Trophy, Swords, CheckCircle2, TrendingUp, Zap, Target,
  Flame, Award, Shield, ArrowUpRight, ArrowDownRight, Layers,
  BarChart3, Activity, Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { userService } from '../services/userService';

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, [user?.id, user?.rating]);

  const fetchDashboard = async () => {
    try {
      const data = await userService.getDashboard(user?.id);
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const username = dashboardData?.username || user?.username || 'Competitor';
  const rating = dashboardData?.rating ?? user?.rating ?? 1000;
  const rank = dashboardData?.rank || user?.rank || 'Bronze';
  const tierProgress = dashboardData?.tierProgress ?? 0;
  const pointsNeededForNextTier = dashboardData?.pointsNeededForNextTier ?? 100;
  const nextTier = dashboardData?.nextTier || 'Silver';

  const stats = dashboardData?.stats || user?.stats || {
    solvedCount: 0,
    winCount: 0,
    lossCount: 0,
    winRate: 0,
    currentStreak: 0,
    bestStreak: 0,
    battlesPlayed: 0
  };

  const topicProficiency = dashboardData?.topicProficiency || {
    strongest: [],
    weakest: []
  };

  const ratingHistory = dashboardData?.ratingHistory && dashboardData.ratingHistory.length > 0
    ? dashboardData.ratingHistory
    : [
        { date: 'Initial', rating: rating }
      ];

  const recentMatches = dashboardData?.recentMatches || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Profile Summary Header */}
      <div className="p-8 rounded-3xl glass-card border border-arena-border bg-arena-card shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          {/* User Avatar & Info */}
          <div className="flex items-center space-x-5">
            <img
              src={dashboardData?.avatar || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-arena-primary/30 shadow-glow-primary"
              alt="Avatar"
            />
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-arena-text">{username}</h1>
                <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase bg-arena-primary/20 text-arena-primary border border-arena-primary/30">
                  {rank}
                </span>
              </div>
              <p className="text-xs font-mono text-arena-muted mt-1">
                {dashboardData?.college || user?.college || 'IIT Delhi'} • {dashboardData?.country || user?.country || 'India'}
              </p>
            </div>
          </div>

          {/* Rating & Tier Progress Box */}
          <div className="p-4 rounded-2xl bg-arena-bg border border-arena-border min-w-[280px] space-y-2 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-arena-muted uppercase font-bold">Rating Rank</span>
              <span className="text-xl font-black text-arena-text">{rating} RR</span>
            </div>
            
            <div>
              <div className="flex justify-between text-[11px] text-arena-muted mb-1">
                <span>Progress to {nextTier}</span>
                <span className="text-arena-primary font-bold">{tierProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-arena-card border border-arena-border overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-arena-primary to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${tierProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-arena-muted mt-1 block">
                {pointsNeededForNextTier > 0 ? `${pointsNeededForNextTier} RR needed for promotion` : 'Peak rank achieved'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-5 rounded-2xl glass-card border border-arena-border bg-arena-card space-y-1">
          <span className="text-xs text-arena-muted flex items-center space-x-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-arena-success" />
            <span>Problems Solved</span>
          </span>
          <div className="text-2xl font-black text-arena-text">{stats.solvedCount}</div>
          <span className="text-[10px] text-arena-muted">{stats.easySolved || 0}E • {stats.mediumSolved || 0}M • {stats.hardSolved || 0}H</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-arena-border bg-arena-card space-y-1">
          <span className="text-xs text-arena-muted flex items-center space-x-1.5 font-bold">
            <Swords className="w-4 h-4 text-arena-primary" />
            <span>1v1 Win Rate</span>
          </span>
          <div className="text-2xl font-black text-arena-text">{stats.winRate}%</div>
          <span className="text-[10px] text-arena-muted">{stats.winCount}W - {stats.lossCount}L recorded</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-arena-border bg-arena-card space-y-1">
          <span className="text-xs text-arena-muted flex items-center space-x-1.5 font-bold">
            <Flame className="w-4 h-4 text-arena-warning" />
            <span>Current Streak</span>
          </span>
          <div className="text-2xl font-black text-arena-warning">{stats.currentStreak} 🔥</div>
          <span className="text-[10px] text-arena-muted">Personal Best: {stats.bestStreak} wins</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-arena-border bg-arena-card space-y-1">
          <span className="text-xs text-arena-muted flex items-center space-x-1.5 font-bold">
            <Trophy className="w-4 h-4 text-arena-primary" />
            <span>Competitive Tier</span>
          </span>
          <div className="text-2xl font-black text-arena-primary">{rank}</div>
          <span className="text-[10px] text-arena-muted">{rating} Competitive RR</span>
        </div>
      </div>

      {/* Main Analysis Section: Topic Proficiency Breakdown & Rating Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Topic Proficiency Breakdown (Strongest vs Weakest) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl glass-card border border-arena-border bg-arena-card space-y-6">
            <div>
              <h2 className="text-lg font-bold text-arena-text flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-arena-primary" />
                <span>Topic Proficiency Breakdown</span>
              </h2>
              <p className="text-xs text-arena-muted mt-1">
                Calculated based on live submissions, benchmark speed, and competitive test passes.
              </p>
            </div>

            {/* Strongest Topics */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-arena-success flex items-center space-x-1.5">
                <ArrowUpRight className="w-4 h-4" />
                <span>Strongest Topics</span>
              </span>

              <div className="space-y-3">
                {topicProficiency.strongest.map((t, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-arena-bg border border-arena-border space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-arena-text">{t.topic}</span>
                      <span className="text-arena-success font-mono font-bold">{t.accuracy}% ({t.solved}/{t.total})</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-arena-card overflow-hidden">
                      <div className="h-full bg-arena-success rounded-full" style={{ width: `${Math.max(5, t.accuracy)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weakest Topics / Needs Practice */}
            <div className="space-y-3 pt-2 border-t border-arena-border/60">
              <span className="text-xs font-extrabold uppercase tracking-wider text-arena-danger flex items-center space-x-1.5">
                <ArrowDownRight className="w-4 h-4" />
                <span>Areas for Improvement</span>
              </span>

              <div className="space-y-3">
                {topicProficiency.weakest.map((t, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-arena-bg border border-arena-border space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-arena-text">{t.topic}</span>
                      <span className="text-arena-danger font-mono font-bold">{t.accuracy}% ({t.solved}/{t.total})</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-arena-card overflow-hidden">
                      <div className="h-full bg-arena-danger rounded-full" style={{ width: `${Math.max(5, t.accuracy)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT: Rating Area Chart & Recent Match History */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Rating Timeline Area Chart */}
          <div className="p-6 rounded-3xl glass-card border border-arena-border bg-arena-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-arena-text flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-arena-primary" />
                <span>Rating Progression Timeline</span>
              </h2>
              <span className="text-xs font-mono font-bold text-arena-success">Live Tracked</span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ratingHistory}>
                  <defs>
                    <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--arena-primary)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--arena-primary)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
                  <YAxis domain={['dataMin - 30', 'dataMax + 30']} stroke="#71717a" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#27272a',
                      borderRadius: '12px',
                      color: '#f4f4f5',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Area type="monotone" dataKey="rating" stroke="var(--arena-primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRating)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Match History */}
          <div className="p-6 rounded-3xl glass-card border border-arena-border bg-arena-card space-y-4">
            <div className="flex items-center justify-between border-b border-arena-border pb-3">
              <h2 className="text-lg font-bold text-arena-text flex items-center space-x-2">
                <Activity className="w-5 h-5 text-arena-primary" />
                <span>Recent 1v1 Battles</span>
              </h2>
              <span className="text-xs font-mono text-arena-muted">{recentMatches.length} recorded</span>
            </div>

            <div className="space-y-3">
              {recentMatches.length > 0 ? (
                recentMatches.map((m, idx) => {
                  const isWin = m.result === 'VICTORY';
                  return (
                    <div key={m.id || idx} className="p-3.5 rounded-2xl bg-arena-bg border border-arena-border flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            isWin ? 'bg-arena-success/20 text-arena-success border border-arena-success/30' : 'bg-arena-danger/20 text-arena-danger border border-arena-danger/30'
                          }`}>
                            {m.result}
                          </span>
                          <strong className="text-arena-text font-mono">{m.opponent}</strong>
                          <span className="text-arena-muted text-[11px]">({m.opponentRating} RR)</span>
                        </div>
                        <div className="text-[11px] text-arena-muted font-mono">
                          Problem: <span className="text-arena-text">{m.problemTitle}</span> • {m.time}
                        </div>
                      </div>

                      <div className={`font-mono font-black text-sm ${isWin ? 'text-arena-success' : 'text-arena-danger'}`}>
                        {m.ratingDelta}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-arena-muted font-mono">
                  No 1v1 battles recorded yet. Head over to the Arena to start battling!
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
