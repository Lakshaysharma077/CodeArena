const fs = require('fs');
const path = require('path');

const adjs = ["Maximum", "Minimum", "Longest", "Shortest", "Valid", "Distinct", "Sorted", "Rotated", "Missing", "Optimal", "Continuous", "Alternating", "Increasing", "Decreasing", "Unique", "Common"];
const nouns = {
  "Array": ["Subarray", "Sequence", "Numbers", "Indices", "Elements", "Subset", "Permutation"],
  "Binary Search": ["Target", "Range", "Peak", "Position", "Matrix", "Value", "Index"],
  "Tree": ["Path", "Leaves", "Nodes", "Subtree", "Depth", "Level", "Ancestors"],
  "Graph": ["Path", "Islands", "Network", "Nodes", "Connections", "Components", "Regions"],
  "String": ["Substring", "Characters", "Words", "Anagram", "Palindrome", "Prefix", "Suffix"],
  "Hash Table": ["Pairs", "Duplicates", "Frequencies", "Mapping", "Matches", "Occurrences"],
  "Dynamic Programming": ["Ways", "Cost", "Profit", "Sum", "Steps", "Jumps", "Sequence"],
  "Sorting": ["Intervals", "Colors", "Elements", "Order", "Ranks", "Positions"],
  "DFS": ["Maze", "Islands", "Path", "Region", "Area", "Perimeter"],
  "Sliding Window": ["Window", "Subarray", "Substring", "Range", "Segment"],
  "Bit Manipulation": ["Bits", "Number", "XOR", "Subset", "Difference", "Hamming Weight"],
  "Linked List": ["Nodes", "List", "Pointers", "Cycle", "Intersection", "Merge"],
  "Two Pointers": ["Pairs", "Sum", "Container", "Water", "Boundaries", "Match"]
};
const actions = ["Sum", "Difference", "Count", "Path", "Search", "Validation", "Optimization", "Reversal", "Traversal", "Evaluation"];

function generateRealisticName(topic, i) {
  const tNouns = nouns[topic] || nouns["Array"];
  const adj = adjs[i % adjs.length];
  const noun = tNouns[(Math.floor(i / adjs.length)) % tNouns.length];
  const action = actions[i % actions.length];
  
  if (i % 3 === 0) return `${adj} ${noun} ${action}`;
  if (i % 3 === 1) return `${action} of ${adj} ${noun}`;
  return `${adj} ${noun}`;
}

