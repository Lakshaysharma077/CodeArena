import React, { useState, useEffect } from 'react';
import { Flame, Clock, Trophy, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContestsPage() {
  const [tab, setTab] = useState('ALL');
  const [contests, setContests] = useState([]);

  useEffect(() => {
    fetchContests();
  }, [tab]);

  const fetchContests = async () => {
    try {
      const res = await fetch(`/api/contests?status=${tab}`);
      const data = await res.json();
      setContests(data.contests || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (contestId) => {
    try {
      const res = await fetch(`/api/contests/${contestId}/register`, { method: 'POST' });
      await res.json();
      fetchContests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-arena-border">
        <div>
          <h1 className="text-3xl font-extrabold text-arena-text flex items-center space-x-3">
            <Flame className="w-8 h-8 text-arena-primary animate-pulse" />
            <span>Competitive Contests & Tournaments</span>
          </h1>
          <p className="text-sm text-arena-muted mt-1">
            Participate in timed arena tournaments to earn global rating points, cash prizes, and Conqueror badges.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-2 mt-4 md:mt-0 p-1.5 rounded-2xl glass-card border border-arena-border bg-arena-card">
          {['ALL', 'LIVE', 'UPCOMING', 'PAST'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === t ? 'bg-arena-primary text-white shadow-glow-primary' : 'text-arena-muted hover:text-arena-text'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Contest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {contests.map((cnt) => (
          <motion.div
            key={cnt.id}
            whileHover={{ y: -5 }}
            className="rounded-3xl glass-card border border-arena-border bg-arena-card overflow-hidden flex flex-col justify-between"
          >
            {/* Banner Header Image */}
            <div className="relative h-48 overflow-hidden">
              <img src={cnt.bannerUrl} alt={cnt.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-arena-card via-arena-card/40 to-transparent" />
              
              <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black uppercase border ${
                cnt.status === 'LIVE' ? 'bg-arena-danger/20 text-arena-danger border-arena-danger/40 animate-pulse' :
                cnt.status === 'UPCOMING' ? 'bg-arena-primary/20 text-arena-primary border-arena-primary/40' :
                'bg-arena-card text-arena-muted border-arena-border'
              }`}>
                {cnt.status}
              </span>
            </div>

            {/* Contest Info Body */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-arena-text leading-snug mb-2">{cnt.title}</h3>
                <div className="flex items-center space-x-4 text-xs font-mono text-arena-muted mb-4">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-arena-primary" />
                    <span>{cnt.problemsCount} Problems</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-arena-success" />
                    <span>{cnt.participantsCount} Registered</span>
                  </span>
                </div>

                {/* Prize Pool Highlights */}
                <div className="p-4 rounded-xl bg-arena-bg border border-arena-border space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-arena-warning flex items-center space-x-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Tournament Prizes</span>
                  </span>
                  <ul className="text-xs text-arena-muted space-y-1 font-medium">
                    {cnt.prizes?.map((p, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-arena-primary" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-arena-border">
                {cnt.registered ? (
                  <button disabled className="w-full py-3 rounded-xl bg-arena-success/15 border border-arena-success/40 text-arena-success font-bold text-xs flex items-center justify-center space-x-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Registered & Ready</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(cnt.id)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-arena-primary to-red-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs shadow-glow-primary transition-all hover:scale-105 active:scale-95"
                  >
                    Register for Contest
                  </button>
                )}
              </div>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
}
