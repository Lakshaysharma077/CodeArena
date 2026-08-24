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
    enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Compilation Error', 'Runtime Error'],
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