const templates = [
  {
    prefix: "Array Traversal Mastery - Level",
    difficulty: "Easy",
    topics: ["Array"],
    description: "Given an array of integers `nums`, find the sum of all elements that are strictly greater than their immediate left and right neighbors.",
    inputFormat: "An array of integers `nums`.",
    outputFormat: "An integer representing the sum of local peaks.",
    starterCode: {
      javascript: "function arrayMastery(nums) {\n  // Write your code here\n}",
      python: "class Solution:\n    def arrayMastery(self, nums):\n        # Write your code here\n        pass",
      cpp: "int arrayMastery(vector<int>& nums) {\n  // Write your code here\n}",
      java: "public int arrayMastery(int[] nums) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const tc = [];
      for(let i=0; i<20; i++) {
        const length = Math.max(3, 5 + level + i);
        const arr = Array.from({length}, () => Math.floor(Math.random() * 200) - 100);
        let sum = 0;
        for(let j=1; j<arr.length-1; j++) {
          if(arr[j] > arr[j-1] && arr[j] > arr[j+1]) sum += arr[j];
        }
        tc.push({ input: JSON.stringify(arr), expectedOutput: sum.toString(), isCustom: false });
      }
      return tc;
    }
  },
  {
    prefix: "Binary Search Deep Dive - Level",
    difficulty: "Medium",
    topics: ["Binary Search", "Array"],
    description: "Given a sorted array of integers `nums` and a target integer `target`, return the index of the target. If not found, return -1.",
    inputFormat: "A string with `nums` and `target`.",
    outputFormat: "An integer representing the index.",
    starterCode: {
      javascript: "function searchTarget(nums, target) {\n  // Write your code here\n}",
      python: "class Solution:\n    def searchTarget(self, nums, target):\n        # Write your code here\n        pass",
      cpp: "int searchTarget(vector<int>& nums, int target) {\n  // Write your code here\n}",
      java: "public int searchTarget(int[] nums, int target) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const tc = [];
      for(let i=0; i<20; i++) {
        const length = 10 + level * 2;
        let arr = Array.from({length}, () => Math.floor(Math.random() * 1000));
        arr.sort((a,b) => a-b);
        arr = [...new Set(arr)]; // Unique
        const shouldFind = Math.random() > 0.3;
        const target = shouldFind && arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : Math.floor(Math.random() * 1000) + 1000;
        const ans = arr.indexOf(target);
        tc.push({ input: `nums = ${JSON.stringify(arr)}, target = ${target}`, expectedOutput: ans.toString(), isCustom: false });
      }
      return tc;
    }
  },
  {
    prefix: "Simulated Tree Traversal - Level",
    difficulty: "Medium",
    topics: ["Tree", "DFS"],
    description: "A binary tree is represented by an array `tree` (level-order traversal where -1 represents a null node). Return the sum of all leaf nodes. A leaf node is a node with no children (no elements at index 2*i+1 and 2*i+2, or those elements are -1).",
    inputFormat: "An array of integers `tree`.",
    outputFormat: "An integer representing the sum of leaf nodes.",
    starterCode: {
      javascript: "function sumOfLeaves(tree) {\n  // Write your code here\n}",
      python: "class Solution:\n    def sumOfLeaves(self, tree):\n        # Write your code here\n        pass",
      cpp: "int sumOfLeaves(vector<int>& tree) {\n  // Write your code here\n}",
      java: "public int sumOfLeaves(int[] tree) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const tc = [];
      for(let i=0; i<20; i++) {
        const length = Math.max(3, 5 + level * 2);
        const arr = Array.from({length}, () => Math.random() > 0.2 ? Math.floor(Math.random() * 100) : -1);
        if (arr[0] === -1) arr[0] = 1;
        let sum = 0;
        for(let j=0; j<arr.length; j++) {
          if(arr[j] !== -1) {
            const left = 2*j + 1;
            const right = 2*j + 2;
            const hasLeft = left < arr.length && arr[left] !== -1;
            const hasRight = right < arr.length && arr[right] !== -1;
            if(!hasLeft && !hasRight) sum += arr[j];
          }
        }
        tc.push({ input: JSON.stringify(arr), expectedOutput: sum.toString(), isCustom: false });
      }
      return tc;
    }
  },
  {
    prefix: "Graph Path Finder - Level",
    difficulty: "Hard",
    topics: ["Graph", "BFS"],
    description: "Given a directed graph represented as an adjacency list `graph` (an array where graph[i] is an array of nodes that node i points to), return the number of nodes reachable from node 0.",
    inputFormat: "A 2D array of integers `graph`.",
    outputFormat: "An integer representing the count of reachable nodes.",
    starterCode: {
      javascript: "function reachableNodes(graph) {\n  // Write your code here\n}",
      python: "class Solution:\n    def reachableNodes(self, graph):\n        # Write your code here\n        pass",
      cpp: "int reachableNodes(vector<vector<int>>& graph) {\n  // Write your code here\n}",
      java: "public int reachableNodes(int[][] graph) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const tc = [];
      for(let i=0; i<20; i++) {
        const nodes = Math.min(50, 4 + level);
        const graph = Array.from({length: nodes}, () => []);
        for(let u=0; u<nodes; u++) {
          const edges = Math.floor(Math.random() * 3);
          for(let e=0; e<edges; e++) {
            const v = Math.floor(Math.random() * nodes);
            if(u !== v && !graph[u].includes(v)) graph[u].push(v);
          }
        }
        const visited = new Set([0]);
        const q = [0];
        while(q.length > 0) {
          const curr = q.shift();
          for(const neighbor of graph[curr]) {
            if(!visited.has(neighbor)) {
              visited.add(neighbor);
              q.push(neighbor);
            }
          }
        }
        tc.push({ input: JSON.stringify(graph), expectedOutput: visited.size.toString(), isCustom: false });
      }
      return tc;
    }
  },
  {
    prefix: "String Validation Protocol - Level",
    difficulty: "Medium",
    topics: ["String", "Hash Table"],
    description: "Given a string `s`, return the length of the longest contiguous substring containing only unique characters.",
    inputFormat: "A string `s`.",
    outputFormat: "An integer.",
    starterCode: {
      javascript: "function lengthOfLongestSubstring(s) {\n  // Write your code here\n}",
      python: "class Solution:\n    def lengthOfLongestSubstring(self, s):\n        # Write your code here\n        pass",
      cpp: "int lengthOfLongestSubstring(string s) {\n  // Write your code here\n}",
      java: "public int lengthOfLongestSubstring(String s) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const tc = [];
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      for(let i=0; i<20; i++) {
        const length = 10 + level * 5;
        let s = "";
        for(let j=0; j<length; j++) s += chars[Math.floor(Math.random() * chars.length)];
        let maxLen = 0;
        let start = 0;
        const map = new Map();
        for(let end=0; end<s.length; end++) {
          if(map.has(s[end])) start = Math.max(start, map.get(s[end]) + 1);
          map.set(s[end], end);
          maxLen = Math.max(maxLen, end - start + 1);
        }
        tc.push({ input: `"${s}"`, expectedOutput: maxLen.toString(), isCustom: false });
      }
      return tc;
    }
  },
  {
    prefix: "Hash Table Optimization - Level",
    difficulty: "Easy",
    topics: ["Hash Table", "Array"],
    description: "Given an array of integers `nums`, find the integer that appears the most frequently. If there is a tie, return the smallest integer.",
    inputFormat: "An array of integers `nums`.",
    outputFormat: "An integer.",
    starterCode: {
      javascript: "function mostFrequent(nums) {\n  // Write your code here\n}",
      python: "class Solution:\n    def mostFrequent(self, nums):\n        # Write your code here\n        pass",
      cpp: "int mostFrequent(vector<int>& nums) {\n  // Write your code here\n}",
      java: "public int mostFrequent(int[] nums) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const tc = [];
      for(let i=0; i<20; i++) {
        const length = 10 + level * 2;
        const arr = Array.from({length}, () => Math.floor(Math.random() * (10 + level)));
        const counts = {};
        let maxCount = 0;
        let bestVal = Infinity;
        arr.forEach(n => {
          counts[n] = (counts[n] || 0) + 1;
          if (counts[n] > maxCount) { maxCount = counts[n]; bestVal = n; }
          else if (counts[n] === maxCount && n < bestVal) { bestVal = n; }
        });
        tc.push({ input: JSON.stringify(arr), expectedOutput: bestVal.toString(), isCustom: false });
      }
      return tc;
    }
  },
  {
    prefix: "Dynamic Programming Challenge - Level",
    difficulty: "Hard",
    topics: ["Dynamic Programming", "Array"],
    description: "Given an array `cost` where `cost[i]` is the cost of step i on a staircase, you can start from step 0 or step 1. You can either climb 1 or 2 steps. Return the minimum cost to reach the top of the floor (index `cost.length`).",
    inputFormat: "An array of integers `cost`.",
    outputFormat: "An integer.",
    starterCode: {
      javascript: "function minCostClimbingStairs(cost) {\n  // Write your code here\n}",
      python: "class Solution:\n    def minCostClimbingStairs(self, cost):\n        # Write your code here\n        pass",
      cpp: "int minCostClimbingStairs(vector<int>& cost) {\n  // Write your code here\n}",
      java: "public int minCostClimbingStairs(int[] cost) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const tc = [];
      for(let i=0; i<20; i++) {
        const length = Math.max(2, 5 + level);
        const cost = Array.from({length}, () => Math.floor(Math.random() * 100));
        let dp1 = cost[0];
        let dp2 = cost[1];
        for(let j=2; j<cost.length; j++) {
          let curr = cost[j] + Math.min(dp1, dp2);
          dp1 = dp2;
          dp2 = curr;
        }
        const ans = Math.min(dp1, dp2);
        tc.push({ input: JSON.stringify(cost), expectedOutput: ans.toString(), isCustom: false });
      }
      return tc;
    }
  },
  {
    prefix: "Sorting Algorithm Implementation - Level",
    difficulty: "Medium",
    topics: ["Sorting", "Array"],
    description: "Given an array of integers `nums`, sort it in descending order using any algorithm and return it.",
    inputFormat: "An array of integers `nums`.",
    outputFormat: "An array of integers.",
    starterCode: {
      javascript: "function sortDescending(nums) {\n  // Write your code here\n}",
      python: "class Solution:\n    def sortDescending(self, nums):\n        # Write your code here\n        pass",
      cpp: "vector<int> sortDescending(vector<int>& nums) {\n  // Write your code here\n}",
      java: "public int[] sortDescending(int[] nums) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const tc = [];
      for(let i=0; i<20; i++) {
        const length = 5 + level;
        const arr = Array.from({length}, () => Math.floor(Math.random() * 500) - 250);
        const sorted = [...arr].sort((a,b)=>b-a);
        tc.push({ input: JSON.stringify(arr), expectedOutput: JSON.stringify(sorted), isCustom: false });
      }
      return tc;
    }
  },
  {
    prefix: "DFS Maze Runner - Level",
    difficulty: "Hard",
    topics: ["DFS", "Matrix"],
    description: "Given a 2D matrix `grid` of 0s and 1s, where 1 is land and 0 is water, return the area of the largest connected island. An island is connected horizontally or vertically.",
    inputFormat: "A 2D array of integers `grid`.",
    outputFormat: "An integer representing the max area.",
    starterCode: {
      javascript: "function maxAreaOfIsland(grid) {\n  // Write your code here\n}",
      python: "class Solution:\n    def maxAreaOfIsland(self, grid):\n        # Write your code here\n        pass",
      cpp: "int maxAreaOfIsland(vector<vector<int>>& grid) {\n  // Write your code here\n}",
      java: "public int maxAreaOfIsland(int[][] grid) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const tc = [];
      for(let i=0; i<20; i++) {
        const rows = Math.min(20, 3 + Math.floor(level/5));
        const cols = Math.min(20, 3 + Math.floor(level/5));
        const grid = Array.from({length: rows}, () => Array.from({length: cols}, () => Math.random() > 0.6 ? 1 : 0));
        let maxArea = 0;
        const visited = Array.from({length: rows}, () => Array(cols).fill(false));
        const dfs = (r, c) => {
          if(r<0||c<0||r>=rows||c>=cols||visited[r][c]||grid[r][c]===0) return 0;
          visited[r][c] = true;
          return 1 + dfs(r+1,c) + dfs(r-1,c) + dfs(r,c+1) + dfs(r,c-1);
        };
        for(let r=0; r<rows; r++) {
          for(let c=0; c<cols; c++) {
            if(grid[r][c]===1 && !visited[r][c]) {
              maxArea = Math.max(maxArea, dfs(r,c));
            }
          }
        }
        tc.push({ input: JSON.stringify(grid), expectedOutput: maxArea.toString(), isCustom: false });
      }
      return tc;
    }
  },
  {
    prefix: "Sliding Window Maximum - Level",
    difficulty: "Medium",
    topics: ["Sliding Window", "Array"],
    description: "Given an array `nums` and an integer `k`, return the maximum sum of any contiguous subarray of size `k`.",
    inputFormat: "A string with `nums` array and integer `k`.",
    outputFormat: "An integer.",
    starterCode: {
      javascript: "function maxSubarraySum(nums, k) {\n  // Write your code here\n}",
      python: "class Solution:\n    def maxSubarraySum(self, nums, k):\n        # Write your code here\n        pass",
      cpp: "int maxSubarraySum(vector<int>& nums, int k) {\n  // Write your code here\n}",
      java: "public int maxSubarraySum(int[] nums, int k) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const tc = [];
      for(let i=0; i<20; i++) {
        const length = Math.max(5, 5 + level);
        const k = Math.min(length, Math.max(1, Math.floor(Math.random() * (length / 2)) + 1));
        const arr = Array.from({length}, () => Math.floor(Math.random() * 100));
        let maxSum = 0;
        let currSum = 0;
        for(let j=0; j<k; j++) currSum += arr[j];
        maxSum = currSum;
        for(let j=k; j<arr.length; j++) {
          currSum += arr[j] - arr[j-k];
          maxSum = Math.max(maxSum, currSum);
        }
        tc.push({ input: `nums = ${JSON.stringify(arr)}, k = ${k}`, expectedOutput: maxSum.toString(), isCustom: false });
      }
      return tc;
    }
  },
  {
    prefix: "Bit Manipulation Basics - Level",
    difficulty: "Easy",
    topics: ["Bit Manipulation"],
    description: "Given an array `nums` where every element appears twice except for one, find that single one.",
    inputFormat: "An array of integers `nums`.",
    outputFormat: "An integer.",
    starterCode: {
      javascript: "function singleNumber(nums) {\n  // Write your code here\n}",
      python: "class Solution:\n    def singleNumber(self, nums):\n        # Write your code here\n        pass",
      cpp: "int singleNumber(vector<int>& nums) {\n  // Write your code here\n}",
      java: "public int singleNumber(int[] nums) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const tc = [];
      for(let i=0; i<20; i++) {
        const pairs = 3 + Math.floor(level/2);
        const arr = [];
        for(let j=0; j<pairs; j++) {
          const val = Math.floor(Math.random() * 500);
          arr.push(val, val);
        }
        const single = Math.floor(Math.random() * 500) + 1000;
        arr.push(single);
        arr.sort(() => Math.random() - 0.5);
        tc.push({ input: JSON.stringify(arr), expectedOutput: single.toString(), isCustom: false });
      }
      return tc;
    }
  },
  {
    prefix: "Simulated Linked List Reversal - Level",
    difficulty: "Medium",
    topics: ["Linked List", "Two Pointers"],
    description: "A linked list is given as an array. Write a function that returns the array representing the reversed linked list.",
    inputFormat: "An array `head`.",
    outputFormat: "An array.",
    starterCode: {
      javascript: "function reverseList(head) {\n  // Write your code here\n}",
      python: "class Solution:\n    def reverseList(self, head):\n        # Write your code here\n        pass",
      cpp: "vector<int> reverseList(vector<int>& head) {\n  // Write your code here\n}",
      java: "public int[] reverseList(int[] head) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const tc = [];
      for(let i=0; i<20; i++) {
        const length = 5 + level;
        const arr = Array.from({length}, () => Math.floor(Math.random() * 100));
        const rev = [...arr].reverse();
        tc.push({ input: JSON.stringify(arr), expectedOutput: JSON.stringify(rev), isCustom: false });
      }
      return tc;
    }
  },
  {
    prefix: "Two Pointers Collision - Level",
    difficulty: "Medium",
    topics: ["Two Pointers", "Array"],
    description: "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number. Return the indices of the two numbers in an array [index1, index2].",
    inputFormat: "A string with sorted array `numbers` and integer `target`.",
    outputFormat: "An array of two integers.",
    starterCode: {
      javascript: "function twoSumSorted(numbers, target) {\n  // Write your code here\n}",
      python: "class Solution:\n    def twoSumSorted(self, numbers, target):\n        # Write your code here\n        pass",
      cpp: "vector<int> twoSumSorted(vector<int>& numbers, int target) {\n  // Write your code here\n}",
      java: "public int[] twoSumSorted(int[] numbers, int target) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const tc = [];
      for(let i=0; i<20; i++) {
        const length = 10 + level;
        let arr = Array.from({length}, () => Math.floor(Math.random() * 100));
        arr.sort((a,b)=>a-b);
        const idx1 = Math.floor(Math.random() * (length - 1));
        const idx2 = idx1 + 1 + Math.floor(Math.random() * (length - idx1 - 1));
        const target = arr[idx1] + arr[idx2];
        const expected = JSON.stringify([idx1+1, idx2+1]);
        tc.push({ input: `numbers = ${JSON.stringify(arr)}, target = ${target}`, expectedOutput: expected, isCustom: false });
      }
      return tc;
    }
  }
];

