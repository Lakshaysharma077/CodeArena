const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');
const { getRankByRating, RANKS } = require('../utils/ratingCalculator');
const { dataStore } = require('../data/store');
const { getIsInMemoryMode } = require('../config/db');
const { SEED_PROBLEMS } = require('../data/seedProblems');

// @route GET /api/user/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];

    if (getIsInMemoryMode() || !userId || userId === 'usr_demo') {
      const dashboard = dataStore.getUserDashboard(userId || 'usr_demo');
      const currentRankInfo = getRankByRating(dashboard.rating);
      return res.json({
        ...dashboard,
        rankInfo: currentRankInfo,
        allRanks: RANKS
      });
    }

    // MongoDB Mode
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const rankInfo = getRankByRating(user.rating);
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

    // Dynamic Topic Proficiency
    const topicStats = {};
    SEED_PROBLEMS.forEach(p => {
      (p.topics || []).forEach(t => {
        if (!topicStats[t]) topicStats[t] = { topic: t, solved: 0, total: 0, attempts: 0 };
        topicStats[t].total += 1;
      });
    });

    const userSubs = await Submission.find({ user: userId });
    userSubs.forEach(s => {
      const prob = SEED_PROBLEMS.find(p => p.problemId === s.problem.toString() || p._id?.toString() === s.problem.toString());
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

    res.json({
      userId: user._id,
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
        battlesPlayed: (user.stats.winCount || 0) + (user.stats.lossCount || 0)
      },
      topicProficiency: {
        strongest,
        weakest
      },
      ratingHistory: user.ratingHistory && user.ratingHistory.length > 0
        ? user.ratingHistory
        : [{ date: 'Initial', rating: user.rating }],
      recentMatches: user.recentMatches || [],
      rankInfo,
      allRanks: RANKS
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/user/update-stats
router.post('/update-stats', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { newRating, newRank, isWin } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
    }

    if (getIsInMemoryMode()) {
      return res.json({ message: 'Stats updated (in-memory mode)', success: true });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.rating = newRating;
    user.rank = newRank;

    if (!user.stats) {
      user.stats = { winCount: 0, lossCount: 0, currentStreak: 0, bestStreak: 0, winRate: 0, solvedCount: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0, totalSubmissions: 0 };
    }

    if (isWin) {
      user.stats.winCount = (user.stats.winCount || 0) + 1;
      user.stats.currentStreak = (user.stats.currentStreak || 0) + 1;
      if (user.stats.currentStreak > (user.stats.bestStreak || 0)) {
        user.stats.bestStreak = user.stats.currentStreak;
      }
    } else {
      user.stats.lossCount = (user.stats.lossCount || 0) + 1;
      user.stats.currentStreak = 0;
    }

    const total = (user.stats.winCount || 0) + (user.stats.lossCount || 0);
    user.stats.winRate = total > 0 ? Math.round((user.stats.winCount / total) * 100) : 0;

    // Optional: push to ratingHistory
    if (!user.ratingHistory) user.ratingHistory = [];
    user.ratingHistory.push({
      date: new Date().toISOString().split('T')[0],
      rating: newRating
    });

    await user.save();

    res.json({ message: 'Stats updated successfully', user });
  } catch (error) {
    console.error('[Update Stats Error]:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
