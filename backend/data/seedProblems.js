/**
 * CodeArena Seed Problems Catalog
 * Curated production-ready competitive programming challenge suite.
 */

const SEED_PROBLEMS = [
  {
    problemId: 'prob_1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topics: ['Arrays', 'Hash Table'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple'],
    companyDisclaimer: 'Commonly associated with interview rounds at Google, Amazon, Meta, Microsoft, Apple.',
    description: `Given an integer array \`nums\` and an integer \`target\`, find the indices of the two distinct elements that sum up to \`target\`.

You may assume that each input will have **exactly one valid solution**, and you cannot use the same element twice. You can return the indices in any order.`,
    inputFormat: 'Line 1: An integer array nums\nLine 2: An integer target',
    outputFormat: 'Return an integer array [index1, index2] representing the 0-indexed positions of the two numbers.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Exactly one valid answer exists for every test case.'
    ],
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2].'
      },
      {
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 3 + 3 == 6, we return [0, 1].'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> numMap;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (numMap.count(complement)) {
                return {numMap[complement], i};
            }
            numMap[nums[i]] = i;
        }
        return {};
    }
};`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', explanation: '2 + 7 = 9' },
      { input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', explanation: '2 + 4 = 6' }
    ],
    hiddenTestcases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]', tag: 'standard-case' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]', tag: 'offset-indices' },
      { input: '[3,3], 6', expectedOutput: '[0,1]', tag: 'duplicate-values' },
      { input: '[-1,-2,-3,-4,-5], -8', expectedOutput: '[2,4]', tag: 'negative-values' },
      { input: '[0,4,3,0], 0', expectedOutput: '[0,3]', tag: 'zero-sum' },
      { input: '[1000000000,-1000000000], 0', expectedOutput: '[0,1]', tag: 'extreme-bounds' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(N)', space: 'O(N)' },
    editorial: {
      approach: 'One-Pass Hash Table',
      intuition: 'While traversing the array, we check if the complement (target - current element) already exists in our hash map. If found, we return the stored index and current index. Otherwise, we insert the current element.',
      timeComplexity: 'O(N) - We traverse the list containing N elements only once.',
      spaceComplexity: 'O(N) - Space required for the hash table to store up to N key-value pairs.'
    },
    hints: [
      'A brute force approach checks all pairs in O(N^2). Can we trade memory for speed using a Hash Map?',
      'As you iterate, store each element and its index, then look up target - current_val in O(1) time.'
    ],
    totalSubmissions: 48920,
    acceptedSubmissions: 31200,
    acceptanceRate: 63.8
  },
  {
    problemId: 'prob_2',
    title: 'LRU Cache',
    slug: 'lru-cache',
    difficulty: 'Medium',
    topics: ['Hash Table', 'Linked List', 'Design'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Meta'],
    companyDisclaimer: 'Commonly associated with interview rounds at Amazon, Google, Microsoft, Meta.',
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) Cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\`: Initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key)\`: Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\`: Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, **evict the least recently used key**.

The functions \`get\` and \`put\` must each run in **O(1)** average time complexity.`,
    inputFormat: 'Operations array and Arguments array representing sequence of get and put calls.',
    outputFormat: 'Array of results corresponding to each operation where put returns null and get returns integer.',
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.'
    ],
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
        explanation: 'LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1);\nlRUCache.put(2, 2);\nlRUCache.get(1);    // returns 1\nlRUCache.put(3, 3); // evicts key 2\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // evicts key 1\nlRUCache.get(1);    // returns -1 (not found)\nlRUCache.get(3);    // returns 3\nlRUCache.get(4);    // returns 4'
      }
    ],
    starterCode: {
      javascript: `class LRUCache {
    /**
     * @param {number} capacity
     */
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    /** 
     * @param {number} key
     * @return {number}
     */
    get(key) {
        if (!this.cache.has(key)) return -1;
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val);
        return val;
    }

    /** 
     * @param {number} key 
     * @param {number} value
     * @return {void}
     */
    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
}`,
      python: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.order = []

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.order.remove(key)
        self.order.append(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.order.remove(key)
        elif len(self.cache) >= self.capacity:
            oldest = self.order.pop(0)
            del self.cache[oldest]
        self.cache[key] = value
        self.order.append(key)`,
      cpp: `#include <unordered_map>
#include <list>
using namespace std;

class LRUCache {
    int capacity;
    list<pair<int, int>> dll;
    unordered_map<int, list<pair<int, int>>::iterator> mp;
public:
    LRUCache(int cap) : capacity(cap) {}

    int get(int key) {
        if (!mp.count(key)) return -1;
        dll.splice(dll.begin(), dll, mp[key]);
        return mp[key]->second;
    }

    void put(int key, int value) {
        if (mp.count(key)) {
            mp[key]->second = value;
            dll.splice(dll.begin(), dll, mp[key]);
            return;
        }
        if (dll.size() == capacity) {
            int delKey = dll.back().first;
            dll.pop_back();
            mp.erase(delKey);
        }
        dll.emplace_front(key, value);
        mp[key] = dll.begin();
    }
};`,
      java: `import java.util.LinkedHashMap;
import java.util.Map;

class LRUCache extends LinkedHashMap<Integer, Integer> {
    private final int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    public int get(int key) {
        return super.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        super.put(key, value);
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > capacity;
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: 'capacity = 2, put(1,1), put(2,2), get(1)', expectedOutput: '1', explanation: 'key 1 is found with value 1' },
      { input: 'put(3,3), get(2)', expectedOutput: '-1', explanation: 'key 2 was evicted' }
    ],
    hiddenTestcases: [
      { input: 'cap=1, put(2,1), get(2), put(3,2), get(2), get(3)', expectedOutput: '[1,-1,2]', tag: 'capacity-1' },
      { input: 'cap=2, put(1,1), put(2,2), put(1,10), get(1), get(2)', expectedOutput: '[10,2]', tag: 'overwrite-existing' },
      { input: 'cap=3, put(1,1), put(2,2), put(3,3), get(1), put(4,4), get(2)', expectedOutput: '[-1]', tag: 'eviction-order' }
    ],
    timeLimit: 2500,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(1)', space: 'O(Capacity)' },
    editorial: {
      approach: 'Doubly Linked List + Hash Map',
      intuition: 'A hash map provides O(1) key lookup, while a doubly linked list allows O(1) removal and insertion of nodes at the head (most recently used) and tail (least recently used).',
      timeComplexity: 'O(1) for both get() and put() operations.',
      spaceComplexity: 'O(Capacity) to store up to capacity elements.'
    },
    hints: [
      'How can we achieve O(1) removal from the middle of a sequence? Think of a Doubly Linked List.',
      'Combine a Hash Map of key -> Node pointer with a Doubly Linked List representing access order.'
    ],
    totalSubmissions: 36400,
    acceptedSubmissions: 17200,
    acceptanceRate: 47.2
  },
  {
    problemId: 'prob_3',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    topics: ['Hash Table', 'String', 'Sliding Window'],
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft'],
    companyDisclaimer: 'Commonly associated with interview rounds at Amazon, Google, Meta, Microsoft.',
    description: `Given a string \`s\`, find the length of the **longest substring** that contains no duplicate characters.`,
    inputFormat: 'Line 1: A single string s',
    outputFormat: 'Return an integer representing the maximum length of a non-repeating substring.',
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols, and spaces.'
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with a length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with a length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with a length of 3. Note that "pwke" is a subsequence and not a substring.'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
    const map = new Map();
    let left = 0;
    let maxLen = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        if (map.has(char) && map.get(char) >= left) {
            left = map.get(char) + 1;
        }
        map.set(char, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_map = {}
        left = 0
        max_len = 0
        for right, ch in enumerate(s):
            if ch in char_map and char_map[ch] >= left:
                left = char_map[ch] + 1
            char_map[ch] = right
            max_len = max(max_len, right - left + 1)
        return max_len`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> lastSeen;
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            if (lastSeen.count(s[right]) && lastSeen[s[right]] >= left) {
                left = lastSeen[s[right]] + 1;
            }
            lastSeen[s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: 's = "abcabcbb"', expectedOutput: '3', explanation: '"abc"' },
      { input: 's = "bbbbb"', expectedOutput: '1', explanation: '"b"' }
    ],
    hiddenTestcases: [
      { input: '""', expectedOutput: '0', tag: 'empty-string' },
      { input: '" "', expectedOutput: '1', tag: 'single-space' },
      { input: '"abcdefghijklmnopqrstuvwxyz"', expectedOutput: '26', tag: 'all-unique' },
      { input: '"aab"', expectedOutput: '2', tag: 'duplicate-prefix' },
      { input: '"tmmzuxt"', expectedOutput: '5', tag: 'inner-duplicates' },
      { input: '"dvdf"', expectedOutput: '3', tag: 're-traversal' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(N)', space: 'O(min(N, M))' },
    editorial: {
      approach: 'Optimized Sliding Window with Character Index Map',
      intuition: 'Maintain a window [left, right]. When a repeated character is encountered at index `right`, immediately advance `left` to `lastSeen[char] + 1` to skip redundant checks.',
      timeComplexity: 'O(N) - We visit each character at most once with the right pointer.',
      spaceComplexity: 'O(min(N, M)) - Space for the map, where M is the charset size.'
    },
    hints: [
      'Can you maintain a sliding window of unique characters?',
      'Instead of sliding the left pointer one by one, use a hash map to jump left directly past the duplicate.'
    ],
    totalSubmissions: 52100,
    acceptedSubmissions: 24800,
    acceptanceRate: 47.6
  },
  {
    problemId: 'prob_4',
    title: 'Merge k Sorted Lists',
    slug: 'merge-k-sorted-lists',
    difficulty: 'Hard',
    topics: ['Linked List', 'Heap', 'Divide and Conquer'],
    companies: ['Amazon', 'Google', 'Microsoft'],
    companyDisclaimer: 'Commonly associated with interview rounds at Amazon, Google, Microsoft.',
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

*Merge all the linked-lists into one sorted linked-list and return its head.*`,
    inputFormat: 'An array of linked list heads lists',
    outputFormat: 'Return the head node of the merged sorted linked list.',
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
      '-10^4 <= lists[i][j] <= 10^4',
      'lists[i] is sorted in ascending order.',
      'The sum of lists[i].length will not exceed 10^4.'
    ],
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
        explanation: 'The linked-lists are:\n[\n  1->4->5,\n  1->3->4,\n  2->6\n]\nmerging them into one sorted list: 1->1->2->3->4->4->5->6'
      },
      {
        input: 'lists = []',
        output: '[]',
        explanation: 'Input list of lists is empty.'
      }
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
function mergeKLists(lists) {
    if (!lists || lists.length === 0) return null;
    
    const mergeTwo = (l1, l2) => {
        const dummy = { val: 0, next: null };
        let curr = dummy;
        while (l1 && l2) {
            if (l1.val <= l2.val) {
                curr.next = l1;
                l1 = l1.next;
            } else {
                curr.next = l2;
                l2 = l2.next;
            }
            curr = curr.next;
        }
        curr.next = l1 || l2;
        return dummy.next;
    };
    
    let interval = 1;
    while (interval < lists.length) {
        for (let i = 0; i + interval < lists.length; i += interval * 2) {
            lists[i] = mergeTwo(lists[i], lists[i + interval]);
        }
        interval *= 2;
    }
    return lists[0];
}`,
      python: `import heapq

class Solution:
    def mergeKLists(self, lists: list) -> list:
        heap = []
        for i, head in enumerate(lists):
            if head:
                heapq.heappush(heap, (head.val, i, head))
        
        dummy = ListNode(0)
        curr = dummy
        while heap:
            val, i, node = heapq.heappop(heap)
            curr.next = node
            curr = curr.next
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
        for (auto l : lists) {
            if (l) pq.push(l);
        }
        ListNode dummy(0);
        ListNode* tail = &dummy;
        while (!pq.empty()) {
            ListNode* node = pq.top();
            pq.pop();
            tail->next = node;
            tail = tail->next;
            if (node->next) pq.push(node->next);
        }
        return dummy.next;
    }
};`,
      java: `import java.util.PriorityQueue;

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
        for (ListNode node : lists) {
            if (node != null) pq.add(node);
        }
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            tail.next = node;
            tail = tail.next;
            if (node.next != null) pq.add(node.next);
        }
        return dummy.next;
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: '[[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]', explanation: 'Merged in ascending order' },
      { input: '[]', expectedOutput: '[]', explanation: 'Empty input' }
    ],
    hiddenTestcases: [
      { input: '[[]]', expectedOutput: '[]', tag: 'single-empty-list' },
      { input: '[[],[1]]', expectedOutput: '[1]', tag: 'one-empty-one-populated' },
      { input: '[[2],[-1]]', expectedOutput: '[-1,2]', tag: 'negative-values' },
      { input: '[[1,2,3],[4,5,6],[7,8,9]]', expectedOutput: '[1,2,3,4,5,6,7,8,9]', tag: 'disjoint-ranges' },
      { input: '[[1],[1],[1],[1]]', expectedOutput: '[1,1,1,1]', tag: 'identical-nodes' }
    ],
    timeLimit: 3000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(N log k)', space: 'O(k)' },
    editorial: {
      approach: 'Min-Heap Priority Queue or Divide & Conquer Merge',
      intuition: 'Maintain a min-heap containing the current head node of each of the k lists. At each step, pop the smallest node, append it to the result list, and push its successor if available.',
      timeComplexity: 'O(N log k) where N is total number of nodes and k is number of linked lists.',
      spaceComplexity: 'O(k) for the priority queue storing k node references.'
    },
    hints: [
      'Instead of merging lists one by one sequentially (O(k * N)), pair them up using Divide and Conquer or Min-Heap.',
      'A Min-Heap of size k allows extracting the next minimum in O(log k).'
    ],
    totalSubmissions: 28400,
    acceptedSubmissions: 11900,
    acceptanceRate: 41.9
  },
  {
    problemId: 'prob_5',
    title: 'Binary Tree Maximum Path Sum',
    slug: 'binary-tree-maximum-path-sum',
    difficulty: 'Hard',
    topics: ['Tree', 'DFS', 'Dynamic Programming'],
    companies: ['Google', 'Amazon', 'Meta'],
    companyDisclaimer: 'Commonly associated with interview rounds at Google, Amazon, Meta.',
    description: `A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence **at most once**. Note that the path does not need to pass through the root.

The **path sum** of a path is the sum of the node values in the path.

Given the \`root\` of a binary tree, return *the maximum **path sum** of any non-empty path*.`,
    inputFormat: 'Serialized level-order representation of the binary tree root.',
    outputFormat: 'Return a single integer representing the maximum path sum.',
    constraints: [
      'The number of nodes in the tree is in the range [1, 3 * 10^4].',
      '-1000 <= Node.val <= 1000'
    ],
    examples: [
      {
        input: 'root = [1, 2, 3]',
        output: '6',
        explanation: 'The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.'
      },
      {
        input: 'root = [-10, 9, 20, null, null, 15, 7]',
        output: '42',
        explanation: 'The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.'
      }
    ],
    starterCode: {
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
function maxPathSum(root) {
    let maxSum = -Infinity;
    
    function maxGain(node) {
        if (!node) return 0;
        
        const leftGain = Math.max(maxGain(node.left), 0);
        const rightGain = Math.max(maxGain(node.right), 0);
        
        const currentPathSum = node.val + leftGain + rightGain;
        maxSum = Math.max(maxSum, currentPathSum);
        
        return node.val + Math.max(leftGain, rightGain);
    }
    
    maxGain(root);
    return maxSum;
}`,
      python: `class Solution:
    def maxPathSum(self, root) -> int:
        max_sum = float('-inf')
        
        def max_gain(node):
            nonlocal max_sum
            if not node:
                return 0
            left_gain = max(max_gain(node.left), 0)
            right_gain = max(max_gain(node.right), 0)
            
            price_newpath = node.val + left_gain + right_gain
            max_sum = max(max_sum, price_newpath)
            
            return node.val + max(left_gain, right_gain)
            
        max_gain(root)
        return max_sum`,
      cpp: `#include <algorithm>
#include <climits>
using namespace std;

class Solution {
    int maxSum = INT_MIN;
    int maxGain(TreeNode* node) {
        if (!node) return 0;
        int leftGain = max(maxGain(node->left), 0);
        int rightGain = max(maxGain(node->right), 0);
        maxSum = max(maxSum, node->val + leftGain + rightGain);
        return node->val + max(leftGain, rightGain);
    }
public:
    int maxPathSum(TreeNode* root) {
        maxGain(root);
        return maxSum;
    }
};`,
      java: `class Solution {
    private int maxSum = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        maxGain(root);
        return maxSum;
    }

    private int maxGain(TreeNode node) {
        if (node == null) return 0;
        int leftGain = Math.max(maxGain(node.left), 0);
        int rightGain = Math.max(maxGain(node.right), 0);
        maxSum = Math.max(maxSum, node.val + leftGain + rightGain);
        return node.val + Math.max(leftGain, rightGain);
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: '[1,2,3]', expectedOutput: '6', explanation: '2 + 1 + 3 = 6' },
      { input: '[-10,9,20,null,null,15,7]', expectedOutput: '42', explanation: '15 + 20 + 7 = 42' }
    ],
    hiddenTestcases: [
      { input: '[-3]', expectedOutput: '-3', tag: 'single-negative-node' },
      { input: '[2,-1]', expectedOutput: '2', tag: 'ignore-negative-branch' },
      { input: '[-2,-1]', expectedOutput: '-1', tag: 'all-negative-tree' },
      { input: '[1,-2,3]', expectedOutput: '4', tag: 'skip-negative-left' },
      { input: '[5,4,8,11,null,13,4,7,2,null,null,null,1]', expectedOutput: '48', tag: 'deep-tree' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(N)', space: 'O(H)' },
    editorial: {
      approach: 'Post-Order Depth First Search (DFS)',
      intuition: 'At each node, compute the maximum contribution it can make to a parent path (node.val + max(0, leftGain, rightGain)). Concurrently, update global maximum path sum using node.val + leftGain + rightGain.',
      timeComplexity: 'O(N) - Every node is visited exactly once.',
      spaceComplexity: 'O(H) - Recursion stack bounded by tree height H (up to O(N) in skewed trees).'
    },
    hints: [
      'Think recursively: what is the maximum path sum that starts at this node and continues down into one subtree?',
      'If a child subtree returns a negative sum, we should prune it by taking max(0, childGain).'
    ],
    totalSubmissions: 22100,
    acceptedSubmissions: 8900,
    acceptanceRate: 40.2
  },
  {
    problemId: 'prob_6',
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    topics: ['Arrays', 'DFS', 'BFS', 'Matrix'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Meta'],
    companyDisclaimer: 'Commonly associated with interview rounds at Amazon, Google, Microsoft, Meta.',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return *the number of islands*.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    inputFormat: 'A 2D character matrix grid',
    outputFormat: 'Return an integer representing total connected components of land.',
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.'
    ],
    examples: [
      {
        input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
        output: '1',
        explanation: 'All 1s connect into a single contiguous island.'
      },
      {
        input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]',
        output: '3',
        explanation: 'There are 3 isolated islands.'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
    if (!grid || grid.length === 0) return 0;
    let count = 0;
    const m = grid.length, n = grid[0].length;
    
    function dfs(r, c) {
        if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] === '0') return;
        grid[r][c] = '0'; // mark visited
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }
    
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            if (grid[r][c] === '1') {
                count++;
                dfs(r, c);
            }
        }
    }
    return count;
}`,
      python: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        if not grid:
            return 0
        m, n = len(grid), len(grid[0])
        count = 0
        
        def dfs(r, c):
            if r < 0 or c < 0 or r >= m or c >= n or grid[r][c] == '0':
                return
            grid[r][c] = '0'
            dfs(r+1, c)
            dfs(r-1, c)
            dfs(r, c+1)
            dfs(r, c-1)
            
        for r in range(m):
            for c in range(n):
                if grid[r][c] == '1':
                    count += 1
                    dfs(r, c)
        return count`,
      cpp: `#include <vector>
using namespace std;

class Solution {
    void dfs(vector<vector<char>>& grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.size() || c >= grid[0].size() || grid[r][c] == '0') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
public:
    int numIslands(vector<vector<char>>& grid) {
        int count = 0;
        for (int r = 0; r < grid.size(); r++) {
            for (int c = 0; c < grid[0].size(); c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }
};`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }

    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] == '0') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: '[["1","1","1"],["0","1","0"],["1","1","1"]]', expectedOutput: '1', explanation: 'One connected island' },
      { input: '[["1","0"],["0","1"]]', expectedOutput: '2', explanation: 'Diagonal land does not connect' }
    ],
    hiddenTestcases: [
      { input: '[["0"]]', expectedOutput: '0', tag: 'all-water' },
      { input: '[["1"]]', expectedOutput: '1', tag: 'single-land' },
      { input: '[["1","0","1"],["0","1","0"],["1","0","1"]]', expectedOutput: '5', tag: 'checkerboard' },
      { input: '[["1","1","1"],["1","1","1"]]', expectedOutput: '1', tag: 'full-land' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(M * N)', space: 'O(M * N)' },
    editorial: {
      approach: 'Flood Fill DFS / BFS',
      intuition: 'Iterate through every cell in the grid. When an unvisited land cell `1` is encountered, increment island count and initiate a DFS/BFS traversal to sink the entire connected island to `0`.',
      timeComplexity: 'O(M * N) - Every cell is examined a constant number of times.',
      spaceComplexity: 'O(M * N) - In worst case recursion stack depth equals M * N.'
    },
    hints: [
      'Treat the grid as an undirected graph where each 1 has edges to its 4 orthogonal neighbors.',
      'Modify visited 1s to 0 in-place to avoid auxiliary visited set allocation.'
    ],
    totalSubmissions: 61200,
    acceptedSubmissions: 35100,
    acceptanceRate: 57.3
  },
  {
    problemId: 'prob_7',
    title: 'Course Schedule',
    slug: 'course-schedule',
    difficulty: 'Medium',
    topics: ['Graph', 'BFS', 'DFS', 'Topological Sort'],
    companies: ['Amazon', 'Google', 'Microsoft'],
    companyDisclaimer: 'Commonly associated with interview rounds at Amazon, Google, Microsoft.',
    description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [ai, bi]\` indicates that you **must** take course \`bi\` first if you want to take course \`ai\`.

- For example, the pair \`[0, 1]\` indicates that to take course \`0\` you have to first take course \`1\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.`,
    inputFormat: 'Line 1: Integer numCourses\nLine 2: 2D array prerequisites',
    outputFormat: 'Boolean true if a valid topological order exists without cycles, false otherwise.',
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2',
      '0 <= ai, bi < numCourses',
      'All the pairs prerequisites[i] are unique.'
    ],
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: 'true',
        explanation: 'There are 2 courses to take. To take course 1 you should have finished course 0. So it is possible.'
      },
      {
        input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
        output: 'false',
        explanation: 'There are 2 courses to take. To take course 1 you need 0, and to take course 0 you need 1. This circular dependency is impossible.'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
function canFinish(numCourses, prerequisites) {
    const inDegree = new Array(numCourses).fill(0);
    const adj = Array.from({ length: numCourses }, () => []);
    
    for (const [course, pre] of prerequisites) {
        adj[pre].push(course);
        inDegree[course]++;
    }
    
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) queue.push(i);
    }
    
    let processed = 0;
    while (queue.length > 0) {
        const curr = queue.shift();
        processed++;
        for (const next of adj[curr]) {
            inDegree[next]--;
            if (inDegree[next] === 0) {
                queue.push(next);
            }
        }
    }
    return processed === numCourses;
}`,
      python: `from collections import deque, defaultdict

