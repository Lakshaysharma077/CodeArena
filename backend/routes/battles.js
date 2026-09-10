const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');
const { calculateBattleRatingDelta, getRankByRating } = require('../utils/ratingCalculator');
const { evaluateSubmission } = require('../utils/judgeEngine');
const { SEED_PROBLEMS } = require('../data/seedProblems');
const { dataStore } = require('../data/store');
const { getIsInMemoryMode } = require('../config/db');

const activeBattles = new Map();
const privateRooms = new Map();

// Helper to fetch user
const fetchUser = async (userId, defaultName) => {
  if (getIsInMemoryMode()) {
    return dataStore.getUser(userId) || { id: userId, username: defaultName, rating: 1200, rank: 'Bronze', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', college: 'Unknown', country: 'Unknown' };
  }
  const user = await User.findById(userId);
  if (user) {
    return {
      id: user._id.toString(),
      username: user.username,
      rating: user.rating,
      rank: user.rank,
      avatar: user.avatar,
      college: user.college,
      country: user.country
    };
  }
  return { id: userId, username: defaultName, rating: 1200, rank: 'Bronze', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', college: 'Unknown', country: 'Unknown' };
};

// @route POST /api/battles/create-private
router.post('/create-private', async (req, res) => {
  try {
    const { userId = 'usr_demo', username = 'Player1' } = req.body;
    const creator = await fetchUser(userId, username);
    
    // Generate 6 character alphanumeric code
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    privateRooms.set(roomId, {
      roomId,
      creator,
      status: 'WAITING',
      battleId: null,
      createdAt: new Date()
    });
    
    res.json({ roomId, message: 'Private room created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/battles/join-private
router.post('/join-private', async (req, res) => {
  try {
    const { roomId, userId = 'usr_joiner', username = 'Challenger' } = req.body;
    
    const room = privateRooms.get(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found or expired' });
    }
    if (room.status !== 'WAITING') {
      return res.status(400).json({ message: 'Room is already full or started' });
    }

    const joiner = await fetchUser(userId, username);
    
    const battleId = `battle_pvt_${Math.floor(100000 + Math.random() * 900000)}`;

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
      battleNumber: battleId.replace('battle_pvt_', '#PVT-'),
      status: 'IN_PROGRESS',
      startedAt: new Date(),
      durationSeconds: 900,
      problems: selectedProblems,
      problem: selectedProblems[0],
      player1: {
        userId: room.creator.id,
        username: room.creator.username,
        rank: room.creator.rank,
        rating: room.creator.rating,
        avatar: room.creator.avatar,
        college: room.creator.college,
        country: room.creator.country,
        status: 'CODING',
        solvedCount: 0,
        solvedProblemIds: [],
        testcasesPassed: 0,
        totalTestcases: 42,
        runtimeMs: 0
      },
      player2: {
        userId: joiner.id,
        username: joiner.username,
        rank: joiner.rank,
        rating: joiner.rating,
        avatar: joiner.avatar,
        college: joiner.college,
        country: joiner.country,
        status: 'CODING',
        solvedCount: 0,
        solvedProblemIds: [],
        testcasesPassed: 0,
        totalTestcases: 42,
        runtimeMs: 0
      },
      ratingDiff: Math.abs(room.creator.rating - joiner.rating)
    };

    activeBattles.set(battleId, battleSession);
    
    room.status = 'STARTED';
    room.battleId = battleId;
    room.battle = battleSession;

    res.json({
      message: 'Joined successfully! Battle starting...',
      battle: battleSession
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/battles/find-match
router.post('/find-match', async (req, res) => {
  try {
    const { userId = 'usr_demo', username = 'Player1' } = req.body;
    const currentUser = await fetchUser(userId, username);

    let opponent;
    if (getIsInMemoryMode()) {
      const allUsers = Array.from(dataStore.users.values()).filter(u => u.id !== currentUser.id);
      const sortedByDiff = [...allUsers].sort((a, b) => Math.abs(a.rating - currentUser.rating) - Math.abs(b.rating - currentUser.rating));
      opponent = sortedByDiff[0];
    } else {
      const allUsers = await User.find({ _id: { $ne: userId } }).lean();
      const sortedByDiff = [...allUsers].sort((a, b) => Math.abs(a.rating - currentUser.rating) - Math.abs(b.rating - currentUser.rating));
      if (sortedByDiff.length > 0) {
        opponent = {
          id: sortedByDiff[0]._id.toString(),
          username: sortedByDiff[0].username,
          rating: sortedByDiff[0].rating,
          rank: sortedByDiff[0].rank,
          avatar: sortedByDiff[0].avatar,
          college: sortedByDiff[0].college,
          country: sortedByDiff[0].country
        };
      }
    }

    if (!opponent) {
      opponent = {
        id: 'usr_void',
        username: 'voidwalker',
        rating: 1678,
        rank: 'Platinum',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        college: 'Waterloo',
        country: 'Canada'
      };
    }

    const battleId = `battle_${Math.floor(100000 + Math.random() * 900000)}`;

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
      durationSeconds: 900,
      problems: selectedProblems,
      problem: selectedProblems[0],
      player1: {
        userId: currentUser.id,
        username: currentUser.username,
        rank: currentUser.rank,
        rating: currentUser.rating,
        status: 'CODING',
        solvedCount: 0,
        solvedProblemIds: [],
        testcasesPassed: 0,
        totalTestcases: 42,
        runtimeMs: 0
      },
      player2: {
        userId: opponent.id,
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
      ratingDiff: Math.abs(currentUser.rating - opponent.rating)
    };

    activeBattles.set(battleId, battleSession);

    res.json({
      message: 'Match found! 3-Problem Battle starting in 3 seconds...',
      battle: battleSession
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

// @route POST /api/battles/submit-solution
router.post('/submit-solution', async (req, res) => {
  try {
    const { battleId, userId = 'usr_demo', problemId, code, language = 'JavaScript', elapsedSeconds = 240, solvedProblemIds = [] } = req.body;

    let targetProblem = SEED_PROBLEMS.find(p => p.problemId === problemId) || SEED_PROBLEMS[0];

    const evaluation = await evaluateSubmission({ code, language: language.toLowerCase(), problem: targetProblem });

    const isAccepted = evaluation.verdict === 'ACCEPTED';
    const updatedSolvedIds = isAccepted && !solvedProblemIds.includes(targetProblem.problemId)
      ? [...solvedProblemIds, targetProblem.problemId]
      : solvedProblemIds;

    if (getIsInMemoryMode()) {
      dataStore.addSubmission({
        submissionId: `sub_${Date.now()}`,
        userId, problemId: targetProblem.problemId, problemTitle: targetProblem.title,
        language, code, verdict: evaluation.verdict, runtimeMs: evaluation.runtimeMs,
        memoryMb: evaluation.memoryMb, testcasesPassed: evaluation.testcasesPassed,
        totalTestcases: evaluation.totalTestcases, createdAt: new Date().toISOString()
      });
    } else {
      const dbProb = await require('../models/Problem').findOne({ problemId: targetProblem.problemId });
      if (dbProb) {
        await Submission.create({
          user: userId,
          username: 'BattleUser',
          problem: dbProb._id,
          problemTitle: dbProb.title,
          code, language, verdict: evaluation.verdict,
          runtimeMs: evaluation.runtimeMs, memoryMb: evaluation.memoryMb,
          testcasesPassed: evaluation.testcasesPassed, totalTestcases: evaluation.totalTestcases
        });
      }
    }

    res.json({
      verdict: evaluation.verdict,
      isAccepted, problemId: targetProblem.problemId, problemTitle: targetProblem.title,
      runtimeMs: evaluation.runtimeMs, memoryMb: evaluation.memoryMb,
      testcasesPassed: evaluation.testcasesPassed, totalTestcases: evaluation.totalTestcases,
      compilationError: evaluation.compilationError, runtimeError: evaluation.runtimeError,
      failedTestcase: evaluation.failedTestcase, stdout: evaluation.stdout,
      solvedProblemIds: updatedSolvedIds, userSolvedCount: updatedSolvedIds.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/battles/end-battle
router.post('/end-battle', async (req, res) => {
  try {
    const { battleId, userId = 'usr_demo', userSolvedIds = [], opponentSolvedCount: reqOpponentSolvedCount = null, elapsedSeconds = 360 } = req.body;

    let battle = activeBattles.get(battleId);
    if (!battle) {
      battle = {
        id: battleId || 'battle_demo',
        player1: { userId, username: 'Player', rating: 1200, rank: 'Bronze' },
        player2: { userId: 'usr_void', username: 'voidwalker', rating: 1678, rank: 'Platinum' },
        problems: SEED_PROBLEMS.slice(0, 3)
      };
    }

    const userCount = userSolvedIds.length;
    let oppCount = reqOpponentSolvedCount !== null
      ? reqOpponentSolvedCount
      : (elapsedSeconds > 450 ? 2 : (elapsedSeconds > 160 ? 1 : 0));

    let isWinner = false, isDraw = false;
    if (userCount > oppCount) isWinner = true;
    else if (userCount < oppCount) isWinner = false;
    else { if (userCount > 0) isWinner = true; else isDraw = true; }

    const ratingCalc = calculateBattleRatingDelta({
      userRating: battle.player1.rating, opponentRating: battle.player2.rating,
      isWinner, isDraw, runtimeMs: 32, memoryMb: 24,
      isFirstAttemptAC: userCount >= 2, wrongAttemptsCount: userCount === 0 ? 1 : 0,
      testcasesPassed: userCount * 14, totalTestcases: 42
    });

    if (userCount === 3 && isWinner) {
      ratingCalc.totalDelta += 10;
      ratingCalc.newRating += 10;
    }

    const oldRankInfo = getRankByRating(battle.player1.rating);
    const newRankInfo = getRankByRating(ratingCalc.newRating);
    const isPromoted = oldRankInfo.name !== newRankInfo.name && ratingCalc.newRating > battle.player1.rating;

    if (getIsInMemoryMode()) {
      dataStore.recordBattleResult({
        userId: battle.player1.userId, opponentUsername: battle.player2.username,
        opponentRating: battle.player2.rating, result: isWinner ? 'VICTORY' : (isDraw ? 'DRAW' : 'DEFEAT'),
        ratingDelta: ratingCalc.totalDelta, newRating: ratingCalc.newRating,
        newRank: newRankInfo.name, problemTitles: battle.problems ? battle.problems.map(p => p.title) : ['Battle']
      });
    } else {
      const userDoc = await User.findById(battle.player1.userId);
      if (userDoc) {
        userDoc.rating = ratingCalc.newRating;
        userDoc.rank = newRankInfo.name;
        
        if (isWinner) {
          userDoc.stats.winCount = (userDoc.stats.winCount || 0) + 1;
          userDoc.stats.currentStreak = (userDoc.stats.currentStreak || 0) + 1;
          if (userDoc.stats.currentStreak > (userDoc.stats.bestStreak || 0)) {
            userDoc.stats.bestStreak = userDoc.stats.currentStreak;
          }
        } else if (!isDraw) {
          userDoc.stats.lossCount = (userDoc.stats.lossCount || 0) + 1;
          userDoc.stats.currentStreak = 0;
        }

        const totalGames = (userDoc.stats.winCount || 0) + (userDoc.stats.lossCount || 0);
        userDoc.stats.winRate = totalGames > 0 ? Math.round((userDoc.stats.winCount / totalGames) * 100) : 0;
        
        userDoc.recentMatches.unshift({
          opponent: battle.player2.username,
          opponentRating: battle.player2.rating,
          result: isWinner ? 'WIN' : (isDraw ? 'DRAW' : 'LOSS'),
          ratingChange: ratingCalc.totalDelta,
          problemTitle: battle.problems ? battle.problems[0].title : 'Battle',
          date: new Date()
        });
        if (userDoc.recentMatches.length > 8) userDoc.recentMatches.pop();

        userDoc.ratingHistory = userDoc.ratingHistory || [];
        userDoc.ratingHistory.push({ date: new Date().toLocaleDateString(), rating: ratingCalc.newRating });
        if (userDoc.ratingHistory.length > 10) userDoc.ratingHistory.shift();

        await userDoc.save();
      }
    }

    const problemSummary = (battle.problems || []).map((p, idx) => ({
      problemId: p.problemId, title: p.title, difficulty: p.difficulty,
      isUserSolved: userSolvedIds.includes(p.problemId), isOpponentSolved: idx < oppCount
    }));

    res.json({
      battleId: battle.id,
      winnerId: isWinner ? userId : (isDraw ? 'DRAW' : battle.player2.userId),
      result: isWinner ? 'VICTORY' : (isDraw ? 'DRAW' : 'DEFEAT'),
      userSolvedCount: userCount, opponentSolvedCount: oppCount, totalProblems: 3, problemSummary,
      userRating: {
        oldRating: battle.player1.rating, newRating: ratingCalc.newRating,
        delta: ratingCalc.totalDelta, formattedDelta: ratingCalc.totalDelta > 0 ? `+${ratingCalc.totalDelta}` : `${ratingCalc.totalDelta}`
      },
      opponentRating: {
        oldRating: battle.player2.rating, newRating: ratingCalc.newOpponentRating,
        delta: ratingCalc.opponentDelta, formattedDelta: ratingCalc.opponentDelta > 0 ? `+${ratingCalc.opponentDelta}` : `${ratingCalc.opponentDelta}`,
        username: battle.player2.username
      },
      oldRank: oldRankInfo.name, newRank: newRankInfo.name, isPromoted,
      performance: {
        timeElapsed: `${Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')}:${(elapsedSeconds % 60).toString().padStart(2, '0')}`,
        score: `${userCount} / 3 Solved`, opponentScore: `${oppCount} / 3 Solved`,
        accuracy: userCount === 3 ? '100% (Sweep!)' : (userCount === 2 ? '67%' : (userCount === 1 ? '33%' : '0%'))
      },
      breakdown: {
        baseDelta: ratingCalc.baseDelta, speedBonus: ratingCalc.speedBonus,
        cleanAttemptBonus: userCount === 3 ? 10 : ratingCalc.cleanAttemptBonus, attemptPenalty: ratingCalc.attemptPenalty, expectedWinProb: ratingCalc.expectedWinProb
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
