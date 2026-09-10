const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  problemTitle: { type: String },
  code: { type: String, required: true },
  language: { type: String, required: true },
  verdict: {
    type: String,
    enum: ['ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'RUNTIME_ERROR'],
    required: true
  },
  runtimeMs: { type: Number, default: 0 },
  memoryMb: { type: Number, default: 0 },
  testcasesPassed: { type: Number, default: 0 },
  totalTestcases: { type: Number, default: 0 },
  correctnessScore: { type: Number, default: 0 },
  complexityScore: { type: Number, default: 0 },
  finalScore: { type: Number, default: 0 },
  ratingDelta: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
