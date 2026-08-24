const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const Problem = require('./models/Problem');

const sampleProblems = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    source: 'LeetCode',
    tags: ['Array', 'Hash Table'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
    starterCode: { javascript: 'function twoSum(nums, target) {\n  // Write solution\n}' },
    expectedComplexity: { time: 'O(N)', space: 'O(N)' }
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    source: 'LeetCode',
    tags: ['String', 'Sliding Window'],
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    constraints: ['0 <= s.length <= 5 * 10^4'],
    examples: [{ input: 's = "abcabcbb"', output: '3' }],
    starterCode: { javascript: 'function lengthOfLongestSubstring(s) {\n  // Write solution\n}' },
    expectedComplexity: { time: 'O(N)', space: 'O(K)' }
  }
];

const seed = async () => {
  await connectDB();
  try {
    await Problem.deleteMany({});
    await Problem.insertMany(sampleProblems);
    console.log('[Seed] Database seeded with initial problems');
  } catch (err) {
    console.log('[Seed] Error or memory mode:', err.message);
  }
  process.exit();
};

if (require.main === module) {
  seed();
}
