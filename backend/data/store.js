const { getRankByRating, RANKS } = require('../utils/ratingCalculator');
const { SEED_PROBLEMS } = require('./seedProblems');

// In-Memory Persistent Store (with MongoDB synchronization support)
class DataStore {
  constructor() {
    this.users = new Map();
    this.submissions = [];
    this.battles = new Map();
    this.contests = [];
    this.initDefaultData();
  }

  initDefaultData() {
    // Fake users removed. Authentication now uses MongoDB.

    // 2. Initial Submissions
    this.submissions = [
      {
        submissionId: 'sub_184921',
        userId: 'usr_demo',
        problemId: 'prob_1',
        problemTitle: 'Two Sum',
        language: 'JavaScript',
        verdict: 'ACCEPTED',
        runtimeMs: 38,
        memoryMb: 44.2,
        testcasesPassed: 42,
        totalTestcases: 42,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      },
      {
        submissionId: 'sub_183402',
        userId: 'usr_demo',
        problemId: 'prob_9',
        problemTitle: 'Maximum Subarray',
        language: 'Python',
        verdict: 'ACCEPTED',
        runtimeMs: 42,
        memoryMb: 24.1,
        testcasesPassed: 38,
        totalTestcases: 38,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      },
      {
        submissionId: 'sub_181190',
        userId: 'usr_demo',
        problemId: 'prob_3',
        problemTitle: 'Longest Substring Without Repeating Characters',
        language: 'JavaScript',
        verdict: 'WRONG_ANSWER',
        runtimeMs: 32,
        memoryMb: 41.0,
        testcasesPassed: 18,
        totalTestcases: 45,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
      }
    ];

    // 3. Real Scheduled & Live Contests
    this.contests = [
      {
        id: 'cnt_1',
        title: 'CodeArena Global Clash #42',
        slug: 'global-clash-42',
        status: 'LIVE',
        startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
        problemsCount: 4,
        participantsCount: 2480,
        prizes: ['$1,500 Cash Pool', 'Custom Conqueror Hoodie', 'Exclusive Discord Role'],
        bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        registeredUsers: ['usr_demo']
      },
      {
        id: 'cnt_2',
        title: 'Valorant Sprint Championship 2026',
        slug: 'valorant-sprint-2026',
        status: 'UPCOMING',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
        problemsCount: 5,
        participantsCount: 4120,
        prizes: ['Keychron Mechanical Keyboards', '$2,500 Prize Pool', 'Conqueror Badge'],
        bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
        registeredUsers: []
      },
      {
        id: 'cnt_3',
        title: 'Algorithmic Warfare - Season 3 Final',
        slug: 'algorithmic-warfare-s3',
        status: 'PAST',
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        problemsCount: 4,
        participantsCount: 5890,
        prizes: ['$5,000 Grand Pool', 'Trophy'],
        bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        registeredUsers: ['usr_demo']
      }
    ];
  }

  getUser(userIdOrEmail) {
    if (!userIdOrEmail) return this.users.get('usr_demo');
    for (const u of this.users.values()) {
      if (u.id === userIdOrEmail || u.email === userIdOrEmail || u.username === userIdOrEmail) {
        return u;
      }
    }
    return this.users.get('usr_demo');
  }

  createUser(user) {
    const id = user.id || `usr_${Date.now()}`;
    const rankInfo = getRankByRating(user.rating || 1000);
    const newUser = {
      id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role || 'user',
      rating: user.rating || 1000,
      rank: rankInfo.name,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      country: user.country || 'India',
      college: user.college || 'IIT Delhi',
      stats: {
        solvedCount: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        totalSubmissions: 0,
        winCount: 0,
        lossCount: 0,
        winRate: 0,
        accuracyRate: 0,
        avgRuntimeMs: 0,
        avgMemoryMb: 0,
        currentStreak: 0,
        bestStreak: 0,
        battlesPlayed: 0
      },
      ratingHistory: [
        { date: 'Initial', rating: user.rating || 1000 }
      ],
      recentMatches: []
    };
    this.users.set(id, newUser);
    return newUser;
  }

  updateUser(userId, updates) {
    const user = this.getUser(userId);
    if (!user) return null;
    Object.assign(user, updates);
    if (updates.rating) {
      const r = getRankByRating(updates.rating);
      user.rank = r.name;
    }
    return user;
  }

