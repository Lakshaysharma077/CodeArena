/**
 * User Service
 * Handles user dashboard stats, topic proficiency metrics, and career achievements.
 */

const API_BASE = '/api/user';

export const userService = {
  async getDashboard(userId) {
    const token = localStorage.getItem('codearena_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (userId) headers['x-user-id'] = userId;

    const url = userId ? `${API_BASE}/dashboard?userId=${userId}` : `${API_BASE}/dashboard`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('Failed to fetch user dashboard');
    return await res.json();
  }
};
