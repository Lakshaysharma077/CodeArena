const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { dataStore } = require('../data/store');
const { getIsInMemoryMode } = require('../config/db');

// @route GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const { category = 'Global', country, college, rankFilter, sortBy = 'rating' } = req.query;
    
    if (getIsInMemoryMode()) {
      const leaderboard = dataStore.getLeaderboard({ category, country, college, rankFilter, sortBy });
      return res.json({ category, count: leaderboard.length, leaderboard });
    }

    // MongoDB Mode
    const query = {};
    if (category === 'Country' && country && country !== 'All') {
      query.country = new RegExp(`^${country}$`, 'i');
    } else if (category === 'College' && college && college !== 'All') {
      query.college = new RegExp(college, 'i');
    }
    
    if (rankFilter && rankFilter !== 'All') {
      query.rank = new RegExp(`^${rankFilter}$`, 'i');
    }

    let sortObj = { rating: -1 };
    if (sortBy === 'solved') sortObj = { 'stats.solvedCount': -1 };
    else if (sortBy === 'wins') sortObj = { 'stats.winCount': -1 };
    else if (sortBy === 'winRate') sortObj = { 'stats.winRate': -1 };
    else if (sortBy === 'streak') sortObj = { 'stats.currentStreak': -1 };
    
    // Weekly category logic
    if (category === 'Weekly') {
      sortObj = { 'stats.currentStreak': -1, 'stats.winRate': -1 };
    }

    const users = await User.find(query).sort(sortObj).limit(100).lean();
    
    const leaderboard = users.map((u, idx) => ({
      userId: u._id,
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
      avatar: u.avatar,
      rankPosition: idx + 1
    }));

    res.json({ category, count: leaderboard.length, leaderboard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
