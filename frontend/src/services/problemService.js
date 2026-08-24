/**
 * Problem Service
 * Handles problem catalog queries, problem detail lookups, metadata tags, and editorial data.
 */

const API_BASE = '/api/problems';

export const problemService = {
  /**
   * Fetch problem catalog with filter parameters
   */
  async getProblems({ difficulty, topic, company, search } = {}) {
    const params = new URLSearchParams();
    if (difficulty && difficulty !== 'All') params.append('difficulty', difficulty);
    if (topic && topic !== 'All') params.append('topic', topic);
    if (company && company !== 'All') params.append('company', company);
    if (search) params.append('search', search);

    const url = `${API_BASE}${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch problem catalog');
    return await res.json();
  },

  /**
   * Fetch single problem by ID or slug
   */
  async getProblemById(idOrSlug) {
    const res = await fetch(`${API_BASE}/${idOrSlug}`);
    if (!res.ok) throw new Error(`Failed to fetch problem ${idOrSlug}`);
    return await res.json();
  },

  /**
   * Fetch metadata topic list
   */
  async getTopics() {
    try {
      const res = await fetch(`${API_BASE}/meta/topics`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.topics || [];
    } catch {
      return [
        'Arrays', 'Strings', 'Hash Table', 'Two Pointers', 'Sliding Window', 'Stack',
        'Queue', 'Linked List', 'Binary Search', 'Trees', 'Binary Tree', 'BST',
        'Heap', 'Graph', 'BFS', 'DFS', 'Backtracking', 'Greedy', 'Dynamic Programming',
        'Math', 'Bit Manipulation', 'Intervals', 'Prefix Sum', 'Union Find', 'Topological Sort', 'Trie', 'Design'
      ];
    }
  },

  /**
   * Fetch metadata companies list
   */
  async getCompanies() {
    try {
      const res = await fetch(`${API_BASE}/meta/companies`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.companies || [];
    } catch {
      return ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix', 'Adobe', 'Uber', 'Bloomberg'];
    }
  }
};
