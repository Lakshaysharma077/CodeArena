const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
  rating: { type: Number, default: 1000 },
  rank: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Crown', 'Conqueror'],
    default: 'Bronze'
  },
  globalRank: { type: Number, default: 42 },
  countryRank: { type: Number, default: 5 },
  country: { type: String, default: 'United States' },
  college: { type: String, default: 'Stanford University' },
  stats: {
    solvedCount: { type: Number, default: 24 },
    easySolved: { type: Number, default: 12 },
    mediumSolved: { type: Number, default: 9 },
    hardSolved: { type: Number, default: 3 },
    totalSubmissions: { type: Number, default: 48 },
    winCount: { type: Number, default: 18 },
    lossCount: { type: Number, default: 6 },
    currentStreak: { type: Number, default: 5 },
    bestStreak: { type: Number, default: 12 },
    totalRuntimeMs: { type: Number, default: 1240 },
    totalMemoryMb: { type: Number, default: 348 },
    winRate: { type: Number, default: 75 },
    accuracyRate: { type: Number, default: 68 }
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
