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
      title: 'Ethical Dilemma',
      description: 'You discover that a piece of software your team is about to deploy has a minor security vulnerability. However, fixing it will delay the highly anticipated launch. What do you do?',
      options: [
        'Keep quiet so the launch goes smoothly. It is a minor bug anyway.',
        'Tell only your best friend on the team.',
        'Escalate the vulnerability immediately to the tech lead and security team, highlighting the risks of proceeding without a fix.',
        'Fix the code directly in production after the launch without telling anyone.'
      ],
      correctAnswer: 2,
      explanation: 'Aligns with Capgemini values: Honesty and Boldness. Integrity and security must always take precedence over deadlines.',
      tags: ['Ethical Dilemmas', 'Integrity'],
      difficulty: 'hard'
    },
    {
      title: 'Conflict Resolution',
      description: 'You and another developer have a strong disagreement over which technology stack to use for a new feature. How do you resolve it?',
      options: [
        'Escalate to the manager immediately and ask them to decide.',
        'Refuse to work on the project unless your stack is chosen.',
        'Propose a technical discussion focusing on pros/cons, business requirements, and prototype both if necessary to make an objective decision.',
        'Just agree with the other developer to avoid conflict.'
      ],
      correctAnswer: 2,
      explanation: 'Aligns with Capgemini values: Trust and Team Spirit. Resolving conflicts through objective, professional discussion is the ideal approach.',
      tags: ['Conflict Resolution', 'Problem Solving'],
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
