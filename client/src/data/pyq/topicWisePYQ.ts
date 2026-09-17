export interface TopicWisePYQ {
  id: string;
  category: string;
  topic: string;
  subtopic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  tags: string[];
}

export const TOPIC_WISE_PYQ_BANK: TopicWisePYQ[] = [
  {
    "id": "pyq_quant_1",
    "category": "Quantitative Aptitude",
    "topic": "Time, Speed & Distance",
    "subtopic": "Relative Speed",
    "difficulty": "easy",
    "question": "A cheetah runs at a speed of 126 km/h. How many seconds does it take to cover a distance of 350 meters?",
    "options": [
      "5 seconds",
      "20 seconds",
      "10 seconds",
      "15 seconds"
    ],
    "answer": 2,
    "explanation": "Convert speed from km/h to m/s: 126 * (5/18) = 7 * 5 = 35 m/s. Time = Distance / Speed = 350 m / 35 m/s = 10 seconds.",
    "tags": [
      "Aptitude",
      "Speed & Distance",
      "Unit Conversion",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_quant_2",
    "category": "Quantitative Aptitude",
    "topic": "Ratio & Proportion",
    "subtopic": "Unitary Method",
    "difficulty": "medium",
    "question": "The cost of 15 packets of biscuits, each weighing 750 grams, is Rs. 300. What will be the approximate cost of 25 packets, if each packet weighs 1 kg?",
    "options": [
      "Rs. 549",
      "Rs. 700",
      "Rs. 333",
      "Rs. 667"
    ],
    "answer": 3,
    "explanation": "Total weight of 15 packets = 15 * 0.75 kg = 11.25 kg. Cost per kg = 300 / 11.25 = Rs. 26.6667 per kg. Total weight of 25 packets (1 kg each) = 25 kg. Total cost = 25 * 26.6667 = Rs. 666.67 ≈ Rs. 667.",
    "tags": [
      "Aptitude",
      "Proportions",
      "Unitary Method",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_quant_3",
    "category": "Quantitative Aptitude",
    "topic": "Problems on Ages",
    "subtopic": "Linear Equations",
    "difficulty": "medium",
    "question": "Paul's age is three times the sum of the ages of his two daughters. Five years from now, his age will be twice the sum of the ages of his two daughters. Find his present age.",
    "options": [
      "40 years",
      "45 years",
      "50 years",
      "55 years"
    ],
    "answer": 1,
    "explanation": "Let the sum of the daughters' ages today be D. Paul's age P = 3D. In 5 years, both daughters grow older by 5 years, so their combined age increases by 10 years (D + 10). Paul's age becomes P + 5. Equation: P + 5 = 2(D + 10) => 3D + 5 = 2D + 20 => D = 15 years. Therefore, Paul's present age P = 3 * 15 = 45 years.",
    "tags": [
      "Aptitude",
      "Ages",
      "Algebra",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_quant_4",
    "category": "Quantitative Aptitude",
    "topic": "Profit & Loss",
    "subtopic": "Discount & Mark-up",
    "difficulty": "medium",
    "question": "A shopkeeper gains 15% after allowing a discount of 20% on the marked price of an article. Find the cost price of the article if its marked price is Rs. 850.",
    "options": [
      "Rs. 591.30",
      "Rs. 680.00",
      "Rs. 600.00",
      "Rs. 720.00"
    ],
    "answer": 0,
    "explanation": "Selling Price (SP) = MP * (1 - Discount%) = 850 * 0.80 = Rs. 680. Since gain is 15%: SP = CP * 1.15 => CP = 680 / 1.15 = Rs. 591.30.",
    "tags": [
      "Aptitude",
      "Profit & Loss",
      "Discount",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_quant_5",
    "category": "Quantitative Aptitude",
    "topic": "Time & Work",
    "subtopic": "Efficiency",
    "difficulty": "easy",
    "question": "A can complete a project in 12 days, and B can complete the same project in 24 days. If they work together, how many days will they take to complete the project?",
    "options": [
      "6 days",
      "8 days",
      "10 days",
      "16 days"
    ],
    "answer": 1,
    "explanation": "A's 1-day work = 1/12. B's 1-day work = 1/24. Combined 1-day work = 1/12 + 1/24 = 3/24 = 1/8. Therefore, together they take 8 days.",
    "tags": [
      "Aptitude",
      "Time & Work",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_quant_6",
    "category": "Quantitative Aptitude",
    "topic": "Permutation & Combination",
    "subtopic": "Word Arrangements",
    "difficulty": "medium",
    "question": "In how many different ways can the letters of the word 'CAPGEMINI' be arranged?",
    "options": [
      "362,880",
      "181,440",
      "90,720",
      "45,360"
    ],
    "answer": 1,
    "explanation": "The word 'CAPGEMINI' has 9 letters in total: C, A, P, G, E, M, I, N, I. Notice the letter 'I' appears twice (2 times). Total distinct permutations = 9! / 2! = 362,880 / 2 = 181,440 ways.",
    "tags": [
      "Aptitude",
      "Permutations",
      "Combinatorics",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_quant_7",
    "category": "Quantitative Aptitude",
    "topic": "Probability",
    "subtopic": "Dice & Cards",
    "difficulty": "easy",
    "question": "Two unbiased six-faced dice are rolled simultaneously. What is the probability that the sum of the numbers on the two faces is a prime number?",
    "options": [
      "5/12",
      "7/18",
      "15/36",
      "13/36"
    ],
    "answer": 0,
    "explanation": "Possible sums range from 2 to 12. Prime sums are {2, 3, 5, 7, 11}.\n- Sum = 2: (1,1) -> 1\n- Sum = 3: (1,2), (2,1) -> 2\n- Sum = 5: (1,4), (2,3), (3,2), (4,1) -> 4\n- Sum = 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6\n- Sum = 11: (5,6), (6,5) -> 2\nTotal favorable outcomes = 1 + 2 + 4 + 6 + 2 = 15. Total outcomes = 36. Probability = 15/36 = 5/12.",
    "tags": [
      "Aptitude",
      "Probability",
      "Dice",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_log_1",
    "category": "Logical Reasoning",
    "topic": "Syllogisms",
    "subtopic": "Deductive Logic",
    "difficulty": "medium",
    "question": "Statements:\nI. All managers are leaders.\nII. Some leaders are innovators.\n\nConclusions:\n1. Some innovators are managers.\n2. Some leaders are managers.\n3. All innovators are leaders.",
    "options": [
      "Only conclusion 1 follows",
      "Only conclusion 2 follows",
      "Both 1 and 2 follow",
      "None of the conclusions follow"
    ],
    "answer": 1,
    "explanation": "From Statement I: 'All managers are leaders' gives the valid converse 'Some leaders are managers' (Conclusion 2 is valid). Since the middle term 'leaders' is undistributed, no direct connection between 'managers' and 'innovators' can be concluded with certainty. Hence only conclusion 2 follows.",
    "tags": [
      "Logical Reasoning",
      "Syllogisms",
      "Venn Diagrams",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_log_2",
    "category": "Logical Reasoning",
    "topic": "Blood Relations",
    "subtopic": "Coded Relations",
    "difficulty": "medium",
    "question": "Pointing to a photograph of a boy, Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to that boy?",
    "options": [
      "Brother",
      "Uncle",
      "Father",
      "Cousin"
    ],
    "answer": 2,
    "explanation": "'The only son of my mother' (for Suresh) is Suresh himself! Therefore, the boy in the photograph is the son of Suresh. Hence, Suresh is the father of the boy.",
    "tags": [
      "Logical Reasoning",
      "Blood Relations",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_log_3",
    "category": "Logical Reasoning",
    "topic": "Series Completion",
    "subtopic": "Number Sequences",
    "difficulty": "easy",
    "question": "Find the next term in the series: 17, 14, 14, 11, 11, 8, 8, ?",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": 0,
    "explanation": "Look at the pattern: alternate pairs subtracting 3: (17 - 3 = 14, repeated: 14, 14), (14 - 3 = 11, repeated: 11, 11), (11 - 3 = 8, repeated: 8, 8), (8 - 3 = 5). Hence the next number is 5.",
    "tags": [
      "Logical Reasoning",
      "Number Series",
      "Capgemini Placement Papers"
    ]
  },
  {
    "id": "pyq_log_4",
    "category": "Logical Reasoning",
    "topic": "Coding-Decoding",
    "subtopic": "Cipher Logic",
    "difficulty": "easy",
    "question": "In a certain code, if 'ROAD' is written as 'URDG', how is 'SWAN' written in that code?",
    "options": [
      "VXDQ",
      "VZCQ",
      "UXDQ",
      "VZDQ"
    ],
    "answer": 3,
    "explanation": "Each letter is shifted forward by +3 alphabetical positions:\nR (+3) -> U\nO (+3) -> R\nA (+3) -> D\nD (+3) -> G\nApplying +3 to 'SWAN':\nS (+3) -> V\nW (+3) -> Z\nA (+3) -> D\nN (+3) -> Q\nResult is 'VZDQ'.",
    "tags": [
      "Logical Reasoning",
      "Coding-Decoding",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_log_5",
    "category": "Logical Reasoning",
    "topic": "Direction Sense",
    "subtopic": "Distance Vectors",
    "difficulty": "medium",
    "question": "A man walks 6 km North, turns right and walks 8 km, then turns right again and walks 6 km. How far and in which direction is he now from his starting point?",
    "options": [
      "8 km East",
      "8 km West",
      "10 km North-East",
      "12 km South"
    ],
    "answer": 0,
    "explanation": "North (+6y), then Right is East (+8x), then Right is South (-6y). Net coordinates: x = +8, y = 6 - 6 = 0. He is exactly 8 km due East of his starting origin.",
    "tags": [
      "Logical Reasoning",
      "Direction Sense",
      "Vectors",
      "Capgemini PYQ"
    ]
  },
  {
    "id": "pyq_cs_1",
    "category": "Computer Fundamentals",
    "topic": "Operating Systems",
    "subtopic": "Memory Management",
    "difficulty": "medium",
    "question": "What is the phenomenon where the operating system spends more time swapping pages between main memory and secondary disk than executing instructions?",
    "options": [
      "Paging deadlock",
      "Segmentation fault",
      "Thrashing",
      "Context Switching bottleneck"
    ],
    "answer": 2,
    "explanation": "Thrashing occurs when the active working set of running processes exceeds the available physical RAM frames, causing constant high page fault rates and continuous page I/O transfers.",
    "tags": [
      "OS",
      "Virtual Memory",
      "Thrashing",
      "Capgemini Technical"
    ]
  },
  {
    "id": "pyq_cs_2",
    "category": "Computer Fundamentals",
    "topic": "Computer Networks",
    "subtopic": "OSI Reference Model",
    "difficulty": "easy",
    "question": "Which layer of the OSI model is responsible for data compression, encryption, and translation of abstract syntax into machine-independent transfer syntax?",
    "options": [
      "Application Layer (Layer 7)",
      "Presentation Layer (Layer 6)",
      "Session Layer (Layer 5)",
      "Transport Layer (Layer 4)"
    ],
    "answer": 1,
    "explanation": "The Presentation Layer (Layer 6) handles formatting, syntax translation, compression, and encryption/decryption between the application and network formats.",
    "tags": [
      "Networks",
      "OSI Model",
      "Encryption",
      "Capgemini Technical"
    ]
  },
  {
    "id": "pyq_cs_3",
    "category": "Computer Fundamentals",
    "topic": "Database Management",
    "subtopic": "Normalization",
    "difficulty": "medium",
    "question": "A relational database table is in Third Normal Form (3NF) if and only if:",
    "options": [
      "All non-key attributes are fully functionally dependent on the entire candidate key.",
      "It is in 2NF and no non-prime attribute is transitively dependent on any candidate key.",
      "Every determinant is a superkey.",
      "All multi-valued dependencies are removed."
    ],
    "answer": 1,
    "explanation": "3NF requires the relation to be in 2NF and eliminate transitive dependencies (X -> Y where Y is non-prime and X is not a superkey). Option C is the stricter Boyce-Codd Normal Form (BCNF).",
    "tags": [
      "DBMS",
      "Normalization",
      "3NF",
      "Capgemini Technical"
    ]
  },
  {
    "id": "pyq_cs_4",
    "category": "Computer Fundamentals",
    "topic": "Data Structures",
    "subtopic": "Stacks & Queues",
    "difficulty": "easy",
    "question": "Which of the following data structures is intrinsically used in evaluating postfix expressions and implementing recursive subroutine calls?",
    "options": [
      "Queue",
      "Circular Linked List",
      "Stack",
      "Binary Min-Heap"
    ],
    "answer": 2,
    "explanation": "A Stack operates on the Last-In-First-Out (LIFO) discipline, making it the ideal structure for matching parentheses, postfix arithmetic evaluation, call-stack activation frames, and Depth-First Search.",
    "tags": [
      "DSA",
      "Stack",
      "Recursion",
      "Capgemini Technical"
    ]
  },
  {
    "id": "pyq_cs_5",
    "category": "Computer Fundamentals",
    "topic": "C Language",
    "subtopic": "Storage Classes",
    "difficulty": "medium",
    "question": "Which of the following is TRUE regarding the 'static' storage class in C?",
    "options": [
      "A static local variable loses its value when the function terminates.",
      "A static global variable has external linkage and is visible across all translation units.",
      "A static local variable retains its value between function calls and is initialized only once.",
      "Static variables are allocated on the runtime CPU call stack."
    ],
    "answer": 2,
    "explanation": "Static local variables have lifetime throughout the entire program execution (stored in the data segment, not on the call stack) and retain their values between invocations.",
    "tags": [
      "C",
      "Storage Classes",
      "Memory Layout",
      "Capgemini Technical"
    ]
  }
];
