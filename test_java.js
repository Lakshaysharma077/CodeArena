const { evaluateSubmission } = require('./backend/utils/judgeEngine');

async function run() {
  const code = `
class Solution {
    public int[] twoSum(int[] nums, int target) {
        for(int i=0; i<nums.length; i++){
            for(int j=i+1; j<nums.length; j++){
                if(nums[i] + nums[j] == target){
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{};
    }
}
  `;
  const result = await evaluateSubmission({
    code,
    language: 'java',
    testcases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]' },
      { input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]' }
    ]
  });
  console.log(JSON.stringify(result, null, 2));
  console.log("STDOUT RAW:", JSON.stringify(result.stdout));
}

run();
