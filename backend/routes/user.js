const express = require('express');
const router = express.Router();
const { getRankByRating, RANKS } = require('../utils/ratingCalculator');

const MOCK_USER_DASHBOARD = {
  userId: 'usr_demo',
  username: 'Lakshay',
  email: 'lakshay@codearena.dev',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  country: 'India',
  college: 'IIT Delhi',
  rating: 1642,
  rank: 'Platinum',
  globalRank: 42,
  countryRank: 5,
  contestRating: 1710,
  stats: {
    solvedCount: 84,
    easySolved: 38,
    mediumSolved: 34,
    hardSolved: 12,
    totalSubmissions: 142,
    winCount: 62,
    lossCount: 22,
    winRate: 74,
    accuracyRate: 81,
    avgRuntimeMs: 34,
    avgMemoryMb: 21.4,
    currentStreak: 6,
    bestStreak: 14,
    battlesPlayed: 84
  },
  topicProficiency: [
    { topic: 'Arrays', accuracy: 82, count: 28, strength: 'strong' },
    { topic: 'Hash Table', accuracy: 78, count: 24, strength: 'strong' },
    { topic: 'Trees', accuracy: 76, count: 18, strength: 'strong' },
    { topic: 'Sliding Window', accuracy: 74, count: 14, strength: 'strong' },
    { topic: 'BFS / DFS', accuracy: 71, count: 19, strength: 'average' },
    { topic: 'Linked List', accuracy: 68, count: 12, strength: 'average' },
    { topic: 'Graphs', accuracy: 60, count: 11, strength: 'weak' },
    { topic: 'Dynamic Programming', accuracy: 54, count: 16, strength: 'weak' },
    { topic: 'Bit Manipulation', accuracy: 48, count: 7, strength: 'weak' }
  ],
  achievements: [
    { code: 'FIRST_WIN', title: 'First Blood', description: 'Win your first 1v1 Ranked Battle', icon: 'Swords', unlocked: true, unlockedAt: '2026-05-12' },
    { code: 'WIN_STREAK_10', title: 'Unstoppable Force', description: 'Achieve a 10 Win Streak in Arena', icon: 'Flame', unlocked: true, unlockedAt: '2026-06-21' },
    { code: 'SPEED_DEMON', title: 'Speed Demon', description: 'Solve a Medium problem in under 30 seconds', icon: 'Zap', unlocked: true, unlockedAt: '2026-07-15' },
    { code: '100_PROBLEMS', title: 'Century Club', description: 'Solve 100 competitive problems', icon: 'Trophy', unlocked: false },
    { code: '500_PROBLEMS', title: 'Grandmaster Coder', description: 'Solve 500 competitive problems', icon: 'Award', unlocked: false },
    { code: 'LEGEND', title: 'Conqueror Legend', description: 'Reach top 100 global conqueror status', icon: 'Crown', unlocked: false }
  ],
  ratingHistory: [
    { date: 'Aug 1', rating: 1420 },
    { date: 'Aug 5', rating: 1485 },
    { date: 'Aug 9', rating: 1530 },
    { date: 'Aug 13', rating: 1575 },
    { date: 'Aug 17', rating: 1610 },
    { date: 'Aug 20', rating: 1625 },
    { date: 'Aug 22', rating: 1642 }
  ],
  recentMatches: [
    { id: 'm_1', opponent: 'voidwalker', opponentRank: 'Platinum', opponentRating: 1678, result: 'WIN', ratingChange: 27, problemTitle: 'Maximum Subarray', timeMs: 24, date: '2026-08-22T06:10:00Z' },
    { id: 'm_2', opponent: 'CyberViper', opponentRank: 'Platinum', opponentRating: 1640, result: 'WIN', ratingChange: 24, problemTitle: 'Two Sum', timeMs: 28, date: '2026-08-21T18:20:00Z' },
    { id: 'm_3', opponent: 'AlgoGod_X', opponentRank: 'Diamond', opponentRating: 1720, result: 'LOSS', ratingChange: -14, problemTitle: 'Trapping Rain Water', timeMs: 82, date: '2026-08-20T14:15:00Z' },
    { id: 'm_4', opponent: 'ShadowCoder_99', opponentRank: 'Gold', opponentRating: 1590, result: 'WIN', ratingChange: 21, problemTitle: 'Longest Substring', timeMs: 36, date: '2026-08-19T11:45:00Z' }
  ]
};

// @route GET /api/user/dashboard
router.get('/dashboard', (req, res) => {
  const currentRankInfo = getRankByRating(MOCK_USER_DASHBOARD.rating);
  res.json({
    ...MOCK_USER_DASHBOARD,
    rankInfo: currentRankInfo,
    allRanks: RANKS
  });
});

module.exports = router;

