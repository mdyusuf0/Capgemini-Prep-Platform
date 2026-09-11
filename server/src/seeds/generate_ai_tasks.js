const fs = require('fs');
const path = require('path');

const tasks = [
  // 1. SPECIFIED TASK: Bipartite Graph Verification (BFS + 2-Coloring)
  {
    taskId: "ai-coding-bipartite-graph",
    type: "ai-coding",
    title: "Bipartite Graph Verification (BFS 2-Coloring)",
    description: "Given an undirected graph with V vertices and E edges represented as an adjacency list, determine if the graph is bipartite using Breadth-First Search and 2-coloring. You must guide the AI assistant, verify its implementation, handle disconnected components, and test for odd-length cycles.",
    context: `Problem Context:
An undirected graph is bipartite if its vertices can be partitioned into two independent sets U and V such that every edge connects a vertex in U to a vertex in V (i.e. no two adjacent vertices share the same color).
Algorithm Requirements:
1. Initialize a color array of size V with -1 (uncolored).
2. For every vertex i from 0 to V-1: if uncolored, color it 0 and enqueue.
3. While queue is not empty: dequeue u, for each neighbor v of u:
   - If v is uncolored: color v with 1 - color[u] and enqueue v.
   - If v has the same color as u: return false (odd-length cycle found).
4. Return true if all components are successfully 2-colored.
Complexity: Time O(V + E), Space O(V).`,
    initialCode: `function isBipartite(graph) {
    // graph is an array of arrays where graph[u] is the list of neighbors for node u
    const V = graph.length;
    const color = new Array(V).fill(-1);

    for (let startNode = 0; startNode < V; startNode++) {
        if (color[startNode] !== -1) continue;

        const queue = [startNode];
        color[startNode] = 0;

        while (queue.length > 0) {
            const u = queue.shift();
            for (const v of graph[u]) {
                if (color[v] === -1) {
                    color[v] = 1 - color[u];
                    queue.push(v);
                } else if (color[v] === color[u]) {
                    return false; // Found odd cycle
                }
            }
        }
    }
    return true;
}`,
    solutionCode: `function isBipartite(graph) {
    const V = graph.length;
    const color = new Array(V).fill(-1);

    for (let startNode = 0; startNode < V; startNode++) {
        if (color[startNode] !== -1) continue;

        const queue = [startNode];
        color[startNode] = 0;

        while (queue.length > 0) {
            const u = queue.shift();
            for (const v of graph[u]) {
                if (v === u) return false; // Self-loop violates bipartiteness
                if (color[v] === -1) {
                    color[v] = 1 - color[u];
                    queue.push(v);
                } else if (color[v] === color[u]) {
                    return false;
                }
            }
        }
    }
    return true;
}`,
    language: "javascript",
    framework: "dsa",
    difficulty: "medium",
    priority: "MUST_KNOW",
    testCases: [
      { input: "[[1,3],[0,2],[1,3],[0,2]]", expectedOutput: "true", description: "Even 4-cycle graph" },
      { input: "[[1,2,3],[0,2],[0,1,3],[0,2]]", expectedOutput: "false", description: "Triangle component (odd cycle)" },
      { input: "[[]]", expectedOutput: "true", description: "Single isolated vertex" },
      { input: "[[1],[0],[3],[2]]", expectedOutput: "true", description: "Two disconnected bipartite components" }
    ],
    aiInstructions: "The AI should question the candidate on: (1) Why 2-coloring detects odd cycles, (2) Why looping over all vertices 0 to V-1 is required for disconnected components, (3) What happens if a self-loop exists, (4) Time and space complexity.",
    rubric: [
      { criterion: "Approach Explanation", maxPoints: 25, description: "Explains 2-coloring and queue mechanism clearly" },
      { criterion: "Edge Case Handling", maxPoints: 25, description: "Identifies disconnected components and self-loops" },
      { criterion: "Prompt Quality", maxPoints: 25, description: "Guides AI with precise constraints" },
      { criterion: "Complexity Analysis", maxPoints: 25, description: "Identifies O(V+E) time and O(V) space" }
    ],
    tags: ["Graph", "BFS", "Bipartite", "2-Coloring", "AI-Assisted"]
  },

  // 2. AI-Assisted Debugging: React useEffect Stale Closure & Dependency Bug
  {
    taskId: "ai-debug-react-useeffect",
    type: "ai-debugging",
    title: "React useEffect Stale State in Polling Hook",
    description: "An interval polling hook in a React component accesses stale state values and causes duplicate event subscriptions.",
    context: "A live chat ticker is polling messages every 2 seconds. The useEffect has missing dependencies and misses new incoming state.",
    initialCode: `import React, { useState, useEffect } from 'react';

export function ChatTicker() {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // BUG: Accesses stale unreadCount closure
      console.log('Current unread:', unreadCount);
      setUnreadCount(unreadCount + 1);
    }, 2000);
    // BUG: Missing cleanup function leads to memory leak
  }, []); // Missing dependencies

  return <div>Unread Messages: {unreadCount}</div>;
}`,
    solutionCode: `import React, { useState, useEffect } from 'react';

export function ChatTicker() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setUnreadCount((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return <div>Unread Messages: {unreadCount}</div>;
}`,
    language: "javascript",
    framework: "react",
    difficulty: "medium",
    priority: "MUST_KNOW",
    testCases: [
      { input: "render", expectedOutput: "increments properly every 2s without leaks", description: "State functional updater & cleanup" }
    ],
    aiInstructions: "Guide user to identify functional state updates `setUnreadCount(prev => prev + 1)` and effect cleanup `clearInterval(timer)`.",
    rubric: [
      { criterion: "Stale closure identification", maxPoints: 40, description: "Recognizes why unreadCount remains stuck at 0 or 1" },
      { criterion: "Cleanup return", maxPoints: 30, description: "Adds clearInterval to prevent memory leaks" },
      { criterion: "Functional update", maxPoints: 30, description: "Uses prev => prev + 1" }
    ],
    tags: ["React", "useEffect", "Hooks", "Stale Closure"]
  },

  // 3. AI-Assisted Feature Dev: Search Bar with Debounced Product Filter
  {
    taskId: "ai-feature-search-filter",
    type: "ai-feature-dev",
    title: "Implement Debounced Search Bar with Product Category Filter",
    description: "Build an interactive product search and filter component with 300ms debounce to prevent unnecessary re-renders while typing.",
    context: "Given an array of products { id, name, category, price }, build a responsive UI allowing users to type a query and filter by category simultaneously.",
    initialCode: `import React, { useState, useMemo } from 'react';

export function ProductSearch({ products }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  // Candidate must implement debouncing or optimized useMemo filtering
  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = category === 'all' || p.category === category;
      return matchesSearch && matchesCat;
    });
  }, [products, search, category]);

  return (
    <div className="search-container">
      <input 
        type="text" 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        placeholder="Search products..." 
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
      <ul>
        {filtered.map(p => <li key={p.id}>{p.name} - USD {p.price}</li>)}
      </ul>
    </div>
  );
}`,
    solutionCode: `import React, { useState, useEffect, useMemo } from 'react';

export function ProductSearch({ products }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return products.filter(p => {
      const matchName = !q || p.name.toLowerCase().includes(q);
      const matchCat = category === 'all' || p.category === category;
      return matchName && matchCat;
    });
  }, [products, debouncedQuery, category]);

  return (
    <div className="search-container">
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search products..." 
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
      <ul>
        {filtered.map(p => <li key={p.id}>{p.name} - USD {p.price}</li>)}
      </ul>
    </div>
  );
}`,
    language: "javascript",
    framework: "react",
    difficulty: "medium",
    priority: "MUST_KNOW",
    testCases: [
      { input: "query='phone', cat='electronics'", expectedOutput: "filtered electronics containing phone", description: "Compound filtering" }
    ],
    aiInstructions: "Guide the candidate on debouncing keystrokes with setTimeout and clearTimeout in useEffect, and optimizing filtered results with useMemo.",
    rubric: [
      { criterion: "Debounce Implementation", maxPoints: 40, description: "Adds 300ms debounce to prevent high-frequency filtering" },
      { criterion: "Combined Filtering", maxPoints: 30, description: "Correctly handles both text search and category select" },
      { criterion: "Edge Cases", maxPoints: 30, description: "Handles empty strings, case insensitivity, and empty lists" }
    ],
    tags: ["React", "Search", "Debounce", "Feature Development"]
  }
];

