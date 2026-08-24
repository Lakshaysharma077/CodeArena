/**
 * Leaderboard Service
 * Handles competitive leaderboard queries with categories, country, college, and tier filters.
 */

const API_BASE = '/api/leaderboard';

export const leaderboardService = {
  async getLeaderboard({ category = 'Global', country, college, rankFilter, sortBy = 'rating' } = {}) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (country) params.append('country', country);
    if (college) params.append('college', college);
    if (rankFilter) params.append('rankFilter', rankFilter);
    if (sortBy) params.append('sortBy', sortBy);

    const res = await fetch(`${API_BASE}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return await res.json();
  }
};