  addSubmission(sub) {
    this.submissions.unshift(sub);

    // Update user stats dynamically
    const user = this.getUser(sub.userId);
    if (user) {
      user.stats.totalSubmissions = (user.stats.totalSubmissions || 0) + 1;

      if (sub.verdict === 'ACCEPTED') {
        const userSubs = this.submissions.filter(s => s.userId === user.id && s.verdict === 'ACCEPTED');
        const uniqueSolved = new Set(userSubs.map(s => s.problemId));
        user.stats.solvedCount = uniqueSolved.size;

        const prob = SEED_PROBLEMS.find(p => p.problemId === sub.problemId);
        if (prob) {
          if (prob.difficulty === 'Easy') user.stats.easySolved = (user.stats.easySolved || 0) + 1;
          if (prob.difficulty === 'Medium') user.stats.mediumSolved = (user.stats.mediumSolved || 0) + 1;
          if (prob.difficulty === 'Hard') user.stats.hardSolved = (user.stats.hardSolved || 0) + 1;
        }
      }
    }
    return sub;
  }

  recordBattleResult({ userId, opponentUsername, opponentRating, result, ratingDelta, newRating, newRank, problemTitles = [] }) {
    const user = this.getUser(userId);
    if (!user) return;

    user.rating = newRating;
    user.rank = newRank;

    const isWin = result === 'VICTORY';
    const isLoss = result === 'DEFEAT';

    if (isWin) {
      user.stats.winCount = (user.stats.winCount || 0) + 1;
      user.stats.currentStreak = (user.stats.currentStreak || 0) + 1;
      if (user.stats.currentStreak > (user.stats.bestStreak || 0)) {
        user.stats.bestStreak = user.stats.currentStreak;
      }
    } else if (isLoss) {
      user.stats.lossCount = (user.stats.lossCount || 0) + 1;
      user.stats.currentStreak = 0;
    }

    const totalGames = (user.stats.winCount || 0) + (user.stats.lossCount || 0);
    user.stats.winRate = totalGames > 0 ? Math.round((user.stats.winCount / totalGames) * 100) : 0;
    user.stats.battlesPlayed = totalGames;

    // Push into rating history
    const dateLabel = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    user.ratingHistory = user.ratingHistory || [];
    user.ratingHistory.push({ date: dateLabel, rating: newRating });
    if (user.ratingHistory.length > 10) user.ratingHistory.shift();

    // Push into recent matches
    user.recentMatches = user.recentMatches || [];
    user.recentMatches.unshift({
      id: `m_${Date.now()}`,
      opponent: opponentUsername || 'Opponent',
      opponentRating: opponentRating || 1600,
      result: result,
      ratingDelta: ratingDelta > 0 ? `+${ratingDelta}` : `${ratingDelta}`,
      problemTitle: problemTitles[0] || '1v1 Battle Arena',
      time: 'Just now',
      date: new Date().toISOString()
    });
    if (user.recentMatches.length > 8) user.recentMatches.pop();
  }

  getUserDashboard(userId) {
    const user = this.getUser(userId) || this.getUser('usr_demo');
    const rankInfo = getRankByRating(user.rating);

    // Calculate Next Tier Progress
    const currentTierIdx = RANKS.findIndex(r => r.name === rankInfo.name);
    const nextRank = currentTierIdx < RANKS.length - 1 ? RANKS[currentTierIdx + 1] : null;

    let tierProgress = 100;
    let pointsNeededForNextTier = 0;
    let nextTierName = 'Top Tier';

    if (nextRank) {
      nextTierName = nextRank.name;
      const range = nextRank.minRating - rankInfo.minRating;
      const progressIntoCurrent = Math.max(0, user.rating - rankInfo.minRating);
      tierProgress = Math.min(100, Math.round((progressIntoCurrent / range) * 100));
      pointsNeededForNextTier = Math.max(0, nextRank.minRating - user.rating);
    }

    // Dynamic Topic Proficiency based on user problem submissions & catalog
    const topicStats = {};
    SEED_PROBLEMS.forEach(p => {
      (p.topics || []).forEach(t => {
        if (!topicStats[t]) topicStats[t] = { topic: t, solved: 0, total: 0, attempts: 0 };
        topicStats[t].total += 1;
      });
    });

    const userSubs = this.submissions.filter(s => s.userId === user.id);
    userSubs.forEach(s => {
      const prob = SEED_PROBLEMS.find(p => p.problemId === s.problemId);
      if (prob) {
        (prob.topics || []).forEach(t => {
          if (!topicStats[t]) topicStats[t] = { topic: t, solved: 0, total: 1, attempts: 0 };
          topicStats[t].attempts += 1;
          if (s.verdict === 'ACCEPTED') topicStats[t].solved += 1;
        });
      }
    });

    const sortedTopics = Object.values(topicStats)
      .map(t => ({
        topic: t.topic,
        accuracy: t.attempts > 0 ? Math.round((t.solved / t.attempts) * 100) : (t.solved > 0 ? 80 : 0),
        solved: t.solved,
        total: t.total
      }))
      .filter(t => t.total > 0);

    const strongest = sortedTopics.filter(t => t.solved > 0).sort((a, b) => b.accuracy - a.accuracy).slice(0, 3);
    const weakest = sortedTopics.sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);

