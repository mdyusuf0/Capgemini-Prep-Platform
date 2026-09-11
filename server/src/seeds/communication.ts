import { Question } from '../models/Question.js';

export const seedCommunication = async () => {
  const rawQuestions = [
    {
      title: 'Subject-Verb Agreement',
      description: 'Choose the correct form of the verb.',
      options: [
        'The group of students are arriving late.',
        'The group of students is arriving late.',
        'The group of students were arriving late.',
        'The group of students have arrived late.'
      ],
      correctAnswer: 1,
      explanation: '"Group" is a singular collective noun, so it takes the singular verb "is".',
      tags: ['Grammar', 'Subject-Verb Agreement'],
      difficulty: 'easy'
    },
    {
      title: 'Fill in the correct preposition',
      description: 'Complete the sentence: "She has been working here ___ 2018."',
      options: ['since', 'for', 'from', 'in'],
      correctAnswer: 0,
      explanation: 'We use "since" for a specific point in time in the past.',
      tags: ['Prepositions', 'Grammar'],
      difficulty: 'easy'
    },
    {
      title: 'Vocabulary: Synonyms',
      description: 'What is the closest synonym for the word "Meticulous"?',
      options: ['Careless', 'Fast', 'Thorough', 'Angry'],
      correctAnswer: 2,
      explanation: '"Meticulous" means showing great attention to detail; very careful and precise, which is synonymous with "thorough".',
      tags: ['Vocabulary', 'Synonyms'],
      difficulty: 'medium'
    },
    {
      title: 'Direct to Indirect Speech',
      description: 'Convert: He said, "I am reading a book."',
      options: [
        'He said that he is reading a book.',
        'He said that I was reading a book.',
        'He said that he was reading a book.',
        'He says that he is reading a book.'
      ],
      correctAnswer: 2,
      explanation: 'Present continuous ("am reading") changes to past continuous ("was reading") in indirect speech.',
      tags: ['Speech and Tenses', 'Grammar'],
      difficulty: 'medium'
    },
    {
      title: 'Sentence Correction',
      description: 'Identify the grammatically correct sentence.',
      options: [
        'Between you and I, this plan will not work.',
        'Between you and me, this plan will not work.',
        'Among you and me, this plan will not work.',
        'Between I and you, this plan will not work.'
      ],
      correctAnswer: 1,
      explanation: '"Between" is a preposition, and it must be followed by an objective pronoun ("me", not "I").',
      tags: ['Sentence Correction', 'Pronouns'],
      difficulty: 'medium'
    }
  ];

  const questions = rawQuestions.map(q => ({
    question: `${q.title}: ${q.description}`,
    category: 'communication',
    topic: q.tags[0] || 'Communication',
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

  await Question.deleteMany({ category: 'communication' });
  await Question.insertMany(questions);
  console.log(`✅ Seeded ${questions.length} Communication questions`);
};