class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        in_degree = [0] * numCourses
        adj = defaultdict(list)
        
        for course, pre in prerequisites:
            adj[pre].append(course)
            in_degree[course] += 1
            
        queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
        processed = 0
        
        while queue:
            curr = queue.popleft()
            processed += 1
            for nxt in adj[curr]:
                in_degree[nxt] -= 1
                if in_degree[nxt] == 0:
                    queue.append(nxt)
                    
        return processed == numCourses`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<int> inDegree(numCourses, 0);
        vector<vector<int>> adj(numCourses);
        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
            inDegree[p[0]]++;
        }
        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) q.push(i);
        }
        int processed = 0;
        while (!q.empty()) {
            int curr = q.front(); q.pop();
            processed++;
            for (int nxt : adj[curr]) {
                if (--inDegree[nxt] == 0) q.push(nxt);
            }
        }
        return processed == numCourses;
    }
};`,
      java: `import java.util.*;

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        int[] inDegree = new int[numCourses];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            inDegree[p[0]]++;
        }
        
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) queue.add(i);
        }
        
        int processed = 0;
        while (!queue.isEmpty()) {
            int curr = queue.poll();
            processed++;
            for (int next : adj.get(curr)) {
                if (--inDegree[next] == 0) queue.add(next);
            }
        }
        return processed == numCourses;
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: '2, [[1,0]]', expectedOutput: 'true', explanation: 'Direct dependency satisfied' },
      { input: '2, [[1,0],[0,1]]', expectedOutput: 'false', explanation: 'Circular loop' }
    ],
    hiddenTestcases: [
      { input: '1, []', expectedOutput: 'true', tag: 'single-course-no-prereqs' },
      { input: '3, [[1,0],[2,1]]', expectedOutput: 'true', tag: 'linear-chain' },
      { input: '3, [[0,1],[1,2],[2,0]]', expectedOutput: 'false', tag: '3-node-cycle' },
      { input: '4, [[1,0],[2,0],[3,1],[3,2]]', expectedOutput: 'true', tag: 'diamond-dag' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(V + E)', space: 'O(V + E)' },
    editorial: {
      approach: "Kahn's Algorithm (BFS Topological Sort)",
      intuition: 'Construct an adjacency list and in-degree counter. Enqueue all vertices with in-degree 0. As vertices are dequeued, decrement the in-degrees of their neighbors. If all vertices are processed, the graph is acyclic.',
      timeComplexity: 'O(V + E) where V = numCourses and E = prerequisites.length.',
      spaceComplexity: 'O(V + E) for adjacency list and in-degree array.'
    },
    hints: [
      'This problem is equivalent to detecting whether a directed graph has a cycle.',
      'Use Topological Sort (Kahn algorithm with BFS or 3-color DFS state tracking).'
    ],
    totalSubmissions: 38200,
    acceptedSubmissions: 17900,
    acceptanceRate: 46.8
  },
  {
    problemId: 'prob_8',
    title: 'Word Ladder',
    slug: 'word-ladder',
    difficulty: 'Hard',
    topics: ['BFS', 'Hash Table', 'String'],
    companies: ['Amazon', 'Google', 'Meta'],
    companyDisclaimer: 'Commonly associated with interview rounds at Amazon, Google, Meta.',
    description: `A **transformation sequence** from word \`beginWord\` to word \`endWord\` using a dictionary \`wordList\` is a sequence of words \`beginWord -> s1 -> s2 -> ... -> sk\` such that:

- Every adjacent pair of words differs by a single letter.
- Every \`si\` for \`1 <= i <= k\` is in \`wordList\`. Note that \`beginWord\` does not need to be in \`wordList\`.
- \`sk == endWord\`

Given two words, \`beginWord\` and \`endWord\`, and a dictionary \`wordList\`, return *the **number of words** in the **shortest transformation sequence** from \`beginWord\` to \`endWord\`, or \`0\` if no such sequence exists.*`,
    inputFormat: 'Line 1: beginWord\nLine 2: endWord\nLine 3: wordList array',
    outputFormat: 'Return integer length of shortest sequence, or 0 if unreachable.',
    constraints: [
      '1 <= beginWord.length <= 10',
      'endWord.length == beginWord.length',
      '1 <= wordList.length <= 5000',
      'wordList[i].length == beginWord.length',
      'beginWord, endWord, and wordList[i] consist of lowercase English letters.',
      'beginWord != endWord',
      'All the words in wordList are unique.'
    ],
    examples: [
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        output: '5',
        explanation: 'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.'
      },
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]',
        output: '0',
        explanation: 'The endWord "cog" is not in wordList, therefore there is no valid transformation sequence.'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
