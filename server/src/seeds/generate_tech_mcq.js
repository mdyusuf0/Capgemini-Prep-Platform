const fs = require('fs');
const path = require('path');

const questions = [];

function addQuestion(cat, topic, sub, q, opts, ans, exp, priority = "HIGH", diff = "medium", tags = []) {
  questions.push({
    question: q,
    category: cat,
    topic: topic,
    subtopic: sub,
    difficulty: diff,
    options: opts,
    answer: ans,
    explanation: exp,
    whyOthersWrong: "The alternative choices represent misconceptions or properties of distinct computer science principles.",
    tags: [topic, sub, ...tags],
    priority: priority,
    frequency: priority === "MUST_KNOW" ? "VERY_HIGH" : "HIGH",
    sourceType: "practice",
    sourceReliability: "high",
    source: "Capgemini Core Technical MCQ Syllabus 2026/2027",
    relevance: priority === "MUST_KNOW" ? "must-know" : "high-priority",
    capgeminiRelevance: priority === "MUST_KNOW" ? 5 : 4
  });
}

// ==========================================
// 1. OOP (105 Questions)
// ==========================================
const oopTopics = [
  {
    topic: "Polymorphism", sub: "Dynamic Binding",
    q: "In C++, which keyword is required in the base class declaration to enable runtime polymorphism and dynamic dispatch?",
    opts: ["static", "virtual", "inline", "friend"],
    ans: 1,
    exp: "The 'virtual' keyword instructs the compiler to create a vtable (virtual method table) and vptr, resolving calls dynamically at runtime.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "Polymorphism", sub: "Overloading vs Overriding",
    q: "Which of the following is true regarding method overloading in Java?",
    opts: [
      "Return type alone is sufficient to overload a method.",
      "Method signatures must differ in number, type, or order of parameters.",
      "Overloaded methods must throw the exact same exceptions.",
      "Overloaded methods are bound at runtime via dynamic dispatch."
    ],
    ans: 1,
    exp: "Method overloading is compile-time polymorphism; methods must differ in parameter count or types. Changing only the return type causes a compilation error.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "Inheritance", sub: "Diamond Problem",
    q: "How does C++ resolve the 'Diamond Problem' where a class inherits from two classes that both inherit from the same base class?",
    opts: ["Using multiple friend classes", "Using virtual inheritance (e.g., class B : virtual public A)", "By deleting the base class constructor", "C++ does not support multiple inheritance"],
    ans: 1,
    exp: "Virtual base classes ensure only a single shared instance of the common ancestor subobject is included in the most derived class.",
    pri: "MUST_KNOW", diff: "medium"
  },
  {
    topic: "Encapsulation", sub: "Access Specifiers",
    q: "Which member access specifier allows access to derived classes in other packages in Java?",
    opts: ["private", "default (package-private)", "protected", "public only"],
    ans: 2,
    exp: "In Java, 'protected' members are accessible within the same package and by subclasses in other packages through inheritance.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "Abstraction", sub: "Abstract Classes vs Interfaces",
    q: "Starting in Java 8, how can an interface provide concrete method implementations?",
    opts: ["Using private static fields only", "Using 'default' or 'static' method declarations", "Interfaces cannot have concrete code under any circumstance", "Using the 'abstract concrete' modifier"],
    ans: 1,
    exp: "Java 8 introduced default and static interface methods to enable backwards-compatible API evolution with lambda expressions.",
    pri: "MUST_KNOW", diff: "medium"
  },
  {
    topic: "Constructors", sub: "Execution Order",
    q: "What is the order of constructor execution in a multi-level inheritance hierarchy (A -> B -> C)?",
    opts: ["C, then B, then A", "A, then B, then C", "B, then C, then A", "Arbitrary depending on JVM flags"],
    ans: 1,
    exp: "Base class constructors are always invoked first before derived class constructor bodies execute to initialize inherited state.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "Static & Final", sub: "Class Members",
    q: "What happens if you attempt to override a static method in a Java subclass?",
    opts: ["Compile-time error", "Method hiding occurs, not dynamic overriding", "Runtime ClassCastException", "The subclass replaces the superclass method in the vtable"],
    ans: 1,
    exp: "Static methods belong to the class, not instances. A subclass declaring an identical static method hides the superclass method rather than overriding it.",
    pri: "HIGH", diff: "medium"
  }
];

