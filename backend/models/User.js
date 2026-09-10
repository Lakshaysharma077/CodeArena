const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
  rating: { type: Number, default: 1200 },
  rank: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Crown', 'Conqueror'],
    default: 'Bronze'
  },
  globalRank: { type: Number, default: 0 },
  countryRank: { type: Number, default: 0 },
  country: { type: String, default: 'United States' },
  college: { type: String, default: 'Stanford University' },
  stats: {
    solvedCount: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    winCount: { type: Number, default: 0 },
    lossCount: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    totalRuntimeMs: { type: Number, default: 0 },
    totalMemoryMb: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    accuracyRate: { type: Number, default: 0 }
  },
  achievements: [{
    code: String,
    title: String,
    description: String,
    unlockedAt: { type: Date, default: Date.now },
    icon: String
  }],
  submissionHeatmap: { type: Object, default: {} },
  recentMatches: [{
    opponent: String,
    opponentRank: String,
    opponentRating: Number,
    result: { type: String, enum: ['WIN', 'LOSS', 'DRAW'] },
    ratingChange: Number,
    problemTitle: String,
    timeMs: Number,
    date: { type: Date, default: Date.now }
  }],
  refreshToken: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