function ladderLength(beginWord, endWord, wordList) {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return 0;
    
    let queue = [[beginWord, 1]];
    const visited = new Set([beginWord]);
    
    while (queue.length > 0) {
        const [word, level] = queue.shift();
        if (word === endWord) return level;
        
        for (let i = 0; i < word.length; i++) {
            for (let c = 97; c <= 122; c++) {
                const newChar = String.fromCharCode(c);
                if (newChar === word[i]) continue;
                const nextWord = word.slice(0, i) + newChar + word.slice(i + 1);
                
                if (wordSet.has(nextWord) && !visited.has(nextWord)) {
                    visited.add(nextWord);
                    queue.push([nextWord, level + 1]);
                }
            }
        }
    }
    return 0;
}`,
      python: `from collections import deque

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: list[str]) -> int:
        word_set = set(wordList)
        if endWord not in word_set:
            return 0
            
        queue = deque([(beginWord, 1)])
        visited = {beginWord}
        
        while queue:
            word, level = queue.popleft()
            if word == endWord:
                return level
            for i in range(len(word)):
                for ch in 'abcdefghijklmnopqrstuvwxyz':
                    next_word = word[:i] + ch + word[i+1:]
                    if next_word in word_set and next_word not in visited:
                        visited.add(next_word)
                        queue.append((next_word, level + 1))
        return 0`,
      cpp: `#include <string>
