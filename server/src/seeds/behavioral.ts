import { Question } from '../models/Question.js';

export const seedBehavioral = async () => {
  const rawQuestions = [
    {
      title: 'Deadline Pressure and Teamwork',
      description: 'Your project deadline is tomorrow, and a team member suddenly falls ill without finishing their critical module. What do you do?',
      options: [
        'Complain to the manager that the deadline will be missed due to the team member.',
        'Work overnight to complete the module yourself without telling anyone.',
        'Immediately inform the project manager, assess the remaining work, and distribute it among the available team members.',
        'Submit the project as is, explaining the module is missing due to illness.'
      ],
      correctAnswer: 2,
      explanation: 'Aligns with Capgemini values: Team Spirit and Honesty. Communicating early and collaborating to solve the issue is the most professional approach.',
      tags: ['Teamwork', 'Deadline Pressure', 'Communication'],
      difficulty: 'medium'
    },
    {
      title: 'Handling Constructive Feedback',
      description: 'During a code review, a senior developer points out multiple flaws in your logic and suggests a completely different approach. How do you react?',
      options: [
        'Defend your code aggressively, pointing out that it passes all tests.',
        'Ignore the feedback and merge your code anyway.',
        'Feel discouraged but quietly rewrite the code as they suggested.',
        'Thank them for the feedback, ask clarifying questions to understand their approach, and implement the improvements.'
      ],
      correctAnswer: 3,
      explanation: 'Aligns with Capgemini values: Modesty and Team Spirit. Accepting feedback gracefully and learning from peers is key to growth.',
      tags: ['Professionalism', 'Adaptability'],
      difficulty: 'medium'
    },
    {
      title: 'Ethical Dilemma & Production Safety',
      description: 'You discover that a piece of software your team is about to deploy has a minor security vulnerability. However, fixing it will delay the highly anticipated launch. What do you do?',
      options: [
        'Keep quiet so the launch goes smoothly. It is a minor bug anyway.',
        'Tell only your best friend on the team.',
        'Escalate the vulnerability immediately to the tech lead and security team, highlighting the risks of proceeding without a fix.',
        'Fix the code directly in production after the launch without telling anyone.'
      ],
      correctAnswer: 2,
      explanation: 'Aligns with Capgemini values: Honesty and Boldness. Integrity and security must always take precedence over deadlines.',
      tags: ['Integrity', 'Ethical Dilemmas'],
      difficulty: 'hard'
    },
    {
      title: 'Conflict Resolution & Technical Debate',
      description: 'You and another developer have a strong disagreement over which technology stack to use for a new feature. How do you resolve it?',
      options: [
        'Escalate to the manager immediately and ask them to decide.',
        'Refuse to work on the project unless your stack is chosen.',
        'Propose a technical discussion focusing on pros/cons, business requirements, and prototype both if necessary to make an objective decision.',
        'Just agree with the other developer to avoid conflict.'
      ],
      correctAnswer: 2,
      explanation: 'Aligns with Capgemini values: Trust and Team Spirit. Resolving conflicts through objective, professional discussion is the ideal approach.',
      tags: ['Problem Solving', 'Conflict Resolution'],
      difficulty: 'medium'
    },
    {
      title: 'Ownership Under Ambiguity',
      description: 'You are assigned a task with vague requirements and your manager is on urgent leave for two days. How do you proceed?',
      options: [
        'Wait until the manager returns before doing any work.',
        'Review existing documentation, consult senior colleagues/stakeholders to clarify expectations, document your assumptions, and begin initial exploratory work.',
        'Guess what is needed, build it completely, and present it as final.',
        'Complain to HR that the team does not provide adequate task briefs.'
      ],
      correctAnswer: 1,
      explanation: 'Aligns with Capgemini values: Boldness and Freedom. Proactively clarifying ambiguity while responsibly documenting assumptions demonstrates high ownership.',
      tags: ['Ownership', 'Problem Solving'],
      difficulty: 'medium'
    },
    {
      title: 'Client Communication & Unrealistic Demands',
      description: 'A client requests a major feature change two days before UAT sign-off without updating the scope of work. What is your response?',
      options: [
        'Agree immediately and force junior devs to work through the weekend.',
        'Flatly refuse and tell the client it is not part of the contract.',
        'Acknowledge the client request, politely explain the impact on the existing schedule, and propose evaluating it as a Phase 2 change request with the Project Lead.',
        'Pretend you did not see the email until after the release.'
      ],
      correctAnswer: 2,
      explanation: 'Aligns with Capgemini values: Honesty and Professionalism. Balancing client satisfaction with transparent reality and formal scope management is essential.',
      tags: ['Communication', 'Professionalism'],
      difficulty: 'hard'
    },
    {
      title: 'Cross-Functional Collaboration',
      description: 'The QA team repeatedly returns tickets logged against your module citing minor discrepancies with the Figma designs. How do you handle this?',
      options: [
        'Argue that QA is being overly pedantic and block their tickets.',
        'Schedule a quick 15-minute sync with the UI designer and QA engineer to align on acceptance criteria and pixel-perfection expectations.',
        'Ignore the bug reports and merge to production.',
        'Ask the manager to transfer the QA engineer to another team.'
      ],
      correctAnswer: 1,
      explanation: 'Aligns with Capgemini values: Team Spirit and Modesty. Constructive cross-functional collaboration and clear criteria alignment prevent friction.',
      tags: ['Teamwork', 'Communication'],
      difficulty: 'easy'
    },
    {
      title: 'Continuous Learning & Upskilling',
      description: 'Your project shifts towards a new cloud platform (AWS to GCP) that you have never worked with before. What is your strategy?',
      options: [
        'Request an immediate transfer to a legacy AWS project.',
        'Proactively dedicate study time to GCP fundamentals, leverage Capgemini learning portals, and partner with a colleague experienced in GCP.',
        'Rely entirely on copying code snippets without understanding the architecture.',
        'Wait for the company to sponsor a mandatory formal multi-month bootcamp.'
      ],
      correctAnswer: 1,
      explanation: 'Aligns with Capgemini values: Boldness and Adaptability. Eagerness to embrace modern cloud paradigms drives career acceleration in enterprise consulting.',
      tags: ['Adaptability', 'Professionalism'],
      difficulty: 'easy'
    },
    {
      title: 'Handling Production Outages',
      description: 'A bug you committed bypasses CI/CD and causes an outage in the production payment gateway. What should your immediate sequence of actions be?',
      options: [
        'Delete the commit logs and claim someone else pushed the build.',
        'Immediately alert the incident lead, take full ownership, assist in rolling back to the last stable release, and lead a blameless post-mortem with preventative tests.',
        'Go on an unannounced break until senior architects fix the issue.',
        'Blame the QA team for failing to catch the bug during staging.'
      ],
      correctAnswer: 1,
      explanation: 'Aligns with Capgemini values: Honesty, Trust, and Boldness. Owning mistakes quickly and prioritizing customer uptime fosters true engineering culture.',
      tags: ['Integrity', 'Ownership'],
      difficulty: 'hard'
    },
    {
      title: 'Mentoring Junior Colleagues',
      description: 'A junior intern on your team is struggling with Git branch conflicts and missing stand-up updates. What should you do?',
      options: [
        'Berate the intern in front of the team during daily stand-up.',
        'Reach out privately, offer a 30-minute pair-programming session to explain Git workflows, and share reference guides.',
        'Do all of the intern\'s tasks for them so the sprint completes on time.',
        'Report them to HR for incompetence.'
      ],
      correctAnswer: 1,
      explanation: 'Aligns with Capgemini values: Team Spirit and Modesty. Empathetic mentorship builds sustainable engineering teams and reflects leadership potential.',
      tags: ['Teamwork', 'Professionalism'],
      difficulty: 'medium'
    },
    {
      title: 'Managing Competing Priorities',
      description: 'You have two high-priority tasks due at the end of the sprint from different stakeholders. You realize you can only finish one with high quality. What do you do?',
      options: [
        'Rush both tasks and deliver half-tested, buggy deliverables for both.',
        'Communicate proactively with both stakeholders and your engineering manager, outline the trade-offs, and establish a clear priority order.',
        'Choose the easier task, submit it, and ignore the second stakeholder until the deadline passes.',
        'Call in sick on the day of the sprint demo.'
      ],
      correctAnswer: 1,
      explanation: 'Aligns with Capgemini values: Honesty and Professionalism. Transparent expectation management is far superior to silent failure or poor quality.',
      tags: ['Problem Solving', 'Communication'],
      difficulty: 'medium'
    },
    {
      title: 'Workplace Inclusion & Culture',
      description: 'During a sprint planning meeting, a colleague with a non-native English background is repeatedly talked over and interrupted by more vocal peers. How do you intervene?',
      options: [
        'Join in and talk over them as well to ensure meetings stay fast.',
        'Politely pause the conversation, say "I\'d love to hear what [Colleague] was sharing just now", and ensure their technical suggestion is heard.',
        'Complain to management after the meeting about loud team members.',
        'Ignore the situation because it is the meeting facilitator\'s responsibility alone.'
      ],
      correctAnswer: 1,
      explanation: 'Aligns with Capgemini values: Fun, Modesty, and Team Spirit. Inclusive cultures thrive when team members actively sponsor psychological safety.',
      tags: ['Teamwork', 'Communication'],
      difficulty: 'medium'
    }
  ];

  const questions = rawQuestions.map(q => ({
    question: `${q.title}: ${q.description}`,
    category: 'behavioral',
    topic: q.tags[0] || 'Behavioral',
    subtopic: q.tags[1] || 'General',
    difficulty: q.difficulty,
    options: q.options,
    answer: q.correctAnswer,
    explanation: q.explanation,
    tags: q.tags,
    sourceType: 'capgemini-style',
    relevance: 'high-priority',
    capgeminiRelevance: 4,
    isVerified: true
  }));

  await Question.deleteMany({ category: 'behavioral' });
  await Question.insertMany(questions);
  console.log(`✅ Seeded ${questions.length} Behavioral/SJT questions`);
};
