// Seed Data for Interview Questions
export const seedInterviewQuestions = [
  // Technical Interview
  {
    question: "Explain the difference between a HashMap and a TreeMap in Java.",
    difficulty: "medium",
    idealAnswer: "HashMap uses a hash table implementation for key-value pairs, offering O(1) average time complexity for basic operations. It does not maintain any order. TreeMap uses a Red-Black tree implementation, offering O(log n) time complexity. It maintains elements in a sorted order based on the natural ordering of keys or a provided Comparator.",
    keyPoints: ["HashMap: O(1) time complexity, unordered", "TreeMap: O(log n) time complexity, sorted order", "HashMap uses hash table, TreeMap uses Red-Black tree"],
    followUpQuestions: ["When would you choose a TreeMap over a HashMap?", "How does a HashMap handle collisions?"],
    category: "technical-interview",
    topic: "Java"
  },
  {
    question: "What is Database Normalization and why is it important?",
    difficulty: "medium",
    idealAnswer: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller, related tables and defining relationships between them. It is important to minimize duplicate data, resolve anomalies (insert, update, delete), and ensure the database takes up less space.",
    keyPoints: ["Reduces data redundancy", "Improves data integrity", "Resolves update, insert, and delete anomalies"],
    followUpQuestions: ["Can you explain the difference between 1NF, 2NF, and 3NF?", "What is denormalization and when would you use it?"],
    category: "technical-interview",
    topic: "DBMS"
  },
  {
    question: "What are the SOLID principles in Object-Oriented Programming?",
    difficulty: "hard",
    idealAnswer: "SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable. They are: Single Responsibility Principle (a class should have one, and only one, reason to change), Open/Closed Principle (software entities should be open for extension but closed for modification), Liskov Substitution Principle (objects in a program should be replaceable with instances of their subtypes), Interface Segregation Principle (many client-specific interfaces are better than one general-purpose interface), and Dependency Inversion Principle (depend upon abstractions, not concretions).",
    keyPoints: ["Single Responsibility", "Open/Closed", "Liskov Substitution", "Interface Segregation", "Dependency Inversion"],
    followUpQuestions: ["Can you give an example of the Single Responsibility Principle?", "How does Dependency Injection relate to the Dependency Inversion Principle?"],
    category: "technical-interview",
    topic: "OOP"
  },
  
  // HR / Behavioral Interview
  {
    question: "Tell me about yourself.",
    difficulty: "easy",
    idealAnswer: "I am a recent computer science graduate with a passion for software development. During my studies, I focused on building scalable web applications and gained strong foundational knowledge in Java, React, and databases. In my final year project, I led a team of three to develop a full-stack e-commerce platform, which taught me valuable collaboration and problem-solving skills. I am excited to apply my technical background and eager to learn in a professional environment like Capgemini.",
    keyPoints: ["Brief educational background", "Highlight key technical skills", "Mention a relevant project or experience", "Connect to the company/role"],
    followUpQuestions: ["What was your role in that team project?", "Which technology do you feel most comfortable with?"],
    category: "hr-interview",
    topic: "Self-Intro"
  },
  {
    question: "Why do you want to join Capgemini?",
    difficulty: "medium",
    idealAnswer: "I am drawn to Capgemini because of its strong reputation as a global leader in consulting and technology services. I am particularly impressed by your focus on innovation and digital transformation. I have read about Capgemini's comprehensive training programs for freshers, which aligns perfectly with my desire for continuous learning and professional growth. Furthermore, the collaborative and diverse work culture at Capgemini is an environment where I believe I can thrive and contribute effectively.",
    keyPoints: ["Global leader reputation", "Focus on innovation", "Good training programs", "Collaborative culture"],
    followUpQuestions: ["Are you open to relocation?", "What do you know about our recent projects?"],
    category: "hr-interview",
    topic: "Why Capgemini"
  },
  {
    question: "Tell me about a time you faced a difficult challenge and how you overcame it.",
    difficulty: "medium",
    idealAnswer: "During my final year project, we faced a significant challenge when our database design proved to be inefficient as the data volume grew. Queries were taking too long, impacting the application's performance. As the backend lead, I took the initiative to learn about database indexing and query optimization. I redesigned the schema, added necessary indexes, and rewrote the critical SQL queries. This reduced the load time by 70%. It taught me the importance of scalable design and how to research and solve unforeseen technical problems under pressure.",
    keyPoints: ["Use STAR method (Situation, Task, Action, Result)", "Focus on your specific action", "Highlight the positive outcome and what was learned"],
    followUpQuestions: ["What would you do differently if you faced that situation again?", "How did your team react to the changes?"],
    category: "hr-interview",
    topic: "Situational"
  }
];
