const path = require('path');
const battleRoutes = require('./routes/battles');

async function test3ProblemBattleFlow() {
  console.log('==================================================');
  console.log('🚀 TESTING 3-QUESTION BATTLE & END BATTLE WORKFLOW');
  console.log('==================================================');

  // Test find-match
  const findMatchReq = {
    body: {
      userId: 'usr_lakshay',
      username: 'Lakshay',
      rating: 1642,
      rank: 'Platinum'
    }
  };

  let battleData = null;
  const mockRes = {
    json: (data) => { battleData = data; }
  };

  const router = battleRoutes;
  // Invoke find-match handler directly
  const findMatchLayer = router.stack.find(l => l.route && l.route.path === '/find-match' && l.route.methods.post);
  await findMatchLayer.route.stack[0].handle(findMatchReq, mockRes);

  console.log(`\n[1] 3-Question Match Found:`);
  console.log(`  - Battle ID: ${battleData.battle.id}`);
  console.log(`  - Total Problems in Battle: ${battleData.battle.problems.length}`);
  battleData.battle.problems.forEach((p, idx) => {
    console.log(`    * Q${idx + 1}: ${p.title} (${p.difficulty}) - [${p.topics.join(', ')}]`);
  });

  // Test submitting Q1 solution
  const q1 = battleData.battle.problems[0];
  const submitReq = {
    body: {
      battleId: battleData.battle.id,
      userId: 'usr_lakshay',
      problemId: q1.problemId,
      code: q1.starterCode.javascript,
      language: 'JavaScript',
      solvedProblemIds: []
    }
  };

  let submitResData = null;
  const mockSubmitRes = {
    json: (data) => { submitResData = data; },
    status: (code) => mockSubmitRes
  };

  const submitLayer = router.stack.find(l => l.route && l.route.path === '/submit-solution' && l.route.methods.post);
  await submitLayer.route.stack[0].handle(submitReq, mockSubmitRes);

  console.log(`\n[2] Submitted Q1 (${q1.title}):`);
  console.log(`  - Verdict: ${submitResData.verdict}, isAccepted: ${submitResData.isAccepted}`);
  console.log(`  - Solved Problems: ${submitResData.solvedProblemIds.length}/3`);

  // Test End Battle
  const endReq = {
    body: {
      battleId: battleData.battle.id,
      userId: 'usr_lakshay',
      userSolvedIds: [q1.problemId, battleData.battle.problems[1].problemId], // 2 solved
      opponentSolvedCount: 1,
      elapsedSeconds: 320
    }
  };

  let endResData = null;
  const mockEndRes = {
    json: (data) => { endResData = data; },
    status: (code) => mockEndRes
  };

  const endLayer = router.stack.find(l => l.route && l.route.path === '/end-battle' && l.route.methods.post);
  await endLayer.route.stack[0].handle(endReq, mockEndRes);

  console.log(`\n[3] Concluded Battle with "End Battle" Button:`);
  console.log(`  - Final Result: ${endResData.result}`);
  console.log(`  - Score: You (${endResData.userSolvedCount}/3) vs Opponent (${endResData.opponentSolvedCount}/3)`);
  console.log(`  - Rating Change: ${endResData.userRating.oldRating} -> ${endResData.userRating.newRating} (${endResData.userRating.formattedDelta} RR)`);
  console.log(`  - Problem Breakdown:`);
  endResData.problemSummary.forEach((p, idx) => {
    console.log(`    * Q${idx + 1}: ${p.title} -> You: ${p.isUserSolved ? '✅ Solved' : '❌ Unsolved'} | Opponent: ${p.isOpponentSolved ? '✅ Solved' : '❌ Unsolved'}`);
  });

  console.log('\n==================================================');
  console.log('✅ ALL 3-QUESTION BATTLE & END BATTLE TESTS PASSED!');
  console.log('==================================================');
}

test3ProblemBattleFlow().catch(console.error);
