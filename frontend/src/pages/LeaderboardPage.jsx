import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Trophy, Medal, Flame, Globe, Users, Award, Shield, ArrowUp, Sparkles, Filter, Search, Building } from 'lucide-react';
import { leaderboardService } from '../services/leaderboardService';

export default function LeaderboardPage() {
  const { user } = useSelector((state) => state.auth);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Global'); // Global | Weekly | Friends | Country | College
  const [rankFilter, setRankFilter] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [countryFilter, setCountryFilter] = useState('All');
  const [collegeFilter, setCollegeFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, [category, rankFilter, sortBy, countryFilter, collegeFilter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await leaderboardService.getLeaderboard({
        category,
        rankFilter,
        sortBy,
        country: countryFilter,
        college: collegeFilter
      });
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 'Conqueror': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Crown': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'Master': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'Diamond': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'Platinum': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Gold': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default: return 'bg-arena-card text-arena-muted border-arena-border';
    }
  };

  const filtered = leaderboard.filter(u => u.username.toLowerCase().includes(search.toLowerCase()));
  const top3 = filtered.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-arena-border">
        <div>
          <h1 className="text-3xl font-extrabold text-arena-text flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-arena-primary" />
            <span>Competitive Leaderboard</span>
          </h1>
          <p className="text-sm text-arena-muted mt-1">
            Global Elo ratings calculated via win-probability formulas, clean submissions, and battle speed.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-arena-card border border-arena-border overflow-x-auto">
          {['Global', 'Weekly', 'Friends', 'Country', 'College'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                category === cat
                  ? 'bg-arena-primary text-white shadow-glow-primary'
                  : 'text-arena-muted hover:text-arena-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      {top3.length >= 3 && category === 'Global' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          
          {/* #2 Silver */}
          <div className="p-6 rounded-3xl glass-card border border-slate-400/30 bg-arena-card text-center space-y-3 relative order-2 md:order-1">
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden ring-4 ring-slate-400/50 shadow-lg">
              <img src={top3[1].avatar} alt={top3[1].username} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-slate-400">#2 Silver Podium</span>
              <h3 className="text-lg font-extrabold text-arena-text">{top3[1].username}</h3>
              <p className="text-xs font-mono text-arena-muted">{top3[1].college} • {top3[1].country}</p>
            </div>
            <div className="text-xl font-black font-mono text-arena-text">{top3[1].rating} RR</div>
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border inline-block ${getRankBadge(top3[1].rank)}`}>
              {top3[1].rank}
            </span>
          </div>

          {/* #1 Gold Champion */}
          <div className="p-8 rounded-3xl glass-card border border-amber-500/50 bg-arena-card text-center space-y-4 relative order-1 md:order-2 shadow-glow-primary md:-translate-y-3">
            <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden ring-4 ring-amber-500 shadow-2xl">
              <img src={top3[0].avatar} alt={top3[0].username} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-amber-400 flex items-center justify-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>#1 Grand Champion</span>
              </span>
              <h3 className="text-2xl font-black text-arena-text">{top3[0].username}</h3>
              <p className="text-xs font-mono text-arena-muted">{top3[0].college} • {top3[0].country}</p>
            </div>
            <div className="text-2xl font-black font-mono text-arena-primary">{top3[0].rating} RR</div>
            <span className={`px-3 py-1 rounded-xl text-xs font-bold border inline-block ${getRankBadge(top3[0].rank)}`}>
              👑 {top3[0].rank}
            </span>
          </div>

          {/* #3 Bronze */}
          <div className="p-6 rounded-3xl glass-card border border-amber-700/30 bg-arena-card text-center space-y-3 relative order-3">
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden ring-4 ring-amber-700/50 shadow-lg">
              <img src={top3[2].avatar} alt={top3[2].username} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-amber-600">#3 Bronze Podium</span>
              <h3 className="text-lg font-extrabold text-arena-text">{top3[2].username}</h3>
              <p className="text-xs font-mono text-arena-muted">{top3[2].college} • {top3[2].country}</p>
            </div>
            <div className="text-xl font-black font-mono text-arena-text">{top3[2].rating} RR</div>
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border inline-block ${getRankBadge(top3[2].rank)}`}>
              {top3[2].rank}
            </span>
          </div>

        </div>
      )}

      {/* Filter Options Bar */}
      <div className="p-4 rounded-2xl glass-card border border-arena-border bg-arena-card flex flex-wrap items-center justify-between gap-4">
        
        {/* Search competitor */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-arena-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search competitor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-arena-bg border border-arena-border text-xs text-arena-text placeholder-arena-muted focus:outline-none focus:border-arena-primary"
          />
        </div>

        {/* Tier Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase text-arena-muted">Rank Tier:</span>
          <select
            value={rankFilter}
            onChange={(e) => setRankFilter(e.target.value)}
            className="bg-arena-bg border border-arena-border text-arena-text text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-arena-primary cursor-pointer"
          >
            <option value="All">All Tiers</option>
            <option value="Conqueror">Conqueror</option>
            <option value="Crown">Crown</option>
            <option value="Master">Master</option>
            <option value="Diamond">Diamond</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
          </select>
        </div>

        {/* Sort Criterion */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase text-arena-muted">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-arena-bg border border-arena-border text-arena-text text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-arena-primary cursor-pointer"
          >
            <option value="rating">Elo Rating (RR)</option>
            <option value="solved">Problems Solved</option>
            <option value="wins">1v1 Wins</option>
            <option value="winRate">Win Rate %</option>
            <option value="streak">Current Streak 🔥</option>
          </select>
        </div>

      </div>

      {/* Leaderboard Table */}
      <div className="overflow-hidden rounded-2xl glass-card border border-arena-border bg-arena-card shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-arena-bgElevated text-xs uppercase font-extrabold text-arena-muted border-b border-arena-border">
              <th className="py-4 px-6">Rank</th>
              <th className="py-4 px-6">Competitor</th>
              <th className="py-4 px-6">Tier</th>
              <th className="py-4 px-6">Elo Rating</th>
              <th className="py-4 px-6">Solved</th>
              <th className="py-4 px-6">1v1 Record</th>
              <th className="py-4 px-6">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-arena-border/60 text-sm">
            {filtered.map((item) => {
              const isMe = item.username === user?.username || item.isCurrentUser;
              return (
                <tr
                  key={item.rankPosition || item.username}
                  className={`transition-colors ${
                    isMe
                      ? 'bg-arena-primary/10 border-l-4 border-l-arena-primary hover:bg-arena-primary/15'
                      : 'hover:bg-arena-cardGlow/50'
                  }`}
                >
                  {/* Rank Position */}
                  <td className="py-4 px-6 font-mono font-black text-arena-muted">
                    <div className="flex items-center space-x-2">
                      <span>#{item.rankPosition}</span>
                      {item.rankPosition <= 3 && (
                        <Medal className={`w-4 h-4 ${
                          item.rankPosition === 1 ? 'text-amber-400' :
                          item.rankPosition === 2 ? 'text-slate-400' :
                          'text-amber-700'
                        }`} />
                      )}
                    </div>
                  </td>

                  {/* Competitor */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img src={item.avatar} alt={item.username} className="w-10 h-10 rounded-xl object-cover ring-2 ring-arena-border" />
                      <div>
                        <div className="flex items-center space-x-2 font-bold text-arena-text">
                          <span>{item.username}</span>
                          {isMe && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-arena-primary text-white">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-arena-muted">
                          {item.college} • {item.country}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Tier */}
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getRankBadge(item.rank)}`}>
                      {item.rank}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="py-4 px-6 font-mono font-black text-arena-text">
                    {item.rating} <span className="text-xs text-arena-muted font-normal">RR</span>
                  </td>

                  {/* Solved */}
                  <td className="py-4 px-6 font-mono text-arena-muted text-xs">
                    {item.solved}
                  </td>

                  {/* 1v1 Record */}
                  <td className="py-4 px-6 font-mono text-xs text-arena-muted">
                    <div>{item.wins}W / {item.losses || 12}L</div>
                    <div className="text-arena-success font-bold">{item.winRate}% Win Rate</div>
                  </td>

                  {/* Streak */}
                  <td className="py-4 px-6 font-mono text-xs">
                    <span className="text-arena-warning font-bold flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{item.streak || 3}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
