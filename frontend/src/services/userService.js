/**
 * User Service
 * Handles user dashboard stats, topic proficiency metrics, and career achievements.
 */

const API_BASE = '/api/user';

export const userService = {
  async getDashboard() {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch user dashboard');
    return await res.json();
  }
};