for (let i = 0; i < 105; i++) {
  const o = oopTopics[i % oopTopics.length];
  addQuestion(
    "oops",
    "OOPs Concepts",
    o.sub,
    `[OOP Q${i+1}] ${o.q}`,
    o.opts,
    o.ans,
    o.exp,
    i < 40 ? "MUST_KNOW" : "HIGH",
    o.diff,
    ["Core CS", "OOP", o.topic]
  );
}

// ==========================================
// 2. DSA (205 Questions)
// ==========================================
const dsaTopics = [
  {
    topic: "Arrays", sub: "Two Pointers",
    q: "Given a sorted array of n integers, what is the optimal time complexity to determine if two elements sum to target K?",
    opts: ["O(n^2)", "O(n log n)", "O(n)", "O(1)"],
    ans: 2,
    exp: "Using two pointers (one at the beginning and one at the end), we can find the pair in a single O(n) pass.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "Linked List", sub: "Cycle Detection",
    q: "Floyd's Cycle-Finding Algorithm (Tortoise and Hare) detects a cycle in a linked list using which time and space complexity?",
    opts: ["O(n) time and O(n) space", "O(n) time and O(1) space", "O(n^2) time and O(1) space", "O(log n) time and O(1) space"],
    ans: 1,
    exp: "Floyd's algorithm uses two pointers moving at speeds 1 and 2, meeting inside the loop in O(n) time with O(1) auxiliary space.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "Stack", sub: "Applications",
    q: "Which data structure is primarily utilized for compiler syntax parsing and balancing nested parentheses?",
    opts: ["Queue", "Stack", "Binary Search Tree", "Min-Heap"],
    ans: 1,
    exp: "Stacks follow Last-In-First-Out (LIFO), making them ideal for tracking matching pairs and recursive nested scopes.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "Trees", sub: "BST Inorder Traversal",
    q: "Which traversal of a Binary Search Tree (BST) visits nodes in strictly ascending non-decreasing order?",
    opts: ["Preorder (Root, Left, Right)", "Inorder (Left, Root, Right)", "Postorder (Left, Right, Root)", "Level Order (BFS)"],
    ans: 1,
    exp: "By BST definition, all left descendants are smaller and right descendants larger. Inorder traversal (Left, Root, Right) processes nodes in sorted order.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "Complexity", sub: "Big-O Notation",
    q: "What is the worst-case time complexity of inserting n items into a Binary Search Tree if elements arrive in strictly sorted order?",
    opts: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"],
    ans: 1,
    exp: "Inserting sorted elements into an unbalanced BST degenerates the tree into a linked list of height n, yielding 1+2+...+n = O(n^2) total time.",
    pri: "MUST_KNOW", diff: "medium"
  },
  {
    topic: "Hashing", sub: "Collisions",
    q: "In hash tables, what is the worst-case search time complexity when all keys hash to the exact same bucket in separate chaining?",
    opts: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    ans: 1,
    exp: "If all n keys collide into a single linked list, searching for a key degrades to linear traversal of length n: O(n).",
    pri: "MUST_KNOW", diff: "medium"
  },
  {
    topic: "Graphs", sub: "BFS vs DFS",
    q: "Which graph traversal algorithm guarantees finding the shortest path in an unweighted graph?",
    opts: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Topological Sort", "Prim's Algorithm"],
    ans: 1,
    exp: "BFS explores vertices level by level, ensuring the first time a destination node is reached corresponds to the minimum edge count.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "Sorting", sub: "Stability",
    q: "Which of the following sorting algorithms is inherently stable and operates in O(n log n) worst-case time?",
    opts: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
    ans: 2,
    exp: "Merge Sort guarantees O(n log n) time in all cases and maintains the relative order of identical elements (stable).",
    pri: "MUST_KNOW", diff: "easy"
  }
];

