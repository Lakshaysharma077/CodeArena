/**
 * CodeArena Elo Rating Engine & Tier Resolver
 * Implements competitive Elo rating calculation with performance multipliers.
 */

const RANKS = [
  { name: 'Bronze', minRating: 0, maxRating: 1199, color: '#CD7F32', gradient: 'from-amber-700 to-amber-900', bgGlow: 'rgba(205, 127, 50, 0.2)' },
  { name: 'Silver', minRating: 1200, maxRating: 1399, color: '#94A3B8', gradient: 'from-slate-400 to-slate-600', bgGlow: 'rgba(148, 163, 184, 0.2)' },
  { name: 'Gold', minRating: 1400, maxRating: 1599, color: '#F59E0B', gradient: 'from-yellow-400 to-amber-600', bgGlow: 'rgba(245, 158, 11, 0.2)' },
  { name: 'Platinum', minRating: 1600, maxRating: 1799, color: '#06B6D4', gradient: 'from-cyan-400 to-blue-600', bgGlow: 'rgba(6, 182, 212, 0.2)' },
  { name: 'Diamond', minRating: 1800, maxRating: 1999, color: '#8B5CF6', gradient: 'from-purple-400 to-indigo-600', bgGlow: 'rgba(139, 92, 246, 0.2)' },
  { name: 'Master', minRating: 2000, maxRating: 2199, color: '#EC4899', gradient: 'from-pink-500 to-rose-600', bgGlow: 'rgba(236, 72, 153, 0.2)' },
  { name: 'Crown', minRating: 2200, maxRating: 2399, color: '#EAB308', gradient: 'from-amber-300 via-yellow-500 to-orange-600', bgGlow: 'rgba(234, 179, 8, 0.25)' },
  { name: 'Conqueror', minRating: 2400, maxRating: 9999, color: '#EF4444', gradient: 'from-red-500 via-rose-600 to-purple-800', bgGlow: 'rgba(239, 68, 68, 0.3)' }
];

const getRankByRating = (rating) => {
  const currentRating = Math.max(0, Math.round(rating));
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (currentRating >= RANKS[i].minRating) {
      const rank = RANKS[i];
      const nextRank = RANKS[i + 1] || null;
      const tierRange = nextRank ? (nextRank.minRating - rank.minRating) : 400;
      const progressInTier = nextRank ? currentRating - rank.minRating : 400;
      const progressPct = nextRank ? Math.min(100, Math.round((progressInTier / tierRange) * 100)) : 100;
      const pointsToNextTier = nextRank ? Math.max(0, nextRank.minRating - currentRating) : 0;

      return {
        ...rank,
        progressPct,
        pointsToNextTier,
        nextTierName: nextRank ? nextRank.name : 'Max Tier'
      };
    }
  }
  return RANKS[0];
};

/**
 * Standard ELO rating delta with performance bonuses:
 * Expected Win Probability: E = 1 / (1 + 10^((R_opponent - R_user) / 400))
 */
const calculateBattleRatingDelta = ({
  userRating,
  opponentRating,
  isWinner,
  isDraw = false,
  runtimeMs = 0,
  memoryMb = 0,
  isFirstAttemptAC = true,
  wrongAttemptsCount = 0,
  testcasesPassed = 42,
  totalTestcases = 42
}) => {
  const K = 32; // K-factor
  const expectedUser = 1 / (1 + Math.pow(10, (opponentRating - userRating) / 400));
  const expectedOpponent = 1 - expectedUser;

  const actualScore = isWinner ? 1.0 : (isDraw ? 0.5 : 0.0);
  let baseDelta = Math.round(K * (actualScore - expectedUser));

  // Ensure minimum delta for a win
  if (isWinner && baseDelta < 15) baseDelta = 16;
  if (!isWinner && !isDraw && baseDelta > -10) baseDelta = -12;

  // Performance modifiers
  let speedBonus = 0;
  if (isWinner && runtimeMs > 0 && runtimeMs < 45) {
    speedBonus = 5;
  }

  let cleanAttemptBonus = 0;
  if (isWinner && isFirstAttemptAC && wrongAttemptsCount === 0) {
    cleanAttemptBonus = 6;
  }

  let partialCredit = 0;
  if (!isWinner && totalTestcases > 0) {
    const passRatio = testcasesPassed / totalTestcases;
    if (passRatio >= 0.75) {
      partialCredit = 4; // Mitigate loss penalty if high testcase completion
    }
  }

  const attemptPenalty = wrongAttemptsCount * 2;

  const totalDelta = isWinner
    ? Math.max(10, baseDelta + speedBonus + cleanAttemptBonus - attemptPenalty)
    : (isDraw ? 0 : Math.min(-5, baseDelta + partialCredit - attemptPenalty));

  const newRating = Math.max(0, userRating + totalDelta);
  const opponentDelta = -totalDelta;
  const newOpponentRating = Math.max(0, opponentRating + opponentDelta);

  return {
    totalDelta,
    baseDelta,
    speedBonus,
    cleanAttemptBonus,
    attemptPenalty,
    partialCredit,
    newRating,
    opponentDelta,
    newOpponentRating,
    expectedWinProb: Math.round(expectedUser * 100)
  };
};

module.exports = {
  RANKS,
  getRankByRating,
  calculateBattleRatingDelta
};

