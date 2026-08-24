const express = require('express');
const router = express.Router();

const MOCK_LEADERBOARD = [
  { rankPosition: 1, username: 'ApexCoder', country: 'United States', college: 'MIT', rank: 'Conqueror', rating: 2680, solved: 840, wins: 340, losses: 24, winRate: 93, streak: 18, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
  { rankPosition: 2, username: 'VortexMaster', country: 'India', college: 'IIT Bombay', rank: 'Crown', rating: 2390, solved: 720, wins: 290, losses: 35, winRate: 89, streak: 12, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
  { rankPosition: 3, username: 'CyberViper', country: 'United States', college: 'Stanford University', rank: 'Crown', rating: 2280, solved: 650, wins: 250, losses: 40, winRate: 86, streak: 8, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80' },
  { rankPosition: 4, username: 'AlgoGod_X', country: 'Germany', college: 'TU Munich', rank: 'Master', rating: 2150, solved: 590, wins: 210, losses: 45, winRate: 82, streak: 5, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80' },
  { rankPosition: 5, username: 'QuantumByte', country: 'India', college: 'IIT Delhi', rank: 'Master', rating: 2040, solved: 520, wins: 185, losses: 50, winRate: 78, streak: 7, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80' },
  { rankPosition: 6, username: 'DevNinja_99', country: 'United Kingdom', college: 'Cambridge', rank: 'Diamond', rating: 1950, solved: 480, wins: 160, losses: 55, winRate: 74, streak: 4, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80' },
  { rankPosition: 7, username: 'BinaryBoss', country: 'Canada', college: 'Waterloo', rank: 'Diamond', rating: 1870, solved: 430, wins: 140, losses: 60, winRate: 70, streak: 3, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80' },
  { rankPosition: 8, username: 'voidwalker', country: 'Canada', college: 'Waterloo', rank: 'Platinum', rating: 1678, solved: 245, wins: 88, losses: 32, winRate: 73, streak: 4, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80' },
  { rankPosition: 9, username: 'Lakshay', country: 'India', college: 'IIT Delhi', rank: 'Platinum', rating: 1642, solved: 84, wins: 62, losses: 22, winRate: 74, streak: 6, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', isCurrentUser: true },
  { rankPosition: 10, username: 'SyntaxSamurai', country: 'Japan', college: 'University of Tokyo', rank: 'Platinum', rating: 1620, solved: 190, wins: 78, losses: 40, winRate: 66, streak: 2, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80' },
  { rankPosition: 11, username: 'ShadowCoder_99', country: 'India', college: 'IIT Delhi', rank: 'Gold', rating: 1590, solved: 140, wins: 55, losses: 35, winRate: 61, streak: 1, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
  { rankPosition: 12, username: 'CodeCraftsman', country: 'Germany', college: 'TU Berlin', rank: 'Gold', rating: 1540, solved: 110, wins: 45, losses: 30, winRate: 60, streak: 3, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' }
];

// @route GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const { category = 'Global', country, college, rankFilter, sortBy = 'rating' } = req.query;

    let leaderboard = [...MOCK_LEADERBOARD];

    if (category === 'Country' && country && country !== 'All') {
      leaderboard = leaderboard.filter(item => item.country.toLowerCase() === country.toLowerCase());
    } else if (category === 'College' && college && college !== 'All') {
      leaderboard = leaderboard.filter(item => item.college.toLowerCase().includes(college.toLowerCase()));
    } else if (category === 'Friends') {
      leaderboard = leaderboard.filter((_, idx) => idx % 2 === 0 || _.isCurrentUser);
    } else if (category === 'Weekly') {
      leaderboard = leaderboard.slice().sort((a, b) => (b.streak * 10 + b.winRate) - (a.streak * 10 + a.winRate));
    }

    if (rankFilter && rankFilter !== 'All') {
      leaderboard = leaderboard.filter(item => item.rank.toLowerCase() === rankFilter.toLowerCase());
    }

    // Sort
    if (sortBy === 'solved') {
      leaderboard.sort((a, b) => b.solved - a.solved);
    } else if (sortBy === 'wins') {
      leaderboard.sort((a, b) => b.wins - a.wins);
    } else if (sortBy === 'winRate') {
      leaderboard.sort((a, b) => b.winRate - a.winRate);
    } else if (sortBy === 'streak') {
      leaderboard.sort((a, b) => b.streak - a.streak);
    } else {
      leaderboard.sort((a, b) => b.rating - a.rating);
    }

    // Update rank positions
    leaderboard = leaderboard.map((item, idx) => ({ ...item, rankPosition: idx + 1 }));

    res.json({ category, count: leaderboard.length, leaderboard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

