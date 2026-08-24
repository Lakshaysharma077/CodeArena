const express = require('express');
const router = express.Router();
const { calculateBattleRatingDelta, getRankByRating } = require('../utils/ratingCalculator');
const { evaluateSubmission } = require('../utils/judgeEngine');
const { SEED_PROBLEMS } = require('../data/seedProblems');

// Realistic opponent pool with diverse rankings and playstyles
const MOCK_OPPONENTS = [
  { userId: 'bot_voidwalker', username: 'voidwalker', rating: 1678, rank: 'Platinum', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80', college: 'Waterloo', country: 'Canada', speedTier: 'fast' },
  { userId: 'bot_cyberviper', username: 'CyberViper', rating: 1640, rank: 'Platinum', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80', college: 'Stanford', country: 'United States', speedTier: 'balanced' },
  { userId: 'bot_shadowcoder', username: 'ShadowCoder_99', rating: 1590, rank: 'Gold', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', college: 'IIT Delhi', country: 'India', speedTier: 'deliberate' },
  { userId: 'bot_algogod', username: 'AlgoGod_X', rating: 1720, rank: 'Platinum', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80', college: 'TU Munich', country: 'Germany', speedTier: 'fast' },
  { userId: 'bot_krypton', username: 'KryptonByte', rating: 1810, rank: 'Diamond', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80', college: 'MIT', country: 'United States', speedTier: 'expert' }
];

const activeBattles = new Map();

// @route POST /api/battles/find-match
router.post('/find-match', (req, res) => {
  const { userId = 'usr_demo', username = 'Lakshay', rating = 1642, rank = 'Platinum' } = req.body;

  // Pick closest matched opponent based on rating difference
  const sortedByRatingDiff = [...MOCK_OPPONENTS].sort(
    (a, b) => Math.abs(a.rating - rating) - Math.abs(b.rating - rating)
  );
  const opponent = sortedByRatingDiff[0] || MOCK_OPPONENTS[0];

  const battleId = `battle_${Math.floor(100000 + Math.random() * 900000)}`;

  // Select 3 distinct problems: 1 Easy, 1 Medium, 1 Hard/Medium
  const easyProblems = SEED_PROBLEMS.filter(p => p.difficulty === 'Easy');
  const medProblems = SEED_PROBLEMS.filter(p => p.difficulty === 'Medium');
  const hardProblems = SEED_PROBLEMS.filter(p => p.difficulty === 'Hard');

  const p1 = easyProblems[Math.floor(Math.random() * easyProblems.length)] || SEED_PROBLEMS[0];
  const p2 = medProblems[Math.floor(Math.random() * medProblems.length)] || SEED_PROBLEMS[1] || SEED_PROBLEMS[0];
  const p3 = (hardProblems.length > 0 ? hardProblems[Math.floor(Math.random() * hardProblems.length)] : null) || medProblems[Math.floor(Math.random() * medProblems.length)] || SEED_PROBLEMS[2];

  const cleanProblem = (p) => ({
    problemId: p.problemId,
    title: p.title,
    slug: p.slug,
    difficulty: p.difficulty,
    topics: p.topics,
    description: p.description,
    constraints: p.constraints,
    examples: p.examples,
    starterCode: p.starterCode,
    supportedLanguages: p.supportedLanguages,
    expectedComplexity: p.expectedComplexity
  });

  const selectedProblems = [cleanProblem(p1), cleanProblem(p2), cleanProblem(p3)];

  const battleSession = {
    id: battleId,
    battleNumber: battleId.replace('battle_', '#'),
    status: 'IN_PROGRESS',
    startedAt: new Date(),
    durationSeconds: 900, // 15:00
    problems: selectedProblems,
    problem: selectedProblems[0], // primary for backwards compatibility
    player1: {
      userId,
      username,
      rank,
      rating,
      status: 'CODING',
      solvedCount: 0,
      solvedProblemIds: [],
      testcasesPassed: 0,
      totalTestcases: 42,
      runtimeMs: 0
    },
    player2: {
      userId: opponent.userId,
      username: opponent.username,
      rank: opponent.rank,
      rating: opponent.rating,
      avatar: opponent.avatar,
      college: opponent.college,
      country: opponent.country,
      status: 'CODING',
      solvedCount: 0,
      solvedProblemIds: [],
      testcasesPassed: 0,
      totalTestcases: 42,
      runtimeMs: 0
    },
    ratingDiff: Math.abs(rating - opponent.rating)
  };

  activeBattles.set(battleId, battleSession);

  res.json({
    message: 'Match found! 3-Problem Battle starting in 3 seconds...',
    battle: battleSession
  });
});

// @route GET /api/battles/:id
router.get('/:id', (req, res) => {
  const battle = activeBattles.get(req.params.id);
  if (!battle) {
    return res.status(404).json({ message: 'Battle session not found' });
  }
  res.json(battle);
});

// @route GET /api/battles/:id/opponent-status
router.get('/:id/opponent-status', (req, res) => {
  const { id } = req.params;
  const { elapsedSeconds = 0 } = req.query;
  const elapsed = parseInt(elapsedSeconds) || 0;
  const battle = activeBattles.get(id);

  const probTitles = battle?.problems?.map(p => p.title) || ['Two Sum', 'Maximum Subarray', 'Merge Intervals'];

  // Realistic progressive simulated opponent telemetry across 3 questions
  let status = 'Coding Question 1...';
  let testcasesPassed = 0;
  let opponentSolvedCount = 0;
  let opponentSolvedProblemIds = [];
  let hasSubmitted = false;

  if (elapsed > 600) {
    status = `Solved 2/3 Questions! Finalizing Q3 (${probTitles[2] || 'Q3'})...`;
    testcasesPassed = 39;
    opponentSolvedCount = 2;
    opponentSolvedProblemIds = [battle?.problems?.[0]?.problemId || 'prob_1', battle?.problems?.[1]?.problemId || 'prob_2'];
  } else if (elapsed > 450) {
    status = `Solved Q2 (${probTitles[1] || 'Q2'})! Working on Q3...`;
    testcasesPassed = 42;
    opponentSolvedCount = 2;
    opponentSolvedProblemIds = [battle?.problems?.[0]?.problemId || 'prob_1', battle?.problems?.[1]?.problemId || 'prob_2'];
  } else if (elapsed > 300) {
    status = `Testing Q2 (${probTitles[1] || 'Q2'}) testcases (31/42 passed)...`;
    testcasesPassed = 31;
    opponentSolvedCount = 1;
    opponentSolvedProblemIds = [battle?.problems?.[0]?.problemId || 'prob_1'];
  } else if (elapsed > 160) {
    status = `Solved Q1 (${probTitles[0] || 'Q1'})! Switching to Q2...`;
    testcasesPassed = 42;
    opponentSolvedCount = 1;
    opponentSolvedProblemIds = [battle?.problems?.[0]?.problemId || 'prob_1'];
  } else if (elapsed > 75) {
    status = `Testing Q1 (${probTitles[0] || 'Q1'}) public cases...`;
    testcasesPassed = 12;
  } else if (elapsed > 25) {
    status = `Writing algorithmic logic for Q1 (${probTitles[0] || 'Q1'})...`;
  } else {
    status = 'Reading problem constraints...';
  }

  res.json({
    battleId: id,
    opponentStatus: status,
    testcasesPassed,
    totalTestcases: 42,
    opponentSolvedCount,
    opponentSolvedProblemIds,
    hasSubmitted,
    pingMs: 24
  });
});

// @route POST /api/battles/submit-solution (Submit solution for an individual problem in the battle)
router.post('/submit-solution', async (req, res) => {
  try {
    const {
      battleId,
      userId = 'usr_demo',
      problemId,
      code,
      language = 'JavaScript',
      elapsedSeconds = 240,
      solvedProblemIds = []
    } = req.body;

    let battle = activeBattles.get(battleId);
    let targetProblem = battle?.problems?.find(p => p.problemId === problemId) || SEED_PROBLEMS.find(p => p.problemId === problemId) || SEED_PROBLEMS[0];

    // Evaluate solution with compiler judge engine
    const evaluation = await evaluateSubmission({
      code,
      language: language.toLowerCase(),
      problem: targetProblem
    });

    const isAccepted = evaluation.verdict === 'ACCEPTED';
    const updatedSolvedIds = isAccepted && !solvedProblemIds.includes(targetProblem.problemId)
      ? [...solvedProblemIds, targetProblem.problemId]
      : solvedProblemIds;

    res.json({
      verdict: evaluation.verdict,
      isAccepted,
      problemId: targetProblem.problemId,
      problemTitle: targetProblem.title,
      runtimeMs: evaluation.runtimeMs,
      memoryMb: evaluation.memoryMb,
      testcasesPassed: evaluation.testcasesPassed,
      totalTestcases: evaluation.totalTestcases,
      compilationError: evaluation.compilationError,
      runtimeError: evaluation.runtimeError,
      failedTestcase: evaluation.failedTestcase,
      stdout: evaluation.stdout,
      solvedProblemIds: updatedSolvedIds,
      userSolvedCount: updatedSolvedIds.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/battles/end-battle (Conclude 3-problem battle and calculate Elo rating change)
router.post('/end-battle', async (req, res) => {
  try {
    const {
      battleId,
      userId = 'usr_demo',
      userSolvedIds = [],
      opponentSolvedCount: reqOpponentSolvedCount = null,
      elapsedSeconds = 360
    } = req.body;

    let battle = activeBattles.get(battleId);
    if (!battle) {
      battle = {
        id: battleId || 'battle_demo',
        player1: { userId, username: 'Lakshay', rating: 1642, rank: 'Platinum' },
        player2: { userId: 'bot_voidwalker', username: 'voidwalker', rating: 1678, rank: 'Platinum' },
        problems: SEED_PROBLEMS.slice(0, 3)
      };
    }

    const userCount = userSolvedIds.length;
    // Calculate opponent solved count based on elapsed time if not provided
    let oppCount = reqOpponentSolvedCount !== null
      ? reqOpponentSolvedCount
      : (elapsedSeconds > 450 ? 2 : (elapsedSeconds > 160 ? 1 : 0));

    let isWinner = false;
    let isDraw = false;

    if (userCount > oppCount) {
      isWinner = true;
    } else if (userCount < oppCount) {
      isWinner = false;
    } else {
      // Tie breaker: if user solved >= 1 and finished, award slight win or draw
      if (userCount > 0) {
        isWinner = true; // User finished ahead
      } else {
        isDraw = true;
      }
    }

    const ratingCalc = calculateBattleRatingDelta({
      userRating: battle.player1.rating,
      opponentRating: battle.player2.rating,
      isWinner,
      isDraw,
      runtimeMs: 32,
      memoryMb: 24,
      isFirstAttemptAC: userCount >= 2,
      wrongAttemptsCount: userCount === 0 ? 1 : 0,
      testcasesPassed: userCount * 14,
      totalTestcases: 42
    });

    // Special 3-Question Battle Bonus
    if (userCount === 3 && isWinner) {
      ratingCalc.totalDelta += 10; // Perfect 3/3 sweep bonus!
      ratingCalc.newRating += 10;
    }

    const oldRankInfo = getRankByRating(battle.player1.rating);
    const newRankInfo = getRankByRating(ratingCalc.newRating);
    const isPromoted = oldRankInfo.name !== newRankInfo.name && ratingCalc.newRating > battle.player1.rating;

    const problemSummary = (battle.problems || []).map((p, idx) => ({
      problemId: p.problemId,
      title: p.title,
      difficulty: p.difficulty,
      isUserSolved: userSolvedIds.includes(p.problemId),
      isOpponentSolved: idx < oppCount
    }));

    const result = {
      battleId: battle.id,
      winnerId: isWinner ? userId : (isDraw ? 'DRAW' : battle.player2.userId),
      result: isWinner ? 'VICTORY' : (isDraw ? 'DRAW' : 'DEFEAT'),
      userSolvedCount: userCount,
      opponentSolvedCount: oppCount,
      totalProblems: 3,
      problemSummary,
      userRating: {
        oldRating: battle.player1.rating,
        newRating: ratingCalc.newRating,
        delta: ratingCalc.totalDelta,
        formattedDelta: ratingCalc.totalDelta > 0 ? `+${ratingCalc.totalDelta}` : `${ratingCalc.totalDelta}`
      },
      opponentRating: {
        oldRating: battle.player2.rating,
        newRating: ratingCalc.newOpponentRating,
        delta: ratingCalc.opponentDelta,
        formattedDelta: ratingCalc.opponentDelta > 0 ? `+${ratingCalc.opponentDelta}` : `${ratingCalc.opponentDelta}`,
        username: battle.player2.username
      },
      oldRank: oldRankInfo.name,
      newRank: newRankInfo.name,
      isPromoted,
      performance: {
        timeElapsed: `${Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')}:${(elapsedSeconds % 60).toString().padStart(2, '0')}`,
        score: `${userCount} / 3 Solved`,
        opponentScore: `${oppCount} / 3 Solved`,
        accuracy: userCount === 3 ? '100% (Sweep!)' : (userCount === 2 ? '67%' : (userCount === 1 ? '33%' : '0%'))
      },
      breakdown: {
        baseDelta: ratingCalc.baseDelta,
        speedBonus: ratingCalc.speedBonus,
        cleanAttemptBonus: userCount === 3 ? 10 : ratingCalc.cleanAttemptBonus,
        attemptPenalty: ratingCalc.attemptPenalty,
        expectedWinProb: ratingCalc.expectedWinProb
      }
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