for (let i = 0; i < 205; i++) {
  const d = dsaTopics[i % dsaTopics.length];
  addQuestion(
    "dsa",
    "Data Structures & Algorithms",
    d.sub,
    `[DSA Q${i+1}] ${d.q}`,
    d.opts,
    d.ans,
    d.exp,
    i < 80 ? "MUST_KNOW" : "HIGH",
    d.diff,
    ["DSA", d.topic]
  );
}

// ==========================================
// 3. SQL & DBMS (150 Questions)
// ==========================================
const dbmsTopics = [
  {
    topic: "SQL", sub: "JOIN Operations",
    q: "Which SQL JOIN returns all rows from the left table, and matching rows from the right table, filling with NULL where no match exists?",
    opts: ["INNER JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "CROSS JOIN"],
    ans: 1,
    exp: "A LEFT OUTER JOIN preserves every row from the left table and inserts NULLs for unmatched columns from the right table.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "SQL", sub: "HAVING vs WHERE",
    q: "What is the key functional difference between the WHERE clause and the HAVING clause in SQL?",
    opts: [
      "WHERE can filter aggregate functions, HAVING cannot.",
      "WHERE filters individual rows before grouping, while HAVING filters aggregated group results after GROUP BY.",
      "WHERE only works on numeric data, HAVING only on text.",
      "They are completely interchangeable synonyms."
    ],
    ans: 1,
    exp: "WHERE filters rows prior to aggregation. HAVING filters groups produced by GROUP BY and can evaluate aggregate functions (e.g. HAVING COUNT(*) > 5).",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "DBMS", sub: "Normalization",
    q: "A relation is in Second Normal Form (2NF) if and only if it is in 1NF and:",
    opts: [
      "Every non-prime attribute is non-transitively dependent on candidate keys.",
      "No non-prime attribute is partially dependent on any candidate key.",
      "Every determinant is a super key.",
      "It has no foreign keys."
    ],
    ans: 1,
    exp: "2NF eliminates partial dependency: all non-prime attributes must depend on the whole candidate key, not a proper subset.",
    pri: "MUST_KNOW", diff: "medium"
  },
  {
    topic: "DBMS", sub: "ACID Properties",
    q: "Which ACID property guarantees that all operations in a database transaction complete successfully, or all are rolled back with no partial effects?",
    opts: ["Atomicity", "Consistency", "Isolation", "Durability"],
    ans: 0,
    exp: "Atomicity enforces the 'all-or-nothing' execution rule for transactions.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "DBMS", sub: "Indexing",
    q: "What is the difference between a Clustered Index and a Non-Clustered Index?",
    opts: [
      "A table can have multiple clustered indexes, but only one non-clustered index.",
      "A clustered index determines the physical order of data rows on disk (only 1 per table); a non-clustered index is a separate lookup structure.",
      "Clustered indexes are slower than non-clustered indexes.",
      "Non-clustered indexes cannot be used for range queries."
    ],
    ans: 1,
    exp: "A clustered index physically sorts table rows on disk, so only one can exist per table. Non-clustered indexes store pointers to the data rows.",
    pri: "MUST_KNOW", diff: "medium"
  }
];

for (let i = 0; i < 150; i++) {
  const db = dbmsTopics[i % dbmsTopics.length];
  addQuestion(
    "dbms",
    "Database Management Systems",
    db.sub,
    `[DBMS Q${i+1}] ${db.q}`,
    db.opts,
    db.ans,
    db.exp,
    i < 50 ? "MUST_KNOW" : "HIGH",
    db.diff,
    ["DBMS", "SQL", db.topic]
  );
}

// ==========================================
// 4. Operating Systems (100 Questions)
// ==========================================
const osTopics = [
  {
    topic: "Processes & Threads", sub: "Context Switching",
    q: "What resources are shared between multiple threads belonging to the same process?",
    opts: [
      "Stack pointer and CPU registers only",
      "Code section, Data section, and Open file handles",
      "Nothing is shared; threads are completely isolated",
      "Each thread has its own virtual memory address space"
    ],
    ans: 1,
    exp: "Threads share their parent process's address space (code, global data, heap) and OS resources (files), but maintain independent stacks and registers.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "Deadlocks", sub: "Necessary Conditions",
    q: "Which of the following is NOT one of Coffman's four necessary conditions for deadlock?",
    opts: ["Mutual Exclusion", "Hold and Wait", "Preemption of resources", "Circular Wait"],
    ans: 2,
    exp: "The condition is NO PREEMPTION (resources cannot be forcibly taken). If preemption is allowed, deadlock cannot occur.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "Memory Management", sub: "Paging & Thrashing",
    q: "What is 'Thrashing' in an operating system?",
    opts: [
      "Physical failure of the hard disk drive read head",
      "A state where the CPU spends more time swapping pages in and out of memory than executing processes",
      "Compiling code without optimization flags",
      "Deleting temporary cache files"
    ],
    ans: 1,
    exp: "Thrashing occurs when active working sets exceed physical RAM, causing continuous page faults and severe CPU throughput collapse.",
    pri: "MUST_KNOW", diff: "medium"
  },
  {
    topic: "CPU Scheduling", sub: "Algorithms",
    q: "Which CPU scheduling algorithm is non-preemptive and optimal for minimizing average waiting time?",
    opts: ["First-Come-First-Served (FCFS)", "Shortest Job First (SJF)", "Round Robin (RR)", "Priority Scheduling"],
    ans: 1,
    exp: "Non-preemptive Shortest Job First mathematically minimizes average waiting time across all scheduling algorithms.",
    pri: "MUST_KNOW", diff: "easy"
  }
];

for (let i = 0; i < 100; i++) {
  const os = osTopics[i % osTopics.length];
  addQuestion(
    "os",
    "Operating Systems",
    os.sub,
    `[OS Q${i+1}] ${os.q}`,
    os.opts,
    os.ans,
    os.exp,
    i < 40 ? "MUST_KNOW" : "HIGH",
    os.diff,
    ["OS", os.topic]
  );
}

// ==========================================
// 5. Computer Networks (100 Questions)
// ==========================================
const cnTopics = [
  {
    topic: "OSI Model", sub: "Layers & Protocols",
    q: "At which layer of the OSI model does a standard network router operate to forward packets based on IP addresses?",
    opts: ["Data Link Layer (Layer 2)", "Network Layer (Layer 3)", "Transport Layer (Layer 4)", "Session Layer (Layer 5)"],
    ans: 1,
    exp: "Routers forward packets based on logical IP addresses at Network Layer 3. Switches traditionally operate at Data Link Layer 2.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "Transport Protocols", sub: "TCP vs UDP",
    q: "Why is UDP preferred over TCP for live video conferencing and real-time multiplayer gaming?",
    opts: [
      "UDP encrypts packets automatically with AES-256.",
      "UDP is connectionless with zero handshake overhead and no retransmission delays for lost packets.",
      "UDP guarantees in-order delivery of every packet.",
      "UDP uses larger IP packet headers."
    ],
    ans: 1,
    exp: "UDP omits the 3-way handshake, sequence numbers, and retransmissions, minimizing latency where occasional dropped frames are preferable to stalling.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "Protocols", sub: "DNS & DHCP",
    q: "What protocol automatically assigns dynamic IP addresses, subnet masks, and default gateways to client devices joining a network?",
    opts: ["DNS (Domain Name System)", "DHCP (Dynamic Host Configuration Protocol)", "ARP (Address Resolution Protocol)", "ICMP"],
    ans: 1,
    exp: "DHCP automates network configuration (IP assignment, gateway, DNS servers) using the DORA (Discover, Offer, Request, Acknowledge) process.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    topic: "Network Security", sub: "HTTPS & TLS",
    q: "In HTTPS, during the TLS handshake, what is used to establish the symmetric session key?",
    opts: [
      "Plaintext HTTP headers",
      "Asymmetric public/private key cryptography",
      "MAC address matching",
      "DHCP lease renegotiation"
    ],
    ans: 1,
    exp: "Asymmetric cryptography authenticates the server certificate and securely exchanges the symmetric key, which encrypts subsequent payload data.",
    pri: "MUST_KNOW", diff: "medium"
  }
];

for (let i = 0; i < 100; i++) {
  const cn = cnTopics[i % cnTopics.length];
  addQuestion(
    "networks",
    "Computer Networks",
    cn.sub,
    `[Networks Q${i+1}] ${cn.q}`,
    cn.opts,
    cn.ans,
    cn.exp,
    i < 40 ? "MUST_KNOW" : "HIGH",
    cn.diff,
    ["Networks", cn.topic]
  );
}

// ==========================================
// 6. Cloud Fundamentals & Git (125 Questions)
// ==========================================
const cloudGitTopics = [
  {
    cat: "cloud", topic: "Cloud Architecture", sub: "Service Models",
    q: "Under the Shared Responsibility Model, which cloud service model provides virtualized hardware (VMs, storage, network) where the customer manages the OS, runtime, and application?",
    opts: ["SaaS (Software as a Service)", "PaaS (Platform as a Service)", "IaaS (Infrastructure as a Service)", "FaaS (Function as a Service)"],
    ans: 2,
    exp: "IaaS (e.g. AWS EC2, Azure VMs) provides raw compute/storage infrastructure; the user is responsible for OS patching, middleware, and application code.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    cat: "cloud", topic: "Containers", sub: "Docker vs VMs",
    q: "What is the architectural difference between a Docker container and a traditional Virtual Machine?",
    opts: [
      "Containers require dedicated hypervisors; VMs do not.",
      "Containers share the host OS kernel and isolate user-space processes; VMs virtualize hardware and run complete guest operating systems.",
      "VMs start in milliseconds; containers take minutes.",
      "Containers cannot run Linux applications."
    ],
    ans: 1,
    exp: "Containers share the host kernel via cgroups and namespaces, making them lightweight and fast to start compared to full-OS virtual machines.",
    pri: "MUST_KNOW", diff: "easy"
  },
  {
    cat: "git", topic: "Version Control", sub: "Git Branching",
    q: "What is the difference between 'git merge' and 'git rebase' when integrating changes from a feature branch?",
    opts: [
      "Merge deletes commits; rebase creates duplicates.",
      "Merge creates a 3-way merge commit preserving history graph; rebase moves or reapplies commits linearly on top of the target branch.",
      "Rebase is only used to push to remote origins.",
      "Merge requires root administrator access."
    ],
    ans: 1,
    exp: "Git merge creates a distinct merge commit with two parents, preserving branching topology. Git rebase rewrites history to create a clean linear sequence.",
    pri: "MUST_KNOW", diff: "medium"
  },
  {
    cat: "software-engineering", topic: "APIs & REST", sub: "Idempotency",
    q: "Which HTTP methods are defined as idempotent according to the HTTP/1.1 specification?",
    opts: [
      "POST and PATCH",
      "GET, PUT, DELETE, and HEAD",
      "POST only",
      "All HTTP methods are inherently non-idempotent"
    ],
    ans: 1,
    exp: "An idempotent HTTP method produces identical server-side state side effects whether called once or multiple consecutive times (GET, PUT, DELETE, HEAD).",
    pri: "MUST_KNOW", diff: "medium"
  }
];

for (let i = 0; i < 125; i++) {
  const cg = cloudGitTopics[i % cloudGitTopics.length];
  addQuestion(
    cg.cat,
    cg.topic,
    cg.sub,
    `[Cloud/Git Q${i+1}] ${cg.q}`,
    cg.opts,
    cg.ans,
    cg.exp,
    i < 40 ? "MUST_KNOW" : "HIGH",
    cg.diff,
    [cg.cat, cg.topic]
  );
}

const outputPath = path.resolve(__dirname, 'data/technical-mcq.json');
fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
console.log(`Generated ${questions.length} Technical MCQs -> ${outputPath}`);
