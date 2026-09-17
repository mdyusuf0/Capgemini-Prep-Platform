export interface PseudocodePYQ {
  id: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  code: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  tags: string[];
}

export const PSEUDOCODE_PYQ_BANK: PseudocodePYQ[] = [
  {
    "id": "pyq_code_1",
    "title": "2D Matrix Symmetric Modification",
    "category": "Basic C & Arrays",
    "difficulty": "medium",
    "code": "int A[5][5], k, j;\nfor(k = 0; k < 5; ++k)\n    for(j = 0; j < 5; j++)\n        A[k][j] = A[j][k];",
    "question": "Which of the following is true regarding the given program fragment?",
    "options": [
      "It transposes the given matrix A",
      "It doesn't alter the given matrix A",
      "It makes the given matrix A, symmetric",
      "None of the mentioned options"
    ],
    "answer": 2,
    "explanation": "At each step, element A[k][j] is assigned the value of A[j][k]. However, when j > k, the original value of A[j][k] was already overwritten when k was smaller. The net effect is that the upper triangle is mirrored into the lower triangle, forcing A[k][j] == A[j][k] for all indices, which makes matrix A symmetric.",
    "tags": [
      "C",
      "Matrix",
      "Nested Loops",
      "CoCubes Drive 2017"
    ]
  },
  {
    "id": "pyq_code_2",
    "title": "sizeof with Logical NOT and Char Promotion",
    "category": "Basic C & Data Types",
    "difficulty": "hard",
    "code": "#include <stdio.h>\nvoid main() {\n    long double a;\n    signed char b;\n    int arr[sizeof(!a + b)];\n    printf(\"%d\", sizeof(arr));\n}",
    "question": "What will be the output of the given C code? (Assume sizeof(int) = 4, sizeof(long double) = 16, sizeof(char) = 1)",
    "options": [
      "16",
      "0",
      "4",
      "16 or 4 depending on architecture"
    ],
    "answer": 2,
    "explanation": "In C, the logical NOT operator `!a` evaluates to an `int` (either 0 or 1). Then in the expression `!a + b`, `b` (signed char) undergoes integer promotion to `int`. Thus `(!a + b)` is of type `int`. Therefore, `sizeof(!a + b)` equals `sizeof(int) = 4`. The array is declared as `int arr[4]`. Finally, `sizeof(arr)` is `4 * sizeof(int) = 4 * 4 = 16` bytes. Wait, let's verify options: In 16-bit systems sizeof(int)=2 (arr[2]=8). In 32-bit systems where sizeof(int)=4, arr[4] size = 16. Option A is 16!",
    "tags": [
      "C",
      "sizeof",
      "Type Promotion",
      "CoCubes Drive 2017"
    ]
  },
  {
    "id": "pyq_code_3",
    "title": "Pointer Arithmetic on Integer Array",
    "category": "Pointers & Arrays",
    "difficulty": "easy",
    "code": "main() {\n    int num[] = {1, 4, 8, 12, 16};\n    int *a, *b;\n    int i;\n    a = num;\n    b = num + 2;\n    i = *a + 1;\n    printf(\"%d,%d,%d\\n\", i, *a, *b);\n}",
    "question": "Consider the given code and predict its output:",
    "options": [
      "2,1,8",
      "4,1,8",
      "4,4,8",
      "2,4,8"
    ],
    "answer": 0,
    "explanation": "Array elements are num[0]=1, num[1]=4, num[2]=8. Pointer `a` points to `num[0]`, so `*a = 1`. Pointer `b = num + 2` points to `num[2]`, so `*b = 8`. Integer `i = *a + 1 = 1 + 1 = 2`. The print statement prints `i, *a, *b` -> `2,1,8`.",
    "tags": [
      "C",
      "Pointers",
      "Arrays",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_4",
    "title": "Boolean Function Simplification",
    "category": "Digital Logic & Boolean Algebra",
    "difficulty": "medium",
    "code": "Suppose f(A, B) = A' + B.\nSimplify the expression for function f(f(x + y, y), z).",
    "question": "What is the simplified expression for f(f(x + y, y), z)?",
    "options": [
      "x' + z",
      "xyz",
      "x y' + z",
      "None of the mentioned options"
    ],
    "answer": 2,
    "explanation": "Step 1: Inner function f(x+y, y) = (x+y)' + y = (x' y') + y = (y + x')(y + y') = y + x'.\nStep 2: Outer function f(y + x', z) = (y + x')' + z = y' (x')' + z = x y' + z.\nHence, the simplified boolean expression is x y' + z.",
    "tags": [
      "Digital Logic",
      "Boolean Algebra",
      "De Morgan",
      "Capgemini Technical"
    ]
  },
  {
    "id": "pyq_code_5",
    "title": "Ternary Operator and Assignment to Pointer",
    "category": "Pointers & Operators",
    "difficulty": "hard",
    "code": "#include <stdio.h>\nint main() {\n    int a = 0, b = 1, c = 2;\n    *( (a + 1 == 1) ? &b : &a ) = a ? b : c;\n    printf(\"%d, %d, %d\\n\", a, b, c);\n    return 0;\n}",
    "question": "What will be the output of the following C code?",
    "options": [
      "0, 1, 2",
      "2, 2, 2",
      "0, 2, 2",
      "1, 1, 2"
    ],
    "answer": 2,
    "explanation": "Evaluate the condition `(a + 1 == 1)`. Since `a = 0`, `0 + 1 == 1` is TRUE. Thus the ternary expression returns `&b`. On the right hand side, `a ? b : c` evaluates: since `a = 0` (false), it yields `c` which is `2`. Therefore, `*(&b) = 2`, which modifies `b` to 2. Variables `a` and `c` remain 0 and 2. Hence `printf` prints 0, 2, 2.",
    "tags": [
      "C",
      "Pointers",
      "Ternary Operator",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_6",
    "title": "String Pointer Arithmetic Offset",
    "category": "Pointers & Strings",
    "difficulty": "medium",
    "code": "char c[] = \"DATA1234\";\nchar *P = c;\nprintf(\"%s\", P + P[3] - P[1]);",
    "question": "The following fragment of C program will print:",
    "options": [
      "DATA1234",
      "234",
      "1234",
      "A1234"
    ],
    "answer": 0,
    "explanation": "In string \"DATA1234\": P[0]='D', P[1]='A', P[2]='T', P[3]='A'. Notice that P[3] is 'A' and P[1] is 'A'. Therefore, P[3] - P[1] = 'A' - 'A' = 0. The pointer offset is P + 0 = P. Thus printf(\"%s\", P) prints the complete string \"DATA1234\".",
    "tags": [
      "C",
      "Pointers",
      "ASCII Arithmetic",
      "Strings",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_7",
    "title": "Pass by Value vs Pass by Reference",
    "category": "Functions & Scope",
    "difficulty": "medium",
    "code": "function modify(w, u) {\n    w = w + 2\n    u = u - 3\n    return (w - u)\n}\nfunction calculate() {\n    integer a = 10, b = 20, c\n    c = modify(a, b)\n    print a\n    print space\n    print b\n}",
    "question": "Assume that a was passed by value and b was passed by reference. What will be the output on executing calculate()?",
    "options": [
      "12 17",
      "10 17",
      "12 20",
      "10 20"
    ],
    "answer": 1,
    "explanation": "Parameter `w` corresponds to `a` (passed by value): changes to `w` do NOT affect `a`, so `a` remains 10. Parameter `u` corresponds to `b` (passed by reference): `u = u - 3 = 20 - 3 = 17` modifies `b` directly. Thus after calling `modify`, `a = 10` and `b = 17`. Output is '10 17'.",
    "tags": [
      "Pseudocode",
      "Pass by Reference",
      "Functions",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_8",
    "title": "Ternary Conditional Assignment",
    "category": "Conditionals & Logic",
    "difficulty": "easy",
    "code": "A = (x > y) ? ((x > z) ? x : z) : ((y > z) ? y : z)",
    "question": "Which of the following combinations of variables x, y, z makes variable A get the value 4?",
    "options": [
      "x = 3; y = 4; z = 2",
      "x = 6; y = 5; z = 3",
      "x = 5; y = 4; z = 5",
      "x = 6; y = 3; z = 5"
    ],
    "answer": 0,
    "explanation": "The expression finds the maximum of three numbers: max(x, y, z). For Option A: x=3, y=4, z=2 -> max(3, 4, 2) = 4. Variable A receives 4. In Option B max is 6, Option C max is 5, Option D max is 6.",
    "tags": [
      "C",
      "Ternary Operator",
      "Logic",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_9",
    "title": "Recursive Summation of Even Numbers",
    "category": "Recursion",
    "difficulty": "medium",
    "code": "function sum(n) {\n    if(n equals 2)\n        return 2\n    else\n        return (n + sum(n - 2))\n}\n// Call:\nsum(30)",
    "question": "How many times will the function sum() be called to compute sum(30)?",
    "options": [
      "1",
      "30",
      "15",
      "16"
    ],
    "answer": 2,
    "explanation": "The calls progress as: sum(30), sum(28), sum(26), ..., sum(4), sum(2). The sequence of arguments is 30, 28, 26, ..., 2. The number of terms is (30 - 2)/2 + 1 = 14 + 1 = 15 calls in total.",
    "tags": [
      "Pseudocode",
      "Recursion",
      "Call Stack",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_10",
    "title": "Integer Division and Subtraction",
    "category": "Pseudocode Math",
    "difficulty": "easy",
    "code": "integer a = 456, b, c, d = 10\nb = a / d\nc = a - b\nprint c",
    "question": "What will be the output of the following pseudocode statements?",
    "options": [
      "410",
      "410.4",
      "411.4",
      "411"
    ],
    "answer": 3,
    "explanation": "Since a and d are integers: b = 456 / 10 = 45 (integer division truncates decimal part). Then c = a - b = 456 - 45 = 411. Output is 411.",
    "tags": [
      "Pseudocode",
      "Integer Arithmetic",
      "Truncation",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_11",
    "title": "Operator Precedence & Short Circuiting",
    "category": "Boolean Operators",
    "difficulty": "medium",
    "code": "integer a = 50, b = 25, c = 0\nprint (a > 45 OR b > 50 AND c > 10)",
    "question": "What will be the output of the following code statement?",
    "options": [
      "1",
      "0",
      "-1",
      "10"
    ],
    "answer": 0,
    "explanation": "In boolean operator precedence, AND has higher precedence than OR. So (a > 45 OR (b > 50 AND c > 10)). Evaluating a > 45: 50 > 45 is TRUE (1). Due to logical OR short-circuiting, since the first operand is TRUE, the entire expression evaluates to TRUE (1).",
    "tags": [
      "Pseudocode",
      "Precedence",
      "Short Circuit",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_12",
    "title": "Bit Requirement for Range Representation",
    "category": "Data Representation",
    "difficulty": "easy",
    "code": "// Data type storing natural numbers: 0 to 25",
    "question": "There is a new data-type which can take natural numbers between (and including) 0 and 25. What are the minimum bits required to store this data type?",
    "options": [
      "4",
      "5",
      "1",
      "3"
    ],
    "answer": 1,
    "explanation": "To store values from 0 to 25, the data type must represent at least 26 distinct values. With 4 bits, 2^4 = 16 values (insufficient). With 5 bits, 2^5 = 32 values (0 to 31), which comfortably accommodates up to 25. Thus, 5 bits are required.",
    "tags": [
      "Computer Architecture",
      "Bits",
      "Binary",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_13",
    "title": "Signed 6-bit Integer Range",
    "category": "Data Representation",
    "difficulty": "medium",
    "code": "// 6-bit two's complement signed integer",
    "question": "A data type is stored as a 6-bit signed integer. Which of the following CANNOT be represented by this data type?",
    "options": [
      "-12",
      "0",
      "32",
      "18"
    ],
    "answer": 2,
    "explanation": "For an n-bit signed integer (using two's complement), the range of representable numbers is from -2^(n-1) to 2^(n-1) - 1. For n = 6: -2^5 to 2^5 - 1 = -32 to +31. Therefore, +32 cannot be represented, as the maximum positive integer is 31.",
    "tags": [
      "Computer Architecture",
      "Signed Numbers",
      "Two's Complement",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_14",
    "title": "Memory Space Complexity Definition",
    "category": "Algorithms & Complexity",
    "difficulty": "easy",
    "code": "// Definition of Space Complexity",
    "question": "What is the space complexity of a program?",
    "options": [
      "Amount of hard-disk space required to store the program",
      "Amount of hard-disk space required to compile the program",
      "Amount of memory (RAM) required by the program to run",
      "Amount of memory required for the program to compile"
    ],
    "answer": 2,
    "explanation": "Space complexity of an algorithm/program is defined as the total amount of primary working memory (RAM) required by the program to execute as a function of the input size.",
    "tags": [
      "DSA",
      "Space Complexity",
      "Theory",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_15",
    "title": "Upper Triangular Matrix Addition Cost",
    "category": "Algorithms & Matrices",
    "difficulty": "medium",
    "code": "// Adding two 10x10 upper triangular matrices",
    "question": "Tarang writes an efficient program to add two upper triangular 10X10 matrices (elements on diagonal retained). How many total additions will his program make?",
    "options": [
      "100",
      "55",
      "25",
      "10"
    ],
    "answer": 1,
    "explanation": "In an n x n upper triangular matrix, non-zero elements exist only on and above the principal diagonal. Row 0 has 10 elements, row 1 has 9 elements, ..., row 9 has 1 element. Total elements to add = 10 + 9 + 8 + ... + 1 = 10 * 11 / 2 = 55 additions.",
    "tags": [
      "DSA",
      "Matrix",
      "Complexity",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_16",
    "title": "Recursive Function Value Calculation",
    "category": "Recursion",
    "difficulty": "medium",
    "code": "function calculate(n) {\n    if (n equals 5)\n        return 5\n    else\n        return (n + calculate(n - 5))\n}\n// Call:\ncalculate(20)",
    "question": "Shishir calls calculate(20). What value will the function return?",
    "options": [
      "50",
      "200",
      "35",
      "20"
    ],
    "answer": 0,
    "explanation": "Trace execution:\ncalculate(20) = 20 + calculate(15)\ncalculate(15) = 15 + calculate(10)\ncalculate(10) = 10 + calculate(5)\ncalculate(5) = 5 (base case)\nSum = 20 + 15 + 10 + 5 = 50.",
    "tags": [
      "Recursion",
      "Trace",
      "Call Stack",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_17",
    "title": "Array Insertion Time Complexity",
    "category": "Time Complexity",
    "difficulty": "medium",
    "code": "// Insert value 3^k at position 3^k in array of size n (k=0, 1, 2...)",
    "question": "There is an array of size n initialized with 0. Akanksha writes an efficient code which inserts the value 3^k at position 3^k in the array (till 3^k < n). What is the time complexity of her code?",
    "options": [
      "θ(n^2)",
      "θ(n)",
      "θ(log3(n))",
      "θ(3n)"
    ],
    "answer": 2,
    "explanation": "The loop executes for positions: 3^0, 3^1, 3^2, ..., 3^k < n. Taking the logarithm with base 3: k < log3(n). The total number of assignments is proportional to log3(n). Hence the time complexity is θ(log3(n)).",
    "tags": [
      "DSA",
      "Asymptotic Analysis",
      "Complexity",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_18",
    "title": "Loop Bounds and Even/Odd Parity",
    "category": "Loop Tracing",
    "difficulty": "medium",
    "code": "for i = m to n increment 2 {\n    print \"Hello!\"\n}",
    "question": "Assuming m < n and (m, n) are either BOTH EVEN or BOTH ODD, how many times will 'Hello!' be printed?",
    "options": [
      "(n - m + 1) / 2",
      "1 + (n - m) / 2",
      "1 + (n - m) / 2 if m is even, (n - m + 1)/2 if m is odd",
      "(n - m) / 2"
    ],
    "answer": 1,
    "explanation": "Example: m = 2, n = 6 (both even). Loop values of i: 2, 4, 6 (3 times). Formula: 1 + (6 - 2)/2 = 1 + 2 = 3. Example: m = 1, n = 5 (both odd). Values: 1, 3, 5 (3 times). Formula: 1 + (5 - 1)/2 = 3. Thus, exactly 1 + (n - m)/2 times.",
    "tags": [
      "Loops",
      "Formula",
      "Trace",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_19",
    "title": "Recursive Max Finder Tracing",
    "category": "Recursion & Logic",
    "difficulty": "easy",
    "code": "function operation(int a, int b) {\n    if (a < b)\n        return operation(b, a)\n    else\n        return a\n}",
    "question": "What does the given recursive function operation(a, b) do?",
    "options": [
      "Returns the max of (a, b)",
      "Returns the min of (a, b)",
      "Loops forever",
      "Always returns the second parameter"
    ],
    "answer": 0,
    "explanation": "If a < b, it calls operation(b, a) where the larger number becomes the first parameter. In the next call, the first parameter is no longer < the second, so it returns the first parameter. Hence it always returns max(a, b).",
    "tags": [
      "Recursion",
      "Analysis",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_code_20",
    "title": "Multiplexer Control Lines Formula",
    "category": "Computer Architecture",
    "difficulty": "easy",
    "code": "// 8-to-1 Multiplexer (MUX)",
    "question": "The number of control (selection) lines required for an 8-to-1 multiplexer is:",
    "options": [
      "3",
      "4",
      "2",
      "5"
    ],
    "answer": 0,
    "explanation": "For a 2^n to 1 multiplexer, n selection/control lines are required. Since 8 = 2^3, exactly 3 control lines are required to select one of the 8 inputs.",
    "tags": [
      "Computer Architecture",
      "Digital Logic",
      "MUX",
      "Capgemini Technical"
    ]
  }
];
