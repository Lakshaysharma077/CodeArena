const express = require('express');
const router = express.Router();
const { evaluateSubmission } = require('../utils/judgeEngine');
const { SEED_PROBLEMS } = require('../data/seedProblems');

// In-memory submission records store
const submissionHistory = [
  {
    submissionId: 'sub_184921',
    userId: 'usr_demo',
    problemId: 'prob_1',
    problemTitle: 'Two Sum',
    language: 'JavaScript',
    verdict: 'ACCEPTED',
    runtimeMs: 38,
    memoryMb: 44.2,
    testcasesPassed: 42,
    totalTestcases: 42,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    submissionId: 'sub_183402',
    userId: 'usr_demo',
    problemId: 'prob_9',
    problemTitle: 'Maximum Subarray',
    language: 'Python',
    verdict: 'ACCEPTED',
    runtimeMs: 42,
    memoryMb: 24.1,
    testcasesPassed: 38,
    totalTestcases: 38,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    submissionId: 'sub_181190',
    userId: 'usr_demo',
    problemId: 'prob_3',
    problemTitle: 'Longest Substring Without Repeating Characters',
    language: 'JavaScript',
    verdict: 'WRONG_ANSWER',
    runtimeMs: 32,
    memoryMb: 41.0,
    testcasesPassed: 18,
    totalTestcases: 45,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
];

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

    const submissionId = `sub_${Math.floor(100000 + Math.random() * 900000)}`;

    const newRecord = {
      submissionId,
      userId,
      problemId: problem.problemId,
      problemTitle: problemTitle || problem.title,
      language,
      code,
      verdict: evaluation.verdict,
      runtimeMs: evaluation.runtimeMs,
      memoryMb: evaluation.memoryMb,
      testcasesPassed: evaluation.testcasesPassed,
      totalTestcases: evaluation.totalTestcases,
      correctnessScore: evaluation.correctnessScore,
      complexityScore: evaluation.complexityScore,
      finalScore: evaluation.finalScore,
      compilationError: evaluation.compilationError,
      runtimeError: evaluation.runtimeError,
      failedTestcase: evaluation.failedTestcase,
      stdout: evaluation.stdout,
      createdAt: new Date().toISOString()
    };

    submissionHistory.unshift(newRecord);

    res.json({
      message: 'Submission evaluated',
      submission: newRecord
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/submissions/problem/:problemId
router.get('/problem/:problemId', (req, res) => {
  const { problemId } = req.params;
  const list = submissionHistory.filter(
    s => s.problemId === problemId || s.problemTitle?.toLowerCase() === problemId?.toLowerCase()
  );
  res.json({ submissions: list });
});

// @route GET /api/submissions/user/:userId
router.get('/user/:userId', (req, res) => {
  res.json({ submissions: submissionHistory });
});

module.exports = router;