    return {
      userId: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      country: user.country,
      college: user.college,
      rating: user.rating,
      rank: user.rank,
      tierProgress,
      pointsNeededForNextTier,
      nextTier: nextTierName,
      stats: {
        solvedCount: user.stats.solvedCount || 0,
        easySolved: user.stats.easySolved || 0,
        mediumSolved: user.stats.mediumSolved || 0,
        hardSolved: user.stats.hardSolved || 0,
        totalSubmissions: user.stats.totalSubmissions || 0,
        winCount: user.stats.winCount || 0,
        lossCount: user.stats.lossCount || 0,
        winRate: user.stats.winRate || 0,
        currentStreak: user.stats.currentStreak || 0,
        bestStreak: user.stats.bestStreak || 0,
        battlesPlayed: user.stats.battlesPlayed || 0
      },
      topicProficiency: {
        strongest: strongest,
        weakest: weakest
      },
      ratingHistory: user.ratingHistory && user.ratingHistory.length > 0
        ? user.ratingHistory
        : [{ date: 'Initial', rating: user.rating }],
      recentMatches: user.recentMatches || []
    };
  }

  getLeaderboard({ category = 'Global', country, college, rankFilter, sortBy = 'rating' } = {}) {
    let list = Array.from(this.users.values()).map(u => ({
      userId: u.id,
      username: u.username,
      country: u.country,
      college: u.college,
      rank: u.rank,
      rating: u.rating,
      solved: u.stats?.solvedCount || 0,
      wins: u.stats?.winCount || 0,
      losses: u.stats?.lossCount || 0,
      winRate: u.stats?.winRate || 0,
      streak: u.stats?.currentStreak || 0,
      avatar: u.avatar
    }));

    if (category === 'Country' && country && country !== 'All') {
      list = list.filter(item => item.country.toLowerCase() === country.toLowerCase());
    } else if (category === 'College' && college && college !== 'All') {
      list = list.filter(item => item.college.toLowerCase().includes(college.toLowerCase()));
    } else if (category === 'Weekly') {
      list = list.slice().sort((a, b) => (b.streak * 10 + b.winRate) - (a.streak * 10 + a.winRate));
    }

    if (rankFilter && rankFilter !== 'All') {
      list = list.filter(item => item.rank.toLowerCase() === rankFilter.toLowerCase());
    }

    if (sortBy === 'solved') {
      list.sort((a, b) => b.solved - a.solved);
    } else if (sortBy === 'wins') {
      list.sort((a, b) => b.wins - a.wins);
    } else if (sortBy === 'winRate') {
      list.sort((a, b) => b.winRate - a.winRate);
    } else if (sortBy === 'streak') {
      list.sort((a, b) => b.streak - a.streak);
    } else {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list.map((item, idx) => ({ ...item, rankPosition: idx + 1 }));
  }

  registerForContest(contestId, userId) {
    const contest = this.contests.find(c => c.id === contestId || c.slug === contestId);
    if (!contest) return null;
    if (!contest.registeredUsers) contest.registeredUsers = [];
    if (!contest.registeredUsers.includes(userId)) {
      contest.registeredUsers.push(userId);
      contest.participantsCount += 1;
    }
    return contest;
  }
}

const dataStore = new DataStore();
module.exports = { dataStore };