#include <vector>
#include <unordered_set>
#include <queue>
using namespace std;

class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> dict(wordList.begin(), wordList.end());
        if (!dict.count(endWord)) return 0;
        queue<pair<string, int>> q;
        q.push({beginWord, 1});
        dict.erase(beginWord);
        
        while (!q.empty()) {
            auto [word, len] = q.front(); q.pop();
            if (word == endWord) return len;
            for (int i = 0; i < word.length(); i++) {
                char orig = word[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    word[i] = c;
                    if (dict.count(word)) {
                        dict.erase(word);
                        q.push({word, len + 1});
                    }
                }
                word[i] = orig;
            }
        }
        return 0;
    }
};`,
      java: `import java.util.*;

class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> dict = new HashSet<>(wordList);
        if (!dict.contains(endWord)) return 0;
        
        Queue<String> queue = new LinkedList<>();
        queue.add(beginWord);
        int level = 1;
        
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int s = 0; s < size; s++) {
                String word = queue.poll();
                if (word.equals(endWord)) return level;
                char[] chars = word.toCharArray();
                for (int i = 0; i < chars.length; i++) {
                    char old = chars[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        chars[i] = c;
                        String next = new String(chars);
                        if (dict.contains(next)) {
                            dict.remove(next);
                            queue.add(next);
                        }
                    }
                    chars[i] = old;
                }
            }
            level++;
        }
        return 0;
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: '"hit", "cog", ["hot","dot","dog","lot","log","cog"]', expectedOutput: '5', explanation: 'hit->hot->dot->dog->cog' },
      { input: '"hit", "cog", ["hot","dot","dog","lot","log"]', expectedOutput: '0', explanation: 'cog is missing from dictionary' }
    ],
    hiddenTestcases: [
      { input: '"a", "c", ["a","b","c"]', expectedOutput: '2', tag: 'single-letter-words' },
      { input: '"hot", "dog", ["hot","dog"]', expectedOutput: '0', tag: 'distance-greater-than-one' },
      { input: '"lost", "cost", ["most","fost","cost"]', expectedOutput: '2', tag: 'direct-one-step' }
    ],
    timeLimit: 3000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(M^2 * N)', space: 'O(M * N)' },
    editorial: {
      approach: 'Breadth-First Search (BFS) / Bidirectional BFS',
      intuition: 'Since all edges have uniform weight 1, the shortest path on the word graph can be found using BFS. Mutate each character from a-z and query the hash set.',
      timeComplexity: 'O(M^2 * N) where M is word length and N is word list size.',
      spaceComplexity: 'O(M * N) to store words in hash set and queue.'
    },
    hints: [
      'Think of words as vertices in an unweighted graph where edges connect words differing by 1 character.',
      'BFS guarantees finding the shortest transformation path first.'
    ],
    totalSubmissions: 25600,
    acceptedSubmissions: 9700,
    acceptanceRate: 37.9
  },
  {
    problemId: 'prob_9',
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    topics: ['Arrays', 'Dynamic Programming', 'Divide and Conquer'],
    companies: ['Amazon', 'Google', 'Microsoft'],
    companyDisclaimer: 'Commonly associated with interview rounds at Amazon, Google, Microsoft.',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.

A **subarray** is a contiguous non-empty sequence of elements within an array.`,
    inputFormat: 'An integer array nums',
    outputFormat: 'Return a single integer representing the maximum contiguous subarray sum.',
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1',
        explanation: 'The subarray [1] has the largest sum 1.'
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23',
        explanation: 'The subarray [5,4,-1,7,8] has the largest sum 23.'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
    let currentSum = nums[0];
    let maxSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
}`,
      python: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        curr_sum = max_sum = nums[0]
        for x in nums[1:]:
            curr_sum = max(x, curr_sum + x)
            max_sum = max(max_sum, curr_sum)
        return max_sum`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int currSum = nums[0], maxSum = nums[0];
        for (size_t i = 1; i < nums.size(); i++) {
            currSum = max(nums[i], currSum + nums[i]);
            maxSum = max(maxSum, currSum);
        }
        return maxSum;
    }
};`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        int currSum = nums[0];
        int maxSum = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currSum = Math.max(nums[i], currSum + nums[i]);
            maxSum = Math.max(maxSum, currSum);
        }
        return maxSum;
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', explanation: '[4,-1,2,1] sum is 6' },
      { input: '[5,4,-1,7,8]', expectedOutput: '23', explanation: 'Entire array sum is 23' }
    ],
    hiddenTestcases: [
      { input: '[-1]', expectedOutput: '-1', tag: 'single-negative' },
      { input: '[-5,-4,-3,-2,-1]', expectedOutput: '-1', tag: 'all-negative-numbers' },
      { input: '[1,2,3,4,5]', expectedOutput: '15', tag: 'all-positive-numbers' },
      { input: '[-2,-1,-3,-4]', expectedOutput: '-1', tag: 'least-negative' },
      { input: '[100,-50,100]', expectedOutput: '150', tag: 'alternating' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(N)', space: 'O(1)' },
    editorial: {
      approach: "Kadane's Dynamic Programming Algorithm",
      intuition: 'At each index i, we decide whether to append nums[i] to the existing running subarray sum (currentSum + nums[i]) or start a fresh subarray at nums[i].',
      timeComplexity: 'O(N) - A single pass over the array.',
      spaceComplexity: 'O(1) - Constant auxiliary space.'
    },
    hints: [
      'If current prefix sum drops below 0, it will only hurt future subarray sums.',
      'Reset running sum to nums[i] whenever currentSum < 0.'
    ],
    totalSubmissions: 57400,
    acceptedSubmissions: 31000,
    acceptanceRate: 54.0
  },
  {
    problemId: 'prob_10',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    topics: ['Arrays', 'Two Pointers', 'Stack'],
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft'],
    companyDisclaimer: 'Commonly associated with interview rounds at Amazon, Google, Meta, Microsoft.',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    inputFormat: 'An array of non-negative integers height',
    outputFormat: 'Return a single integer representing total trapped water units.',
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.'
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
        explanation: '9 units of rain water trapped.'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
    if (!height || height.length === 0) return 0;
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0;
    let totalWater = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                totalWater += leftMax - height[left];
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                totalWater += rightMax - height[right];
            }
            right--;
        }
    }
    return totalWater;
}`,
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        if not height:
            return 0
        left, right = 0, len(height) - 1
        left_max = right_max = total_water = 0
        
        while left < right:
            if height[left] < height[right]:
                if height[left] >= left_max:
                    left_max = height[left]
                else:
                    total_water += left_max - height[left]
                left += 1
            else:
                if height[right] >= right_max:
                    right_max = height[right]
                else:
                    total_water += right_max - height[right]
                right -= 1
        return total_water`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
};`,
      java: `class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0, total = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else total += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else total += rightMax - height[right];
                right--;
            }
        }
        return total;
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', explanation: '6 units of water trapped' },
      { input: '[4,2,0,3,2,5]', expectedOutput: '9', explanation: '9 units of water trapped' }
    ],
    hiddenTestcases: [
      { input: '[3]', expectedOutput: '0', tag: 'single-bar' },
      { input: '[3,2,1]', expectedOutput: '0', tag: 'descending' },
      { input: '[1,2,3]', expectedOutput: '0', tag: 'ascending' },
      { input: '[5,0,5]', expectedOutput: '5', tag: 'u-shaped-well' },
      { input: '[0,2,0]', expectedOutput: '0', tag: 'peak-middle' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(N)', space: 'O(1)' },
    editorial: {
      approach: 'Two Pointers Technique',
      intuition: 'The water trapped at any position is bounded by min(maxLeft, maxRight) - height[i]. By maintaining left and right pointers and processing the smaller side, we guarantee accurate bound resolution.',
      timeComplexity: 'O(N) - Linear single pass.',
      spaceComplexity: 'O(1) - Constant extra space.'
    },
    hints: [
      'Water level above any bar is determined by min(max_left, max_right) - height[i].',
      'Can you maintain leftMax and rightMax simultaneously moving inward from both ends?'
    ],
    totalSubmissions: 39100,
    acceptedSubmissions: 15800,
    acceptanceRate: 40.4
  },
  {
    problemId: 'prob_11',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    topics: ['Stack', 'String'],
    companies: ['Bloomberg', 'Meta', 'Amazon', 'Microsoft'],
    companyDisclaimer: 'Commonly associated with interview rounds at Bloomberg, Meta, Amazon, Microsoft.',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    inputFormat: 'A string s containing parentheses characters.',
    outputFormat: 'Return boolean true if valid, false otherwise.',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    examples: [
      { input: 's = "()"', output: 'true', explanation: 'Valid pair' },
      { input: 's = "()[]{}"', output: 'true', explanation: 'All matching' },
      { input: 's = "(]"', output: 'false', explanation: 'Mismatched types' }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (const ch of s) {
        if (ch in map) {
            if (stack.length === 0 || stack.pop() !== map[ch]) return false;
        } else {
            stack.push(ch);
        }
    }
    return stack.length === 0;
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in mapping:
                top = stack.pop() if stack else '#'
                if mapping[char] != top:
                    return False
            else:
                stack.append(char)
        return not stack`,
      cpp: `#include <string>
#include <stack>
#include <unordered_map>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> mp = {{')', '('}, {'}', '{'}, {']', '['}};
        for (char c : s) {
            if (mp.count(c)) {
                if (st.empty() || st.top() != mp[c]) return false;
                st.pop();
            } else {
                st.push(c);
            }
        }
        return st.empty();
    }
};`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: '"()"', expectedOutput: 'true', explanation: 'Valid' },
      { input: '"([)]"', expectedOutput: 'false', explanation: 'Improperly interleaved' }
    ],
    hiddenTestcases: [
      { input: '"["', expectedOutput: 'false', tag: 'unclosed-single' },
      { input: '"]"', expectedOutput: 'false', tag: 'extra-close' },
      { input: '"{[]}"', expectedOutput: 'true', tag: 'nested-valid' }
    ],
    timeLimit: 1500,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(N)', space: 'O(N)' },
    editorial: {
      approach: 'LIFO Stack Matching',
      intuition: 'Push opening brackets onto a stack. When a closing bracket arrives, pop the topmost bracket and ensure it matches the corresponding opening bracket.',
      timeComplexity: 'O(N) - Linear pass through string.',
      spaceComplexity: 'O(N) - Stack size in worst case.'
    },
    hints: ['Use a stack to keep track of the most recent open bracket.'],
    totalSubmissions: 67800,
    acceptedSubmissions: 42100,
    acceptanceRate: 62.1
  },
  {
    problemId: 'prob_12',
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    topics: ['Dynamic Programming', 'BFS'],
    companies: ['Uber', 'Amazon', 'Google'],
    companyDisclaimer: 'Commonly associated with interview rounds at Uber, Amazon, Google.',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    inputFormat: 'Line 1: Integer array coins\nLine 2: Integer amount',
    outputFormat: 'Return minimum coin count integer, or -1 if impossible.',
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: 'coins = [2], amount = 3', output: '-1', explanation: 'Cannot form amount 3' }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for coin in coins:
                if i - coin >= 0:
                    dp[i] = min(dp[i], dp[i - coin] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) dp[i] = min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
      java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: '[1,2,5], 11', expectedOutput: '3', explanation: '5 + 5 + 1' },
      { input: '[2], 3', expectedOutput: '-1', explanation: 'Impossible' }
    ],
    hiddenTestcases: [
      { input: '[1], 0', expectedOutput: '0', tag: 'zero-amount' },
      { input: '[186,419,83,408], 6249', expectedOutput: '20', tag: 'large-amount-irregular-denominations' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(S * N)', space: 'O(S)' },
    editorial: {
      approach: 'Bottom-up Dynamic Programming',
      intuition: 'Define dp[i] as the minimum coins needed for amount i. Transition: dp[i] = min(dp[i], dp[i - coin] + 1).',
      timeComplexity: 'O(amount * len(coins)).',
      spaceComplexity: 'O(amount) for DP table.'
    },
    hints: ['Formulate optimal subproblem: F(amount) = min(F(amount - coin)) + 1.'],
    totalSubmissions: 44200,
    acceptedSubmissions: 19800,
    acceptanceRate: 44.8
  },
  {
    problemId: 'prob_13',
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    difficulty: 'Hard',
    topics: ['Arrays', 'Binary Search', 'Divide and Conquer'],
    companies: ['Google', 'Amazon', 'Microsoft', 'Apple'],
    companyDisclaimer: 'Commonly associated with interview rounds at Google, Amazon, Microsoft, Apple.',
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the **median** of the two sorted arrays.
The overall run time complexity should be \`O(log (m+n))\`.`,
    inputFormat: 'Line 1: Sorted integer array nums1\nLine 2: Sorted integer array nums2',
    outputFormat: 'Return floating point median number.',
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000'
    ],
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.0', explanation: 'merged array = [1,2,3] and median is 2.' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.5', explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.' }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function findMedianSortedArrays(nums1, nums2) {
    if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
    const m = nums1.length, n = nums2.length;
    let low = 0, high = m;
    while (low <= high) {
        const partitionX = Math.floor((low + high) / 2);
        const partitionY = Math.floor((m + n + 1) / 2) - partitionX;
        const maxLeftX = partitionX === 0 ? -Infinity : nums1[partitionX - 1];
        const minRightX = partitionX === m ? Infinity : nums1[partitionX];
        const maxLeftY = partitionY === 0 ? -Infinity : nums2[partitionY - 1];
        const minRightY = partitionY === n ? Infinity : nums2[partitionY];
        if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
            if ((m + n) % 2 === 0) {
                return (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2;
            } else {
                return Math.max(maxLeftX, maxLeftY);
            }
        } else if (maxLeftX > minRightY) {
            high = partitionX - 1;
        } else {
            low = partitionX + 1;
        }
    }
    return 0.0;
}`,
      python: `class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        m, n = len(nums1), len(nums2)
        low, high = 0, m
        while low <= high:
            px = (low + high) // 2
            py = (m + n + 1) // 2 - px
            maxLeftX = float('-inf') if px == 0 else nums1[px - 1]
            minRightX = float('inf') if px == m else nums1[px]
            maxLeftY = float('-inf') if py == 0 else nums2[py - 1]
            minRightY = float('inf') if py == n else nums2[py]
            if maxLeftX <= minRightY and maxLeftY <= minRightX:
                if (m + n) % 2 == 0:
                    return (max(maxLeftX, maxLeftY) + min(minRightX, minRightY)) / 2.0
                return float(max(maxLeftX, maxLeftY))
            elif maxLeftX > minRightY:
                high = px - 1
            else:
                low = px + 1
        return 0.0`,
      cpp: `#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);
        int m = nums1.size(), n = nums2.size();
        int low = 0, high = m;
        while (low <= high) {
            int px = (low + high) / 2;
            int py = (m + n + 1) / 2 - px;
            int maxLeftX = (px == 0) ? INT_MIN : nums1[px - 1];
            int minRightX = (px == m) ? INT_MAX : nums1[px];
            int maxLeftY = (py == 0) ? INT_MIN : nums2[py - 1];
            int minRightY = (py == n) ? INT_MAX : nums2[py];
            if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
                if ((m + n) % 2 == 0) {
                    return (max(maxLeftX, maxLeftY) + min(minRightX, minRightY)) / 2.0;
                } else {
                    return max(maxLeftX, maxLeftY);
                }
            } else if (maxLeftX > minRightY) {
                high = px - 1;
            } else {
                low = px + 1;
            }
        }
        return 0.0;
    }
};`,
      java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
        int m = nums1.length, n = nums2.length;
        int low = 0, high = m;
        while (low <= high) {
            int px = (low + high) / 2;
            int py = (m + n + 1) / 2 - px;
            int maxLeftX = (px == 0) ? Integer.MIN_VALUE : nums1[px - 1];
            int minRightX = (px == m) ? Integer.MAX_VALUE : nums1[px];
            int maxLeftY = (py == 0) ? Integer.MIN_VALUE : nums2[py - 1];
            int minRightY = (py == n) ? Integer.MAX_VALUE : nums2[py];
            if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
                if ((m + n) % 2 == 0) {
                    return (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2.0;
                } else {
                    return Math.max(maxLeftX, maxLeftY);
                }
            } else if (maxLeftX > minRightY) {
                high = px - 1;
            } else {
                low = px + 1;
            }
        }
        return 0.0;
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: '[1,3], [2]', expectedOutput: '2.0', explanation: 'Median of [1,2,3] is 2.0' },
      { input: '[1,2], [3,4]', expectedOutput: '2.5', explanation: 'Median of [1,2,3,4] is 2.5' }
    ],
    hiddenTestcases: [
      { input: '[0,0], [0,0]', expectedOutput: '0.0', tag: 'zeros' },
      { input: '[], [1]', expectedOutput: '1.0', tag: 'empty-array' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(log(min(M,N)))', space: 'O(1)' },
    editorial: {
      approach: 'Binary Search Partitioning',
      intuition: 'Partition both arrays such that left halves combined equals right halves combined and all left elements <= right elements.',
      timeComplexity: 'O(log(min(M, N)))',
      spaceComplexity: 'O(1)'
    },
    hints: ['Binary search on the smaller array partition index.'],
    totalSubmissions: 61200,
    acceptedSubmissions: 23100,
    acceptanceRate: 37.7
  },
  {
    problemId: 'prob_14',
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    difficulty: 'Medium',
    topics: ['Arrays', 'Binary Search'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
    companyDisclaimer: 'Commonly associated with interview rounds at Meta, Amazon, Google, Microsoft.',
    description: `Given a rotated sorted array \`nums\` of unique integers and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.
You must write an algorithm with \`O(log n)\` runtime complexity.`,
    inputFormat: 'Line 1: Rotated sorted array nums\nLine 2: Target integer',
    outputFormat: 'Return 0-indexed integer position, or -1.',
    constraints: [
      '1 <= nums.length <= 5000',
      '-10^4 <= nums[i] <= 10^4',
      'All values of nums are unique.'
    ],
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4', explanation: '0 is at index 4' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1', explanation: '3 is not present' }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) right = mid - 1;
            else left = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[right]) left = mid + 1;
            else right = mid - 1;
        }
    }
    return -1;
}`,
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            else:
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1
        return -1`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) right = mid - 1;
                else left = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[right]) left = mid + 1;
                else right = mid - 1;
            }
        }
        return -1;
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) right = mid - 1;
                else left = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[right]) left = mid + 1;
                else right = mid - 1;
            }
        }
        return -1;
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: '[4,5,6,7,0,1,2], 0', expectedOutput: '4', explanation: 'Index 4' },
      { input: '[4,5,6,7,0,1,2], 3', expectedOutput: '-1', explanation: 'Not found' }
    ],
    hiddenTestcases: [
      { input: '[1], 0', expectedOutput: '-1', tag: 'single-element-miss' },
      { input: '[1,3], 3', expectedOutput: '1', tag: 'two-elements' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(log N)', space: 'O(1)' },
    editorial: {
      approach: 'Modified Binary Search',
      intuition: 'At least one half of the array will always be strictly sorted. Determine which half is sorted and check if target lies within that range.',
      timeComplexity: 'O(log N)',
      spaceComplexity: 'O(1)'
    },
    hints: ['Check if nums[left] <= nums[mid] to see if the left half is normally sorted.'],
    totalSubmissions: 54100,
    acceptedSubmissions: 21500,
    acceptanceRate: 39.7
  },
  {
    problemId: 'prob_15',
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    topics: ['Arrays', 'Dynamic Programming'],
    companies: ['Amazon', 'Meta', 'Google', 'Apple', 'Bloomberg'],
    companyDisclaimer: 'Commonly associated with interview rounds at Amazon, Meta, Google, Apple, Bloomberg.',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`-th day.
You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.
Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    inputFormat: 'Line 1: Integer array prices',
    outputFormat: 'Return integer maximum profit.',
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'In this case, no transactions are done and max profit = 0.' }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    for (let i = 0; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else if (prices[i] - minPrice > maxProfit) {
            maxProfit = prices[i] - minPrice;
        }
    }
    return maxProfit;
}`,
      python: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        for p in prices:
            if p < min_price:
                min_price = p
            elif p - min_price > max_profit:
                max_profit = p - min_price
        return max_profit`,
      cpp: `#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX;
        int maxP = 0;
        for (int p : prices) {
            minPrice = min(minPrice, p);
            maxP = max(maxP, p - minPrice);
        }
        return maxP;
    }
};`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int p : prices) {
            if (p < minPrice) minPrice = p;
            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
        }
        return maxProfit;
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: '[7,1,5,3,6,4]', expectedOutput: '5', explanation: '6 - 1 = 5' },
      { input: '[7,6,4,3,1]', expectedOutput: '0', explanation: 'Declining prices' }
    ],
    hiddenTestcases: [
      { input: '[2,4,1]', expectedOutput: '2', tag: 'late-drop' },
      { input: '[1,2]', expectedOutput: '1', tag: 'monotonic-rise' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(N)', space: 'O(1)' },
    editorial: {
      approach: 'One-Pass Greedy Minimum Tracking',
      intuition: 'Maintain the running minimum purchase price seen so far. At each day, evaluate selling today.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    },
    hints: ['Track the lowest buying price encountered as you iterate.'],
    totalSubmissions: 98400,
    acceptedSubmissions: 53200,
    acceptanceRate: 54.1
  },
  {
    problemId: 'prob_16',
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    difficulty: 'Medium',
    topics: ['Arrays', 'Prefix Sum'],
    companies: ['Amazon', 'Meta', 'Apple', 'Microsoft'],
    companyDisclaimer: 'Commonly associated with interview rounds at Amazon, Meta, Apple, Microsoft.',
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.
You must write an algorithm that runs in \`O(n)\` time and without using the division operation.`,
    inputFormat: 'Line 1: Integer array nums',
    outputFormat: 'Return integer array where answer[i] is product of all elements except nums[i].',
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
      'The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.'
    ],
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', explanation: '2*3*4=24, 1*3*4=12, 1*2*4=8, 1*2*3=6' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]', explanation: 'Zero handling' }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function productExceptSelf(nums) {
    const n = nums.length;
    const res = new Array(n).fill(1);
    let left = 1;
    for (let i = 0; i < n; i++) {
        res[i] = left;
        left *= nums[i];
    }
    let right = 1;
    for (let i = n - 1; i >= 0; i--) {
        res[i] *= right;
        right *= nums[i];
    }
    return res;
}`,
      python: `class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        n = len(nums)
        res = [1] * n
        left = 1
        for i in range(n):
            res[i] = left
            left *= nums[i]
        right = 1
        for i in range(n - 1, -1, -1):
            res[i] *= right
            right *= nums[i]
        return res`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> res(n, 1);
        int left = 1;
        for (int i = 0; i < n; i++) {
            res[i] = left;
            left *= nums[i];
        }
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            res[i] *= right;
            right *= nums[i];
        }
        return res;
    }
};`,
      java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        int left = 1;
        for (int i = 0; i < n; i++) {
            res[i] = left;
            left *= nums[i];
        }
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            res[i] *= right;
            right *= nums[i];
        }
        return res;
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: '[1,2,3,4]', expectedOutput: '[24,12,8,6]', explanation: 'Standard prefix suffix' },
      { input: '[-1,1,0,-3,3]', expectedOutput: '[0,0,9,0,0]', explanation: 'Contains zero' }
    ],
    hiddenTestcases: [
      { input: '[0,0]', expectedOutput: '[0,0]', tag: 'double-zero' },
      { input: '[2,3]', expectedOutput: '[3,2]', tag: 'two-elements' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(N)', space: 'O(1)' },
    editorial: {
      approach: 'Prefix and Suffix Accumulation',
      intuition: 'Compute prefix products moving left-to-right, then multiply by suffix products moving right-to-left.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1) extra space excluding output array.'
    },
    hints: ['Construct the output array with prefix products first, then iterate backwards with running suffix product.'],
    totalSubmissions: 72000,
    acceptedSubmissions: 46800,
    acceptanceRate: 65.0
  },
  {
    problemId: 'prob_17',
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    topics: ['Two Pointers', 'Strings'],
    companies: ['Meta', 'Amazon', 'Microsoft', 'Spotify'],
    companyDisclaimer: 'Commonly associated with interview rounds at Meta, Amazon, Microsoft, Spotify.',
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.
Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    inputFormat: 'Line 1: Input string s',
    outputFormat: 'Return boolean true or false.',
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0, right = clean.length - 1;
    while (left < right) {
        if (clean[left] !== clean[right]) return false;
        left++;
        right--;
    }
    return true;
}`,
      python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        clean = [c.lower() for c in s if c.isalnum()]
        return clean == clean[::-1]`,
      cpp: `#include <string>
#include <cctype>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        int left = 0, right = s.size() - 1;
        while (left < right) {
            while (left < right && !isalnum(s[left])) left++;
            while (left < right && !isalnum(s[right])) right--;
            if (tolower(s[left]) != tolower(s[right])) return false;
            left++;
            right--;
        }
        return true;
    }
};`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) return false;
            left++;
            right--;
        }
        return true;
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true', explanation: 'Palindrome' },
      { input: '"race a car"', expectedOutput: 'false', explanation: 'Not palindrome' }
    ],
    hiddenTestcases: [
      { input: '" "', expectedOutput: 'true', tag: 'whitespace-empty' },
      { input: '"0P"', expectedOutput: 'false', tag: 'alphanumeric-mismatch' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(N)', space: 'O(1)' },
    editorial: {
      approach: 'Two-Pointer In-Place Validation',
      intuition: 'Pointers start at start and end of string, skip non-alphanumeric characters and verify matching lowercases.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    },
    hints: ['Skip non-alphanumeric characters using pointers.'],
    totalSubmissions: 89000,
    acceptedSubmissions: 48900,
    acceptanceRate: 55.0
  },
  {
    problemId: 'prob_18',
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'Medium',
    topics: ['Arrays', 'Intervals', 'Sorting'],
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Bloomberg'],
    companyDisclaimer: 'Commonly associated with interview rounds at Google, Meta, Amazon, Microsoft, Bloomberg.',
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.`,
    inputFormat: 'Line 1: 2D integer array intervals',
    outputFormat: 'Return merged 2D integer array.',
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= start_i <= end_i <= 10^4'
    ],
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Intervals [1,3] and [2,6] overlap, merged into [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
    if (!intervals.length) return [];
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const last = merged[merged.length - 1];
        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.push(current);
        }
    }
    return merged;
}`,
      python: `class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        intervals.sort(key=lambda x: x[0])
        merged = []
        for interval in intervals:
            if not merged or merged[-1][1] < interval[0]:
                merged.append(interval)
            else:
                merged[-1][1] = max(merged[-1][1], interval[1])
        return merged`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        if (intervals.empty()) return {};
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> merged;
        merged.push_back(intervals[0]);
        for (int i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] <= merged.back()[1]) {
                merged.back()[1] = max(merged.back()[1], intervals[i][1]);
            } else {
                merged.push_back(intervals[i]);
            }
        }
        return merged;
    }
};`,
      java: `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals.length <= 1) return intervals;
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> result = new ArrayList<>();
        int[] current = intervals[0];
        result.add(current);
        for (int[] interval : intervals) {
            if (interval[0] <= current[1]) {
                current[1] = Math.max(current[1], interval[1]);
            } else {
                current = interval;
                result.add(current);
            }
        }
        return result.toArray(new int[result.size()][]);
    }
}`
    },
    supportedLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
    publicTestcases: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]', explanation: 'Overlap merged' },
      { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]', explanation: 'Touch point merged' }
    ],
    hiddenTestcases: [
      { input: '[[1,4],[2,3]]', expectedOutput: '[[1,4]]', tag: 'complete-subsumption' },
      { input: '[[1,4],[0,4]]', expectedOutput: '[[0,4]]', tag: 'unsorted-start' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    expectedComplexity: { time: 'O(N log N)', space: 'O(N)' },
    editorial: {
      approach: 'Sort by Start Time and Linear Merge',
      intuition: 'Once sorted by start times, overlapping intervals are guaranteed to be contiguous.',
      timeComplexity: 'O(N log N) from sorting.',
      spaceComplexity: 'O(N) for output merged list.'
    },
    hints: ['Sort the intervals by their start values first.'],
    totalSubmissions: 67800,
    acceptedSubmissions: 31200,
    acceptanceRate: 46.0
  }
];

module.exports = { SEED_PROBLEMS };

