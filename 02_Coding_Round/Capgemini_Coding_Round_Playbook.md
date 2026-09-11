# 💻 Capgemini Exceller Coding Round: The Complete Playbook

In Round 2, you have **45 minutes to solve 2 coding problems**.
To guarantee an interview shortlist, **you should aim for 100% test case pass on both questions** (or at minimum, 1 full pass + partial pass on the second).

---

## 📌 Round Specifications & Format

- **Duration:** 45 minutes
- **Number of Problems:** 2
- **Difficulty:**
  - Problem 1: Easy to Medium-Easy (Array/String simulation, counting, basic math)
  - Problem 2: Medium (Two pointers, Sliding window, Hashing, Greedy, or Matrix)
- **Languages Permitted:** C, C++, Java, Python
- **Platform:** Aon CoCubes / Mettl
- **I/O Style:** Often requires parsing standard input (`cin` / `Scanner` / `sys.stdin.read`), so know how to read inputs cleanly!

---

## 🏆 Top 10 Most Repeated Problem Patterns in Capgemini

| # | Pattern / Topic | Typical Question Types | Key Algorithmic Trick |
|:-:|:---|:---|:---|
| **1** | **String Manipulation** | Anagram check, String compression (`a3b2c1`), Reverse words in string | Frequency array `int count[26]`, Two pointers |
| **2** | **Array Sums & Windows** | Maximum subarray sum (Kadane's), Subarray with target sum | Kadane's Algorithm, Prefix Sum + HashMap |
| **3** | **Two Pointers** | Pair with target sum in sorted array, Move zeroes to end | Left & Right pointers approaching center |
| **4** | **Frequency & Hashing** | First non-repeating character, Element appearing $N/2$ times | HashMap / Hash Table / Frequency array |
| **5** | **Number Theory** | Prime factors, Sieve of Eratosthenes, GCD/LCM, Base conversion | Modulo arithmetic, Euclidean algorithm |
| **6** | **Matrix Manipulation** | Transpose, 90-degree rotation, Spiral matrix traversal | Row/Col index transformations |
| **7** | **Sorting & Intervals** | Merge overlapping intervals, Sort 0s, 1s, and 2s | Dutch National Flag algorithm, greedy sorting |
| **8** | **Bitwise Coding** | Single number in array where all others appear twice, Count set bits | XOR accumulator (`^`), `n & (n - 1)` |
| **9** | **Basic Dynamic Programming** | Climbing stairs, Fibonacci, House Robber / Max loot | State array `dp[i] = max(...)` |
| **10**| **Greedy Scheduling** | Maximum activities / meetings in one room | Sort by finish time |

---

## ⚠️ Pitfalls That Cause Test Cases to Fail

1. **Integer Overflow:**
   - In C++ and Java, using 32-bit `int` for sums can overflow if inputs are up to $10^9$. Always use `long long` in C++ or `long` in Java when calculating products or cumulative sums.
2. **Whitespace and Trailing Newline in Strings:**
   - If using `cin >> str` vs `getline`, reading strings with spaces can cause silent failures.
3. **Empty / Single Element Arrays:**
   - Always check bounds before accessing `arr[0]` or `arr[n - 1]`.
4. **Time Limit Exceeded (TLE):**
   - For $N = 10^5$, an $O(N^2)$ nested loop will **Time Out** (1-second limit is $\approx 10^8$ operations). You must use $O(N)$ or $O(N \log N)$ solutions.
