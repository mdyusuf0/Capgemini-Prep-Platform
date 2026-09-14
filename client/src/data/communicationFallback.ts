export interface CommunicationFallbackQuestion {
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

export const FALLBACK_COMMUNICATION_QUESTIONS: CommunicationFallbackQuestion[] = [
  {
    "_id": "comm_fb_1",
    "question": "[Verbal Ability] Select the sentence with correct subject-verb agreement: (Pattern Variant 1)",
    "options": [
      "Neither the manager nor the employees was available for comment.",
      "Neither the manager nor the employees were available for comment.",
      "Neither the employees nor the manager were available for comment.",
      "Each of the candidates have submitted their portfolio."
    ],
    "answer": 1,
    "explanation": "When subjects are joined by 'neither... nor', the verb agrees with the nearer subject ('employees' is plural, so 'were' is correct).",
    "topic": "Grammar",
    "subtopic": "Subject-Verb Agreement",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_2",
    "question": "[Verbal Ability] Complete the sentence: 'A committee of senior architects and lead developers ___ formed yesterday.' (Pattern Variant 1)",
    "options": [
      "were",
      "was",
      "are",
      "have been"
    ],
    "answer": 1,
    "explanation": "'A committee' is a collective noun acting as a single unit here, and 'yesterday' signifies past tense, requiring the singular past verb 'was'.",
    "topic": "Grammar",
    "subtopic": "Subject-Verb Agreement",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_3",
    "question": "[Verbal Ability] Choose the correct preposition: 'The team has been consistently working on this microservice ___ last November.' (Pattern Variant 1)",
    "options": [
      "for",
      "since",
      "from",
      "during"
    ],
    "answer": 1,
    "explanation": "'Since' is used with the present perfect continuous tense to refer to a specific starting point in time ('last November').",
    "topic": "Grammar",
    "subtopic": "Prepositions",
    "difficulty": "hard",
    "category": "communication"
  },
  {
    "_id": "comm_fb_4",
    "question": "[Verbal Ability] Identify the correct sentence: (Pattern Variant 1)",
    "options": [
      "She is proficient with C++ and good in mathematics.",
      "She is proficient in C++ and good at mathematics.",
      "She is proficient at C++ and good in mathematics.",
      "She is proficient with C++ and good for mathematics."
    ],
    "answer": 1,
    "explanation": "The correct idioms are 'proficient in [a language/skill]' and 'good at [a subject/activity]'.",
    "topic": "Grammar",
    "subtopic": "Prepositions",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_5",
    "question": "[Verbal Ability] Select the correct form: 'By the time the code review began, the developer ___ all unit tests.' (Pattern Variant 1)",
    "options": [
      "already committed",
      "had already committed",
      "has already committed",
      "is already committing"
    ],
    "answer": 1,
    "explanation": "The past perfect tense ('had already committed') describes an action completed prior to another past event ('the code review began').",
    "topic": "Grammar",
    "subtopic": "Tenses",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_6",
    "question": "[Verbal Ability] Convert to indirect speech: The architect said, 'We will deploy the container tomorrow.' (Pattern Variant 1)",
    "options": [
      "The architect said that they will deploy the container tomorrow.",
      "The architect said that they would deploy the container the next day.",
      "The architect told that we would deploy the container yesterday.",
      "The architect says they would deploy the container tomorrow."
    ],
    "answer": 1,
    "explanation": "In reported speech with past reporting verb ('said'), 'will' shifts to 'would' and 'tomorrow' shifts to 'the next day'.",
    "topic": "Grammar",
    "subtopic": "Direct and Indirect Speech",
    "difficulty": "hard",
    "category": "communication"
  },
  {
    "_id": "comm_fb_7",
    "question": "[Verbal Ability] Convert to passive voice: 'The automated pipeline ran the regression test suite.' (Pattern Variant 1)",
    "options": [
      "The regression test suite was run by the automated pipeline.",
      "The regression test suite had been run by the automated pipeline.",
      "The automated pipeline was run by the regression test suite.",
      "The regression test suite is run by the automated pipeline."
    ],
    "answer": 0,
    "explanation": "Simple past active ('ran') converts to 'was/were + past participle' ('was run').",
    "topic": "Grammar",
    "subtopic": "Active and Passive Voice",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_8",
    "question": "[Verbal Ability] Identify the part of the sentence with an error: 'Between you and I (A) / there are no secrets (B) / regarding the new architecture (C) / No error (D)' (Pattern Variant 1)",
    "options": [
      "Between you and I (A)",
      "there are no secrets (B)",
      "regarding the new architecture (C)",
      "No error (D)"
    ],
    "answer": 0,
    "explanation": "'Between' is a preposition requiring objective pronouns: it should be 'Between you and me', not 'Between you and I'.",
    "topic": "Grammar",
    "subtopic": "Spotting Errors",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_9",
    "question": "[Verbal Ability] Select the correct conditional: 'If the server ___ properly configured, the traffic surge would not have caused downtime.' (Pattern Variant 1)",
    "options": [
      "was",
      "had been",
      "would have been",
      "were"
    ],
    "answer": 1,
    "explanation": "Third conditional (hypothetical past): 'If + past perfect (had been), would have + past participle'.",
    "topic": "Grammar",
    "subtopic": "Modals & Conditionals",
    "difficulty": "hard",
    "category": "communication"
  },
  {
    "_id": "comm_fb_10",
    "question": "[Verbal Ability] Fill in the blank: 'He holds ___ Master's degree in Computer Science and works as ___ unique systems specialist.' (Pattern Variant 1)",
    "options": [
      "a, an",
      "a, a",
      "an, a",
      "the, an"
    ],
    "answer": 1,
    "explanation": "'Master's' begins with a consonant sound (/m/) so takes 'a'; 'unique' begins with a consonant 'y' sound (/juː/) so also takes 'a'.",
    "topic": "Grammar",
    "subtopic": "Articles",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_11",
    "question": "[Verbal Ability] Select the sentence with correct subject-verb agreement: (Pattern Variant 2)",
    "options": [
      "Neither the manager nor the employees was available for comment.",
      "Neither the manager nor the employees were available for comment.",
      "Neither the employees nor the manager were available for comment.",
      "Each of the candidates have submitted their portfolio."
    ],
    "answer": 1,
    "explanation": "When subjects are joined by 'neither... nor', the verb agrees with the nearer subject ('employees' is plural, so 'were' is correct).",
    "topic": "Grammar",
    "subtopic": "Subject-Verb Agreement",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_12",
    "question": "[Verbal Ability] Complete the sentence: 'A committee of senior architects and lead developers ___ formed yesterday.' (Pattern Variant 2)",
    "options": [
      "were",
      "was",
      "are",
      "have been"
    ],
    "answer": 1,
    "explanation": "'A committee' is a collective noun acting as a single unit here, and 'yesterday' signifies past tense, requiring the singular past verb 'was'.",
    "topic": "Grammar",
    "subtopic": "Subject-Verb Agreement",
    "difficulty": "hard",
    "category": "communication"
  },
  {
    "_id": "comm_fb_13",
    "question": "[Verbal Ability] Choose the correct preposition: 'The team has been consistently working on this microservice ___ last November.' (Pattern Variant 2)",
    "options": [
      "for",
      "since",
      "from",
      "during"
    ],
    "answer": 1,
    "explanation": "'Since' is used with the present perfect continuous tense to refer to a specific starting point in time ('last November').",
    "topic": "Grammar",
    "subtopic": "Prepositions",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_14",
    "question": "[Verbal Ability] Identify the correct sentence: (Pattern Variant 2)",
    "options": [
      "She is proficient with C++ and good in mathematics.",
      "She is proficient in C++ and good at mathematics.",
      "She is proficient at C++ and good in mathematics.",
      "She is proficient with C++ and good for mathematics."
    ],
    "answer": 1,
    "explanation": "The correct idioms are 'proficient in [a language/skill]' and 'good at [a subject/activity]'.",
    "topic": "Grammar",
    "subtopic": "Prepositions",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_15",
    "question": "[Verbal Ability] Select the correct form: 'By the time the code review began, the developer ___ all unit tests.' (Pattern Variant 2)",
    "options": [
      "already committed",
      "had already committed",
      "has already committed",
      "is already committing"
    ],
    "answer": 1,
    "explanation": "The past perfect tense ('had already committed') describes an action completed prior to another past event ('the code review began').",
    "topic": "Grammar",
    "subtopic": "Tenses",
    "difficulty": "hard",
    "category": "communication"
  },
  {
    "_id": "comm_fb_16",
    "question": "[Verbal Ability] Convert to indirect speech: The architect said, 'We will deploy the container tomorrow.' (Pattern Variant 2)",
    "options": [
      "The architect said that they will deploy the container tomorrow.",
      "The architect said that they would deploy the container the next day.",
      "The architect told that we would deploy the container yesterday.",
      "The architect says they would deploy the container tomorrow."
    ],
    "answer": 1,
    "explanation": "In reported speech with past reporting verb ('said'), 'will' shifts to 'would' and 'tomorrow' shifts to 'the next day'.",
    "topic": "Grammar",
    "subtopic": "Direct and Indirect Speech",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_17",
    "question": "[Verbal Ability] Convert to passive voice: 'The automated pipeline ran the regression test suite.' (Pattern Variant 2)",
    "options": [
      "The regression test suite was run by the automated pipeline.",
      "The regression test suite had been run by the automated pipeline.",
      "The automated pipeline was run by the regression test suite.",
      "The regression test suite is run by the automated pipeline."
    ],
    "answer": 0,
    "explanation": "Simple past active ('ran') converts to 'was/were + past participle' ('was run').",
    "topic": "Grammar",
    "subtopic": "Active and Passive Voice",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_18",
    "question": "[Verbal Ability] Identify the part of the sentence with an error: 'Between you and I (A) / there are no secrets (B) / regarding the new architecture (C) / No error (D)' (Pattern Variant 2)",
    "options": [
      "Between you and I (A)",
      "there are no secrets (B)",
      "regarding the new architecture (C)",
      "No error (D)"
    ],
    "answer": 0,
    "explanation": "'Between' is a preposition requiring objective pronouns: it should be 'Between you and me', not 'Between you and I'.",
    "topic": "Grammar",
    "subtopic": "Spotting Errors",
    "difficulty": "hard",
    "category": "communication"
  },
  {
    "_id": "comm_fb_19",
    "question": "[Verbal Ability] Select the correct conditional: 'If the server ___ properly configured, the traffic surge would not have caused downtime.' (Pattern Variant 2)",
    "options": [
      "was",
      "had been",
      "would have been",
      "were"
    ],
    "answer": 1,
    "explanation": "Third conditional (hypothetical past): 'If + past perfect (had been), would have + past participle'.",
    "topic": "Grammar",
    "subtopic": "Modals & Conditionals",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_20",
    "question": "[Verbal Ability] Fill in the blank: 'He holds ___ Master's degree in Computer Science and works as ___ unique systems specialist.' (Pattern Variant 2)",
    "options": [
      "a, an",
      "a, a",
      "an, a",
      "the, an"
    ],
    "answer": 1,
    "explanation": "'Master's' begins with a consonant sound (/m/) so takes 'a'; 'unique' begins with a consonant 'y' sound (/juː/) so also takes 'a'.",
    "topic": "Grammar",
    "subtopic": "Articles",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_21",
    "question": "[Verbal Ability] Select the sentence with correct subject-verb agreement: (Pattern Variant 3)",
    "options": [
      "Neither the manager nor the employees was available for comment.",
      "Neither the manager nor the employees were available for comment.",
      "Neither the employees nor the manager were available for comment.",
      "Each of the candidates have submitted their portfolio."
    ],
    "answer": 1,
    "explanation": "When subjects are joined by 'neither... nor', the verb agrees with the nearer subject ('employees' is plural, so 'were' is correct).",
    "topic": "Grammar",
    "subtopic": "Subject-Verb Agreement",
    "difficulty": "hard",
    "category": "communication"
  },
  {
    "_id": "comm_fb_22",
    "question": "[Verbal Ability] Complete the sentence: 'A committee of senior architects and lead developers ___ formed yesterday.' (Pattern Variant 3)",
    "options": [
      "were",
      "was",
      "are",
      "have been"
    ],
    "answer": 1,
    "explanation": "'A committee' is a collective noun acting as a single unit here, and 'yesterday' signifies past tense, requiring the singular past verb 'was'.",
    "topic": "Grammar",
    "subtopic": "Subject-Verb Agreement",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_23",
    "question": "[Verbal Ability] Choose the correct preposition: 'The team has been consistently working on this microservice ___ last November.' (Pattern Variant 3)",
    "options": [
      "for",
      "since",
      "from",
      "during"
    ],
    "answer": 1,
    "explanation": "'Since' is used with the present perfect continuous tense to refer to a specific starting point in time ('last November').",
    "topic": "Grammar",
    "subtopic": "Prepositions",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_24",
    "question": "[Verbal Ability] Identify the correct sentence: (Pattern Variant 3)",
    "options": [
      "She is proficient with C++ and good in mathematics.",
      "She is proficient in C++ and good at mathematics.",
      "She is proficient at C++ and good in mathematics.",
      "She is proficient with C++ and good for mathematics."
    ],
    "answer": 1,
    "explanation": "The correct idioms are 'proficient in [a language/skill]' and 'good at [a subject/activity]'.",
    "topic": "Grammar",
    "subtopic": "Prepositions",
    "difficulty": "hard",
    "category": "communication"
  },
  {
    "_id": "comm_fb_25",
    "question": "[Verbal Ability] Select the correct form: 'By the time the code review began, the developer ___ all unit tests.' (Pattern Variant 3)",
    "options": [
      "already committed",
      "had already committed",
      "has already committed",
      "is already committing"
    ],
    "answer": 1,
    "explanation": "The past perfect tense ('had already committed') describes an action completed prior to another past event ('the code review began').",
    "topic": "Grammar",
    "subtopic": "Tenses",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_26",
    "question": "[Verbal Ability] Convert to indirect speech: The architect said, 'We will deploy the container tomorrow.' (Pattern Variant 3)",
    "options": [
      "The architect said that they will deploy the container tomorrow.",
      "The architect said that they would deploy the container the next day.",
      "The architect told that we would deploy the container yesterday.",
      "The architect says they would deploy the container tomorrow."
    ],
    "answer": 1,
    "explanation": "In reported speech with past reporting verb ('said'), 'will' shifts to 'would' and 'tomorrow' shifts to 'the next day'.",
    "topic": "Grammar",
    "subtopic": "Direct and Indirect Speech",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_27",
    "question": "[Verbal Ability] Convert to passive voice: 'The automated pipeline ran the regression test suite.' (Pattern Variant 3)",
    "options": [
      "The regression test suite was run by the automated pipeline.",
      "The regression test suite had been run by the automated pipeline.",
      "The automated pipeline was run by the regression test suite.",
      "The regression test suite is run by the automated pipeline."
    ],
    "answer": 0,
    "explanation": "Simple past active ('ran') converts to 'was/were + past participle' ('was run').",
    "topic": "Grammar",
    "subtopic": "Active and Passive Voice",
    "difficulty": "hard",
    "category": "communication"
  },
  {
    "_id": "comm_fb_28",
    "question": "[Verbal Ability] Identify the part of the sentence with an error: 'Between you and I (A) / there are no secrets (B) / regarding the new architecture (C) / No error (D)' (Pattern Variant 3)",
    "options": [
      "Between you and I (A)",
      "there are no secrets (B)",
      "regarding the new architecture (C)",
      "No error (D)"
    ],
    "answer": 0,
    "explanation": "'Between' is a preposition requiring objective pronouns: it should be 'Between you and me', not 'Between you and I'.",
    "topic": "Grammar",
    "subtopic": "Spotting Errors",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_29",
    "question": "[Verbal Ability] Select the correct conditional: 'If the server ___ properly configured, the traffic surge would not have caused downtime.' (Pattern Variant 3)",
    "options": [
      "was",
      "had been",
      "would have been",
      "were"
    ],
    "answer": 1,
    "explanation": "Third conditional (hypothetical past): 'If + past perfect (had been), would have + past participle'.",
    "topic": "Grammar",
    "subtopic": "Modals & Conditionals",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_30",
    "question": "[Verbal Ability] Fill in the blank: 'He holds ___ Master's degree in Computer Science and works as ___ unique systems specialist.' (Pattern Variant 3)",
    "options": [
      "a, an",
      "a, a",
      "an, a",
      "the, an"
    ],
    "answer": 1,
    "explanation": "'Master's' begins with a consonant sound (/m/) so takes 'a'; 'unique' begins with a consonant 'y' sound (/juː/) so also takes 'a'.",
    "topic": "Grammar",
    "subtopic": "Articles",
    "difficulty": "hard",
    "category": "communication"
  }
];
