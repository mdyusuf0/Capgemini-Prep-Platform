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
  },
  {
    "_id": "comm_fb_31",
    "question": "[Verbal Ability] Select the sentence with correct subject-verb agreement: (Pattern Variant 4)",
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
    "_id": "comm_fb_32",
    "question": "[Verbal Ability] Complete the sentence: 'A committee of senior architects and lead developers ___ formed yesterday.' (Pattern Variant 4)",
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
    "_id": "comm_fb_33",
    "question": "[Verbal Ability] Choose the correct preposition: 'The team has been consistently working on this microservice ___ last November.' (Pattern Variant 4)",
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
    "_id": "comm_fb_34",
    "question": "[Verbal Ability] Identify the correct sentence: (Pattern Variant 4)",
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
    "_id": "comm_fb_35",
    "question": "[Verbal Ability] Select the correct form: 'By the time the code review began, the developer ___ all unit tests.' (Pattern Variant 4)",
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
    "_id": "comm_fb_36",
    "question": "[Verbal Ability] Convert to indirect speech: The architect said, 'We will deploy the container tomorrow.' (Pattern Variant 4)",
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
    "_id": "comm_fb_37",
    "question": "[Verbal Ability] Convert to passive voice: 'The automated pipeline ran the regression test suite.' (Pattern Variant 4)",
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
    "_id": "comm_fb_38",
    "question": "[Verbal Ability] Identify the part of the sentence with an error: 'Between you and I (A) / there are no secrets (B) / regarding the new architecture (C) / No error (D)' (Pattern Variant 4)",
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
    "_id": "comm_fb_39",
    "question": "[Verbal Ability] Select the correct conditional: 'If the server ___ properly configured, the traffic surge would not have caused downtime.' (Pattern Variant 4)",
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
    "_id": "comm_fb_40",
    "question": "[Verbal Ability] Fill in the blank: 'He holds ___ Master's degree in Computer Science and works as ___ unique systems specialist.' (Pattern Variant 4)",
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
    "_id": "comm_fb_41",
    "question": "Choose the word most SIMILAR in meaning to \"METICULOUS\":",
    "options": [
      "Thorough",
      "Careless",
      "Unrelated word",
      "Fictional term"
    ],
    "answer": 0,
    "explanation": "\"METICULOUS\" means Thorough, painstaking, precise. The closest synonym is Thorough.",
    "topic": "Vocabulary",
    "subtopic": "Synonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_42",
    "question": "Choose the word most OPPOSITE in meaning to \"METICULOUS\":",
    "options": [
      "Thorough",
      "Careless",
      "Neutral term",
      "Secondary derivative"
    ],
    "answer": 1,
    "explanation": "\"METICULOUS\" means Thorough, painstaking, precise. Its antonym is Careless.",
    "topic": "Vocabulary",
    "subtopic": "Antonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_43",
    "question": "What is the meaning of the idiom \"Dot the i's and cross the t's\"?",
    "options": [
      "Relating to thorough",
      "A culinary technique",
      "An algebraic proof",
      "A navigational instrument"
    ],
    "answer": 0,
    "explanation": "The idiom \"Dot the i's and cross the t's\" conveys the sense of being thorough.",
    "topic": "Vocabulary",
    "subtopic": "Idioms & Phrasal Verbs",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_44",
    "question": "Choose the word most SIMILAR in meaning to \"CANDID\":",
    "options": [
      "Frank",
      "Deceitful",
      "Unrelated word",
      "Fictional term"
    ],
    "answer": 0,
    "explanation": "\"CANDID\" means Frank, outspoken, blunt. The closest synonym is Frank.",
    "topic": "Vocabulary",
    "subtopic": "Synonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_45",
    "question": "Choose the word most OPPOSITE in meaning to \"CANDID\":",
    "options": [
      "Frank",
      "Deceitful",
      "Neutral term",
      "Secondary derivative"
    ],
    "answer": 1,
    "explanation": "\"CANDID\" means Frank, outspoken, blunt. Its antonym is Deceitful.",
    "topic": "Vocabulary",
    "subtopic": "Antonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_46",
    "question": "What is the meaning of the idiom \"Call a spade a spade\"?",
    "options": [
      "Relating to frank",
      "A culinary technique",
      "An algebraic proof",
      "A navigational instrument"
    ],
    "answer": 0,
    "explanation": "The idiom \"Call a spade a spade\" conveys the sense of being frank.",
    "topic": "Vocabulary",
    "subtopic": "Idioms & Phrasal Verbs",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_47",
    "question": "Choose the word most SIMILAR in meaning to \"PRAGMATIC\":",
    "options": [
      "Practical",
      "Idealistic",
      "Unrelated word",
      "Fictional term"
    ],
    "answer": 0,
    "explanation": "\"PRAGMATIC\" means Practical, realistic, utilitarian. The closest synonym is Practical.",
    "topic": "Vocabulary",
    "subtopic": "Synonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_48",
    "question": "Choose the word most OPPOSITE in meaning to \"PRAGMATIC\":",
    "options": [
      "Practical",
      "Idealistic",
      "Neutral term",
      "Secondary derivative"
    ],
    "answer": 1,
    "explanation": "\"PRAGMATIC\" means Practical, realistic, utilitarian. Its antonym is Idealistic.",
    "topic": "Vocabulary",
    "subtopic": "Antonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_49",
    "question": "What is the meaning of the idiom \"Down to earth\"?",
    "options": [
      "Relating to practical",
      "A culinary technique",
      "An algebraic proof",
      "A navigational instrument"
    ],
    "answer": 0,
    "explanation": "The idiom \"Down to earth\" conveys the sense of being practical.",
    "topic": "Vocabulary",
    "subtopic": "Idioms & Phrasal Verbs",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_50",
    "question": "Choose the word most SIMILAR in meaning to \"RESILIENT\":",
    "options": [
      "Tenacious",
      "Fragile",
      "Unrelated word",
      "Fictional term"
    ],
    "answer": 0,
    "explanation": "\"RESILIENT\" means Tenacious, flexible, enduring. The closest synonym is Tenacious.",
    "topic": "Vocabulary",
    "subtopic": "Synonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_51",
    "question": "Choose the word most OPPOSITE in meaning to \"RESILIENT\":",
    "options": [
      "Tenacious",
      "Fragile",
      "Neutral term",
      "Secondary derivative"
    ],
    "answer": 1,
    "explanation": "\"RESILIENT\" means Tenacious, flexible, enduring. Its antonym is Fragile.",
    "topic": "Vocabulary",
    "subtopic": "Antonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_52",
    "question": "What is the meaning of the idiom \"Bounce back\"?",
    "options": [
      "Relating to tenacious",
      "A culinary technique",
      "An algebraic proof",
      "A navigational instrument"
    ],
    "answer": 0,
    "explanation": "The idiom \"Bounce back\" conveys the sense of being tenacious.",
    "topic": "Vocabulary",
    "subtopic": "Idioms & Phrasal Verbs",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_53",
    "question": "Choose the word most SIMILAR in meaning to \"EPHEMERAL\":",
    "options": [
      "Transitory",
      "Permanent",
      "Unrelated word",
      "Fictional term"
    ],
    "answer": 0,
    "explanation": "\"EPHEMERAL\" means Transitory, fleeting, short-lived. The closest synonym is Transitory.",
    "topic": "Vocabulary",
    "subtopic": "Synonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_54",
    "question": "Choose the word most OPPOSITE in meaning to \"EPHEMERAL\":",
    "options": [
      "Transitory",
      "Permanent",
      "Neutral term",
      "Secondary derivative"
    ],
    "answer": 1,
    "explanation": "\"EPHEMERAL\" means Transitory, fleeting, short-lived. Its antonym is Permanent.",
    "topic": "Vocabulary",
    "subtopic": "Antonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_55",
    "question": "What is the meaning of the idiom \"Here today, gone tomorrow\"?",
    "options": [
      "Relating to transitory",
      "A culinary technique",
      "An algebraic proof",
      "A navigational instrument"
    ],
    "answer": 0,
    "explanation": "The idiom \"Here today, gone tomorrow\" conveys the sense of being transitory.",
    "topic": "Vocabulary",
    "subtopic": "Idioms & Phrasal Verbs",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_56",
    "question": "Choose the word most SIMILAR in meaning to \"LACONIC\":",
    "options": [
      "Concise",
      "Verbose",
      "Unrelated word",
      "Fictional term"
    ],
    "answer": 0,
    "explanation": "\"LACONIC\" means Concise, terse, brief. The closest synonym is Concise.",
    "topic": "Vocabulary",
    "subtopic": "Synonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_57",
    "question": "Choose the word most OPPOSITE in meaning to \"LACONIC\":",
    "options": [
      "Concise",
      "Verbose",
      "Neutral term",
      "Secondary derivative"
    ],
    "answer": 1,
    "explanation": "\"LACONIC\" means Concise, terse, brief. Its antonym is Verbose.",
    "topic": "Vocabulary",
    "subtopic": "Antonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_58",
    "question": "What is the meaning of the idiom \"Few and far between\"?",
    "options": [
      "Relating to concise",
      "A culinary technique",
      "An algebraic proof",
      "A navigational instrument"
    ],
    "answer": 0,
    "explanation": "The idiom \"Few and far between\" conveys the sense of being concise.",
    "topic": "Vocabulary",
    "subtopic": "Idioms & Phrasal Verbs",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_59",
    "question": "Choose the word most SIMILAR in meaning to \"UBIQUITOUS\":",
    "options": [
      "Omnipresent",
      "Rare",
      "Unrelated word",
      "Fictional term"
    ],
    "answer": 0,
    "explanation": "\"UBIQUITOUS\" means Omnipresent, pervasive, everywhere. The closest synonym is Omnipresent.",
    "topic": "Vocabulary",
    "subtopic": "Synonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_60",
    "question": "Choose the word most OPPOSITE in meaning to \"UBIQUITOUS\":",
    "options": [
      "Omnipresent",
      "Rare",
      "Neutral term",
      "Secondary derivative"
    ],
    "answer": 1,
    "explanation": "\"UBIQUITOUS\" means Omnipresent, pervasive, everywhere. Its antonym is Rare.",
    "topic": "Vocabulary",
    "subtopic": "Antonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_61",
    "question": "What is the meaning of the idiom \"Found around every corner\"?",
    "options": [
      "Relating to omnipresent",
      "A culinary technique",
      "An algebraic proof",
      "A navigational instrument"
    ],
    "answer": 0,
    "explanation": "The idiom \"Found around every corner\" conveys the sense of being omnipresent.",
    "topic": "Vocabulary",
    "subtopic": "Idioms & Phrasal Verbs",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_62",
    "question": "Choose the word most SIMILAR in meaning to \"AMBIGUOUS\":",
    "options": [
      "Equivocal",
      "Explicit",
      "Unrelated word",
      "Fictional term"
    ],
    "answer": 0,
    "explanation": "\"AMBIGUOUS\" means Equivocal, vague, obscure. The closest synonym is Equivocal.",
    "topic": "Vocabulary",
    "subtopic": "Synonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_63",
    "question": "Choose the word most OPPOSITE in meaning to \"AMBIGUOUS\":",
    "options": [
      "Equivocal",
      "Explicit",
      "Neutral term",
      "Secondary derivative"
    ],
    "answer": 1,
    "explanation": "\"AMBIGUOUS\" means Equivocal, vague, obscure. Its antonym is Explicit.",
    "topic": "Vocabulary",
    "subtopic": "Antonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_64",
    "question": "What is the meaning of the idiom \"Clear as mud\"?",
    "options": [
      "Relating to equivocal",
      "A culinary technique",
      "An algebraic proof",
      "A navigational instrument"
    ],
    "answer": 0,
    "explanation": "The idiom \"Clear as mud\" conveys the sense of being equivocal.",
    "topic": "Vocabulary",
    "subtopic": "Idioms & Phrasal Verbs",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_65",
    "question": "Read the excerpt:\n\"Cloud computing and microservices have revolutionized corporate software engineering by replacing monolithic codebases with decentralized, independently deployable services. While this decoupling promotes developer agility and continuous integration, it introduces substantial operational complexity. Distributed tracing, eventual consistency in database transactions, and network latency across inter-service RPC calls demand robust monitoring frameworks. Organizations that transition without adequate automated observability often experience cascading outages that are notoriously difficult to isolate.\"\n\nQuestion: According to the passage, what is the primary operational trade-off introduced by adopting microservices?",
    "options": [
      "Higher developer salary costs",
      "Increased operational complexity in distributed tracing and network latency",
      "Inability to deploy continuous software releases",
      "Complete elimination of cloud computing infrastructure"
    ],
    "answer": 1,
    "explanation": "The passage specifically notes that decoupling 'introduces substantial operational complexity' including distributed tracing and inter-service network latency.",
    "topic": "Reading Comprehension",
    "subtopic": "Factual Inference",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_66",
    "question": "Read the excerpt:\n\"Cloud computing and microservices have revolutionized corporate software engineering by replacing monolithic codebases with decentralized, independently deployable services. While this decoupling promotes developer agility and continuous integration, it introduces substantial operational complexity. Distributed tracing, eventual consistency in database transactions, and network latency across inter-service RPC calls demand robust monitoring frameworks. Organizations that transition without adequate automated observability often experience cascading outages that are notoriously difficult to isolate.\"\n\nQuestion: What is the author's primary tone in evaluating the transition to microservices?",
    "options": [
      "Hostile and cynical",
      "Analytical and pragmatic",
      "Overly romantic and naive",
      "Indifferent and dismissive"
    ],
    "answer": 1,
    "explanation": "The author methodically balances developer agility against operational hurdles, maintaining an analytical, objective viewpoint.",
    "topic": "Reading Comprehension",
    "subtopic": "Author's Tone & Style",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_67",
    "question": "Read the excerpt:\n\"Cloud computing and microservices have revolutionized corporate software engineering by replacing monolithic codebases with decentralized, independently deployable services. While this decoupling promotes developer agility and continuous integration, it introduces substantial operational complexity. Distributed tracing, eventual consistency in database transactions, and network latency across inter-service RPC calls demand robust monitoring frameworks. Organizations that transition without adequate automated observability often experience cascading outages that are notoriously difficult to isolate.\"\n\nQuestion: What consequence is highlighted for teams that transition to microservices without automated observability?",
    "options": [
      "Hardware failures on individual developer machines",
      "Cascading outages that are exceptionally challenging to diagnose and isolate",
      "Mandatory regulatory penalties from cloud providers",
      "Immediate loss of database persistence"
    ],
    "answer": 1,
    "explanation": "The passage directly highlights that teams without observability experience 'cascading outages that are notoriously difficult to isolate'.",
    "topic": "Reading Comprehension",
    "subtopic": "Factual Recall",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_68",
    "question": "Read the excerpt:\n\"Cloud computing and microservices have revolutionized corporate software engineering by replacing monolithic codebases with decentralized, independently deployable services. While this decoupling promotes developer agility and continuous integration, it introduces substantial operational complexity. Distributed tracing, eventual consistency in database transactions, and network latency across inter-service RPC calls demand robust monitoring frameworks. Organizations that transition without adequate automated observability often experience cascading outages that are notoriously difficult to isolate.\"\n\nQuestion: Which word used in the passage is closest in meaning to 'decentralized'?",
    "options": [
      "Monolithic",
      "Decoupled",
      "Obsolete",
      "Hierarchical"
    ],
    "answer": 1,
    "explanation": "'Decoupled' indicates components being separated and made autonomous, matching the sense of 'decentralized'.",
    "topic": "Reading Comprehension",
    "subtopic": "Vocabulary in Context",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_69",
    "question": "Read the excerpt:\n\"The integration of artificial intelligence into clinical diagnostics promises unprecedented speed in oncology imaging and genomic profiling. Deep learning neural networks can detect micro-calcifications and subtle tissue anomalies that often elude the human eye during preliminary scans. However, deploying these systems into frontline healthcare raises acute bioethical dilemmas. Neural networks frequently operate as opaque black boxes, obscuring the algorithmic rationale behind their predictions. When diagnostic models are trained on demographically biased datasets, systemic health disparities are inadvertently codified and amplified, jeopardizing equitable patient outcomes.\"\n\nQuestion: What is the primary diagnostic advantage of AI systems mentioned in the passage?",
    "options": [
      "Eliminating the need for certified physicians entirely",
      "Rapidly detecting microscopic anomalies and tissue variations that human clinicians might overlook",
      "Reducing the financial cost of prescription pharmaceuticals",
      "Automating hospital billing and insurance claims"
    ],
    "answer": 1,
    "explanation": "The passage explicitly credits deep learning models with the ability to detect micro-calcifications and subtle tissue anomalies that elude the human eye.",
    "topic": "Reading Comprehension",
    "subtopic": "Factual Recall",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_70",
    "question": "Read the excerpt:\n\"The integration of artificial intelligence into clinical diagnostics promises unprecedented speed in oncology imaging and genomic profiling. Deep learning neural networks can detect micro-calcifications and subtle tissue anomalies that often elude the human eye during preliminary scans. However, deploying these systems into frontline healthcare raises acute bioethical dilemmas. Neural networks frequently operate as opaque black boxes, obscuring the algorithmic rationale behind their predictions. When diagnostic models are trained on demographically biased datasets, systemic health disparities are inadvertently codified and amplified, jeopardizing equitable patient outcomes.\"\n\nQuestion: Why does the author characterize clinical neural networks as 'opaque black boxes'?",
    "options": [
      "Their physical servers are housed in light-restricted laboratory cleanrooms",
      "Their internal decision-making calculations cannot be easily interpreted or explained by clinicians",
      "They are proprietary trade secrets locked by patent laws",
      "They only accept binary grayscale image inputs"
    ],
    "answer": 1,
    "explanation": "The metaphor 'black box' signifies the lack of explainability, where the algorithmic rationale behind diagnostic predictions remains obscured.",
    "topic": "Reading Comprehension",
    "subtopic": "Author's Tone & Style",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_71",
    "question": "Read the excerpt:\n\"The integration of artificial intelligence into clinical diagnostics promises unprecedented speed in oncology imaging and genomic profiling. Deep learning neural networks can detect micro-calcifications and subtle tissue anomalies that often elude the human eye during preliminary scans. However, deploying these systems into frontline healthcare raises acute bioethical dilemmas. Neural networks frequently operate as opaque black boxes, obscuring the algorithmic rationale behind their predictions. When diagnostic models are trained on demographically biased datasets, systemic health disparities are inadvertently codified and amplified, jeopardizing equitable patient outcomes.\"\n\nQuestion: According to the passage, what severe risk arises from training diagnostic models on demographically biased data?",
    "options": [
      "Catastrophic hardware meltdown in MRI scanners",
      "The perpetuation and amplification of existing systemic healthcare disparities",
      "Overwhelming legal liability for cloud storage companies",
      "An immediate shortage of skilled radiologists"
    ],
    "answer": 1,
    "explanation": "The author warns that models trained on skewed demographic cohorts inadvertently codify and amplify systemic health disparities.",
    "topic": "Reading Comprehension",
    "subtopic": "Factual Inference",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_72",
    "question": "Read the excerpt:\n\"The integration of artificial intelligence into clinical diagnostics promises unprecedented speed in oncology imaging and genomic profiling. Deep learning neural networks can detect micro-calcifications and subtle tissue anomalies that often elude the human eye during preliminary scans. However, deploying these systems into frontline healthcare raises acute bioethical dilemmas. Neural networks frequently operate as opaque black boxes, obscuring the algorithmic rationale behind their predictions. When diagnostic models are trained on demographically biased datasets, systemic health disparities are inadvertently codified and amplified, jeopardizing equitable patient outcomes.\"\n\nQuestion: In the passage, the word 'acute' is closest in meaning to:",
    "options": [
      "Trivial",
      "Intense and pressing",
      "Geometrical",
      "Superficial"
    ],
    "answer": 1,
    "explanation": "In the context of 'acute bioethical dilemmas', 'acute' signifies severe, critical, or intensely urgent problems.",
    "topic": "Reading Comprehension",
    "subtopic": "Vocabulary in Context",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_73",
    "question": "Read the excerpt:\n\"Hyperscale data centers form the structural backbone of modern digital commerce, yet their skyrocketing electrical and aquatic consumption demands scrutiny. As server clusters process compute-intensive machine learning workloads, thermal output escalates exponentially. While operators have achieved remarkable Power Usage Effectiveness (PUE) ratings through immersion liquid cooling and evaporative cooling towers, efficiency gains are often neutralized by the Jevons paradox: cheaper, more efficient computation inevitably drives exponential growth in overall compute consumption.\"\n\nQuestion: According to the passage, what consequence does the Jevons paradox predict in enterprise cloud computing?",
    "options": [
      "Data centers will run completely out of clean water within five years",
      "Efficiency gains reduce marginal costs, ultimately sparking higher overall aggregate consumption",
      "Liquid immersion cooling will replace all electrical fans by 2030",
      "Cloud providers will be forced to ban large language model training"
    ],
    "answer": 1,
    "explanation": "The Jevons paradox posits that technological improvements increasing resource efficiency often lead to increased consumption of that resource rather than conservation.",
    "topic": "Reading Comprehension",
    "subtopic": "Factual Inference",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_74",
    "question": "Read the excerpt:\n\"Hyperscale data centers form the structural backbone of modern digital commerce, yet their skyrocketing electrical and aquatic consumption demands scrutiny. As server clusters process compute-intensive machine learning workloads, thermal output escalates exponentially. While operators have achieved remarkable Power Usage Effectiveness (PUE) ratings through immersion liquid cooling and evaporative cooling towers, efficiency gains are often neutralized by the Jevons paradox: cheaper, more efficient computation inevitably drives exponential growth in overall compute consumption.\"\n\nQuestion: What technological solution do operators employ to manage the thermal escalation described?",
    "options": [
      "Limiting developer access to daytime hours",
      "Immersion liquid cooling and evaporative cooling towers",
      "Relocating all computing infrastructure to high-altitude space stations",
      "Replacing silicon transistors with vacuum tubes"
    ],
    "answer": 1,
    "explanation": "The passage notes that operators achieve improved PUE ratings specifically through 'immersion liquid cooling and evaporative cooling towers'.",
    "topic": "Reading Comprehension",
    "subtopic": "Factual Recall",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_75",
    "question": "Read the excerpt:\n\"Hyperscale data centers form the structural backbone of modern digital commerce, yet their skyrocketing electrical and aquatic consumption demands scrutiny. As server clusters process compute-intensive machine learning workloads, thermal output escalates exponentially. While operators have achieved remarkable Power Usage Effectiveness (PUE) ratings through immersion liquid cooling and evaporative cooling towers, efficiency gains are often neutralized by the Jevons paradox: cheaper, more efficient computation inevitably drives exponential growth in overall compute consumption.\"\n\nQuestion: Which word used in the passage is closest in meaning to 'escalates'?",
    "options": [
      "Fluctuates",
      "Surges or intensifies",
      "Stabilizes",
      "Diminishes"
    ],
    "answer": 1,
    "explanation": "'Escalate' means to increase rapidly in intensity or magnitude, synonymous with surges or intensifies.",
    "topic": "Reading Comprehension",
    "subtopic": "Vocabulary in Context",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_76",
    "question": "Read the excerpt:\n\"Hyperscale data centers form the structural backbone of modern digital commerce, yet their skyrocketing electrical and aquatic consumption demands scrutiny. As server clusters process compute-intensive machine learning workloads, thermal output escalates exponentially. While operators have achieved remarkable Power Usage Effectiveness (PUE) ratings through immersion liquid cooling and evaporative cooling towers, efficiency gains are often neutralized by the Jevons paradox: cheaper, more efficient computation inevitably drives exponential growth in overall compute consumption.\"\n\nQuestion: What is the primary organizational challenge highlighted regarding data center sustainability?",
    "options": [
      "Software developers refusing to write multi-threaded code",
      "Balancing thermal and environmental resource consumption against relentless computational demand",
      "A worldwide shortage of fiber optic cabling",
      "Unwillingness of retail consumers to use cloud banking apps"
    ],
    "answer": 1,
    "explanation": "The text centers on the tension between sustainable electrical/water usage and the exponential demand driven by AI and digital commerce.",
    "topic": "Reading Comprehension",
    "subtopic": "Main Idea",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_77",
    "question": "Read the excerpt:\n\"The advent of fault-tolerant quantum computing represents an existential threshold for contemporary cryptography. Modern public-key infrastructure—governing everything from TLS handshakes to digital blockchain ledgers—relies on the mathematical intractability of prime factorization (RSA) and discrete logarithms (ECC). Shor's algorithm demonstrates that a sufficiently scaled quantum computer could unravel these mathematical foundations in polynomial time. Recognizing this eventuality, security agencies advocate an immediate migration toward post-quantum lattice-based algorithms, warning against 'harvest now, decrypt later' espionage campaigns.\"\n\nQuestion: Why are RSA and ECC encryption systems vulnerable to quantum computing architectures?",
    "options": [
      "They rely on outdated 8-bit binary microcode",
      "Shor's algorithm solves prime factorization and discrete logarithms in polynomial time",
      "Quantum computers do not utilize TCP/IP protocols",
      "They cannot be implemented on multi-core GPU clusters"
    ],
    "answer": 1,
    "explanation": "The passage explains that Shor's algorithm can solve the prime factorization and discrete logarithm problems underpinning RSA and ECC in polynomial time.",
    "topic": "Reading Comprehension",
    "subtopic": "Factual Recall",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_78",
    "question": "Read the excerpt:\n\"The advent of fault-tolerant quantum computing represents an existential threshold for contemporary cryptography. Modern public-key infrastructure—governing everything from TLS handshakes to digital blockchain ledgers—relies on the mathematical intractability of prime factorization (RSA) and discrete logarithms (ECC). Shor's algorithm demonstrates that a sufficiently scaled quantum computer could unravel these mathematical foundations in polynomial time. Recognizing this eventuality, security agencies advocate an immediate migration toward post-quantum lattice-based algorithms, warning against 'harvest now, decrypt later' espionage campaigns.\"\n\nQuestion: What threat does the phrase 'harvest now, decrypt later' refer to?",
    "options": [
      "Ransomware gangs deleting backup drives before requesting cryptocurrency",
      "Adversaries intercepting and hoarding encrypted ciphertext today with the intent to decrypt it once quantum machines mature",
      "Agricultural IoT sensors leaking fertilizer distribution secrets",
      "Database administrators selling expired SSL certificates on the dark web"
    ],
    "answer": 1,
    "explanation": "'Harvest now, decrypt later' describes nation-states intercepting secure traffic now, waiting for quantum capability to break the keys in the future.",
    "topic": "Reading Comprehension",
    "subtopic": "Factual Inference",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_79",
    "question": "Read the excerpt:\n\"The advent of fault-tolerant quantum computing represents an existential threshold for contemporary cryptography. Modern public-key infrastructure—governing everything from TLS handshakes to digital blockchain ledgers—relies on the mathematical intractability of prime factorization (RSA) and discrete logarithms (ECC). Shor's algorithm demonstrates that a sufficiently scaled quantum computer could unravel these mathematical foundations in polynomial time. Recognizing this eventuality, security agencies advocate an immediate migration toward post-quantum lattice-based algorithms, warning against 'harvest now, decrypt later' espionage campaigns.\"\n\nQuestion: What alternative mathematical framework does the passage propose to replace vulnerable public-key cryptography?",
    "options": [
      "Basic symmetric substitution ciphers",
      "Post-quantum lattice-based algorithms",
      "Unencrypted peer-to-peer transmission",
      "Hardwired coaxial fiber connections"
    ],
    "answer": 1,
    "explanation": "The passage explicitly identifies 'post-quantum lattice-based algorithms' as the recommended migration path.",
    "topic": "Reading Comprehension",
    "subtopic": "Factual Recall",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_80",
    "question": "Read the excerpt:\n\"The advent of fault-tolerant quantum computing represents an existential threshold for contemporary cryptography. Modern public-key infrastructure—governing everything from TLS handshakes to digital blockchain ledgers—relies on the mathematical intractability of prime factorization (RSA) and discrete logarithms (ECC). Shor's algorithm demonstrates that a sufficiently scaled quantum computer could unravel these mathematical foundations in polynomial time. Recognizing this eventuality, security agencies advocate an immediate migration toward post-quantum lattice-based algorithms, warning against 'harvest now, decrypt later' espionage campaigns.\"\n\nQuestion: In the passage, the word 'intractability' most nearly means:",
    "options": [
      "Extreme computational difficulty or impossibility to solve efficiently",
      "Simplicity of derivation",
      "Lack of mathematical rigor",
      "Inability to be stored on hard drives"
    ],
    "answer": 0,
    "explanation": "Mathematical intractability refers to problems that cannot be solved within a reasonable or polynomial computational time frame.",
    "topic": "Reading Comprehension",
    "subtopic": "Vocabulary in Context",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_81",
    "question": "Read the excerpt:\n\"Enterprise agility is frequently stymied when legacy organizations conflate agility with the ritualistic adoption of Scrum ceremonies. True organizational agility requires architectural modularity, autonomous team topology, and continuous deployment pipelines that permit low-risk experimentation. When traditional hierarchies superimpose two-week sprints upon monolithic release cycles with quarterly CAB (Change Advisory Board) approval gates, the result is 'agile in name only'—a toxic hybrid that introduces coordination friction while forfeiting predictability.\"\n\nQuestion: What central flaw does the author criticize regarding corporate agile transformations?",
    "options": [
      "Hiring software engineers who refuse to attend standup meetings",
      "Adopting agile ceremonies superficially without modernizing architectural pipelines and organizational hierarchies",
      "Paying too much attention to customer feedback during sprint reviews",
      "Migrating legacy mainframe databases to modern relational databases"
    ],
    "answer": 1,
    "explanation": "The author points out that adopting ceremonies while retaining monolithic architectures and bureaucratic CAB gates leads to 'agile in name only'.",
    "topic": "Reading Comprehension",
    "subtopic": "Main Idea",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_82",
    "question": "Read the excerpt:\n\"Enterprise agility is frequently stymied when legacy organizations conflate agility with the ritualistic adoption of Scrum ceremonies. True organizational agility requires architectural modularity, autonomous team topology, and continuous deployment pipelines that permit low-risk experimentation. When traditional hierarchies superimpose two-week sprints upon monolithic release cycles with quarterly CAB (Change Advisory Board) approval gates, the result is 'agile in name only'—a toxic hybrid that introduces coordination friction while forfeiting predictability.\"\n\nQuestion: What is described as an essential architectural prerequisite for achieving genuine agility?",
    "options": [
      "Quarterly change advisory board meetings",
      "Architectural modularity, autonomous team topology, and continuous deployment pipelines",
      "Mandatory 100% test coverage using only one programming language",
      "Strict waterfall documentation phases spanning six months"
    ],
    "answer": 1,
    "explanation": "The passage lists 'architectural modularity, autonomous team topology, and continuous deployment pipelines' as true requirements for agility.",
    "topic": "Reading Comprehension",
    "subtopic": "Factual Recall",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_83",
    "question": "Read the excerpt:\n\"Enterprise agility is frequently stymied when legacy organizations conflate agility with the ritualistic adoption of Scrum ceremonies. True organizational agility requires architectural modularity, autonomous team topology, and continuous deployment pipelines that permit low-risk experimentation. When traditional hierarchies superimpose two-week sprints upon monolithic release cycles with quarterly CAB (Change Advisory Board) approval gates, the result is 'agile in name only'—a toxic hybrid that introduces coordination friction while forfeiting predictability.\"\n\nQuestion: What does the author imply happens when two-week sprints are paired with quarterly change approvals?",
    "options": [
      "Developer productivity increases threefold",
      "It creates coordination friction and erodes predictability without delivering real agility",
      "Clients immediately cancel their outsourcing contracts",
      "The software product becomes completely bug-free"
    ],
    "answer": 1,
    "explanation": "The author labels this mismatch a 'toxic hybrid' that produces coordination friction while forfeiting predictability.",
    "topic": "Reading Comprehension",
    "subtopic": "Factual Inference",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_84",
    "question": "Read the excerpt:\n\"Enterprise agility is frequently stymied when legacy organizations conflate agility with the ritualistic adoption of Scrum ceremonies. True organizational agility requires architectural modularity, autonomous team topology, and continuous deployment pipelines that permit low-risk experimentation. When traditional hierarchies superimpose two-week sprints upon monolithic release cycles with quarterly CAB (Change Advisory Board) approval gates, the result is 'agile in name only'—a toxic hybrid that introduces coordination friction while forfeiting predictability.\"\n\nQuestion: In the passage, the word 'stymied' is closest in meaning to:",
    "options": [
      "Accelerated",
      "Hindered or thwarted",
      "Celebrated",
      "Financed"
    ],
    "answer": 1,
    "explanation": "'Stymied' means stopped, blocked, or prevented from making progress, synonymous with hindered.",
    "topic": "Reading Comprehension",
    "subtopic": "Vocabulary in Context",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_85",
    "question": "Read the excerpt:\n\"The rapid transition toward distributed remote work has radically altered knowledge transmission in technology consultancies. While asynchronous collaboration tools—such as Slack and Jira—excel at linear task management, they fall short in fostering the serendipitous 'watercooler' exchanges where tacit architectural knowledge is informally transmitted. Junior developers in fully distributed teams frequently report feelings of isolation and slower onboarding velocity, as requesting clarification via formal direct message incurs greater psychological friction than turning to an adjacent desk.\"\n\nQuestion: What specific limitation of asynchronous collaboration tools is emphasized in the text?",
    "options": [
      "They cannot store source code in cloud repositories",
      "They fail to facilitate the spontaneous, informal exchanges where tacit knowledge is shared",
      "They consume excessive network bandwidth during video meetings",
      "They do not integrate with enterprise email servers"
    ],
    "answer": 1,
    "explanation": "The passage notes that while async tools handle linear tasks, they fall short in fostering serendipitous exchanges where tacit architectural knowledge is transmitted.",
    "topic": "Reading Comprehension",
    "subtopic": "Factual Recall",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_86",
    "question": "Read the excerpt:\n\"The rapid transition toward distributed remote work has radically altered knowledge transmission in technology consultancies. While asynchronous collaboration tools—such as Slack and Jira—excel at linear task management, they fall short in fostering the serendipitous 'watercooler' exchanges where tacit architectural knowledge is informally transmitted. Junior developers in fully distributed teams frequently report feelings of isolation and slower onboarding velocity, as requesting clarification via formal direct message incurs greater psychological friction than turning to an adjacent desk.\"\n\nQuestion: Why do junior engineers experience greater onboarding friction in fully remote environments?",
    "options": [
      "They lack modern laptop hardware",
      "Formally initiating a digital direct message presents greater psychological friction than speaking to an adjacent colleague",
      "Consultancies restrict junior access to codebase documentation",
      "Remote work requires knowing more programming languages"
    ],
    "answer": 1,
    "explanation": "The author states that requesting help over direct messaging carries higher psychological hesitation than an informal in-person desk conversation.",
    "topic": "Reading Comprehension",
    "subtopic": "Factual Inference",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_87",
    "question": "Read the excerpt:\n\"The rapid transition toward distributed remote work has radically altered knowledge transmission in technology consultancies. While asynchronous collaboration tools—such as Slack and Jira—excel at linear task management, they fall short in fostering the serendipitous 'watercooler' exchanges where tacit architectural knowledge is informally transmitted. Junior developers in fully distributed teams frequently report feelings of isolation and slower onboarding velocity, as requesting clarification via formal direct message incurs greater psychological friction than turning to an adjacent desk.\"\n\nQuestion: In the context of the passage, 'tacit knowledge' refers to:",
    "options": [
      "Information formally written in company employee handbooks",
      "Unwritten, experiential insights and contextual understanding passed through informal interaction",
      "Encrypted database passwords and cryptographic keys",
      "Public marketing materials distributed to clients"
    ],
    "answer": 1,
    "explanation": "Tacit knowledge is intuitive, experiential knowledge that is difficult to codify or write down and is shared primarily through interpersonal mentorship.",
    "topic": "Reading Comprehension",
    "subtopic": "Vocabulary in Context",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_88",
    "question": "Read the excerpt:\n\"The rapid transition toward distributed remote work has radically altered knowledge transmission in technology consultancies. While asynchronous collaboration tools—such as Slack and Jira—excel at linear task management, they fall short in fostering the serendipitous 'watercooler' exchanges where tacit architectural knowledge is informally transmitted. Junior developers in fully distributed teams frequently report feelings of isolation and slower onboarding velocity, as requesting clarification via formal direct message incurs greater psychological friction than turning to an adjacent desk.\"\n\nQuestion: Which title best captures the core focus of the passage?",
    "options": [
      "The Complete Failure of Enterprise Cloud Software",
      "The Hidden Costs of Remote Collaboration on Tacit Knowledge and Mentorship",
      "Why Face-to-Face Meetings Should Be Outlawed in Tech",
      "A Step-by-Step Guide to Jira Workflow Setup"
    ],
    "answer": 1,
    "explanation": "The passage analyzes the subtle trade-offs of remote work, specifically its dampening effect on informal learning and junior onboarding.",
    "topic": "Reading Comprehension",
    "subtopic": "Main Idea",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_89",
    "question": "Identify the segment that contains a grammatical error. If there is no error, select 'No error':\n\n\"Two border guards patrolling (1) / the nearby frontier with Georgia have also (2) / been reported missing from Friday night (3).\"",
    "options": [
      "Two border guards patrolling",
      "the nearby frontier with Georgia have also",
      "No Error",
      "been reported missing from Friday night."
    ],
    "answer": 3,
    "explanation": "In standard English grammar with present perfect tense (\"have also been reported missing\"), a specific starting point in the past continuing to the present requires the preposition 'since' rather than 'from' (\"since Friday night\").",
    "topic": "Sentence",
    "subtopic": "Error Spotting",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_90",
    "question": "The following sentence has been split into four segments. Identify the segment that contains an error:\n\n\"The newspaper reported / that it was a mystery / how the thieves enter / the house.\"",
    "options": [
      "the house",
      "how the thieves enter",
      "that it was a mystery",
      "The newspaper reported"
    ],
    "answer": 1,
    "explanation": "Sequence of tenses rule: The principal reporting clause is in past tense (\"reported\", \"it was a mystery\"). Therefore, the subordinate clause describing the past intrusion must also be in past tense (\"how the thieves entered\" instead of \"enter\").",
    "topic": "Sentence",
    "subtopic": "Sequence of Tenses",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_91",
    "question": "Identify the segment that contains a grammatical error in the given sentence:\n\n\"The reduced air pressure on airline flights can lessen the amount of oxygen in passenger's blood for twenty-five percent.\"",
    "options": [
      "The reduced air pressure on airline flights",
      "No error",
      "in passenger's blood for twenty-five percent",
      "can lessen the amount of oxygen"
    ],
    "answer": 2,
    "explanation": "Preposition of extent/margin: The preposition 'for' is incorrectly used to indicate the degree of change. The preposition 'by' should be used to denote percentage differences or margins (\"by twenty-five percent\").",
    "topic": "Prepositions",
    "subtopic": "Preposition of Extent",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_92",
    "question": "Identify the segment that contains an error in the sentence:\n\n\"The dignitaries / had left before / the Minister / had arrived at the venue.\"",
    "options": [
      "had left before",
      "The dignitaries",
      "had arrived at the venue",
      "the Minister"
    ],
    "answer": 2,
    "explanation": "Past perfect rule with 'before': When two past actions are linked by a time conjunction like 'before', the earlier completed action takes the past perfect tense (\"had left\"), while the subsequent action takes the simple past tense (\"arrived\", not \"had arrived\").",
    "topic": "Grammar",
    "subtopic": "Past Perfect Tense",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_93",
    "question": "Fill in the blank with the appropriate phrasal verb:\n\n\"The PM will ____________ the flood victims tomorrow.\"",
    "options": [
      "call at",
      "call in",
      "call on",
      "call for"
    ],
    "answer": 2,
    "explanation": "\"Call on\" means to pay a formal or brief visit to a person (\"call on someone\"). In contrast, \"call at\" refers to stopping at a place/port, \"call in\" means to summon assistance, and \"call for\" means to demand.",
    "topic": "Vocabulary",
    "subtopic": "Phrasal Verbs",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_94",
    "question": "Fill in the blank with the appropriate phrasal verb:\n\n\"The police personnel ____________ on the suspect.\"",
    "options": [
      "close at",
      "close in",
      "close on",
      "close for"
    ],
    "answer": 1,
    "explanation": "The phrasal verb \"close in on\" means to move in surrounding or encircling a target, progressively cutting off avenues of escape.",
    "topic": "Vocabulary",
    "subtopic": "Phrasal Verbs",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_95",
    "question": "Fill in the blank with the correct prepositional/phrasal combination:\n\n\"He was ____________ by the Judge.\"",
    "options": [
      "clear at",
      "clear in",
      "clear on",
      "clear of"
    ],
    "answer": 3,
    "explanation": "To be \"clear of\" (or \"cleared of all charges\") means to be formally acquitted, exonerated, or declared innocent of allegations by a judge or court.",
    "topic": "Vocabulary",
    "subtopic": "Phrasal Verbs",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_96",
    "question": "Fill in the blank with the appropriate phrase:\n\n\"Work hard if you want to ____________ the syllabus.\"",
    "options": [
      "catch at",
      "catch in",
      "catch on",
      "catch of"
    ],
    "answer": 2,
    "explanation": "In competitive exam grammar sets, \"catch on\" is tested with the contextual meaning of grasping, comprehending, or understanding academic instructional material (\"catch on to/grasp the syllabus\").",
    "topic": "Vocabulary",
    "subtopic": "Phrasal Verbs",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_97",
    "question": "Fill in the blank with the appropriate phrasal verb:\n\n\"Last Sunday I ____________ your place but you were not at home.\"",
    "options": [
      "call at",
      "call in",
      "call on",
      "call for"
    ],
    "answer": 0,
    "explanation": "\"Call at\" means to visit a specific physical address, residence, or port briefly (\"call at your place\"). In contrast, \"call on\" is used for paying a visit to an individual.",
    "topic": "Vocabulary",
    "subtopic": "Phrasal Verbs",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_98",
    "question": "Select the option that is nearest in meaning (synonym) to the underlined word:\n\n\"There are many elusive questions in philosophy.\"",
    "options": [
      "clear",
      "baffling",
      "paramount",
      "truthful"
    ],
    "answer": 1,
    "explanation": "\"Elusive\" denotes something difficult to grasp, comprehend, or define clearly. \"Baffling\" (perplexing, mystifying, or defying explanation) is closest in meaning.",
    "topic": "Vocabulary",
    "subtopic": "Synonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_99",
    "question": "Select the most appropriate synonym of the given word:\n\nConfusion",
    "options": [
      "Intrepidity",
      "Stagnation",
      "Perusal",
      "Commotion"
    ],
    "answer": 3,
    "explanation": "\"Confusion\" denotes a state of disorder, disarray, or agitation. \"Commotion\" means a state of confused and noisy disturbance. \"Intrepidity\" means fearlessness, \"Stagnation\" means inactivity, and \"Perusal\" means the act of reading thoroughly.",
    "topic": "Vocabulary",
    "subtopic": "Synonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_100",
    "question": "Select the most appropriate ANTONYM of the given word:\n\nModest",
    "options": [
      "Unhappy",
      "Conceited",
      "Sullen",
      "Glum"
    ],
    "answer": 1,
    "explanation": "\"Modest\" means humble, unassuming, or moderate. \"Conceited\" means excessively proud, boastful, or vain, making it the direct antonym.",
    "topic": "Vocabulary",
    "subtopic": "Antonyms",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_101",
    "question": "Select the most appropriate ANTONYM of the given word:\n\nTENACIOUS",
    "options": [
      "Persistent",
      "Relentless",
      "Steadfast",
      "Yielding"
    ],
    "answer": 3,
    "explanation": "\"Tenacious\" means holding fast, persistent, stubborn, or unyielding. \"Yielding\" means giving way under pressure or compliant, making it the opposite. Persistent, relentless, and steadfast are synonyms.",
    "topic": "Vocabulary",
    "subtopic": "Antonyms",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_102",
    "question": "Read the excerpt:\n\"What is religion? A very complex question! We know religion and we live religion. But, how do we explain or define religion? Religion is one of the most sensitive and vulnerable aspects of human life from the very beginning. Though it looks simple, it is not a simple reality to be easily defined or explained. There are many theories proposed regarding the origin of religion as a result of the development of speculative, intellectual and scientific mind. However, in spite of the differences in the understanding of this important element, it is confirmed that it is purely a human activity and it has become an inevitable aspect of human life. In the West, under the influence of the inherited tradition of Judeo-Christian tradition, religion was understood more theistically while in the East, it was mostly a response to the experience of the natural powers that are beyond human control and also to the inner urge for an ethical and moral reference.\n\nEtymologically, the word 'religion' is derived from the Latin root 'religare' and it means 'to bind fast'. Then 'religion' has certainly a strong emphasis on community aspects. It is something that binds fast the members of it together. When we start thinking seriously on religion, naturally we fall upon thoughts of the definition of religion. There are numberless definitions of religion. The meaning and definition of religion differs according to the socio-cultural and psychological background of the person who reflects upon it. Even the political setting inserts its influence on the understanding of the meaning of religion. Some of the definitions are phenomenological and try to expose the common elements that we see in the acknowledged world religions. For example, the human recognition of a superhuman power entitled to obedience and worship. Some others are interpretative definitions.\"\n\nQuestion: The meaning and definition of religion depends upon following factors :-\nA. Socio-cultural\nB. Political\nC. Psychological\nD. Phenomenological\n\nChoose the correct answer from the options given below :-",
    "options": [
      "A and C",
      "B, C and D",
      "B and D",
      "A, B, C and D"
    ],
    "answer": 3,
    "explanation": "The passage explicitly states: \"The meaning and definition of religion differs according to the socio-cultural and psychological background... Even the political setting inserts its influence... Some of the definitions are phenomenological\". Therefore, all four factors (A, B, C, and D) influence the meaning and definition of religion.",
    "topic": "Reading Comprehension",
    "subtopic": "Detail Comprehension",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_103",
    "question": "Read the excerpt:\n\"In the West, under the influence of the inherited tradition of Judeo-Christian tradition, religion was understood more theistically while in the East, it was mostly a response to the experience of the natural powers that are beyond human control and also to the inner urge for an ethical and moral reference.\"\n\nQuestion: In which tradition, religion is seen as a response to the experience of the natural powers?",
    "options": [
      "Western Tradition",
      "Eastern Tradition",
      "Indo-western Tradition",
      "Christian Tradition"
    ],
    "answer": 1,
    "explanation": "The text directly states: \"while in the East, it was mostly a response to the experience of the natural powers that are beyond human control and also to the inner urge for an ethical and moral reference\".",
    "topic": "Reading Comprehension",
    "subtopic": "Fact Retrieval",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_104",
    "question": "Read the excerpt:\n\"Etymologically, the word 'religion' is derived from the Latin root 'religare' and it means 'to bind fast'. Then 'religion' has certainly a strong emphasis on community aspects. It is something that binds fast the members of it together.\"\n\nQuestion: Which of the phrases is closest in meaning to etymology?",
    "options": [
      "Origin of ideas and thoughts",
      "Origin of religion",
      "Origin of human life",
      "Origin of words and their meanings"
    ],
    "answer": 3,
    "explanation": "\"Etymology\" is the scientific study of the historical origin and evolution of words, their linguistic roots, and how their grammatical forms and meanings have developed over time.",
    "topic": "Reading Comprehension",
    "subtopic": "Vocabulary in Context",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_105",
    "question": "Read the excerpt:\n\"Religion is one of the most sensitive and vulnerable aspects of human life from the very beginning... it is confirmed that it is purely a human activity and it has become an inevitable aspect of human life... It is something that binds fast the members of it together.\"\n\nQuestion: Which of these statements are correct with reference to the above passage?\nA. Religion is one of the most sensitive aspects of human life form.\nB. Religion is purely a human activity.\nC. Religion doesn't bind the members of a community together.\n\nChoose from the options given below:",
    "options": [
      "A and B",
      "Only B",
      "A, B and C",
      "Only A"
    ],
    "answer": 0,
    "explanation": "Statements A and B are explicitly affirmed in the text (\"Religion is one of the most sensitive and vulnerable aspects...\", \"it is confirmed that it is purely a human activity\"). Statement C is contradicted by the passage, which states that religion \"binds fast the members of it together\".",
    "topic": "Reading Comprehension",
    "subtopic": "Critical Evaluation",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_106",
    "question": "Your team is facing a tight deadline on a critical project. Some members are demotivated. How do you handle the situation?",
    "options": [
      "Realign priorities, break deliverables into manageable milestones, and hold a supportive check-in to rebuild morale.",
      "Escalate the issue to senior management and request replacements for the demotivated members immediately.",
      "Mandate daily unpaid overtime and closely monitor individual output through micro-tracking tools.",
      "Ignore the team morale concerns and demand strict adherence to original deadlines without any adjustment."
    ],
    "answer": 0,
    "explanation": "Effective corporate leadership and situational communication require empathy, clear priority realignment, and reducing cognitive overwhelm into achievable milestones while proactively supporting team members.",
    "topic": "Sentence",
    "subtopic": "Situational Judgment",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_107",
    "question": "Read the scenario:\n\"It is 2025: a new batch of lawyers has joined the firm. Some lawyers from the 2024 batch have approached the founders to express their appreciation for the intent behind the socialization ritual. They shared that the experience offered them a glimpse of the world they are about to enter. However, they feel that the ritual has become archaic in its execution, showing its age and necessitating some fresh thinking.\n\nAs they leave, Ned feels that the time has come to abandon the ritual due to changing times. However, Homer disagrees; he thinks that exposing the employees to what the profession has to offer, in the first week, is very critical. Moreover, it helps the organization know whether the newcomer is ready for such a profession. Further, he adds that the socialization ritual has been effectively helping them for decades in grooming the talents of their organization.\"\n\nQuestion: Which of the following actions should the founders BEST take, if they still want to welcome their newcomers by exposing them to the harsh reality of the profession, while being empathetic to the demands of the times?",
    "options": [
      "They should, in their website, share details about how tough the workload is going to be.",
      "They should get a mental health professional to design their socialization ritual.",
      "They should stick to what they are doing but hire a mental health professional who the newcomers can refer to if they feel the need.",
      "They should invite suggestions from their young lawyers regarding formulating a new socialization ritual."
    ],
    "answer": 3,
    "explanation": "Inviting suggestions directly from the recently onboarded young lawyers provides the freshest, most empathetic perspective on how to modernize archaic practices while preserving the vital reality-check intent of the firm's socialization tradition.",
    "topic": "Reading Comprehension",
    "subtopic": "Decision Making",
    "difficulty": "hard",
    "category": "communication"
  },
  {
    "_id": "comm_fb_108",
    "question": "Based on the official University Library Information Guide table below, identify the weekday closing time for Bailey Library:\n\n[Library Guide Table]\n- Library: Bailey Library\n- Location: Parkville campus\n- Opening times: 8.30 am to (1)...........pm weekdays\n- Other information: Popular with students\n\nQuestion: What is the missing weekday closing time for Bailey Library (1)?",
    "options": [
      "8:00 pm",
      "9:00 pm",
      "10:00 pm",
      "11:00 pm"
    ],
    "answer": 2,
    "explanation": "According to the official IELTS Library Guide listening script, Bailey Library on the Parkville campus operates from 8:30 am to 10:00 pm on weekdays.",
    "topic": "Reading Comprehension",
    "subtopic": "Information Extraction",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_109",
    "question": "Based on the official University Library Information Guide table below, identify the missing street/location detail for Brown Library:\n\n[Library Guide Table]\n- Library: Brown Library\n- Location: Near Stratton Street and (2)........... \n- Opening times: 7 am to 2 am daily\n- Other information: Open to biomed students only\n\nQuestion: Which street/parade completes the location of Brown Library (2)?",
    "options": [
      "Royal Parade",
      "Victoria Street",
      "Elizabeth Street",
      "Flinders Way"
    ],
    "answer": 0,
    "explanation": "The IELTS Library Guide records Brown Library as being located near the intersection of Stratton Street and Royal Parade.",
    "topic": "Reading Comprehension",
    "subtopic": "Information Extraction",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_110",
    "question": "Based on the official University Library Information Guide table below, identify the student access restriction for Brown Library:\n\n[Library Guide Table]\n- Library: Brown Library\n- Location: Near Stratton Street and Royal Parade\n- Opening times: 7 am to 2 am daily\n- Other information: Open to (3)........... students only\n\nQuestion: Who is permitted access to Brown Library (3)?",
    "options": [
      "Postgraduate students only",
      "Biomedical (biomed) students only",
      "Faculty members only",
      "Engineering students only"
    ],
    "answer": 1,
    "explanation": "Access to Brown Library is specifically designated for biomedical (\"biomed\") students only due to specialised laboratory resources and literature.",
    "topic": "Reading Comprehension",
    "subtopic": "Information Extraction",
    "difficulty": "easy",
    "category": "communication"
  },
  {
    "_id": "comm_fb_111",
    "question": "Based on the official University Library Information Guide table below, identify the street address number for RMIT Library:\n\n[Library Guide Table]\n- Library: RMIT Library\n- Location: Level 5, building 8, (4)........... Swan Street\n- Opening times: 10 am - 12 midnight Monday to Friday; 10 am - 6 pm Saturdays and Sundays\n- Other information: Good internet facilities\n\nQuestion: What is the missing street number on Swan Street (4)?",
    "options": [
      "120 Swan Street",
      "250 Swan Street",
      "360 Swan Street",
      "480 Swan Street"
    ],
    "answer": 2,
    "explanation": "The official address of RMIT Library is Level 5, Building 8, 360 Swan Street.",
    "topic": "Reading Comprehension",
    "subtopic": "Information Extraction",
    "difficulty": "medium",
    "category": "communication"
  },
  {
    "_id": "comm_fb_112",
    "question": "Based on the official University Library Information Guide table below, identify the weekend closing time for RMIT Library:\n\n[Library Guide Table]\n- Library: RMIT Library\n- Location: Level 5, building 8, 360 Swan Street\n- Opening times: 10 am - 12 midnight Monday to Friday; 10 am - (5)...........pm Saturdays and Sundays\n- Other information: Good internet facilities\n\nQuestion: What is the weekend closing time for RMIT Library (5)?",
    "options": [
      "5:00 pm",
      "6:00 pm",
      "8:00 pm",
      "10:00 pm"
    ],
    "answer": 1,
    "explanation": "On Saturdays and Sundays, the RMIT Library operates from 10:00 am to 6:00 pm.",
    "topic": "Reading Comprehension",
    "subtopic": "Information Extraction",
    "difficulty": "easy",
    "category": "communication"
  }
];