const newProblems = [];
let counter = 1;

for (const t of templates) {
  const mainTopic = t.topics[0];
  
  for (let i = 1; i <= 100; i++) {
    const pId = `P${String(counter).padStart(4, '0')}`;
    let title = generateRealisticName(mainTopic, i);
    
    if (i > 50) title += ` ${i - 50 > 10 ? 'II' : 'III'}`;
    if (i > 80) title += ' IV';
    
    title = `${title} (v${i})`;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const tcs = t.generator(i);
    
    const publicTc = tcs[0];
    const hiddenTcs = tcs.slice(1);
    
    newProblems.push({
      problemId: pId,
      title: title,
      slug: slug,
      difficulty: i > 80 ? 'Hard' : (i > 30 ? t.difficulty : 'Easy'),
      topics: t.topics,
      description: `${t.description}\n\n**Level:** ${i}`,
      inputFormat: t.inputFormat,
      outputFormat: t.outputFormat,
      constraints: [`1 <= input length <= ${100 + i * 5}`],
      examples: [
        { input: publicTc.input, output: publicTc.expectedOutput, explanation: "Generated test case example." }
      ],
      starterCode: t.starterCode,
      publicTestcases: [publicTc],
      hiddenTestcases: hiddenTcs,
      timeLimit: 2000,
      memoryLimit: 256,
      expectedComplexity: { time: "O(N)", space: "O(1)" }
    });
    counter++;
  }
}

const outputPath = path.join(__dirname, 'data', 'seedProblems.js');
const fileContent = `const SEED_PROBLEMS = ${JSON.stringify(newProblems, null, 2)};\n\nmodule.exports = { SEED_PROBLEMS };`;

fs.writeFileSync(outputPath, fileContent);
console.log(`Successfully generated ${newProblems.length} completely randomized problems (with 20 testcases each) and saved to seedProblems.js`);
