/**
 * Submission Service
 * Handles code test runs, official grading submissions, and submission histories.
 */

const API_BASE = '/api/submissions';

export const submissionService = {
  /**
   * Run code against public testcases / custom input (Dry run)
   */
  async runCode({ code, language, problemId, customInput }) {
    const res = await fetch(`${API_BASE}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language, problemId, customInput })
    });
    if (!res.ok) throw new Error('Code execution failed');
    return await res.json();
  },

  /**
   * Submit solution for full evaluation against hidden test suite
   */
  async submitSolution({ userId, problemId, problemTitle, code, language }) {
    const res = await fetch(`${API_BASE}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, problemId, problemTitle, code, language })
    });
    if (!res.ok) throw new Error('Submission evaluation failed');
    return await res.json();
  },

  /**
   * Get past submission history for a problem
   */
  async getProblemSubmissions(problemId) {
    try {
      const res = await fetch(`${API_BASE}/problem/${problemId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.submissions || [];
    } catch {
      return [];
    }
  },

  /**
   * Get user overall submissions
   */
  async getUserSubmissions(userId) {
    try {
      const res = await fetch(`${API_BASE}/user/${userId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.submissions || [];
    } catch {
      return [];
    }
  }
};
