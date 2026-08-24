const mongoose = require('mongoose');

const battleSchema = new mongoose.Schema({
  player1: {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String },
    rank: { type: String, default: 'Gold' },
    rating: { type: Number, default: 1450 },
    score: { type: Number, default: 0 },
    status: { type: String, enum: ['IDLE', 'SUBMITTED', 'FINISHED'], default: 'IDLE' },
    code: { type: String, default: '' },
    runtimeMs: { type: Number, default: 0 },
    ratingChange: { type: Number, default: 0 }
  },
  player2: {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String },
    rank: { type: String, default: 'Gold' },
    rating: { type: Number, default: 1420 },
    score: { type: Number, default: 0 },
    status: { type: String, enum: ['IDLE', 'SUBMITTED', 'FINISHED'], default: 'IDLE' },
    code: { type: String, default: '' },
    runtimeMs: { type: Number, default: 0 },
    ratingChange: { type: Number, default: 0 }
  },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  problemTitle: { type: String, default: 'Two Sum' },
  difficulty: { type: String, default: 'Easy' },
  status: { type: String, enum: ['MATCHING', 'IN_PROGRESS', 'FINISHED'], default: 'IN_PROGRESS' },
  winnerId: { type: String, default: null },
  durationSeconds: { type: Number, default: 900 },
  startedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Battle', battleSchema);
