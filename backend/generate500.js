const fs = require('fs');
const path = require('path');
const { SEED_PROBLEMS } = require('./data/seedProblems');

const templates = [
  {
    prefix: "Calculate Sum of Array Elements - Level",
    difficulty: "Easy",
    topics: ["Arrays", "Math"],
    description: "Given an array of integers, write a function to calculate the sum of its elements.",
    inputFormat: "An array of integers `nums`.",
    outputFormat: "An integer representing the sum.",
    starterCode: {
      javascript: "function calculateSum(nums) {\n  // Write your code here\n}",
      python: "class Solution:\n    def calculateSum(self, nums):\n        # Write your code here\n        pass",
      cpp: "int calculateSum(vector<int>& nums) {\n  // Write your code here\n}",
      java: "public int calculateSum(int[] nums) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const length = 5 + level;
      const tc = [];
      for(let i=0; i<3; i++) {
        const arr = Array.from({length}, () => Math.floor(Math.random() * 100));
        const sum = arr.reduce((a,b)=>a+b, 0);
        tc.push({
          input: JSON.stringify(arr),
          expectedOutput: sum.toString(),
          isCustom: false
        });
      }
      return tc;
    }
  },
  {
    prefix: "Find Maximum Element in Array - Level",
    difficulty: "Easy",
    topics: ["Arrays", "Searching"],
    description: "Given an array of integers, return the maximum element.",
    inputFormat: "An array of integers `nums`.",
    outputFormat: "An integer representing the maximum element.",
    starterCode: {
      javascript: "function findMax(nums) {\n  // Write your code here\n}",
      python: "class Solution:\n    def findMax(self, nums):\n        # Write your code here\n        pass",
      cpp: "int findMax(vector<int>& nums) {\n  // Write your code here\n}",
      java: "public int findMax(int[] nums) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const length = 5 + level;
      const tc = [];
      for(let i=0; i<3; i++) {
        const arr = Array.from({length}, () => Math.floor(Math.random() * 1000) - 500);
        const max = Math.max(...arr);
        tc.push({
          input: JSON.stringify(arr),
          expectedOutput: max.toString(),
          isCustom: false
        });
      }
      return tc;
    }
  },
  {
    prefix: "Reverse an Array - Level",
    difficulty: "Medium",
    topics: ["Arrays", "Two Pointers"],
    description: "Given an array, return a new array with elements in reverse order.",
    inputFormat: "An array of integers.",
    outputFormat: "An array of integers.",
    starterCode: {
      javascript: "function reverseArray(nums) {\n  // Write your code here\n}",
      python: "class Solution:\n    def reverseArray(self, nums):\n        # Write your code here\n        pass",
      cpp: "vector<int> reverseArray(vector<int>& nums) {\n  // Write your code here\n}",
      java: "public int[] reverseArray(int[] nums) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const length = 4 + level;
      const tc = [];
      for(let i=0; i<3; i++) {
        const arr = Array.from({length}, () => Math.floor(Math.random() * 100));
        const rev = [...arr].reverse();
        tc.push({
          input: JSON.stringify(arr),
          expectedOutput: JSON.stringify(rev),
          isCustom: false
        });
      }
      return tc;
    }
  },
  {
    prefix: "Is Palindrome Array - Level",
    difficulty: "Medium",
    topics: ["Arrays", "Two Pointers"],
    description: "Given an array of integers, determine if it reads the same forwards and backwards.",
    inputFormat: "An array of integers `nums`.",
    outputFormat: "`true` if it is a palindrome, else `false`.",
    starterCode: {
      javascript: "function isPalindrome(nums) {\n  // Write your code here\n}",
      python: "class Solution:\n    def isPalindrome(self, nums):\n        # Write your code here\n        pass",
      cpp: "bool isPalindrome(vector<int>& nums) {\n  // Write your code here\n}",
      java: "public boolean isPalindrome(int[] nums) {\n  // Write your code here\n}"
    },
    generator: (level) => {
      const tc = [];
      // 1 true, 2 false
      for(let i=0; i<3; i++) {
        const length = 3 + level;
        let arr = Array.from({length: Math.floor(length/2)}, () => Math.floor(Math.random() * 10));
        if (i === 0) {
           arr = arr.concat([...arr].reverse());
           tc.push({ input: JSON.stringify(arr), expectedOutput: "true", isCustom: false });
        } else {
           arr = arr.concat(Array.from({length: Math.ceil(length/2)}, () => Math.floor(Math.random() * 10)));
           tc.push({ input: JSON.stringify(arr), expectedOutput: "false", isCustom: false });
        }
      }
      return tc;
    }
  }
];

const newProblems = [...SEED_PROBLEMS];
let counter = SEED_PROBLEMS.length + 1;

for (let i = 1; i <= 100; i++) {
  for (const t of templates) {
    const pId = `P${String(counter).padStart(4, '0')}`;
    const title = `${t.prefix} ${i}`;
    const slug = title.toLowerCase().replace(/ /g, '-');
    const tcs = t.generator(i);
    
    newProblems.push({
      problemId: pId,
      title: title,
      slug: slug,
      difficulty: i > 75 ? 'Hard' : (i > 30 ? t.difficulty : 'Easy'),
      topics: t.topics,
      description: t.description + ` (Variation ${i})`,
      inputFormat: t.inputFormat,
      outputFormat: t.outputFormat,
      constraints: [`1 <= nums.length <= ${5 + i * 2}`],
      examples: [
        { input: tcs[0].input, output: tcs[0].expectedOutput, explanation: "Generated example" }
      ],
      starterCode: t.starterCode,
      publicTestcases: [tcs[0]],
      hiddenTestcases: [tcs[1], tcs[2]],
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
console.log(`Successfully generated ${newProblems.length} problems and saved to seedProblems.js`);
