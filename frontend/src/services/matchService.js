/**
 * Match Service
 * Handles matchmaking queue, battle session polling, opponent live status, and match submissions.
 */

const API_BASE = '/api/battles';

export const matchService = {
  /**
   * Enter ranked matchmaking queue
   */
  async findMatch({ userId, username, rating, rank }) {
    const res = await fetch(`${API_BASE}/find-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, username, rating, rank })
    });
    if (!res.ok) throw new Error('Failed to find ranked match');
    return await res.json();
  },

  /**
   * Fetch active battle session details
   */
  async getBattle(battleId) {
    const res = await fetch(`${API_BASE}/${battleId}`);
    if (!res.ok) throw new Error('Battle session not found');
    return await res.json();
  },

  /**
   * Fetch opponent real-time activity status telemetry
   */
  async getOpponentStatus(battleId, elapsedSeconds = 0) {
    try {
      const res = await fetch(`${API_BASE}/${battleId}/opponent-status?elapsedSeconds=${elapsedSeconds}`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return {
        opponentStatus: 'Coding...',
        testcasesPassed: 0,
        totalTestcases: 42,
        hasSubmitted: false
      };
    }
  },

  /**
   * Submit battle problem solution for test evaluation
   */
  async submitBattleSolution({ battleId, userId, problemId, code, language, elapsedSeconds, solvedProblemIds }) {
    const res = await fetch(`${API_BASE}/submit-solution`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ battleId, userId, problemId, code, language, elapsedSeconds, solvedProblemIds })
    });
    if (!res.ok) throw new Error('Battle solution evaluation failed');
    return await res.json();
  },

  /**
   * Conclude 3-problem battle and resolve Elo ratings
   */
  async endBattle({ battleId, userId, userSolvedIds, opponentSolvedCount, elapsedSeconds }) {
    const res = await fetch(`${API_BASE}/end-battle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ battleId, userId, userSolvedIds, opponentSolvedCount, elapsedSeconds })
    });
    if (!res.ok) throw new Error('End battle calculation failed');
    return await res.json();
  }
};