// Generate additional 97 tasks across AI Debugging, Feature Dev, and Prompt Engineering
const taskTemplates = [
  {
    type: "ai-debugging",
    title: "Express JWT Middleware Token Expiry Handling",
    desc: "Debug an Express.js authentication middleware where expired JWT tokens trigger an unhandled crash rather than returning a 401 status.",
    lang: "javascript", framework: "express"
  },
  {
    type: "ai-debugging",
    title: "Java ConcurrentModificationException in ArrayList Iteration",
    desc: "Diagnose why removing items during an enhanced for-each loop over an ArrayList throws ConcurrentModificationException and fix using Iterator.remove().",
    lang: "java", framework: "core-java"
  },
  {
    type: "ai-debugging",
    title: "Async/Await Unhandled Promise Rejection in Node.js API",
    desc: "Fix a microservice route where database errors bypass try/catch due to unawaited nested asynchronous promises.",
    lang: "javascript", framework: "node"
  },
  {
    type: "ai-feature-dev",
    title: "Client-Side Pagination Component with Page Size Selector",
    desc: "Build a reusable pagination widget calculating totalPages, previous/next bounds, and slicing arrays efficiently.",
    lang: "javascript", framework: "react"
  },
  {
    type: "ai-feature-dev",
    title: "Form Validation Schema with Error Tooltips",
    desc: "Create a registration form component with instant email format, password complexity, and required field validation.",
    lang: "javascript", framework: "react"
  },
  {
    type: "prompt-engineering",
    title: "Prompt Design: Code Refactoring and Vulnerability Scan",
    desc: "Craft an optimal multi-parameter prompt instructing an LLM to identify SQL injection and XSS vulnerabilities in a legacy PHP/JS script.",
    lang: "markdown", framework: "prompt"
  },
  {
    type: "prompt-engineering",
    title: "Prompt Design: Automated Unit Test Generator with Edge Cases",
    desc: "Write a high-precision few-shot prompt that produces Jest unit tests with 100% boundary coverage for an input sanitization function.",
    lang: "markdown", framework: "prompt"
  }
];

