const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  problemId: { type: String, required: true, unique: true },
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  source: { type: String, default: 'CodeArena' },
  topics: [{ type: String }],
  companies: [{ type: String }],
  companyDisclaimer: { type: String, default: 'Commonly associated with interview rounds at listed companies.' },
  description: { type: String, required: true },
  inputFormat: { type: String, default: '' },
  outputFormat: { type: String, default: '' },
  constraints: [{ type: String }],
  examples: [{
    input: { type: String },
    output: { type: String },
    explanation: { type: String }
  }],
  starterCode: {
    javascript: { type: String },
    python: { type: String },
    cpp: { type: String },
    java: { type: String }
  },
  supportedLanguages: {
    type: [String],
    default: ['JavaScript', 'Python', 'C++', 'Java']
  },
  publicTestcases: [{
    input: { type: String },
    expectedOutput: { type: String },
    explanation: { type: String }
  }],
  hiddenTestcases: [{
    input: { type: String },
    expectedOutput: { type: String },
    tag: { type: String } // e.g. min-input, max-input, edge-case, stress-test
  }],
  timeLimit: { type: Number, default: 2000 }, // ms
  memoryLimit: { type: Number, default: 256 }, // MB
  expectedComplexity: {
    time: { type: String, default: 'O(N)' },
    space: { type: String, default: 'O(1)' }
  },
  editorial: {
    approach: { type: String },
    intuition: { type: String },
    timeComplexity: { type: String },
    spaceComplexity: { type: String },
    codeSolution: {
      javascript: { type: String },
      python: { type: String },
      cpp: { type: String },
      java: { type: String }
    }
  },
  hints: [{ type: String }],
  totalSubmissions: { type: Number, default: 1200 },
  acceptedSubmissions: { type: Number, default: 780 },
  acceptanceRate: { type: Number, default: 65.0 }
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);

