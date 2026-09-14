import { PseudocodeQuestion } from '../services/pseudocodeService';

export const FALLBACK_PSEUDOCODE_QUESTIONS: PseudocodeQuestion[] = [
  {
    "_id": "pseudo_v2_1",
    "question": "What will be the output of the following bitwise pseudocode?",
    "codeBlock": "INTEGER a, b, c\nSET a = 15, b = 9\nSET c = (a & b) + (a ^ b)\nPRINT c",
    "options": [
      "15",
      "24",
      "18",
      "9"
    ],
    "answer": 0,
    "explanation": "Fundamental identity: (a & b) + (a ^ b) = a | b. Binary: a = 1111_2, b = 1001_2. a | b = 1111_2 = 15.",
    "dryRunTrace": "a=15 (1111_2), b=9 (1001_2)\na & b = 1001_2 (9)\na ^ b = 0110_2 (6)\nc = 9 + 6 = 15 (also equal to a | b).",
    "topic": "Bitwise Operators",
    "subtopic": "Identity Simplification",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Bitwise Operators",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_2",
    "question": "What is the final value of result printed by the pseudocode?",
    "codeBlock": "INTEGER p, q, result\nSET p = 4, q = 6, result = 0\nFOR i FROM 1 TO p\n    result = result + q\nEND FOR\nPRINT result",
    "options": [
      "10",
      "24",
      "16",
      "36"
    ],
    "answer": 1,
    "explanation": "The loop repeats p (4) times, adding q (6) each iteration: 4 * 6 = 24.",
    "dryRunTrace": "i=1: result = 0 + 6 = 6\ni=2: result = 6 + 6 = 12\ni=3: result = 12 + 6 = 18\ni=4: result = 18 + 6 = 24.",
    "topic": "Loops & Conditions",
    "subtopic": "Iterative Multiplication",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Loops & Conditions",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_3",
    "question": "What is the return value of mystery(16, 24)?",
    "codeBlock": "FUNCTION mystery(a, b)\n    WHILE b != 0\n        INTEGER temp = b\n        b = a MOD b\n        a = temp\n    END WHILE\n    RETURN a\nEND FUNCTION",
    "options": [
      "4",
      "16",
      "8",
      "2"
    ],
    "answer": 2,
    "explanation": "This is Euclid's algorithm for Greatest Common Divisor (GCD). GCD(16, 24) = 8.",
    "dryRunTrace": "Iteration 1: a=16, b=24 -> temp=24, b=16 MOD 24=16, a=24\nIteration 2: a=24, b=16 -> temp=16, b=24 MOD 16=8, a=16\nIteration 3: a=16, b=8 -> temp=8, b=16 MOD 8=0, a=8\nLoop terminates because b==0. Returns a=8.",
    "topic": "Recursion & Functions",
    "subtopic": "Euclidean GCD",
    "difficulty": "medium",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Recursion & Functions",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_4",
    "question": "What will be printed by the following recursive function for test(4)?",
    "codeBlock": "FUNCTION test(n)\n    IF n <= 1 THEN\n        RETURN 1\n    END IF\n    RETURN n * test(n - 1)\nEND FUNCTION",
    "options": [
      "12",
      "16",
      "4",
      "24"
    ],
    "answer": 3,
    "explanation": "This computes factorial of n: 4! = 4 * 3 * 2 * 1 = 24.",
    "dryRunTrace": "test(4) = 4 * test(3)\ntest(3) = 3 * test(2)\ntest(2) = 2 * test(1)\ntest(1) = 1 (base case)\nUnwinding: 2*1 = 2 -> 3*2 = 6 -> 4*6 = 24.",
    "topic": "Recursion & Functions",
    "subtopic": "Factorial",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Recursion & Functions",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_5",
    "question": "What is the final value of count in the following loop?",
    "codeBlock": "INTEGER count = 0\nFOR i = 1 TO 5\n    FOR j = 1 TO i\n        count = count + 1\n    END FOR\nEND FOR\nPRINT count",
    "options": [
      "15",
      "25",
      "10",
      "20"
    ],
    "answer": 0,
    "explanation": "Sum of arithmetic progression: 1 + 2 + 3 + 4 + 5 = 15.",
    "dryRunTrace": "i=1: j in 1..1 (1 iteration)\ni=2: j in 1..2 (2 iterations)\ni=3: j in 1..3 (3 iterations)\ni=4: j in 1..4 (4 iterations)\ni=5: j in 1..5 (5 iterations)\nTotal = 1+2+3+4+5 = 15.",
    "topic": "Loops & Conditions",
    "subtopic": "Triangular Sum",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Loops & Conditions",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_6",
    "question": "What is the output of the following bitwise shift pseudocode?",
    "codeBlock": "INTEGER x = 12\nSET x = (x << 2) - (x >> 1)\nPRINT x",
    "options": [
      "48",
      "42",
      "36",
      "24"
    ],
    "answer": 1,
    "explanation": "x << 2 multiplies by 4: 12 * 4 = 48. x >> 1 divides by 2: 12 / 2 = 6. 48 - 6 = 42.",
    "dryRunTrace": "x = 12 (0000 1100_2)\nx << 2 = 48 (0011 0000_2)\nx >> 1 = 6  (0000 0110_2)\nx = 48 - 6 = 42.",
    "topic": "Bitwise Operators",
    "subtopic": "Bit Shifts",
    "difficulty": "medium",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Bitwise Operators",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_7",
    "question": "What is the output of the following array processing pseudocode?",
    "codeBlock": "INTEGER arr[] = {3, 7, 2, 9, 5}\nINTEGER maxVal = arr[0]\nFOR i = 1 TO 4\n    IF arr[i] > maxVal THEN\n        maxVal = arr[i]\n    END IF\nEND FOR\nPRINT maxVal",
    "options": [
      "7",
      "5",
      "9",
      "3"
    ],
    "answer": 2,
    "explanation": "Standard linear scan finding the maximum element in the array: 9.",
    "dryRunTrace": "Init: maxVal = arr[0] = 3\ni=1: arr[1]=7 > 3 -> maxVal = 7\ni=2: arr[2]=2 < 7 -> maxVal = 7\ni=3: arr[3]=9 > 7 -> maxVal = 9\ni=4: arr[4]=5 < 9 -> maxVal = 9\nOutput: 9.",
    "topic": "Arrays & Data Structures",
    "subtopic": "Linear Scan Max",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Arrays & Data Structures",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_8",
    "question": "What will be printed when calculate(13) executes?",
    "codeBlock": "FUNCTION calculate(n)\n    INTEGER count = 0\n    WHILE n > 0\n        count = count + (n & 1)\n        n = n >> 1\n    END WHILE\n    RETURN count\nEND FUNCTION",
    "options": [
      "4",
      "2",
      "1",
      "3"
    ],
    "answer": 3,
    "explanation": "This function counts set bits (Hamming weight). 13 in binary is 1101_2, which has three 1s. Returns 3.",
    "dryRunTrace": "n=13 (1101_2): n&1=1, count=1, n>>1=6 (0110_2)\nn=6: n&1=0, count=1, n>>1=3 (0011_2)\nn=3: n&1=1, count=2, n>>1=1 (0001_2)\nn=1: n&1=1, count=3, n>>1=0 (0000_2)\nLoop terminates. Returns count=3.",
    "topic": "Bitwise Operators",
    "subtopic": "Set Bit Count",
    "difficulty": "medium",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Bitwise Operators",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_9",
    "question": "What is the output of the following string reversal tracing pseudocode?",
    "codeBlock": "STRING str = \"CAPGEMINI\"\nINTEGER len = LENGTH(str)\nSTRING res = \"\"\nFOR i = len - 1 DOWNTO 0\n    res = res + str[i]\nEND FOR\nPRINT res",
    "options": [
      "INIMEGPAC",
      "CAPGEMINI",
      "INIMEG",
      "GPAC"
    ],
    "answer": 0,
    "explanation": "The loop concatenates characters in reverse index order: 'CAPGEMINI' -> 'INIMEGPAC'.",
    "dryRunTrace": "Characters picked from index 8 down to 0:\nstr[8]='I', str[7]='N', str[6]='I', str[5]='M', str[4]='E', str[3]='G', str[2]='P', str[1]='A', str[0]='C'\nResult = 'INIMEGPAC'.",
    "topic": "Strings & Logic",
    "subtopic": "Reverse Traversal",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Strings & Logic",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_10",
    "question": "What is the return value of fib(6)?",
    "codeBlock": "FUNCTION fib(n)\n    IF n <= 0 THEN RETURN 0\n    IF n == 1 THEN RETURN 1\n    RETURN fib(n - 1) + fib(n - 2)\nEND FUNCTION",
    "options": [
      "5",
      "8",
      "13",
      "6"
    ],
    "answer": 1,
    "explanation": "Fibonacci sequence: F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8.",
    "dryRunTrace": "F(0)=0\nF(1)=1\nF(2)=1+0=1\nF(3)=1+1=2\nF(4)=2+1=3\nF(5)=3+2=5\nF(6)=5+3=8.",
    "topic": "Recursion & Functions",
    "subtopic": "Fibonacci",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Recursion & Functions",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_11",
    "question": "What will be printed by the following XOR swap pseudocode?",
    "codeBlock": "INTEGER a = 25, b = 18\nSET a = a ^ b\nSET b = a ^ b\nSET a = a ^ b\nPRINT a, b",
    "options": [
      "25, 18",
      "0, 0",
      "18, 25",
      "25, 25"
    ],
    "answer": 2,
    "explanation": "This is the classic in-place variable swap using bitwise XOR without auxiliary memory. a becomes 18, b becomes 25.",
    "dryRunTrace": "Line 1: a = 25 ^ 18\nLine 2: b = (25 ^ 18) ^ 18 = 25 ^ (18 ^ 18) = 25 ^ 0 = 25\nLine 3: a = (25 ^ 18) ^ 25 = (25 ^ 25) ^ 18 = 0 ^ 18 = 18\nOutput: 18, 25.",
    "topic": "Bitwise Operators",
    "subtopic": "In-Place XOR Swap",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Bitwise Operators",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_12",
    "question": "What is the output of the following nested loop step counter?",
    "codeBlock": "INTEGER sum = 0\nFOR i = 1 TO 3\n    FOR j = 1 TO 3\n        IF (i == j) THEN\n            sum = sum + i\n        END IF\n    END FOR\nEND FOR\nPRINT sum",
    "options": [
      "9",
      "3",
      "12",
      "6"
    ],
    "answer": 3,
    "explanation": "The condition (i == j) triggers for (1,1), (2,2), (3,3). sum = 1 + 2 + 3 = 6.",
    "dryRunTrace": "i=1, j=1: 1==1 -> sum = 0 + 1 = 1\ni=2, j=2: 2==2 -> sum = 1 + 2 = 3\ni=3, j=3: 3==3 -> sum = 3 + 3 = 6\nOutput: 6.",
    "topic": "Loops & Conditions",
    "subtopic": "Diagonal Accumulator",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Loops & Conditions",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_13",
    "question": "What is the return value of power(2, 5)?",
    "codeBlock": "FUNCTION power(base, exp)\n    IF exp == 0 THEN RETURN 1\n    IF (exp MOD 2 == 0) THEN\n        INTEGER half = power(base, exp / 2)\n        RETURN half * half\n    ELSE\n        RETURN base * power(base, exp - 1)\n    END IF\nEND FUNCTION",
    "options": [
      "32",
      "10",
      "64",
      "16"
    ],
    "answer": 0,
    "explanation": "Binary exponentiation computes 2^5 = 32 in O(log n) recursive calls.",
    "dryRunTrace": "power(2, 5): odd -> 2 * power(2, 4)\npower(2, 4): even -> half = power(2, 2) = 4 -> 4*4 = 16\npower(2, 2): even -> half = power(2, 1) = 2 -> 2*2 = 4\npower(2, 1): odd -> 2 * power(2, 0) = 2 * 1 = 2\npower(2, 0) = 1\nResult: 2 * 16 = 32.",
    "topic": "Recursion & Functions",
    "subtopic": "Fast Exponentiation",
    "difficulty": "medium",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Recursion & Functions",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_14",
    "question": "What will be the output of the following array modification pseudocode?",
    "codeBlock": "INTEGER arr[4] = { 2, 4, 6, 8 }\nFOR i = 0 TO 2\n    arr[i + 1] = arr[i] + arr[i + 1]\nEND FOR\nPRINT arr[3]",
    "options": [
      "14",
      "20",
      "8",
      "24"
    ],
    "answer": 1,
    "explanation": "Prefix sum propagation: arr[1]=2+4=6; arr[2]=6+6=12; arr[3]=12+8=20.",
    "dryRunTrace": "Init: arr = [2, 4, 6, 8]\ni=0: arr[1] = arr[0] + arr[1] = 2 + 4 = 6 -> arr = [2, 6, 6, 8]\ni=1: arr[2] = arr[1] + arr[2] = 6 + 6 = 12 -> arr = [2, 6, 12, 8]\ni=2: arr[3] = arr[2] + arr[3] = 12 + 8 = 20 -> arr = [2, 6, 12, 20]\narr[3] = 20.",
    "topic": "Arrays & Data Structures",
    "subtopic": "Cumulative Prefix Sum",
    "difficulty": "medium",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Arrays & Data Structures",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_15",
    "question": "What is the output of the following modulo and division loop?",
    "codeBlock": "INTEGER n = 1234, sum = 0\nWHILE n > 0\n    sum = sum + (n MOD 10)\n    n = n / 10\nEND WHILE\nPRINT sum",
    "options": [
      "12",
      "24",
      "10",
      "4"
    ],
    "answer": 2,
    "explanation": "Computes sum of digits: 4 + 3 + 2 + 1 = 10.",
    "dryRunTrace": "Iter 1: n=1234 -> sum = 0 + 4 = 4, n = 123\nIter 2: n=123 -> sum = 4 + 3 = 7, n = 12\nIter 3: n=12 -> sum = 7 + 2 = 9, n = 1\nIter 4: n=1 -> sum = 9 + 1 = 10, n = 0\nLoop ends. sum = 10.",
    "topic": "Loops & Conditions",
    "subtopic": "Digit Summation",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Loops & Conditions",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_16",
    "question": "What is the output of the following bitwise check?",
    "codeBlock": "FUNCTION isPowerOfTwo(n)\n    IF (n > 0) AND ((n & (n - 1)) == 0) THEN\n        RETURN 1\n    ELSE\n        RETURN 0\n    END IF\nEND FUNCTION\nPRINT isPowerOfTwo(16), isPowerOfTwo(18)",
    "options": [
      "0, 1",
      "1, 1",
      "0, 0",
      "1, 0"
    ],
    "answer": 3,
    "explanation": "n & (n - 1) removes the lowest set bit. For powers of 2 (only one set bit), n & (n - 1) is 0. 16 is a power of 2 (1); 18 is not (0).",
    "dryRunTrace": "16: 10000_2 & 01111_2 = 0 -> returns 1\n18: 10010_2 & 10001_2 = 10000_2 != 0 -> returns 0.",
    "topic": "Bitwise Operators",
    "subtopic": "Power of Two Property",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Bitwise Operators",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_17",
    "question": "What will be printed when search(arr, 4, 30) runs?",
    "codeBlock": "INTEGER arr[4] = { 10, 20, 30, 40 }\nFUNCTION search(arr, n, target)\n    INTEGER low = 0, high = n - 1\n    WHILE low <= high\n        INTEGER mid = (low + high) / 2\n        IF arr[mid] == target THEN RETURN mid\n        ELSE IF arr[mid] < target THEN low = mid + 1\n        ELSE high = mid - 1\n    END WHILE\n    RETURN -1\nEND FUNCTION",
    "options": [
      "2",
      "1",
      "3",
      "-1"
    ],
    "answer": 0,
    "explanation": "Standard binary search. 30 is at index 2 (0-indexed).",
    "dryRunTrace": "low=0, high=3 -> mid = 1. arr[1] = 20 < 30 -> low = 2\nlow=2, high=3 -> mid = 2. arr[2] = 30 == 30 -> returns 2.",
    "topic": "Arrays & Data Structures",
    "subtopic": "Binary Search",
    "difficulty": "medium",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Arrays & Data Structures",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_18",
    "question": "What will be printed by the following ternary operator expression?",
    "codeBlock": "INTEGER a = 8, b = 15, c = 12\nINTEGER result = (a > b) ? (a > c ? a : c) : (b > c ? b : c)\nPRINT result",
    "options": [
      "12",
      "15",
      "8",
      "27"
    ],
    "answer": 1,
    "explanation": "The nested ternary expression computes the maximum among three numbers. Max(8, 15, 12) = 15.",
    "dryRunTrace": "a > b is 8 > 15 (False).\nEvaluates right branch: (b > c ? b : c)\nb > c is 15 > 12 (True) -> returns b = 15.",
    "topic": "Loops & Conditions",
    "subtopic": "Ternary Max Evaluation",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Loops & Conditions",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_19",
    "question": "What is the output of the following post-decrement while loop?",
    "codeBlock": "INTEGER x = 4, count = 0\nWHILE x > 0\n    x = x - 1\n    count = count + x\nEND WHILE\nPRINT count",
    "options": [
      "10",
      "4",
      "6",
      "3"
    ],
    "answer": 2,
    "explanation": "x starts at 4. Decrement occurs before addition: x=3 (count=3), x=2 (count=5), x=1 (count=6), x=0 (count=6). Loop ends.",
    "dryRunTrace": "Iter 1: x = 3, count = 0 + 3 = 3\nIter 2: x = 2, count = 3 + 2 = 5\nIter 3: x = 1, count = 5 + 1 = 6\nIter 4: x = 0, count = 6 + 0 = 6\nWhile condition x > 0 fails (0 > 0 False). Output: 6.",
    "topic": "Loops & Conditions",
    "subtopic": "Pre-condition While Trace",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Loops & Conditions",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_20",
    "question": "What is the return value of mystery(3, 4)?",
    "codeBlock": "FUNCTION mystery(a, b)\n    IF b == 0 THEN RETURN 0\n    RETURN a + mystery(a, b - 1)\nEND FUNCTION",
    "options": [
      "7",
      "1",
      "64",
      "12"
    ],
    "answer": 3,
    "explanation": "Recursive multiplication by repeated addition: 3 added 4 times equals 12.",
    "dryRunTrace": "mystery(3, 4) = 3 + mystery(3, 3)\n= 3 + 3 + mystery(3, 2)\n= 3 + 3 + 3 + mystery(3, 1)\n= 3 + 3 + 3 + 3 + mystery(3, 0)\n= 3 + 3 + 3 + 3 + 0 = 12.",
    "topic": "Recursion & Functions",
    "subtopic": "Recursive Product",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Recursion & Functions",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_21",
    "question": "What will be printed by the following bitwise NOT and AND code?",
    "codeBlock": "INTEGER x = 7, y = 5\nINTEGER z = (x & ~y)\nPRINT z",
    "options": [
      "2",
      "7",
      "5",
      "0"
    ],
    "answer": 0,
    "explanation": "x = 7 (0111_2), y = 5 (0101_2). ~y has 0 where y has 1. x & ~y isolates bits present in x but absent in y (bit 1): 0010_2 = 2.",
    "dryRunTrace": "x = 0111_2 (7)\ny = 0101_2 (5)\n~y = ...1111 1010_2\nx & ~y = 0111_2 & 1010_2 = 0010_2 = 2.",
    "topic": "Bitwise Operators",
    "subtopic": "Set Difference",
    "difficulty": "medium",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Bitwise Operators",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_22",
    "question": "What is the output of the following string length and character check?",
    "codeBlock": "STRING s = \"EXCELLER\"\nINTEGER count = 0\nFOR i = 0 TO LENGTH(s) - 1\n    IF s[i] == 'E' THEN\n        count = count + 1\n    END IF\nEND FOR\nPRINT count",
    "options": [
      "2",
      "3",
      "4",
      "1"
    ],
    "answer": 1,
    "explanation": "In 'EXCELLER', the letter 'E' appears 3 times (indices 0, 3, 6).",
    "dryRunTrace": "s[0]='E' (count=1), s[1]='X', s[2]='C', s[3]='E' (count=2), s[4]='L', s[5]='L', s[6]='E' (count=3), s[7]='R'\nOutput: 3.",
    "topic": "Strings & Logic",
    "subtopic": "Character Frequency",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Strings & Logic",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_23",
    "question": "What will be the final value of val printed by the pseudocode?",
    "codeBlock": "INTEGER val = 1\nFOR i = 1 TO 4\n    val = val * 2\nEND FOR\nPRINT val",
    "options": [
      "8",
      "32",
      "16",
      "4"
    ],
    "answer": 2,
    "explanation": "The value doubles 4 times: 1 -> 2 -> 4 -> 8 -> 16.",
    "dryRunTrace": "i=1: val = 1 * 2 = 2\ni=2: val = 2 * 2 = 4\ni=3: val = 4 * 2 = 8\ni=4: val = 8 * 2 = 16\nOutput: 16.",
    "topic": "Loops & Conditions",
    "subtopic": "Exponential Growth",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Loops & Conditions",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_24",
    "question": "What is the output of the following array swap operation?",
    "codeBlock": "INTEGER arr[3] = { 10, 20, 30 }\nINTEGER temp = arr[0]\narr[0] = arr[2]\narr[2] = temp\nPRINT arr[0], arr[1], arr[2]",
    "options": [
      "10, 20, 30",
      "30, 20, 30",
      "10, 20, 10",
      "30, 20, 10"
    ],
    "answer": 3,
    "explanation": "Swapping first and last elements in-place: [10, 20, 30] becomes [30, 20, 10].",
    "dryRunTrace": "temp = arr[0] = 10\narr[0] = arr[2] = 30\narr[2] = temp = 10\nResult: 30, 20, 10.",
    "topic": "Arrays & Data Structures",
    "subtopic": "In-Place Reversal",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Arrays & Data Structures",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_25",
    "question": "What will be printed by the following break condition in a loop?",
    "codeBlock": "INTEGER sum = 0\nFOR i = 1 TO 10\n    IF (i > 4) THEN\n        BREAK\n    END IF\n    sum = sum + i\nEND FOR\nPRINT sum",
    "options": [
      "10",
      "15",
      "55",
      "4"
    ],
    "answer": 0,
    "explanation": "The loop breaks when i becomes 5. sum = 1 + 2 + 3 + 4 = 10.",
    "dryRunTrace": "i=1: sum = 0 + 1 = 1\ni=2: sum = 1 + 2 = 3\ni=3: sum = 3 + 3 = 6\ni=4: sum = 6 + 4 = 10\ni=5: 5 > 4 is True -> BREAK triggers.\nOutput: 10.",
    "topic": "Loops & Conditions",
    "subtopic": "Early Termination Break",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Loops & Conditions",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_26",
    "question": "What will be printed when test(3) runs?",
    "codeBlock": "FUNCTION test(n)\n    IF n == 0 THEN RETURN\n    PRINT n\n    test(n - 1)\n    PRINT n\nEND FUNCTION",
    "options": [
      "3 2 1",
      "3 2 1 1 2 3",
      "1 2 3",
      "3 3 2 2 1 1"
    ],
    "answer": 1,
    "explanation": "Prints during call recursion downwards (3 2 1), then upon unwinding the call stack backwards (1 2 3).",
    "dryRunTrace": "test(3): prints 3 -> calls test(2)\ntest(2): prints 2 -> calls test(1)\ntest(1): prints 1 -> calls test(0)\ntest(0): returns\ntest(1) unrolls: prints 1\ntest(2) unrolls: prints 2\ntest(3) unrolls: prints 3\nCombined output: 3 2 1 1 2 3.",
    "topic": "Recursion & Functions",
    "subtopic": "Stack Unwinding",
    "difficulty": "medium",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Recursion & Functions",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_27",
    "question": "What is the output of the following right-shift loop?",
    "codeBlock": "INTEGER x = 32, steps = 0\nWHILE x > 1\n    x = x >> 1\n    steps = steps + 1\nEND WHILE\nPRINT steps",
    "options": [
      "6",
      "4",
      "5",
      "32"
    ],
    "answer": 2,
    "explanation": "Right shift divides by 2 each step. 32 = 2^5, so it takes 5 shifts to reach 1. This computes log2(32).",
    "dryRunTrace": "Init: x = 32\nStep 1: x = 16, steps = 1\nStep 2: x = 8, steps = 2\nStep 3: x = 4, steps = 3\nStep 4: x = 2, steps = 4\nStep 5: x = 1, steps = 5\nLoop terminates as x is no longer > 1. Output: 5.",
    "topic": "Bitwise Operators",
    "subtopic": "Logarithmic Shift",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Bitwise Operators",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_28",
    "question": "What will be the output of the following 2D array diagonal sum?",
    "codeBlock": "INTEGER mat[2][2] = { { 3, 5 }, { 7, 9 } }\nINTEGER trace = mat[0][0] + mat[1][1]\nPRINT trace",
    "options": [
      "14",
      "16",
      "8",
      "12"
    ],
    "answer": 3,
    "explanation": "Main diagonal elements are mat[0][0] = 3 and mat[1][1] = 9. 3 + 9 = 12.",
    "dryRunTrace": "mat[0][0] = 3\nmat[1][1] = 9\ntrace = 3 + 9 = 12.",
    "topic": "Arrays & Data Structures",
    "subtopic": "Matrix Trace",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Arrays & Data Structures",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_29",
    "question": "What will be printed by the following continuing loop?",
    "codeBlock": "INTEGER sum = 0\nFOR i = 1 TO 6\n    IF (i MOD 2 != 0) THEN\n        CONTINUE\n    END IF\n    sum = sum + i\nEND FOR\nPRINT sum",
    "options": [
      "12",
      "9",
      "21",
      "6"
    ],
    "answer": 0,
    "explanation": "Odd numbers are skipped by CONTINUE. Only evens (2, 4, 6) are added: 2 + 4 + 6 = 12.",
    "dryRunTrace": "i=1: odd -> skip\ni=2: even -> sum = 0 + 2 = 2\ni=3: odd -> skip\ni=4: even -> sum = 2 + 4 = 6\ni=5: odd -> skip\ni=6: even -> sum = 6 + 6 = 12\nOutput: 12.",
    "topic": "Loops & Conditions",
    "subtopic": "Continue Skip Logic",
    "difficulty": "easy",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Loops & Conditions",
      "Capgemini Round 1.1"
    ]
  },
  {
    "_id": "pseudo_v2_30",
    "question": "What is the return value of mystery(25)?",
    "codeBlock": "FUNCTION mystery(n)\n    INTEGER r = 0\n    WHILE (r * r) <= n\n        r = r + 1\n    END WHILE\n    RETURN r - 1\nEND FUNCTION",
    "options": [
      "6",
      "5",
      "4",
      "25"
    ],
    "answer": 1,
    "explanation": "This algorithm computes the integer square root of n: floor(sqrt(25)) = 5.",
    "dryRunTrace": "r=0: 0*0 <= 25 -> r=1\nr=1: 1*1 <= 25 -> r=2\nr=2: 2*2 <= 25 -> r=3\nr=3: 3*3 <= 25 -> r=4\nr=4: 4*4 <= 25 -> r=5\nr=5: 5*5 <= 25 -> r=6\nr=6: 6*6 = 36 > 25 -> loop ends.\nReturns r - 1 = 6 - 1 = 5.",
    "topic": "Algorithms & Logic",
    "subtopic": "Integer Square Root",
    "difficulty": "medium",
    "relevance": "must-know",
    "capgeminiRelevance": 5,
    "tags": [
      "Pseudocode",
      "Algorithms & Logic",
      "Capgemini Round 1.1"
    ]
  }
];