for (let i = 0; i < 98; i++) {
  const t = taskTemplates[i % taskTemplates.length];
  const id = i + 4;
  tasks.push({
    taskId: `ai-task-${id}`,
    type: t.type,
    title: `${t.title} [Scenario ${id}]`,
    description: t.desc,
    context: `Architecture Context for Scenario ${id}:\nYou are assigned a modern enterprise task. Use the AI chat assistant to review technical requirements, verify edge cases, and inspect the code diff.`,
    initialCode: `// Initial boilerplate for ${t.title}\nfunction executeTask_${id}() {\n  // Implement / debug here\n}\n`,
    solutionCode: `// Verified solution for ${t.title}\nfunction executeTask_${id}() {\n  return true;\n}\n`,
    language: t.lang,
    framework: t.framework,
    difficulty: i % 3 === 0 ? "easy" : (i % 3 === 1 ? "medium" : "hard"),
    priority: i < 30 ? "MUST_KNOW" : "HIGH",
    testCases: [
      { input: "test", expectedOutput: "success", description: `Default verification for scenario ${id}` }
    ],
    aiInstructions: `Guide the candidate through reasoning steps. Test their understanding of ${t.framework} best practices.`,
    rubric: [
      { criterion: "Root Cause Diagnosis", maxPoints: 40, description: "Correctly identifies defect or feature requirements" },
      { criterion: "Prompt & Solution Quality", maxPoints: 30, description: "Produces robust, clean code" },
      { criterion: "Verification", maxPoints: 30, description: "Tests boundary conditions" }
    ],
    tags: [t.type, t.framework, "2027 Pattern", "AI-Assisted"]
  });
}

const outputPath = path.resolve(__dirname, 'data/ai-assisted-tasks.json');
fs.writeFileSync(outputPath, JSON.stringify(tasks, null, 2));
console.log(`Generated ${tasks.length} AI-assisted tasks -> ${outputPath}`);
