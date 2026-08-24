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
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await userService.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const profile = dashboardData?.profile || {
    username: user?.username || 'Lakshay',
    rating: user?.rating || 1642,
    rank: user?.rank || 'Platinum',
    tierProgress: 71,
    pointsNeededForNextTier: 158,
    nextTier: 'Diamond',
    solvedCount: user?.stats?.solvedCount || 84,
    winCount: user?.stats?.winCount || 62,
    lossCount: user?.stats?.lossCount || 22,
    winRate: user?.stats?.winRate || 74,
    currentStreak: user?.stats?.currentStreak || 6,
    bestStreak: user?.stats?.bestStreak || 14
  };

  const topicProficiency = dashboardData?.topicProficiency || {
    strongest: [
      { topic: 'Dynamic Programming', accuracy: 92, solved: 24, total: 26 },
      { topic: 'Arrays & Two Pointers', accuracy: 88, solved: 32, total: 36 },
      { topic: 'Hash Table', accuracy: 85, solved: 28, total: 33 }
    ],
    weakest: [
      { topic: 'Graph & Topological Sort', accuracy: 54, solved: 7, total: 13 },
      { topic: 'Trie & Prefix Tree', accuracy: 48, solved: 4, total: 8 },
      { topic: 'Bit Manipulation', accuracy: 42, solved: 3, total: 7 }
    ]
  };

  const ratingHistory = dashboardData?.ratingHistory || [
    { date: 'Aug 1', rating: 1500 },
    { date: 'Aug 5', rating: 1530 },
    { date: 'Aug 9', rating: 1575 },
    { date: 'Aug 13', rating: 1560 },
    { date: 'Aug 17', rating: 1610 },
    { date: 'Aug 20', rating: 1642 }
  ];

  const recentMatches = dashboardData?.recentMatches || [
    { id: 'm1', opponent: 'voidwalker', opponentRating: 1678, result: 'VICTORY', ratingDelta: '+27', problemTitle: 'Maximum Subarray', time: '2 hours ago' },
    { id: 'm2', opponent: 'SyntaxSamurai', opponentRating: 1620, result: 'VICTORY', ratingDelta: '+22', problemTitle: 'Two Sum', time: '1 day ago' },
    { id: 'm3', opponent: 'BinaryBoss', opponentRating: 1870, result: 'DEFEAT', ratingDelta: '-14', problemTitle: 'Course Schedule', time: '2 days ago' },
    { id: 'm4', opponent: 'CyberViper', opponentRating: 1615, result: 'VICTORY', ratingDelta: '+25', problemTitle: 'Valid Parentheses', time: '3 days ago' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Profile Summary Header */}
      <div className="p-8 rounded-3xl glass-card border border-arena-border bg-arena-card shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          {/* User Avatar & Info */}
          <div className="flex items-center space-x-5">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-arena-primary/30 shadow-glow-primary"
              alt="Avatar"
            />
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-arena-text">{profile.username}</h1>
                <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase bg-arena-primary/20 text-arena-primary border border-arena-primary/30">
                  {profile.rank}
                </span>
              </div>
              <p className="text-xs font-mono text-arena-muted mt-1">
                {user?.college || 'IIT Delhi'} • {user?.country || 'India'} • Global Rank #9
              </p>
            </div>
          </div>

          {/* Rating & Tier Progress Box */}
          <div className="p-4 rounded-2xl bg-arena-bg border border-arena-border min-w-[280px] space-y-2 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-arena-muted uppercase font-bold">Rating Rank</span>
              <span className="text-xl font-black text-arena-text">{profile.rating} RR</span>
            </div>
            
            <div>
              <div className="flex justify-between text-[11px] text-arena-muted mb-1">
                <span>Progress to {profile.nextTier}</span>
                <span className="text-arena-primary font-bold">{profile.tierProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-arena-card border border-arena-border overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-arena-primary to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${profile.tierProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-arena-muted mt-1 block">
                {profile.pointsNeededForNextTier} RR needed for promotion
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
          <div className="text-2xl font-black text-arena-text">{profile.solvedCount}</div>
          <span className="text-[10px] text-arena-muted">Across 12 algorithm categories</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-arena-border bg-arena-card space-y-1">
          <span className="text-xs text-arena-muted flex items-center space-x-1.5 font-bold">
            <Swords className="w-4 h-4 text-arena-primary" />
            <span>1v1 Win Rate</span>
          </span>
          <div className="text-2xl font-black text-arena-text">{profile.winRate}%</div>
          <span className="text-[10px] text-arena-muted">{profile.winCount}W - {profile.lossCount}L recorded</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-arena-border bg-arena-card space-y-1">
          <span className="text-xs text-arena-muted flex items-center space-x-1.5 font-bold">
            <Flame className="w-4 h-4 text-arena-warning" />
            <span>Current Streak</span>
          </span>
          <div className="text-2xl font-black text-arena-warning">{profile.currentStreak} 🔥</div>
          <span className="text-[10px] text-arena-muted">Personal Best: {profile.bestStreak} wins</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-arena-border bg-arena-card space-y-1">
          <span className="text-xs text-arena-muted flex items-center space-x-1.5 font-bold">
            <Trophy className="w-4 h-4 text-arena-primary" />
            <span>Competitive Tier</span>
          </span>
          <div className="text-2xl font-black text-arena-primary">{profile.rank}</div>
          <span className="text-[10px] text-arena-muted">Top 3.8% of platform</span>
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
                Calculated based on first-attempt accuracy, benchmark speed, and CP test passes.
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
                      <div className="h-full bg-arena-success rounded-full" style={{ width: `${t.accuracy}%` }} />
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
                      <div className="h-full bg-arena-danger rounded-full" style={{ width: `${t.accuracy}%` }} />
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
              <span className="text-xs font-mono font-bold text-arena-success">+142 RR (This Month)</span>
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
                  <YAxis domain={['dataMin - 50', 'dataMax + 50']} stroke="#71717a" fontSize={11} />
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
              {recentMatches.map((m) => {
                const isWin = m.result === 'VICTORY';
                return (
                  <div key={m.id} className="p-3.5 rounded-2xl bg-arena-bg border border-arena-border flex items-center justify-between text-xs">
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
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
