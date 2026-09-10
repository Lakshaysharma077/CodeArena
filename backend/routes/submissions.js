const express = require('express');
const router = express.Router();
const { evaluateSubmission } = require('../utils/judgeEngine');
const { SEED_PROBLEMS } = require('../data/seedProblems');
const { dataStore } = require('../data/store');
const { getIsInMemoryMode } = require('../config/db');
const Submission = require('../models/Submission');
const User = require('../models/User');
const Problem = require('../models/Problem');

// @route POST /api/submissions/run (Dry Run testcases)
router.post('/run', async (req, res) => {
  try {
    const { code, language, problemId, customInput } = req.body;
    if (!code) return res.status(400).json({ message: 'Code is required' });

    const problem = SEED_PROBLEMS.find(p => p.problemId === problemId || p.slug === problemId) || SEED_PROBLEMS[0];

    const result = await evaluateSubmission({
      code,
      language: language || 'javascript',
      problem,
      customInput,
      timeLimitMs: problem.timeLimit || 2000,
      memoryLimitMb: problem.memoryLimit || 256
    });

    res.json({
      message: 'Run complete',
      verdict: result.verdict,
      runtimeMs: result.runtimeMs,
      memoryMb: result.memoryMb,
      testcasesPassed: result.testcasesPassed,
      totalTestcases: result.totalTestcases,
      compilationError: result.compilationError,
      runtimeError: result.runtimeError,
      failedTestcase: result.failedTestcase,
      stdout: result.stdout
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/submissions/submit (Official Code Evaluation)
router.post('/submit', async (req, res) => {
  try {
    const { userId = 'usr_demo', problemId, problemTitle, code, language = 'JavaScript' } = req.body;
    if (!code) return res.status(400).json({ message: 'Code is required' });

    const problem = SEED_PROBLEMS.find(p => p.problemId === problemId || p.slug === problemId) || SEED_PROBLEMS[0];

    const evaluation = await evaluateSubmission({
      code,
      language: language.toLowerCase(),
      problem,
      timeLimitMs: problem.timeLimit || 2000,
      memoryLimitMb: problem.memoryLimit || 256
    });

    if (getIsInMemoryMode()) {
      const submissionId = `sub_${Math.floor(100000 + Math.random() * 900000)}`;
      const newRecord = {
        submissionId, userId, problemId: problem.problemId, problemTitle: problemTitle || problem.title,
        language, code, verdict: evaluation.verdict, runtimeMs: evaluation.runtimeMs, memoryMb: evaluation.memoryMb,
        testcasesPassed: evaluation.testcasesPassed, totalTestcases: evaluation.totalTestcases,
        correctnessScore: evaluation.correctnessScore, complexityScore: evaluation.complexityScore,
        finalScore: evaluation.finalScore, compilationError: evaluation.compilationError,
        runtimeError: evaluation.runtimeError, failedTestcase: evaluation.failedTestcase,
        stdout: evaluation.stdout, createdAt: new Date().toISOString()
      };
      dataStore.addSubmission(newRecord);
      return res.json({ message: 'Submission evaluated', submission: newRecord });
    }

    // MongoDB Persistence
    let userDoc = await User.findById(userId);
    let dbProblem = await Problem.findOne({ problemId: problem.problemId });

    if (!userDoc || !dbProblem) {
      return res.status(400).json({ message: 'User or Problem not found in database' });
    }

    const newRecord = await Submission.create({
      user: userDoc._id,
      username: userDoc.username,
      problem: dbProblem._id,
      problemTitle: dbProblem.title,
      code,
      language,
      verdict: evaluation.verdict,
      runtimeMs: evaluation.runtimeMs,
      memoryMb: evaluation.memoryMb,
      testcasesPassed: evaluation.testcasesPassed,
      totalTestcases: evaluation.totalTestcases,
      correctnessScore: evaluation.correctnessScore,
      complexityScore: evaluation.complexityScore,
      finalScore: evaluation.finalScore
    });

    // Update user stats
    userDoc.stats.totalSubmissions = (userDoc.stats.totalSubmissions || 0) + 1;
    if (evaluation.verdict === 'ACCEPTED') {
      const hasSolvedBefore = await Submission.findOne({ user: userDoc._id, problem: dbProblem._id, verdict: 'ACCEPTED' });
      if (!hasSolvedBefore) {
        userDoc.stats.solvedCount = (userDoc.stats.solvedCount || 0) + 1;
        if (dbProblem.difficulty === 'Easy') userDoc.stats.easySolved = (userDoc.stats.easySolved || 0) + 1;
        if (dbProblem.difficulty === 'Medium') userDoc.stats.mediumSolved = (userDoc.stats.mediumSolved || 0) + 1;
        if (dbProblem.difficulty === 'Hard') userDoc.stats.hardSolved = (userDoc.stats.hardSolved || 0) + 1;
      }
    }
    await userDoc.save();

    res.json({
      message: 'Submission evaluated',
      submission: {
        ...newRecord.toObject(),
        compilationError: evaluation.compilationError,
        runtimeError: evaluation.runtimeError,
        failedTestcase: evaluation.failedTestcase,
        stdout: evaluation.stdout
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/submissions/problem/:problemId
router.get('/problem/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;
    if (getIsInMemoryMode()) {
      const list = dataStore.submissions.filter(s => s.problemId === problemId || s.problemTitle?.toLowerCase() === problemId?.toLowerCase());
      return res.json({ submissions: list });
    }

    const dbProblem = await Problem.findOne({ problemId });
    if (!dbProblem) return res.json({ submissions: [] });

    const subs = await Submission.find({ problem: dbProblem._id }).sort({ createdAt: -1 }).lean();
    res.json({ submissions: subs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/submissions/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (getIsInMemoryMode() || userId === 'usr_demo') {
      const list = dataStore.submissions.filter(s => s.userId === userId);
      return res.json({ submissions: list.length > 0 ? list : dataStore.submissions });
    }

    const subs = await Submission.find({ user: userId }).sort({ createdAt: -1 }).lean();
    res.json({ submissions: subs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
