import { Question } from '../models/Question.js';

export const seedAILiteracy = async () => {
  const rawQuestions = [
    {
      title: 'What does LLM stand for in Generative AI?',
      description: 'Choose the correct expansion of LLM.',
      options: [
        'Large Logic Model',
        'Large Language Model',
        'Local Language Machine',
        'Logical Learning Mechanism'
      ],
      correctAnswer: 1,
      explanation: 'LLM stands for Large Language Model, which is a type of AI algorithm that applies neural network techniques with a large number of parameters to process and understand human languages.',
      tags: ['Generative AI', 'Basics', 'LLM'],
      difficulty: 'easy'
    },
    {
      title: 'Which of the following is an example of Prompt Injection?',
      description: 'Identify the security vulnerability.',
      options: [
        'Providing 5 examples to the model before asking a question',
        'Tricking an AI to ignore its system instructions and execute a malicious command',
        'Training a model on corrupted data to change its fundamental behavior',
        'Asking the model to think step-by-step'
      ],
      correctAnswer: 1,
      explanation: 'Prompt Injection is a technique where a user inputs text designed to trick an LLM into ignoring its original instructions and executing unauthorized actions.',
      tags: ['Prompt Engineering', 'AI Security'],
      difficulty: 'medium'
    },
    {
      title: 'What is Chain-of-Thought prompting?',
      description: 'Select the best description of CoT prompting.',
      options: [
        'Generating a continuous stream of random text',
        'Prompting the model to output a step-by-step reasoning process before giving the final answer',
        'Providing multiple isolated examples to the model',
        'Connecting multiple AI models in a sequence'
      ],
      correctAnswer: 1,
      explanation: 'Chain-of-Thought (CoT) prompting involves asking the model to break down a complex problem into smaller, logical steps before arriving at a conclusion.',
      tags: ['Prompt Engineering', 'Reasoning'],
      difficulty: 'medium'
    },
    {
      title: 'What is hallucination in the context of LLMs?',
      description: 'Identify the correct definition.',
      options: [
        'When the model consumes too much memory',
        'When the AI becomes sentient',
        'When the model confidently generates false or fabricated information',
        'When the model cannot generate an image correctly'
      ],
      correctAnswer: 2,
      explanation: 'Hallucination occurs when an AI model confidently provides an incorrect, nonsensical, or fabricated response because it lacks actual understanding.',
      tags: ['Responsible AI', 'Hallucination'],
      difficulty: 'medium'
    },
    {
      title: 'In ML, what is the difference between supervised and unsupervised learning?',
      description: 'Choose the most accurate distinction.',
      options: [
        'Supervised uses deep networks, unsupervised uses simple regression',
        'Supervised learning uses labeled data, while unsupervised learning uses unlabeled data to find patterns',
        'Supervised learning does not require human supervision during training',
        'Unsupervised learning requires humans to constantly provide answers'
      ],
      correctAnswer: 1,
      explanation: 'Supervised learning relies on a labeled dataset (inputs paired with correct outputs), whereas unsupervised learning analyzes unlabeled data to find hidden structures.',
      tags: ['ML Basics', 'Machine Learning'],
      difficulty: 'hard'
    },
    {
      title: 'What is a zero-shot prompt?',
      description: 'Define zero-shot prompting.',
      options: [
        'A prompt that gives zero results',
        'A prompt where you ask the AI to delete its memory',
        'A prompt that includes no examples and asks the model to perform the task directly',
        'A prompt that takes zero seconds to execute'
      ],
      correctAnswer: 2,
      explanation: 'Zero-shot prompting implies asking the AI to perform a task without providing any prior examples of the task in the prompt.',
      tags: ['Prompt Engineering', 'Zero-shot'],
      difficulty: 'easy'
    }
  ];

  const questions = rawQuestions.map(q => ({
    question: `${q.title} - ${q.description}`,
    category: 'ai-literacy',
    topic: q.tags[0] || 'AI Literacy',
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

  await Question.deleteMany({ category: 'ai-literacy' });
  await Question.insertMany(questions);
  console.log(`✅ Seeded ${questions.length} AI Literacy questions`);
};
