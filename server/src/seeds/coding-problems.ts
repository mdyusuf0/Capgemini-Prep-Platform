import { CodingProblem } from '../models/CodingProblem.js';

export const seedCodingProblems = async () => {
  await CodingProblem.deleteMany({}); // Clear existing

  const getBoilerplate = (name: string, returnType: string, args: string, argNames: string, returnFmt: string) => ({
    java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read input here\n        // System.out.println(solution(...));\n    }\n\n    public static ${returnType} solution(${args}) {\n        // Write your code here\n        return null;\n    }\n}`,
    cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\n${returnType} solution(${args}) {\n    // Write your code here\n    return {};\n}\n\nint main() {\n    // Read input here\n    // cout << solution(${argNames}) << endl;\n    return 0;\n}`,
    python: `def solution(${argNames}):\n    # Write your code here\n    pass\n\nif __name__ == "__main__":\n    # Read input here\n    # print(solution(${argNames}))\n    pass`,
    c: `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n// Adjust return type and arguments as needed\nvoid solution() {\n    // Write your code here\n}\n\nint main() {\n    // Read input here\n    // solution();\n    return 0;\n}`
  });

  const generateTestCase = (input: string, output: string, isHidden = false) => ({
    input, expectedOutput: output, isHidden, explanation: isHidden ? undefined : 'Standard test case'
  });

  const problems = [
    // ---------------- ARRAYS (8) ----------------
    {
      title: "Two Sum",
      description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
      inputFormat: "First line: N (size of array)\\nSecond line: N space-separated integers\\nThird line: target integer",
      outputFormat: "Two space-separated integers representing the indices.",
      constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
      examples: [{ input: "4\n2 7 11 15\n9", output: "0 1", explanation: "nums[0] + nums[1] == 9" }],
      difficulty: "easy",
      topics: ["Arrays", "Hashing"],
      hints: ["Use a hash map to store elements and their indices."],
      editorial: "Iterate through the array while storing elements in a hash map. For each element, check if (target - element) exists in the map.",
      expectedComplexity: { time: "O(N)", space: "O(N)" },
      starterCode: getBoilerplate("TwoSum", "int[]", "int[] nums, int target", "nums, target", "0 1"),
      testCases: [
        generateTestCase("4\n2 7 11 15\n9", "0 1"),
        generateTestCase("3\n3 2 4\n6", "1 2"),
        generateTestCase("2\n3 3\n6", "0 1", true),
        generateTestCase("5\n-1 -2 -3 -4 -5\n-8", "2 4", true)
      ],
      relevance: "must-know", capgeminiRelevance: 5
    },
    {
      title: "Find Missing Number",
      description: "Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one that is missing from the array.",
      inputFormat: "First line: N\\nSecond line: N space-separated integers",
      outputFormat: "A single integer (the missing number)",
      constraints: ["1 <= N <= 10^4"],
      examples: [{ input: "3\n3 0 1", output: "2", explanation: "2 is missing from [0,1,3]" }],
      difficulty: "easy",
      topics: ["Arrays", "Math"],
      hints: ["Sum of first N natural numbers is N*(N+1)/2"],
      editorial: "Calculate expected sum and subtract actual sum.",
      expectedComplexity: { time: "O(N)", space: "O(1)" },
      starterCode: getBoilerplate("MissingNumber", "int", "int[] nums", "nums", "2"),
      testCases: [
        generateTestCase("3\n3 0 1", "2"),
        generateTestCase("2\n0 1", "2"),
        generateTestCase("9\n9 6 4 2 3 5 7 0 1", "8", true)
      ],
      relevance: "high-priority", capgeminiRelevance: 4
    },
    {
      title: "Max Subarray Sum",
      description: "Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. (Kadane's Algorithm)",
      inputFormat: "First line: N\\nSecond line: N space-separated integers",
      outputFormat: "A single integer",
      constraints: ["1 <= N <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      examples: [{ input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6", explanation: "[4,-1,2,1] has the largest sum = 6." }],
      difficulty: "medium",
      topics: ["Arrays", "Dynamic Programming"],
      hints: ["Keep track of current sum and max sum."],
      editorial: "Kadane's algorithm: curr_sum = max(nums[i], curr_sum + nums[i])",
      expectedComplexity: { time: "O(N)", space: "O(1)" },
      starterCode: getBoilerplate("MaxSubArray", "int", "int[] nums", "nums", "6"),
      testCases: [
        generateTestCase("9\n-2 1 -3 4 -1 2 1 -5 4", "6"),
        generateTestCase("1\n1", "1"),
        generateTestCase("5\n5 4 -1 7 8", "23", true),
        generateTestCase("3\n-1 -2 -3", "-1", true)
      ],
      relevance: "must-know", capgeminiRelevance: 5
    },
    {
      title: "Rotate Array",
      description: "Rotate an array of n elements to the right by k steps.",
      inputFormat: "First line: N and K\\nSecond line: N space-separated integers",
      outputFormat: "N space-separated integers",
      constraints: ["1 <= N <= 10^5", "0 <= K <= 10^5"],
      examples: [{ input: "7 3\n1 2 3 4 5 6 7", output: "5 6 7 1 2 3 4", explanation: "Rotate 3 steps right" }],
      difficulty: "medium",
      topics: ["Arrays", "Math"],
      hints: ["Reverse the array, then reverse parts."],
      editorial: "Reverse whole array, reverse first k, reverse remaining.",
      expectedComplexity: { time: "O(N)", space: "O(1)" },
      starterCode: getBoilerplate("RotateArray", "void", "int[] nums, int k", "nums, k", ""),
      testCases: [
        generateTestCase("7 3\n1 2 3 4 5 6 7", "5 6 7 1 2 3 4"),
        generateTestCase("4 2\n-1 -100 3 99", "3 99 -1 -100"),
        generateTestCase("2 3\n1 2", "2 1", true)
      ],
      relevance: "high-priority", capgeminiRelevance: 4
    },
    {
      title: "Second Largest",
      description: "Find the second largest distinct element in an array.",
      inputFormat: "First line: N\\nSecond line: N integers",
      outputFormat: "Single integer or -1 if none",
      constraints: ["1 <= N <= 10^5"],
      examples: [{ input: "6\n12 35 1 10 34 1", output: "34", explanation: "34 is second largest" }],
      difficulty: "easy",
      topics: ["Arrays"],
      hints: ["Keep track of max1 and max2."],
      editorial: "Traverse array updating max and second_max.",
      expectedComplexity: { time: "O(N)", space: "O(1)" },
      starterCode: getBoilerplate("SecondLargest", "int", "int[] arr", "arr", "34"),
      testCases: [
        generateTestCase("6\n12 35 1 10 34 1", "34"),
        generateTestCase("3\n10 10 10", "-1"),
        generateTestCase("5\n1 2 3 4 5", "4", true)
      ],
      relevance: "important", capgeminiRelevance: 3
    },
    {
      title: "Remove Duplicates from Sorted",
      description: "Given a sorted array, remove duplicates in-place such that each element appears only once and returns the new length.",
      inputFormat: "First line: N\\nSecond line: N integers",
      outputFormat: "Integer length followed by space separated array up to length",
      constraints: ["0 <= N <= 3 * 10^4"],
      examples: [{ input: "3\n1 1 2", output: "2\n1 2", explanation: "Length is 2, array is [1,2]" }],
      difficulty: "easy",
      topics: ["Arrays", "Two Pointers"],
      hints: ["Use two pointers."],
      editorial: "One pointer iterates, one keeps track of last unique.",
      expectedComplexity: { time: "O(N)", space: "O(1)" },
      starterCode: getBoilerplate("RemoveDupes", "int", "int[] nums", "nums", "2"),
      testCases: [
        generateTestCase("3\n1 1 2", "2\n1 2"),
        generateTestCase("10\n0 0 1 1 1 2 2 3 3 4", "5\n0 1 2 3 4"),
        generateTestCase("0\n", "0\n", true)
      ],
      relevance: "must-know", capgeminiRelevance: 4
    },
    {
      title: "Merge Two Sorted Arrays",
      description: "Merge two sorted arrays nums1 and nums2 into a single array sorted in non-decreasing order.",
      inputFormat: "First line: N M\\nSecond line: N integers\\nThird line: M integers",
      outputFormat: "N+M space separated integers",
      constraints: ["0 <= N, M <= 10^5"],
      examples: [{ input: "3 3\n1 2 3\n2 5 6", output: "1 2 2 3 5 6", explanation: "Merged output" }],
      difficulty: "easy",
      topics: ["Arrays", "Two Pointers"],
      hints: ["Use two pointers starting from ends or beginnings."],
      editorial: "Merge using two pointers.",
      expectedComplexity: { time: "O(N+M)", space: "O(N+M)" },
      starterCode: getBoilerplate("MergeArrays", "int[]", "int[] n1, int[] n2", "n1, n2", ""),
      testCases: [
        generateTestCase("3 3\n1 2 3\n2 5 6", "1 2 2 3 5 6"),
        generateTestCase("1 0\n1\n", "1"),
        generateTestCase("0 1\n\n1", "1", true)
      ],
      relevance: "practice", capgeminiRelevance: 3
    },
    {
      title: "Leaders in Array",
      description: "An element is leader if it is greater than all elements to its right. Find all leaders.",
      inputFormat: "First line: N\\nSecond line: N integers",
      outputFormat: "Space separated leaders",
      constraints: ["1 <= N <= 10^5"],
      examples: [{ input: "6\n16 17 4 3 5 2", output: "17 5 2", explanation: "17, 5, 2 are leaders" }],
      difficulty: "medium",
      topics: ["Arrays"],
      hints: ["Traverse from right to left."],
      editorial: "Maintain max from right.",
      expectedComplexity: { time: "O(N)", space: "O(N)" },
      starterCode: getBoilerplate("Leaders", "int[]", "int[] arr", "arr", ""),
      testCases: [
        generateTestCase("6\n16 17 4 3 5 2", "17 5 2"),
        generateTestCase("5\n1 2 3 4 5", "5"),
        generateTestCase("5\n5 4 3 2 1", "5 4 3 2 1", true)
      ],
      relevance: "important", capgeminiRelevance: 4
    },

    // ---------------- STRINGS (7) ----------------
    {
      title: "Reverse String",
      description: "Write a function that reverses a string.",
      inputFormat: "Single string S",
      outputFormat: "Reversed string",
      constraints: ["1 <= S.length <= 10^5"],
      examples: [{ input: "hello", output: "olleh", explanation: "reversed" }],
      difficulty: "easy",
      topics: ["Strings", "Two Pointers"],
      hints: ["Swap first and last characters."],
      editorial: "Use two pointers, swap and move inwards.",
      expectedComplexity: { time: "O(N)", space: "O(1)" },
      starterCode: getBoilerplate("ReverseStr", "String", "String s", "s", ""),
      testCases: [
        generateTestCase("hello", "olleh"),
        generateTestCase("Capgemini", "inimegpaC"),
        generateTestCase("a", "a", true)
      ],
      relevance: "must-know", capgeminiRelevance: 4
    },
    {
      title: "Check Palindrome",
      description: "Check if a given string is a palindrome.",
      inputFormat: "Single string S",
      outputFormat: "true or false",
      constraints: ["1 <= S.length <= 10^5"],
      examples: [{ input: "racecar", output: "true", explanation: "Reads same forwards and backwards" }],
      difficulty: "easy",
      topics: ["Strings"],
      hints: ["Use two pointers."],
      editorial: "Compare ends moving inwards.",
      expectedComplexity: { time: "O(N)", space: "O(1)" },
      starterCode: getBoilerplate("IsPalindrome", "boolean", "String s", "s", ""),
      testCases: [
        generateTestCase("racecar", "true"),
        generateTestCase("hello", "false"),
        generateTestCase("a", "true", true)
      ],
      relevance: "must-know", capgeminiRelevance: 5
    },
    {
      title: "Anagram Check",
      description: "Check if two strings are anagrams of each other.",
      inputFormat: "Two strings S1 and S2 on separate lines",
      outputFormat: "true or false",
      constraints: ["1 <= len <= 5*10^4"],
      examples: [{ input: "listen\nsilent", output: "true", explanation: "Same characters." }],
      difficulty: "easy",
      topics: ["Strings", "Hashing"],
      hints: ["Count characters."],
      editorial: "Use a frequency array or hash map.",
      expectedComplexity: { time: "O(N)", space: "O(1)" },
      starterCode: getBoilerplate("IsAnagram", "boolean", "String s1, String s2", "s1, s2", ""),
      testCases: [
        generateTestCase("listen\nsilent", "true"),
        generateTestCase("hello\nworld", "false"),
        generateTestCase("a\na", "true", true)
      ],
      relevance: "high-priority", capgeminiRelevance: 5
    },
    {
      title: "First Non-Repeating Char",
      description: "Find the first non-repeating character in a string and return its index.",
      inputFormat: "Single string S",
      outputFormat: "Integer index or -1",
      constraints: ["1 <= len <= 10^5"],
      examples: [{ input: "leetcode", output: "0", explanation: "l is first" }],
      difficulty: "easy",
      topics: ["Strings", "Hashing"],
      hints: ["Count frequencies."],
      editorial: "Count frequencies then iterate string.",
      expectedComplexity: { time: "O(N)", space: "O(1)" },
      starterCode: getBoilerplate("FirstUniq", "int", "String s", "s", ""),
      testCases: [
        generateTestCase("leetcode", "0"),
        generateTestCase("loveleetcode", "2"),
        generateTestCase("aabb", "-1", true)
      ],
      relevance: "important", capgeminiRelevance: 4
    },
    {
      title: "String Compression",
      description: "Compress string like aabbb -> a2b3.",
      inputFormat: "String S",
      outputFormat: "Compressed string",
      constraints: ["1 <= len <= 10^4"],
      examples: [{ input: "aabbbc", output: "a2b3c1", explanation: "Count runs." }],
      difficulty: "medium",
      topics: ["Strings"],
      hints: ["Keep track of current char and count."],
      editorial: "Iterate and count consecutive characters.",
      expectedComplexity: { time: "O(N)", space: "O(N)" },
      starterCode: getBoilerplate("Compress", "String", "String s", "s", ""),
      testCases: [
        generateTestCase("aabbbc", "a2b3c1"),
        generateTestCase("a", "a1"),
        generateTestCase("abbbbbbbbbb", "a1b10", true)
      ],
      relevance: "practice", capgeminiRelevance: 3
    },
    {
      title: "Count Vowels and Consonants",
      description: "Count the number of vowels and consonants in a string.",
      inputFormat: "String S",
      outputFormat: "Two integers: Vowels Consonants",
      constraints: ["1 <= len <= 10^5"],
      examples: [{ input: "hello", output: "2 3", explanation: "e,o are vowels" }],
      difficulty: "easy",
      topics: ["Strings"],
      hints: ["Iterate and check if a,e,i,o,u."],
      editorial: "Simple iteration and condition checks.",
      expectedComplexity: { time: "O(N)", space: "O(1)" },
      starterCode: getBoilerplate("Count", "int[]", "String s", "s", ""),
      testCases: [
        generateTestCase("hello", "2 3"),
        generateTestCase("aeiou", "5 0"),
        generateTestCase("xyz", "0 3", true)
      ],
      relevance: "practice", capgeminiRelevance: 3
    },
    {
      title: "Remove Duplicate Chars",
      description: "Remove duplicate characters from string maintaining first appearance order.",
      inputFormat: "String S",
      outputFormat: "String without duplicates",
      constraints: ["1 <= len <= 10^5"],
      examples: [{ input: "programming", output: "progamin", explanation: "Duplicates removed" }],
      difficulty: "medium",
      topics: ["Strings", "Hashing"],
      hints: ["Use a boolean array for seen chars."],
      editorial: "Maintain a set of seen characters.",
      expectedComplexity: { time: "O(N)", space: "O(1)" },
      starterCode: getBoilerplate("RemoveDupes", "String", "String s", "s", ""),
      testCases: [
        generateTestCase("programming", "progamin"),
        generateTestCase("aaaa", "a"),
        generateTestCase("abcdef", "abcdef", true)
      ],
      relevance: "important", capgeminiRelevance: 4
    },

    // ---------------- SORTING/SEARCHING (5) ----------------
    {
      title: "Binary Search",
      description: "Given a sorted array of integers nums and an integer target, write a function to search target in nums.",
      inputFormat: "N\\nN sorted integers\\nTarget",
      outputFormat: "Index of target or -1",
      constraints: ["1 <= N <= 10^4"],
      examples: [{ input: "6\n-1 0 3 5 9 12\n9", output: "4", explanation: "9 is at index 4" }],
      difficulty: "easy",
      topics: ["Searching"],
      hints: ["Find middle element and halve search space."],
      editorial: "Standard binary search implementation.",
      expectedComplexity: { time: "O(log N)", space: "O(1)" },
      starterCode: getBoilerplate("Search", "int", "int[] nums, int target", "nums, target", ""),
      testCases: [
        generateTestCase("6\n-1 0 3 5 9 12\n9", "4"),
        generateTestCase("6\n-1 0 3 5 9 12\n2", "-1"),
        generateTestCase("1\n5\n5", "0", true)
      ],
      relevance: "must-know", capgeminiRelevance: 5
    },
    {
      title: "Bubble Sort Implementation",
      description: "Implement bubble sort.",
      inputFormat: "N\\nN integers",
      outputFormat: "N sorted integers",
      constraints: ["1 <= N <= 10^3"],
      examples: [{ input: "5\n4 1 3 9 7", output: "1 3 4 7 9", explanation: "Sorted" }],
      difficulty: "easy",
      topics: ["Sorting"],
      hints: ["Compare adjacent elements and swap."],
      editorial: "Standard bubble sort with early exit flag.",
      expectedComplexity: { time: "O(N^2)", space: "O(1)" },
      starterCode: getBoilerplate("Sort", "int[]", "int[] nums", "nums", ""),
      testCases: [
        generateTestCase("5\n4 1 3 9 7", "1 3 4 7 9"),
        generateTestCase("3\n3 2 1", "1 2 3"),
        generateTestCase("5\n1 2 3 4 5", "1 2 3 4 5", true)
      ],
      relevance: "practice", capgeminiRelevance: 2
    },
    {
      title: "Find Peak Element",
      description: "Find an element that is strictly greater than its neighbors.",
      inputFormat: "N\\nN integers",
      outputFormat: "Index of any peak",
      constraints: ["1 <= N <= 10^3"],
      examples: [{ input: "4\n1 2 3 1", output: "2", explanation: "3 is a peak" }],
      difficulty: "medium",
      topics: ["Searching", "Binary Search"],
      hints: ["Can you do it in O(log N)?"],
      editorial: "Binary search by comparing mid with mid+1.",
      expectedComplexity: { time: "O(log N)", space: "O(1)" },
      starterCode: getBoilerplate("FindPeak", "int", "int[] nums", "nums", ""),
      testCases: [
        generateTestCase("4\n1 2 3 1", "2"),
        generateTestCase("7\n1 2 1 3 5 6 4", "5"),
        generateTestCase("1\n1", "0", true)
      ],
      relevance: "important", capgeminiRelevance: 4
    },
    {
      title: "Kth Smallest Element",
      description: "Find the kth smallest element in an unsorted array.",
      inputFormat: "N\\nN integers\\nK",
      outputFormat: "The kth smallest integer",
      constraints: ["1 <= K <= N <= 10^4"],
      examples: [{ input: "6\n7 10 4 3 20 15\n3", output: "7", explanation: "3rd smallest is 7" }],
      difficulty: "medium",
      topics: ["Sorting", "Heaps"],
      hints: ["Use a max heap or quickselect."],
      editorial: "Sort or use heap.",
      expectedComplexity: { time: "O(N log K)", space: "O(K)" },
      starterCode: getBoilerplate("KthSmallest", "int", "int[] nums, int k", "nums, k", ""),
      testCases: [
        generateTestCase("6\n7 10 4 3 20 15\n3", "7"),
        generateTestCase("5\n1 2 3 4 5\n1", "1"),
        generateTestCase("4\n4 4 4 4\n2", "4", true)
      ],
      relevance: "high-priority", capgeminiRelevance: 4
    },
    {
      title: "Sort 0s 1s 2s",
      description: "Sort an array of 0s, 1s and 2s in-place. (Dutch National Flag)",
      inputFormat: "N\\nN integers",
      outputFormat: "Sorted integers",
      constraints: ["1 <= N <= 10^5"],
      examples: [{ input: "6\n2 0 2 1 1 0", output: "0 0 1 1 2 2", explanation: "Sorted" }],
      difficulty: "medium",
      topics: ["Arrays", "Sorting"],
      hints: ["Use three pointers: low, mid, high."],
      editorial: "Dutch National Flag Algorithm.",
      expectedComplexity: { time: "O(N)", space: "O(1)" },
      starterCode: getBoilerplate("SortColors", "void", "int[] nums", "nums", ""),
      testCases: [
        generateTestCase("6\n2 0 2 1 1 0", "0 0 1 1 2 2"),
        generateTestCase("3\n2 0 1", "0 1 2"),
        generateTestCase("1\n0", "0", true)
      ],
      relevance: "must-know", capgeminiRelevance: 5
    },

    // ---------------- HASHING (4) ----------------
    {
      title: "Frequency of Elements",
      description: "Print the frequencies of all elements in the array in the order of their first appearance.",
      inputFormat: "N\\nN integers",
      outputFormat: "Multi-line: 'Element Count'",
      constraints: ["1 <= N <= 10^4"],
      examples: [{ input: "5\n2 3 2 3 5", output: "2 2\n3 2\n5 1", explanation: "2 appears twice, 3 twice, 5 once" }],
      difficulty: "easy",
      topics: ["Hashing"],
      hints: ["Use a LinkedHashMap or map + list."],
      editorial: "Store frequencies in map.",
      expectedComplexity: { time: "O(N)", space: "O(N)" },
      starterCode: getBoilerplate("PrintFreq", "void", "int[] nums", "nums", ""),
      testCases: [
        generateTestCase("5\n2 3 2 3 5", "2 2\n3 2\n5 1"),
        generateTestCase("3\n1 1 1", "1 3"),
        generateTestCase("4\n1 2 3 4", "1 1\n2 1\n3 1\n4 1", true)
      ],
      relevance: "important", capgeminiRelevance: 4
    },
    {
      title: "Pair with Given Sum",
      description: "Check if there exists a pair in array with sum = target.",
      inputFormat: "N\\nN integers\\nTarget",
      outputFormat: "true or false",
      constraints: ["1 <= N <= 10^5"],
      examples: [{ input: "6\n0 -1 2 -3 1\n-2", output: "true", explanation: "-3 and 1 sum to -2" }],
      difficulty: "easy",
      topics: ["Hashing"],
      hints: ["Use a hash set."],
      editorial: "Check if target - x is in set.",
      expectedComplexity: { time: "O(N)", space: "O(N)" },
      starterCode: getBoilerplate("HasPair", "boolean", "int[] nums, int target", "nums, target", ""),
      testCases: [
        generateTestCase("5\n0 -1 2 -3 1\n-2", "true"),
        generateTestCase("4\n1 -2 1 0\n0", "false"),
        generateTestCase("2\n2 2\n4", "true", true)
      ],
      relevance: "must-know", capgeminiRelevance: 5
    },
    {
      title: "Longest Consecutive Sequence",
      description: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.",
      inputFormat: "N\\nN integers",
      outputFormat: "Integer length",
      constraints: ["0 <= N <= 10^5"],
      examples: [{ input: "6\n100 4 200 1 3 2", output: "4", explanation: "1, 2, 3, 4" }],
      difficulty: "medium",
      topics: ["Hashing"],
      hints: ["Insert all elements into a hash set."],
      editorial: "For each x, if x-1 not in set, it's a start of sequence.",
      expectedComplexity: { time: "O(N)", space: "O(N)" },
      starterCode: getBoilerplate("LongestConsecutive", "int", "int[] nums", "nums", ""),
      testCases: [
        generateTestCase("6\n100 4 200 1 3 2", "4"),
        generateTestCase("10\n0 3 7 2 5 8 4 6 0 1", "9"),
        generateTestCase("0\n", "0", true)
      ],
      relevance: "high-priority", capgeminiRelevance: 4
    },
    {
      title: "Group Anagrams",
      description: "Group a list of strings into anagrams.",
      inputFormat: "N\\nN strings",
      outputFormat: "Space separated sizes of groups in sorted order",
      constraints: ["1 <= N <= 10^4"],
      examples: [{ input: "6\neat tea tan ate nat bat", output: "1 2 3", explanation: "Groups of sizes 1, 2, 3" }],
      difficulty: "medium",
      topics: ["Hashing", "Strings"],
      hints: ["Sort each string and use as key."],
      editorial: "Use hash map with sorted string as key.",
      expectedComplexity: { time: "O(N * K log K)", space: "O(N * K)" },
      starterCode: getBoilerplate("GroupAnagramsSizes", "int[]", "String[] strs", "strs", ""),
      testCases: [
        generateTestCase("6\neat tea tan ate nat bat", "1 2 3"),
        generateTestCase("1\na", "1"),
        generateTestCase("3\na a a", "3", true)
      ],
      relevance: "practice", capgeminiRelevance: 3
    },

    // ---------------- MATH (3) ----------------
    {
      title: "GCD and LCM",
      description: "Find GCD and LCM of two numbers A and B.",
      inputFormat: "A B",
      outputFormat: "GCD LCM",
      constraints: ["1 <= A,B <= 10^4"],
      examples: [{ input: "12 15", output: "3 60", explanation: "gcd is 3, lcm is 60" }],
      difficulty: "easy",
      topics: ["Math"],
      hints: ["Use Euclidean algorithm."],
      editorial: "GCD(a,b) = GCD(b, a%b). LCM = (A*B)/GCD.",
      expectedComplexity: { time: "O(log(min(A,B)))", space: "O(1)" },
      starterCode: getBoilerplate("GcdLcm", "int[]", "int a, int b", "a, b", ""),
      testCases: [
        generateTestCase("12 15", "3 60"),
        generateTestCase("7 13", "1 91"),
        generateTestCase("10 10", "10 10", true)
      ],
      relevance: "must-know", capgeminiRelevance: 5
    },
    {
      title: "Check Prime",
      description: "Check if a number N is prime.",
      inputFormat: "N",
      outputFormat: "true or false",
      constraints: ["1 <= N <= 10^9"],
      examples: [{ input: "17", output: "true", explanation: "17 has no divisors" }],
      difficulty: "easy",
      topics: ["Math"],
      hints: ["Iterate till sqrt(N)."],
      editorial: "Check divisors up to sqrt(N).",
      expectedComplexity: { time: "O(sqrt(N))", space: "O(1)" },
      starterCode: getBoilerplate("IsPrime", "boolean", "int n", "n", ""),
      testCases: [
        generateTestCase("17", "true"),
        generateTestCase("1", "false"),
        generateTestCase("97", "true", true),
        generateTestCase("1000000000", "false", true)
      ],
      relevance: "must-know", capgeminiRelevance: 5
    },
    {
      title: "Fibonacci Nth Term",
      description: "Find the Nth Fibonacci number. (F(0)=0, F(1)=1)",
      inputFormat: "N",
      outputFormat: "Nth term modulo 10^9+7",
      constraints: ["0 <= N <= 10^5"],
      examples: [{ input: "5", output: "5", explanation: "0 1 1 2 3 5" }],
      difficulty: "easy",
      topics: ["Math", "Dynamic Programming"],
      hints: ["Use bottom up DP."],
      editorial: "Keep track of prev1 and prev2.",
      expectedComplexity: { time: "O(N)", space: "O(1)" },
      starterCode: getBoilerplate("Fibonacci", "int", "int n", "n", ""),
      testCases: [
        generateTestCase("5", "5"),
        generateTestCase("1", "1"),
        generateTestCase("10", "55", true),
        generateTestCase("0", "0", true)
      ],
      relevance: "must-know", capgeminiRelevance: 5
    },

    // ---------------- RECURSION (3) ----------------
    {
      title: "Power Function",
      description: "Implement pow(x, n), which calculates x raised to the power n.",
      inputFormat: "Double x\\nInteger n",
      outputFormat: "Double formatted to 5 decimal places",
      constraints: ["-100.0 < x < 100.0", "-2^31 <= n <= 2^31-1"],
      examples: [{ input: "2.00000\n10", output: "1024.00000", explanation: "2^10 = 1024" }],
      difficulty: "medium",
      topics: ["Recursion", "Math"],
      hints: ["Can you do it in O(log n)?"],
      editorial: "Binary exponentiation.",
      expectedComplexity: { time: "O(log N)", space: "O(log N)" },
      starterCode: getBoilerplate("MyPow", "double", "double x, int n", "x, n", ""),
      testCases: [
        generateTestCase("2.00000\n10", "1024.00000"),
        generateTestCase("2.10000\n3", "9.26100"),
        generateTestCase("2.00000\n-2", "0.25000", true)
      ],
      relevance: "important", capgeminiRelevance: 4
    },
    {
      title: "Sum of Digits",
      description: "Find the sum of digits of a given number using recursion.",
      inputFormat: "N",
      outputFormat: "Sum",
      constraints: ["0 <= N <= 10^9"],
      examples: [{ input: "1234", output: "10", explanation: "1+2+3+4=10" }],
      difficulty: "easy",
      topics: ["Recursion"],
      hints: ["N % 10 + func(N / 10)."],
      editorial: "Recursive reduction.",
      expectedComplexity: { time: "O(log N)", space: "O(log N)" },
      starterCode: getBoilerplate("SumDigits", "int", "int n", "n", ""),
      testCases: [
        generateTestCase("1234", "10"),
        generateTestCase("9", "9"),
        generateTestCase("0", "0", true),
        generateTestCase("9999", "36", true)
      ],
      relevance: "practice", capgeminiRelevance: 2
    },
    {
      title: "Tower of Hanoi Count",
      description: "Return the minimum number of moves required to solve Tower of Hanoi for N disks.",
      inputFormat: "N",
      outputFormat: "Moves",
      constraints: ["1 <= N <= 20"],
      examples: [{ input: "3", output: "7", explanation: "2^3 - 1" }],
      difficulty: "easy",
      topics: ["Recursion", "Math"],
      hints: ["The answer is 2^N - 1."],
      editorial: "Mathematical formula derived from recursion tree.",
      expectedComplexity: { time: "O(1)", space: "O(1)" },
      starterCode: getBoilerplate("HanoiMoves", "int", "int n", "n", ""),
      testCases: [
        generateTestCase("3", "7"),
        generateTestCase("1", "1"),
        generateTestCase("4", "15", true)
      ],
      relevance: "practice", capgeminiRelevance: 3
    }
  ];

  for (const prob of problems) {
    try {
      await CodingProblem.create(prob);
    } catch (e: any) {
      if (e.code !== 11000) console.error("Error creating problem", prob.title, e.message);
    }
  }
  console.log(`Successfully seeded ${problems.length} coding problems.`);
};
