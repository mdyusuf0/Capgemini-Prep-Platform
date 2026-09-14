export interface TechnicalFallbackQuestion {
  _id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  topic: string;
  subtopic: string;
  difficulty: string;
  category: string;
}

export const FALLBACK_TECHNICAL_QUESTIONS: TechnicalFallbackQuestion[] = [
  {
    "_id": "tech_fb_1",
    "question": "In C++ and Java, what mechanism enables runtime dynamic method dispatch (runtime polymorphism)?",
    "options": [
      "Virtual Method Table (vtable) and vptr pointer lookup at runtime",
      "Static name mangling during preprocessing",
      "Heap allocation via malloc()",
      "Automatic inlining by the linker"
    ],
    "answer": 0,
    "explanation": "Compilers construct a vtable for classes with virtual/overridden methods; instances store a vptr pointing to the appropriate subclass implementation table.",
    "topic": "Polymorphism",
    "subtopic": "Virtual Functions",
    "difficulty": "medium",
    "category": "oops"
  },
  {
    "_id": "tech_fb_2",
    "question": "What does the \"Liskov Substitution Principle\" (LSP) in SOLID design state?",
    "options": [
      "A class should have only one reason to change.",
      "Objects of a superclass should be replaceable with objects of its subclasses without breaking application correctness.",
      "Classes should be open for extension and closed for modification.",
      "High-level modules should not depend on low-level modules."
    ],
    "answer": 1,
    "explanation": "LSP ensures derived subclasses honor the contracts, pre-conditions, and invariants expected of their base classes.",
    "topic": "Design Principles",
    "subtopic": "SOLID",
    "difficulty": "medium",
    "category": "oops"
  },
  {
    "_id": "tech_fb_3",
    "question": "In Java, which access modifier restricts visibility to classes within the same package and subclasses in different packages?",
    "options": [
      "private",
      "default (package-private)",
      "protected",
      "public"
    ],
    "answer": 2,
    "explanation": "protected allows access within the package and by any inheriting subclasses outside the package.",
    "topic": "Encapsulation",
    "subtopic": "Access Modifiers",
    "difficulty": "easy",
    "category": "oops"
  },
  {
    "_id": "tech_fb_4",
    "question": "When should an engineer prefer an Abstract Class over an Interface in Java/C++?",
    "options": [
      "When defining non-static state (instance fields) and shared default method implementations among closely related classes",
      "When multiple inheritance of implementation is required",
      "When no code reuse is desired",
      "When creating lightweight data transfer objects"
    ],
    "answer": 0,
    "explanation": "Abstract classes represent an \"is-a\" relationship and can maintain private instance state and constructors, whereas interfaces define capabilities.",
    "topic": "Abstraction",
    "subtopic": "Interface vs Abstract Class",
    "difficulty": "medium",
    "category": "oops"
  },
  {
    "_id": "tech_fb_5",
    "question": "Given a sorted array of N numbers, what is the optimal time and space complexity to find two elements whose sum equals Target?",
    "options": [
      "O(N^2) time and O(1) space using nested loops",
      "O(N) time and O(1) auxiliary space using two pointers at opposite ends",
      "O(N log N) time and O(N) space using Merge Sort",
      "O(1) time using binary search"
    ],
    "answer": 1,
    "explanation": "Using two pointers starting at index 0 and index N-1, adjusting inward based on current sum, solves the 2-Sum problem on sorted arrays in O(N) time and O(1) space.",
    "topic": "Arrays",
    "subtopic": "Two Pointer Technique",
    "difficulty": "easy",
    "category": "dsa"
  },
  {
    "_id": "tech_fb_6",
    "question": "What is the time and space complexity of Floyd's Cycle-Finding Algorithm (Tortoise and Hare) on a linked list with N nodes?",
    "options": [
      "O(N) time and O(1) auxiliary space",
      "O(N^2) time and O(N) auxiliary space",
      "O(log N) time and O(N) space",
      "O(N) time and O(N) hash set space"
    ],
    "answer": 0,
    "explanation": "Slow moves 1 step and Fast moves 2 steps. They intersect inside any loop in O(N) steps without allocating extra memory (O(1) space).",
    "topic": "Linked Lists",
    "subtopic": "Cycle Detection",
    "difficulty": "medium",
    "category": "dsa"
  },
  {
    "_id": "tech_fb_7",
    "question": "Which traversal order of a Binary Search Tree (BST) visits node keys in strictly non-decreasing sorted order?",
    "options": [
      "Pre-order (Root -> Left -> Right)",
      "In-order (Left -> Root -> Right)",
      "Post-order (Left -> Right -> Root)",
      "Level-order (Breadth-First BFS)"
    ],
    "answer": 1,
    "explanation": "Because left subtree < root < right subtree in a valid BST, an in-order traversal recursively visits keys in ascending sorted order.",
    "topic": "Trees",
    "subtopic": "BST In-Order",
    "difficulty": "easy",
    "category": "dsa"
  },
  {
    "_id": "tech_fb_8",
    "question": "What is the worst-case time complexity of standard QuickSort with first-element pivot selection when the input array is already sorted?",
    "options": [
      "O(N log N)",
      "O(N)",
      "O(N^2)",
      "O(log N)"
    ],
    "answer": 2,
    "explanation": "If the array is already sorted and pivot is chosen naively, partitions are unbalanced (size 0 and N-1), degrading performance to O(N^2).",
    "topic": "Sorting",
    "subtopic": "QuickSort Complexity",
    "difficulty": "medium",
    "category": "dsa"
  },
  {
    "_id": "tech_fb_9",
    "question": "Which algorithm finds the single-source shortest path in a weighted directed graph that contains NO negative edge weights?",
    "options": [
      "Kruskal Algorithm",
      "Dijkstra Algorithm using Min-Heap priority queue",
      "Tarjan Strongly Connected Components",
      "Prim Minimum Spanning Tree"
    ],
    "answer": 1,
    "explanation": "Dijkstra's greedy algorithm solves single-source shortest paths in non-negative weighted graphs in O((V + E) log V) time with a binary heap.",
    "topic": "Graphs",
    "subtopic": "Shortest Path",
    "difficulty": "medium",
    "category": "dsa"
  },
  {
    "_id": "tech_fb_10",
    "question": "Which SQL join returns all rows from the left table and matched rows from the right table, filling with NULL where no match exists?",
    "options": [
      "INNER JOIN",
      "LEFT OUTER JOIN",
      "RIGHT OUTER JOIN",
      "CROSS JOIN"
    ],
    "answer": 1,
    "explanation": "LEFT OUTER JOIN preserves every record from the left table regardless of whether a matching record exists in the right table.",
    "topic": "SQL",
    "subtopic": "JOIN Types",
    "difficulty": "easy",
    "category": "dbms"
  },
  {
    "_id": "tech_fb_11",
    "question": "A relational database table is in Third Normal Form (3NF) if it is in 2NF and:",
    "options": [
      "All attributes are primary keys",
      "No non-prime attribute is transitively dependent on the primary key",
      "Every column contains multi-valued arrays",
      "Tables contain at least 1,000 records"
    ],
    "answer": 1,
    "explanation": "3NF requires that table is in 2NF and no transitive functional dependencies exist (X -> Y and Y -> Z where Z is non-prime).",
    "topic": "Normalization",
    "subtopic": "Normal Forms",
    "difficulty": "medium",
    "category": "dbms"
  },
  {
    "_id": "tech_fb_12",
    "question": "Which ACID property guarantees that concurrent execution of transactions leaves the database in the exact same state as if they were executed serially?",
    "options": [
      "Atomicity",
      "Consistency",
      "Isolation",
      "Durability"
    ],
    "answer": 2,
    "explanation": "Isolation ensures concurrent transaction executions do not interfere with one another or read uncommitted dirty state.",
    "topic": "Transactions",
    "subtopic": "ACID Properties",
    "difficulty": "easy",
    "category": "dbms"
  },
  {
    "_id": "tech_fb_13",
    "question": "Why do relational databases primarily use B+ Trees rather than standard Binary Search Trees (BST) for disk-based indexes?",
    "options": [
      "B+ Trees have higher node branching factor, drastically minimizing disk block I/O operations and supporting fast sequential range scans via leaf node pointers.",
      "Binary search trees cannot store integers.",
      "B+ trees require no disk storage.",
      "B+ trees eliminate the need for primary keys."
    ],
    "answer": 0,
    "explanation": "B+ tree nodes match disk page sizes, keeping tree shallow (fan-out of hundreds) to resolve lookups in 2-3 disk reads and linking leaves for range queries.",
    "topic": "Indexing",
    "subtopic": "B-Trees",
    "difficulty": "hard",
    "category": "dbms"
  },
  {
    "_id": "tech_fb_14",
    "question": "What is the functional difference between WHERE and HAVING clauses in SQL?",
    "options": [
      "WHERE filters records before aggregate functions (GROUP BY) are computed; HAVING filters grouped summary results after aggregation.",
      "WHERE is only used with INSERT statements; HAVING is used with SELECT.",
      "HAVING cannot be used with aggregate functions like COUNT() or SUM().",
      "WHERE and HAVING are completely interchangeable."
    ],
    "answer": 0,
    "explanation": "WHERE evaluates individual rows prior to grouping; HAVING evaluates aggregated summary statistics after GROUP BY.",
    "topic": "SQL",
    "subtopic": "WHERE vs HAVING",
    "difficulty": "easy",
    "category": "dbms"
  },
  {
    "_id": "tech_fb_15",
    "question": "What resource is shared among multiple threads belonging to the same operating system process?",
    "options": [
      "Program counter",
      "Stack memory space and registers",
      "Address space (heap, code segment, and global variables)",
      "Thread ID"
    ],
    "answer": 2,
    "explanation": "Threads within the same process share virtual address space, heap memory, and open file descriptors, but each thread maintains its own private stack and registers.",
    "topic": "Process Management",
    "subtopic": "Process vs Thread",
    "difficulty": "medium",
    "category": "os"
  },
  {
    "_id": "tech_fb_16",
    "question": "Which of the following is NOT one of the four Coffman conditions necessary for a deadlock to occur?",
    "options": [
      "Mutual Exclusion",
      "Hold and Wait",
      "Preemption allowed",
      "Circular Wait"
    ],
    "answer": 2,
    "explanation": "No Preemption is a required Coffman condition. If resources can be preempted forcibly, deadlocks cannot persist.",
    "topic": "Concurrency",
    "subtopic": "Deadlock Conditions",
    "difficulty": "medium",
    "category": "os"
  },
  {
    "_id": "tech_fb_17",
    "question": "What is \"Thrashing\" in an operating system virtual memory subsystem?",
    "options": [
      "When the CPU clock speed drops due to overheating",
      "When the operating system spends more time swapping pages in and out of disk than executing actual instruction cycles",
      "When a thread terminates without releasing a lock",
      "When cache hits exceed 99%"
    ],
    "answer": 1,
    "explanation": "Thrashing occurs when memory is overcommitted, causing continuous page faults and high disk I/O, collapsing overall throughput.",
    "topic": "Memory Management",
    "subtopic": "Virtual Memory",
    "difficulty": "medium",
    "category": "os"
  },
  {
    "_id": "tech_fb_18",
    "question": "Which CPU scheduling algorithm is most susceptible to process starvation (convoy/starvation effect for long jobs)?",
    "options": [
      "Round Robin with small time quantum",
      "Shortest Job First (SJF) non-preemptive",
      "First Come First Served (FCFS)",
      "Fair-Share Scheduler"
    ],
    "answer": 1,
    "explanation": "In SJF, short burst processes continually preempt or jump ahead in the ready queue, leaving long CPU-intensive jobs starving indefinitely.",
    "topic": "CPU Scheduling",
    "subtopic": "Starvation",
    "difficulty": "medium",
    "category": "os"
  },
  {
    "_id": "tech_fb_19",
    "question": "What is the primary difference between a binary Semaphore and a Mutex?",
    "options": [
      "Mutex has ownership semantics (only the thread that locked the mutex can unlock it); Semaphore has no ownership and can be signaled by any thread.",
      "Semaphores can only be used in kernel mode.",
      "Mutex cannot prevent race conditions.",
      "There is no difference; they are exact aliases."
    ],
    "answer": 0,
    "explanation": "A mutex enforces thread ownership (lock and unlock must be performed by same thread). Semaphores are signaling counters usable across tasks.",
    "topic": "Concurrency",
    "subtopic": "Mutex vs Semaphore",
    "difficulty": "hard",
    "category": "os"
  },
  {
    "_id": "tech_fb_20",
    "question": "At which OSI layer do Routers primarily operate to forward IP packets based on logical addresses?",
    "options": [
      "Physical Layer (Layer 1)",
      "Data Link Layer (Layer 2)",
      "Network Layer (Layer 3)",
      "Transport Layer (Layer 4)"
    ],
    "answer": 2,
    "explanation": "Network Layer (Layer 3) handles end-to-end logical addressing (IP) and routing paths between heterogeneous networks.",
    "topic": "OSI Model",
    "subtopic": "Layer Functions",
    "difficulty": "easy",
    "category": "networks"
  }
];
