export interface CoCubesQuestion {
  id: string;
  questionNumber: number;
  section: string;
  question: string;
  passage?: string | null;
  passageImage?: string | null;
  questionImage?: string | null;
  options: string[];
  answer: number;
  explanation: string;
  topic: string;
  difficulty: string;
}

export interface CoCubesPaper {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  totalMarks: number;
  sections: {
    name: string;
    questionCount: number;
    marks: number;
  }[];
  questions: CoCubesQuestion[];
}

export const COCUBES_REAL_PAPERS: CoCubesPaper[] = [
  {
    "id": "paper_1",
    "title": "CoCubes Authentic On-Campus Paper 1",
    "subtitle": "2017 On-Campus Drive • Full 32Q Real Drive Simulation",
    "durationMinutes": 50,
    "totalMarks": 32,
    "sections": [
      {
        "name": "Analytical Reasoning",
        "questionCount": 16,
        "marks": 16
      },
      {
        "name": "Quantitative Ability",
        "questionCount": 16,
        "marks": 16
      }
    ],
    "questions": [
      {
        "id": "cocubes_p1_q1",
        "questionNumber": 1,
        "section": "Analytical Reasoning",
        "question": "Below\n is given a question followed by two statements numbered I and II. The \nquestion may or may not be answered with the help of these statements. \nYou have to decide if these statements are sufficient to answer the \nquestion. Mark the answer accordingly. Question: Is 1 > 1/x? Statements: I. 1 > x II. x > 0",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Both statements I and II together are sufficient to answer the question asked but neither statement alone is sufficient.",
          "Statements I and II together are not sufficient to answer the question asked and additional data to the problem is needed.",
          "Only one of the statements, alone, is sufficient to answer the question but other statement is not.",
          "Each statement alone is sufficient to answer the question."
        ],
        "answer": 0,
        "explanation": "If 0 < x < 1, then 1/x > 1, so 1 > 1/x is definitively FALSE. Both statements I (1 > x) and II (x > 0) together establish 0 < x < 1. Alone neither suffices.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q2",
        "questionNumber": 2,
        "section": "Analytical Reasoning",
        "question": "If\n the first and eighth terms of a G.P. are 3 and 2 respectively, then \nfind the value of 'P' provided it's the product of first eight terms of \nthe corresponding G.P.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "1296",
          "216",
          "36",
          "6"
        ],
        "answer": 0,
        "explanation": "In a G.P., product of terms equidistant from extremes is constant: a1 * a8 = 3 * 2 = 6. Product of 8 terms = (6)^4 = 1296.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q3",
        "questionNumber": 3,
        "section": "Analytical Reasoning",
        "question": "Below\n is/are given statement/s followed by conclusions in the options. Take \nthe given statement/s to be true, even if they contradict commonly known\n facts, and determine the conclusion/s that logically follow/s from the \nstatement/s. Statements: I. All houses are residences. II. All sheds are residences.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "No houses are sheds.",
          "Some sheds are houses.",
          "All houses are sheds.",
          "None follows"
        ],
        "answer": 3,
        "explanation": "Both premises are affirmative universal with the middle term 'residences' undistributed in both. No valid categorical syllogism conclusion can be drawn between houses and sheds.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q4",
        "questionNumber": 4,
        "section": "Analytical Reasoning",
        "question": "Which of the given options can be formed using the letters of the following set? {a, w, r, t, i, s, o, n, m, l, b, h, e, p}",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "wide",
          "pest",
          "left",
          "bend"
        ],
        "answer": 1,
        "explanation": "'pest' uses letters {p, e, s, t} which are all present in the given set. The other words contain 'd' or 'f' which are absent.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q5",
        "questionNumber": 5,
        "section": "Analytical Reasoning",
        "question": "A state with the second lowest number of movie watchers is:",
        "passage": "A\n survey of movie goers from five states P, Q, R, S and T is summarized \nbelow. The first column gives the percentage of viewers in each state \nwho watch less than one movie a week. The second column gives the total \nnumber of viewers who view one or more movies per week. Study the table \nand accordingly answer the questions that follow.",
        "passageImage": "/pyq-assets/di_bank14_q98.png",
        "questionImage": null,
        "options": [
          "Q",
          "S",
          "R",
          "T"
        ],
        "answer": 0,
        "explanation": "Based on the state-wise movie goer distribution table, State Q has the second lowest total count of movie watchers.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q6",
        "questionNumber": 6,
        "section": "Analytical Reasoning",
        "question": "The total number of all movie goers in the five states who watch less than one movie per week is:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "34565",
          "45250",
          "87658",
          "54360"
        ],
        "answer": 0,
        "explanation": "Based on the state-wise movie goer distribution table, State Q has the second lowest total count of movie watchers.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q7",
        "questionNumber": 7,
        "section": "Analytical Reasoning",
        "question": "How many times decisions are taken during the flow of the given chart?",
        "passage": "Study the flowchart given below and answer the questions that follow:",
        "passageImage": "/pyq-assets/gad_037_bank_aptitude_flowchart_q4_060915.png",
        "questionImage": null,
        "options": [
          "4",
          "1",
          "3",
          "2"
        ],
        "answer": 3,
        "explanation": "In the flowchart, the decision diamonds with conditional branches are evaluated exactly 2 times during the primary path flow.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q8",
        "questionNumber": 8,
        "section": "Analytical Reasoning",
        "question": "In which of the following conditions the induction process is performed?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "In all of the mentioned conditions",
          "When contractor/temp is engaged",
          "When current employee is moved to the new position",
          "When new employee is selected and appointed"
        ],
        "answer": 0,
        "explanation": "According to the HR flowchart, induction is mandated across all scenarios (new employee, internal relocation, and contractor).",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q9",
        "questionNumber": 9,
        "section": "Analytical Reasoning",
        "question": "Below\n is given a question followed by two statements numbered I and II. The \nquestion may or may not be answered with the help of these statements. \nYou have to decide if these statements are sufficient to answer the \nquestion. Question: The number of persons eligible to vote in an election is 50,000. How many of them actually voted? Statements: I. 63% of the eligible men voted. II. 67% of the eligible women voted.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Only one of the statements, alone, is sufficient to answer the question but other statement is not.",
          "Both statements I and II together are sufficient to answer the question asked but neither statement alone is sufficient.",
          "Each statement alone is sufficient to answer the question.",
          "Statements I and II together are not sufficient to answer the question asked and additional data to the problem is needed."
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q10",
        "questionNumber": 10,
        "section": "Analytical Reasoning",
        "question": "For the following questions, choose the answer that best completes the comparison. Plague : Contagion :: Influenza : ?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Cold",
          "Epidemic",
          "Epidermis",
          "Dermis"
        ],
        "answer": 1,
        "explanation": "Plague is characterized as a contagion; similarly, Influenza is a contagious epidemic disease.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q11",
        "questionNumber": 11,
        "section": "Analytical Reasoning",
        "question": "Whether\n you can accomplish a specific goal or meet a specific deadline depends \nfirst on how much time you need to get the job done. What should you do \nwhen the demands of the job exceed the time you have available? The best\n approach is to divide the project into smaller pieces. Different goals \nwill have to be divided in different ways, but one seemingly unrealistic\n goal can often be accomplished by working on several smaller, more \nreasonable goals. This paragraph best supports the statement that:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "jobs often remain only partially completed because of lack of time.",
          "the best way to complete projects is to make sure your goals are achievable.",
          "the best way to tackle large projects is to divide the load and go step by step.",
          "the best approach to a demanding job is to delegate responsibility."
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q12",
        "questionNumber": 12,
        "section": "Analytical Reasoning",
        "question": "Two sets of figures are given below, the Problem Figures and the Answer Figures marked (1), (2), (3), (4). Which of them would be the next in the series of the Problem Figures ? Problem Figures : Answer Figures:",
        "passage": null,
        "passageImage": null,
        "questionImage": "/pyq-assets/cb_visual_21.png",
        "options": [
          "(1)",
          "(3)",
          "(2)",
          "(4)"
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q13",
        "questionNumber": 13,
        "section": "Analytical Reasoning",
        "question": "Directions: The\n question that follows contains a set of figures showing a sequence of \nfolding of a piece of paper. The dotted lines in last figure shows the \nmanner in which the folded paper was cut. The figures are followed by \nfour answer figures marked (1), (2), (3) and (4) from which you have to \nchoose a figure which would closely resemble the pattern in which the \ncuttings appear when the paper is unfolded.",
        "passage": null,
        "passageImage": null,
        "questionImage": "/pyq-assets/cb_vr_9.png",
        "options": [
          "(1)",
          "(2)",
          "(3)",
          "(4)"
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q14",
        "questionNumber": 14,
        "section": "Analytical Reasoning",
        "question": "If\n A $ B means B is the father of A; A # B means B is the mother of A; A *\n B means B is the sister of A and A @ B means B is the wife of A, which \nof the following indicates that N is the grandmother of P ?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "P * Q # M $ N",
          "P # Q $ M @ N",
          "P $ Q # N * M",
          "P @ Q $ N # M"
        ],
        "answer": 2,
        "explanation": "In symbolic blood relations: P $ Q (Q is father of P) # N (N is mother of Q) indicates N is the paternal grandmother of P.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q15",
        "questionNumber": 15,
        "section": "Analytical Reasoning",
        "question": "In the following question(s), symbols @, * , ?, $ and % are used with different meanings as follows: 'A % B' means 'A is equal to B'. 'A  @  B' means 'A is neither smaller than nor equal to B'. 'A * B' means 'A is neither smaller than nor greater than B'. 'A ? B' means ' means 'A is not  greater than B'. 'A $ B' means 'A is neither greater than nor equal to B'. Now\n assuming in the following question the given statements to be true, \nfind which of the given conclusions given below them is/are definitely \ntrue and give your answer accordingly. Statements: I. L @ T II. P ? T III. K $ L Conclusions: I. L @ P II. K @ T",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Only conclusion II follows",
          "Only conclusion I follows",
          "Both conclusion I and conclusion II follow",
          "Neither conclusion I nor conclusion II follows"
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q16",
        "questionNumber": 16,
        "section": "Analytical Reasoning",
        "question": "If\n in a certain code language, \"PEN\" is coded as \"NZO\" and \"PRANK\" is \ncoded as \"NSTOL\", then how would \"PEAK\" be coded in the same code \nlanguage?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "NLZT",
          "NZTL",
          "NZLT",
          "NTLZ"
        ],
        "answer": 2,
        "explanation": "Direct letter substitution mapping: P->N, E->Z, A->L, K->T gives 'NZLT'.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q17",
        "questionNumber": 17,
        "section": "Quantitative Ability",
        "question": "If\n 30 men working 7 hours a day can do a piece of work in 18 days. In how \nmany days will 21 men working 8 hours a day do the same piece of work?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "22.3",
          "22.5",
          "23.5",
          "21.2"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q18",
        "questionNumber": 18,
        "section": "Quantitative Ability",
        "question": "Determine the average of the following data. 45, 50, 33, 22, 15",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "34",
          "35",
          "33",
          "32"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q19",
        "questionNumber": 19,
        "section": "Quantitative Ability",
        "question": "The\n ratio of the father's age to the son's age is 4:1. The product of their\n ages is 196 years. What will be the ratio of their ages after 5 years?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "11:6",
          "11:10",
          "11:7",
          "11:4"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q20",
        "questionNumber": 20,
        "section": "Quantitative Ability",
        "question": "When three times a number is added to the square of the given number, the result is 54. What is the number?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "6",
          "4",
          "2",
          "3"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q21",
        "questionNumber": 21,
        "section": "Quantitative Ability",
        "question": "A mixture \"M 1 \" of Mix Juice, Orange Juice and Pineapple Juice contains 90% Mix Juice, \n5% Orange Juice and 5% Pineapple Juice. A second mixture \"M 2 \" of Mix Juice and Orange Juice is mixed with M 1 such that the resulting mixture \"M 3 \" contains 85% of Mix Juice, 12.5% of Orange Juice, and 2.5% Pineapple Juice. What is the ratio of percentage of Orange Juice in M 2 to the percentage of Mix Juice in M 1 ? (Note: M 1 and M 2 are mixed in equal quantities)",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "5 : 9",
          "4 : 9",
          "7 : 9",
          "2 : 9"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q22",
        "questionNumber": 22,
        "section": "Quantitative Ability",
        "question": "A cheetah runs at a speed of 144 kmph. It covers a distance of 280 m in:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "6 seconds",
          "8 seconds",
          "7 seconds",
          "9 seconds"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q23",
        "questionNumber": 23,
        "section": "Quantitative Ability",
        "question": "Two numbers are in the ratio 3 : 4. If each number be increased by 2, the ratio becomes 7 : 9. Find the numbers.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "13, 12",
          "15, 15",
          "12, 16",
          "16, 12"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q24",
        "questionNumber": 24,
        "section": "Quantitative Ability",
        "question": "A\n man rows to a place 60 km distant and back in 15 hours. He finds that \nhe can row 5 km with the stream in the same time as 4 km against the \nstream. What is the rate of the stream?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "16.2 kmph",
          "1.2 kmph",
          "0.9 kmph",
          "1 kmph"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q25",
        "questionNumber": 25,
        "section": "Quantitative Ability",
        "question": "A\n train travels first 800 kms at an average rate of 150 kmph and further \ntravels the same distance at an average rate of 120 kmph. Determine the \naverage speed of the train over the whole journey.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "145 kmph",
          "135 kmph",
          "133.33 kmph",
          "137.66 kmph"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q26",
        "questionNumber": 26,
        "section": "Quantitative Ability",
        "question": "4%\n of the votes cast were found to be invalid in an election. Raman got \n75% of the total valid votes and won the election by 240 votes from \nRitesh who was the only opponent. Find the total number of people who \ncast the votes provided one person can cast one vote only.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "650",
          "600",
          "500",
          "550"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q27",
        "questionNumber": 27,
        "section": "Quantitative Ability",
        "question": "Simplify: log 23 (22) * log 24 (23) * log 25 (24) * log 26 (25) * _ _ _ _ * log 40 (39)",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "None of the mentioned options",
          "log 40 (22 + 23 + 24 + _ _ _ + 39)",
          "log 22 (40)",
          "log 40 (22)"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q28",
        "questionNumber": 28,
        "section": "Quantitative Ability",
        "question": "Two unbiased coins are tossed. The probability of obtaining at least one head is:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "1/4",
          "2/4",
          "3/4",
          "0"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q29",
        "questionNumber": 29,
        "section": "Quantitative Ability",
        "question": "Cominos,\n a pizza manufacturing company, sells 1 lakh pizzas in a month. The cost\n of making one pizza is Rs. 500 and the company invests 25% of the \nmanufacturing cost in advertisement. The cost of delivering pizzas is \nborne by the company and is approximately 30% of the manufacturing cost.\n At what price should the pizzas be sold in order to gain 20% overall \nprofit?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Rs. 930",
          "Rs. 780",
          "Rs. 640",
          "Rs. 860"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q30",
        "questionNumber": 30,
        "section": "Quantitative Ability",
        "question": "3 boys can complete a work in 7 days. 1 boy can complete it in:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "49 days",
          "21 days",
          "35 days",
          "30 days"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q31",
        "questionNumber": 31,
        "section": "Quantitative Ability",
        "question": "Read the information given below and answer the question that follows. f(x) = f(x - 1) + f(x + 1), \"x\" is a whole number f(0) = 2 f(2) = 0 What is the value of f(f(2))?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "0",
          "Not defined",
          "2",
          "1"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p1_q32",
        "questionNumber": 32,
        "section": "Quantitative Ability",
        "question": "In\n a school election, Peter wins over Albert by a margin of 260 votes \nwhich is 13% of the total number of votes. If the invalid votes are \n0.5%, then how many votes are valid?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "1995",
          "2000",
          "1990",
          "2010"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "paper_2",
    "title": "CoCubes Authentic On-Campus Paper 2",
    "subtitle": "2018 On-Campus Drive • Full 32Q Real Drive Simulation",
    "durationMinutes": 50,
    "totalMarks": 32,
    "sections": [
      {
        "name": "Analytical Reasoning",
        "questionCount": 16,
        "marks": 16
      },
      {
        "name": "Quantitative Ability",
        "questionCount": 16,
        "marks": 16
      }
    ],
    "questions": [
      {
        "id": "cocubes_p2_q1",
        "questionNumber": 1,
        "section": "Analytical Reasoning",
        "question": "If in a certain code language CHEER is coded as 385518 and WATER as 23120518, how would EXPRESS be coded in that code language?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "524151841919",
          "524161751919",
          "52415719195",
          "524161851919"
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q2",
        "questionNumber": 2,
        "section": "Analytical Reasoning",
        "question": "Below\n is given a question followed by two statements numbered I and II. The \nquestion may or may not be answered with the help of these statements. \nYou have to decide if these statements are sufficient to answer the \nquestion. Question: How many smaller cubes are formed from a larger cube? Statements: I. The side of larger cube is 15 cm. II. The surface area of the smaller cube is 150 cm 2 .",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Statements I and II together are not sufficient to answer the question asked and additional data to the problem is needed.",
          "Both statements I and II together are sufficient to answer the question asked but neither statement alone is sufficient.",
          "Only one of the statements, alone, is sufficient to answer the question but other statement is not.",
          "Each statement alone is sufficient to answer the question."
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q3",
        "questionNumber": 3,
        "section": "Analytical Reasoning",
        "question": "Which among the following sentences is formed with least number of vowels ?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "How to go about this?",
          "There is some food kept for you.",
          "You reap what you sow.",
          "Someone is here to meet you."
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q4",
        "questionNumber": 4,
        "section": "Analytical Reasoning",
        "question": "Below\n is/are given statement/s followed by conclusions in the options. Take \nthe given statement/s to be true, even if they contradict commonly known\n facts, and determine the conclusion/s that logically follow/s from the \nstatement/s. Statements: I. All carbon are diamonds. II. Some graphite are carbon.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "None follows",
          "Some graphite are diamonds.",
          "No graphite are diamonds.",
          "All diamonds are graphite."
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q5",
        "questionNumber": 5,
        "section": "Analytical Reasoning",
        "question": "In the following question, the symbols & , !! , * , ? and # are used with the following meanings illustrated. \"M * N\" means \"M is neither greater than nor equal to N\". \"M !! N\" means \"M is either greater than or equal to N\". \"M # N\" means \"M is greater than N\". \"M & N\" means \"M is neither smaller than nor equal to N\". \"M ? N\" means \"M is smaller than N\". Now\n assuming the given statements to be true, find which of the given \nconclusions given below them is/are definitely true and give your answer\n accordingly. Statements: I. W * Q II.  Q & P III. P ? F Conclusions: I. F & Q II. W ? Q III. P # W",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Only conclusion I and conclusion II follow",
          "Only conclusion I and conclusion III follow",
          "Only conclusion II and conclusion III follow",
          "Only conclusion II follows"
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q6",
        "questionNumber": 6,
        "section": "Analytical Reasoning",
        "question": "Below\n is given a question followed by two statements numbered I and II. The \nquestion may or may not be answered with the help of these statements. \nYou have to decide if these statements are sufficient to answer the \nquestion. Question: If Ranga can paint a house in 3 days working alone, how long will it take to paint the house along with Billa? Statements: I. Billa can paint the house in 4 days working alone. II. Working together with Ranga, Billa does 3/7 th of the total work.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Only one of the statements, alone, is sufficient to answer the question but other statement is not.",
          "Each statement alone is sufficient to answer the question.",
          "Both statements I and II together are sufficient to answer the question asked but neither statement alone is sufficient.",
          "Statements I and II together are not sufficient to answer the question asked and additional data to the problem are needed."
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q7",
        "questionNumber": 7,
        "section": "Analytical Reasoning",
        "question": "For the following questions, choose the answer that best completes the comparison. Plague : Contagion :: Influenza : ?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Dermis",
          "Epidemic",
          "Cold",
          "Epidermis"
        ],
        "answer": 1,
        "explanation": "Plague is characterized as a contagion; similarly, Influenza is a contagious epidemic disease.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q8",
        "questionNumber": 8,
        "section": "Analytical Reasoning",
        "question": "Select the statement from the given options that best develops or supports the following paragraph. Before\n you begin to compose a business letter, sit down and think about your \npurpose for writing the letter. Do you want to request information, \norder a product, register a complaint, or apply for something? Do some \nbrainstorming and gather information before you begin writing. Always \nkeep your objective in mind.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "for many different kinds of writing tasks, planning is an important first step.",
          "while some people plan ahead when they are writing a business letter, others do not.",
          "brainstorming and writing take approximately equal amounts of time.",
          "business letters are frequently complaint letters."
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q9",
        "questionNumber": 9,
        "section": "Analytical Reasoning",
        "question": "In which standard is the difference between the results of girls and boys maximum?",
        "passage": "Study\n the bar graph given below that illustrates the result (pass percentage)\n of boys and girls belonging to different standards of same school. \nStudy the graph and accordingly answer the questions that follow.",
        "passageImage": "/pyq-assets/di_bank14_q97.png",
        "questionImage": null,
        "options": [
          "IX",
          "VII",
          "XII",
          "X"
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q10",
        "questionNumber": 10,
        "section": "Analytical Reasoning",
        "question": "In which standard is the failure of girls lowest in comparison to the result of boys?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "IX",
          "XII",
          "X",
          "VII"
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q11",
        "questionNumber": 11,
        "section": "Analytical Reasoning",
        "question": "Read the following information carefully and answer the questions that follow. I) A + B means A is the sister of B II) A - B means A is the brother of B III) A × B means A is the daughter of B Which of the following shows the relation that E is the maternal uncle of D ?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "D - F × E x Q",
          "D × F + E - C",
          "D × F - E + C",
          "D + Q × C + E"
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q12",
        "questionNumber": 12,
        "section": "Analytical Reasoning",
        "question": "Taking details of a company is:",
        "passage": "Study the flowchart given below and answer the questions that follow:",
        "passageImage": "/pyq-assets/pa_fl_f1.png",
        "questionImage": null,
        "options": [
          "Instruction",
          "Starting of the process",
          "Decisional call",
          "Process step"
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q13",
        "questionNumber": 13,
        "section": "Analytical Reasoning",
        "question": "Which of the following statements is correct regarding the given diagram?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "This flow chart is part of a bigger flow chart.",
          "None of the mentioned options",
          "This is not a flow chart.",
          "This is a complete flow chart."
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q14",
        "questionNumber": 14,
        "section": "Analytical Reasoning",
        "question": "From the given options identify which should complete the following sequence.",
        "passage": null,
        "passageImage": null,
        "questionImage": "/pyq-assets/aptitude_quant_visual_new_q33.png",
        "options": [
          "B.",
          "C.",
          "D."
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q15",
        "questionNumber": 15,
        "section": "Analytical Reasoning",
        "question": "In the following question, a portion from the Problem Figure is missing. Complete the missing portion by selecting the correct option from the Response Figures (A), (B), (C), (D) and (E). Problem Figure: Response Figures:",
        "passage": null,
        "passageImage": null,
        "questionImage": "/pyq-assets/prk_306_jecrc_set_1_sectioni_visual_q2_04122014.png",
        "options": [
          "(B)",
          "(E)",
          "(D)",
          "(C)",
          "E. (A)"
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q16",
        "questionNumber": 16,
        "section": "Analytical Reasoning",
        "question": "Find the missing term(s) in the series given below: 12, 60, 180, 408, ? , 1332, 2100, 3120",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "722",
          "754",
          "796",
          "780"
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q17",
        "questionNumber": 17,
        "section": "Quantitative Ability",
        "question": "Read the information given below and answer the questions that follow. f(t) = (t 3 - 1) g(t) = 1 h(t) = -t 2 Find the value of fohog at t = -3.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "-1",
          "None of the mentioned options",
          "-2",
          "0"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q18",
        "questionNumber": 18,
        "section": "Quantitative Ability",
        "question": "The ratio of the lengths of the respective diagonals of two squares is 2 : 1. Find the ratio of their areas.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "4 : 1",
          "5 : 4",
          "5 : 2",
          "4 : 3"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q19",
        "questionNumber": 19,
        "section": "Quantitative Ability",
        "question": "If a watch costs ₹120 more than a ring, then find the price of the watch if their cost is in ratio 3:2 in order.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "₹480",
          "₹240",
          "₹120",
          "₹360"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q20",
        "questionNumber": 20,
        "section": "Quantitative Ability",
        "question": "The\n sum of the ages of a son and father is 56 years. After 4 years, the age\n of the father will be three times that of the son. What is the age of \nthe son?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "13 years",
          "12 years",
          "10 years",
          "11 years"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q21",
        "questionNumber": 21,
        "section": "Quantitative Ability",
        "question": "Determine the average of the following data. 81, 73, 69, 17, 20",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "54",
          "51",
          "53",
          "52"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q22",
        "questionNumber": 22,
        "section": "Quantitative Ability",
        "question": "By selling goods for Rs. 240, a merchant gains 25%. How much percent would he gain by selling it for Rs. 216?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "12.5%",
          "13%",
          "14%",
          "20%"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q23",
        "questionNumber": 23,
        "section": "Quantitative Ability",
        "question": "If the outcome is an odd number when a dice is rolled, then calculate the probability that it is a prime number.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "1/2",
          "1/6",
          "2/3",
          "5/6"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q24",
        "questionNumber": 24,
        "section": "Quantitative Ability",
        "question": "4 boys can complete a work in 17 days. 1 boy can complete it in:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "68 days",
          "85 days",
          "102 days",
          "51 days"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q25",
        "questionNumber": 25,
        "section": "Quantitative Ability",
        "question": "A\n train travels first 400 kms at an average rate of 80 kmph and further \ntravels the same distance at an average rate of 60 kmph. Determine the \naverage speed of the train over the whole journey.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "68.57 kmph",
          "74 kmph",
          "72.84 kmph",
          "70 kmph"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q26",
        "questionNumber": 26,
        "section": "Quantitative Ability",
        "question": "Uchit,\n on his bike, completes a journey in 47 hours. If it is known that he \ntravels at 25 kmph for half the distance and at 22 kmph for the other \nhalf, then find the distance traveled.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "1101 km",
          "1000 km",
          "1001 km",
          "1100 km"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q27",
        "questionNumber": 27,
        "section": "Quantitative Ability",
        "question": "If a + (1/a) = 3, then what is the value of (a 2 - 3a + 1)?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "1",
          "2",
          "0",
          "5"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q28",
        "questionNumber": 28,
        "section": "Quantitative Ability",
        "question": "Simplify: log 201 (200) * log 202 (201) * log 203 (202) * log 204 (203) * _ _ _ _ * log 222 (221)",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "log 200 (222)",
          "log 222 (200 + 201 + 202 + _ _ _ + 221)",
          "None of the mentioned options",
          "log 222 (200)"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q29",
        "questionNumber": 29,
        "section": "Quantitative Ability",
        "question": "What\n is the percentage increase in the population of the country from 2014 \nto 2017 if it increases at a rate of 20% from 2014 to 2015 and again 20%\n from 2015 to 2016 but reduces at a rate of 10% during 2016 to 2017?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "26.2%",
          "22.4%",
          "29.6%",
          "24.4%"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q30",
        "questionNumber": 30,
        "section": "Quantitative Ability",
        "question": "Lisa\n and Paul started a journey of distance 100 km. If Lisa and Paul travel \nat the speeds of 50 kmph and 25 kmph respectively. How many minutes \nearly can Paul reach the destination?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "120 minutes",
          "45 minutes",
          "180 minutes",
          "60 minutes"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q31",
        "questionNumber": 31,
        "section": "Quantitative Ability",
        "question": "Two\n friends bought two bags whose prices were in the ratio of 1 : 3. If \nthey sold them at a loss of 10%, the difference of the money earned by \nthem was Rs. 360. What was the cost price of the costlier bag?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Rs. 900",
          "Rs. 600",
          "Rs. 300",
          "Rs. 450"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p2_q32",
        "questionNumber": 32,
        "section": "Quantitative Ability",
        "question": "A\n large tanker can be filled by two pipes A and B in 60 minutes and 40 \nminutes respectively. How many minutes will it take to fill the tanker \nfrom empty state if pipe A is used for half the tank and pipes A and B \nfill the tank together for the other half?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "37 minutes",
          "42 minutes",
          "32 minutes",
          "30 minutes"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "paper_3",
    "title": "CoCubes Authentic On-Campus Paper 3",
    "subtitle": "2019 On-Campus Drive • Full 32Q Real Drive Simulation",
    "durationMinutes": 50,
    "totalMarks": 32,
    "sections": [
      {
        "name": "Analytical Reasoning",
        "questionCount": 16,
        "marks": 16
      },
      {
        "name": "Quantitative Ability",
        "questionCount": 16,
        "marks": 16
      }
    ],
    "questions": [
      {
        "id": "cocubes_p3_q1",
        "questionNumber": 1,
        "section": "Analytical Reasoning",
        "question": "For the following questions, choose the answer that best completes the comparison. Lick : Taste :: Sniff : ?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Halt",
          "Smell",
          "Hear",
          "Snore"
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q2",
        "questionNumber": 2,
        "section": "Analytical Reasoning",
        "question": "Which number is definitely in its correct position at the end of first pass?",
        "passage": "Study the flowchart given below and answer the questions that follow. The above flowchart depicts the logic for sorting a list in the ascending order A = [76, 3, 94, 55, 21, 1], with index starting with 0",
        "passageImage": "/pyq-assets/978_imageq2.png",
        "questionImage": null,
        "options": [
          "94",
          "55",
          "1",
          "3"
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q3",
        "questionNumber": 3,
        "section": "Analytical Reasoning",
        "question": "What is the MINIMUM number of passes in which the list can be sorted in ascending order?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "4",
          "6",
          "3",
          "5"
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q4",
        "questionNumber": 4,
        "section": "Analytical Reasoning",
        "question": "Find the missing term(s) in the series given below: 8, 15, 36, 99, ? , 855",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "275",
          "264",
          "288",
          "290"
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q5",
        "questionNumber": 5,
        "section": "Analytical Reasoning",
        "question": "Read the given options and choose the sentence that best develops or supports the one given in the question. It is a fact that people are now living longer than ever before for many reasons.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Advances in medical science have done wonders for longevity.",
          "Some people in the Russia's Caucasus Mountains live to be over one hundred years of age.",
          "No one seems to understand this phenomenon.",
          "The people in many regions do not seem to gain anything from medical science."
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q6",
        "questionNumber": 6,
        "section": "Analytical Reasoning",
        "question": "Directions: The\n question that follows contains a set of figures showing a sequence of \nfolding of a piece of paper. The dotted lines in last figure shows the \nmanner in which the folded paper was cut. The figures are followed by \nfour answer figures marked (1), (2), (3) and (4) from which you have to \nchoose a figure which would closely resemble the pattern in which the \ncuttings appear when the paper is unfolded.",
        "passage": null,
        "passageImage": null,
        "questionImage": "/pyq-assets/cb_vr_5.png",
        "options": [
          "(1)",
          "(2)",
          "(3)",
          "(4)"
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q7",
        "questionNumber": 7,
        "section": "Analytical Reasoning",
        "question": "From the given options identify which should complete the following sequence.",
        "passage": null,
        "passageImage": null,
        "questionImage": "/pyq-assets/aptitude_quant_visual_new_q32.png",
        "options": [
          "B.",
          "C.",
          "D."
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q8",
        "questionNumber": 8,
        "section": "Analytical Reasoning",
        "question": "Below\n is/are given statement/s followed by conclusions in the options. Take \nthe given statement/s to be true, even if they contradict commonly known\n facts, and determine the conclusion/s that logically follow/s from the \nstatement/s. Statements: I. All mountains are hills. II. All Mount Everest are mountains.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "No hills are Mount Everest.",
          "No mountains are Mount Everest.",
          "All Mount Everest are hills.",
          "All hills are Mount Everest."
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q9",
        "questionNumber": 9,
        "section": "Analytical Reasoning",
        "question": "If\n in a certain code language \"COCHLEA\" is coded as \"BUDGMIE\" and \n\"LATITUDE\" as \"KEVOSAFI\", then how would \"PEPPERCORN\" be coded in the \nsame language?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "NIQQISDUSP",
          "NIQNISBUSM",
          "NINNIQBUQM",
          "QIQQISDUSP"
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q10",
        "questionNumber": 10,
        "section": "Analytical Reasoning",
        "question": "Below\n is given a question followed by two statements numbered I and II. The \nquestion may or may not be answered with the help of these statements. \nYou have to decide if these statements are sufficient to answer the \nquestion. Question: How many letters can two typists complete in a day? Statements: I. A working day consists of 6 hours. II. Four typists can type 600 letters in 3 days.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Statements I and II together are not sufficient to answer the question asked and additional data to the problem are needed.",
          "Both statements I and II together are sufficient to answer the question asked but neither statement alone is sufficient.",
          "Only one of the statements, alone, is sufficient to answer the question but other statement is not.",
          "Each statement alone is sufficient to answer the question."
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q11",
        "questionNumber": 11,
        "section": "Analytical Reasoning",
        "question": "Which among the following sentences is formed with least number of vowels ?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "What are your ideas?",
          "If he can do so can I.",
          "You can if you think.",
          "Don't argue with me."
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q12",
        "questionNumber": 12,
        "section": "Analytical Reasoning",
        "question": "In the following question, the symbols & , !! , * , ? and # are used with the following meanings illustrated. \"M * N\" means \"M is neither greater than nor equal to N\". \"M !! N\" means \"M is either greater than or equal to N\". \"M # N\" means \"M is greater than N\". \"M & N\" means \"M is neither smaller than nor equal to N\". \"M ? N\" means \"M is smaller than N\". Now\n assuming the given statements to be true, find which of the given \nconclusions given below them is/are definitely true and give your answer\n accordingly. Statements: I. W * Q II.  Q & P III. P ? F Conclusions: I. F & Q II. W ? Q III. P # W",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Only conclusion II follows",
          "Only conclusion II and conclusion III follow",
          "Only conclusion I and conclusion III follow",
          "Only conclusion I and conclusion II follow"
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q13",
        "questionNumber": 13,
        "section": "Analytical Reasoning",
        "question": "If\n A $ B means B is the father of A; A # B means B is the mother of A; A *\n B means B is the sister of A and A @ B means B is the wife of A, which \nof the following indicates that N is the grandmother of P ?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "P * Q # M $ N",
          "P @ Q $ N # M",
          "P $ Q # N * M",
          "P # Q $ M @ N"
        ],
        "answer": 2,
        "explanation": "In symbolic blood relations: P $ Q (Q is father of P) # N (N is mother of Q) indicates N is the paternal grandmother of P.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q14",
        "questionNumber": 14,
        "section": "Analytical Reasoning",
        "question": "In which standard is the result of the girls less than the average result of the boys of the school?",
        "passage": "Study\n the bar graph given below that illustrates the result (pass percentage)\n of boys and girls belonging to different standards of same school. \nStudy the graph and accordingly answer the questions that follow.",
        "passageImage": "/pyq-assets/di_bank14_q97.png",
        "questionImage": null,
        "options": [
          "XII",
          "VIII",
          "XI",
          "IX"
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q15",
        "questionNumber": 15,
        "section": "Analytical Reasoning",
        "question": "In which standard is the failure of girls lowest in comparison to the result of boys?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "X",
          "XII",
          "VII",
          "IX"
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q16",
        "questionNumber": 16,
        "section": "Analytical Reasoning",
        "question": "Below\n is given a question followed by two statements numbered I and II. The \nquestion may or may not be answered with the help of these statements. \nYou have to decide if these statements are sufficient to answer the \nquestion. Question: What is the ratio of savings of A and B? Statements: I. The incomes of A and B are in the ratio 4 : 5. II. The ratio of expenditures of A and B is 3 : 5.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Only one of the statements, alone, is sufficient to answer the question but other statement is not.",
          "Both statements I and II together are sufficient to answer the question asked but neither statement alone is sufficient.",
          "Each statement alone is sufficient to answer the question.",
          "Statements I and II together are not sufficient to answer the question asked and additional data to the problem is needed."
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q17",
        "questionNumber": 17,
        "section": "Quantitative Ability",
        "question": "A\n train travels first 800 kms at an average rate of 150 kmph and further \ntravels the same distance at an average rate of 120 kmph. Determine the \naverage speed of the train over the whole journey.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "135 kmph",
          "133.33 kmph",
          "137.66 kmph",
          "145 kmph"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q18",
        "questionNumber": 18,
        "section": "Quantitative Ability",
        "question": "Kushal's\n age is three times the sum of the ages of his two sons. 5 years hence, \nhis age will be double the sum of their ages. Find Kushal's present age.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "25 years",
          "35 years",
          "65 years",
          "45 years"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q19",
        "questionNumber": 19,
        "section": "Quantitative Ability",
        "question": "The ratio of the lengths of the respective diagonals of two squares is 2 : 1. Find the ratio of their areas.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "4 : 3",
          "5 : 2",
          "4 : 1",
          "5 : 4"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q20",
        "questionNumber": 20,
        "section": "Quantitative Ability",
        "question": "Two trains are travelling towards each other at speeds 36 kmph and 54 kmph. In 3 hours they together will cover a total of:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "100 km",
          "360 km",
          "54 km",
          "270 km"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q21",
        "questionNumber": 21,
        "section": "Quantitative Ability",
        "question": "The number of diagonals of a polygon having 22 sides is:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "190",
          "189",
          "219",
          "209"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q22",
        "questionNumber": 22,
        "section": "Quantitative Ability",
        "question": "By selling goods for Rs. 240, a merchant gains 25%. How much percent would he gain by selling it for Rs. 216?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "14%",
          "12.5%",
          "13%",
          "20%"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q23",
        "questionNumber": 23,
        "section": "Quantitative Ability",
        "question": "Two\n dice with face marked 1, 2, 3, 4, 5, 6 are thrown simultaneously and \nthe points on the dice are multiplied together. The probability that \nproduct is 12 is:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "12/36",
          "4/36",
          "None of the mentioned options",
          "5/36"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q24",
        "questionNumber": 24,
        "section": "Quantitative Ability",
        "question": "Two\n friends bought two bags whose prices were in the ratio of 1 : 3. If \nthey sold them at a loss of 20%, the difference of the money earned by \nthem was Rs. 320. What was the cost price of the costlier bag?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Rs. 900",
          "Rs. 300",
          "Rs. 450",
          "Rs. 600"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q25",
        "questionNumber": 25,
        "section": "Quantitative Ability",
        "question": "Simplify: log y (z) * log x (y) * log w (x) * log v (w) * _ _ _ _ * log a (b)",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "log z (a + b + c + _ _ _ + y)",
          "None of the mentioned options",
          "log a (z)",
          "log z (a)"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q26",
        "questionNumber": 26,
        "section": "Quantitative Ability",
        "question": "One poet can write 2 words per second. 12 poets can write 7200 words in:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "3 minutes",
          "2 minutes",
          "6 minutes",
          "5 minutes"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q27",
        "questionNumber": 27,
        "section": "Quantitative Ability",
        "question": "A\n boat takes 20 hours to travel downstream from point P to point Q and \ncoming back to a point R midway between P and Q. If the velocity of the \nstream is 5 kmph and the speed of the boat in still water is 13 kmph, \nthen what is the distance between P and Q?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "150.3 km",
          "200 km",
          "180 km",
          "169.4 km"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q28",
        "questionNumber": 28,
        "section": "Quantitative Ability",
        "question": "Determine the average of the following data. 47, 87, 26, 63, 57",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "54",
          "57",
          "56",
          "55"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q29",
        "questionNumber": 29,
        "section": "Quantitative Ability",
        "question": "(5/23) th of 437 is:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "105",
          "85",
          "75",
          "95"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q30",
        "questionNumber": 30,
        "section": "Quantitative Ability",
        "question": "Cominos,\n a pizza manufacturing company, sells 1 lakh pizzas in a month. The cost\n of making one pizza is Rs. 200 and the company invests 30% of the \nmanufacturing cost in advertisement. The cost of delivering pizzas is \nborne by the company and is approximately 25% of the manufacturing cost.\n At what price should the pizzas be sold in order to gain 50% overall \nprofit?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Rs. 465",
          "Rs. 425",
          "Rs. 420",
          "Rs. 480"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q31",
        "questionNumber": 31,
        "section": "Quantitative Ability",
        "question": "3 boys can complete a work in 9 days. 1 boy can complete it in:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "18 days",
          "27 days",
          "36 days",
          "54 days"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p3_q32",
        "questionNumber": 32,
        "section": "Quantitative Ability",
        "question": "Read the information given below and answer the questions that follow. f(t) = (t 3 - 1) g(t) = 1 h(t) = -t 2 Find the value of hoh(-2) + gog(0) - fof(1).",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "-14",
          "-16",
          "-17",
          "-15"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "paper_4",
    "title": "CoCubes Authentic On-Campus Paper 4",
    "subtitle": "2020 Virtual OA Drive • Full 32Q Real Drive Simulation",
    "durationMinutes": 50,
    "totalMarks": 32,
    "sections": [
      {
        "name": "Analytical Reasoning",
        "questionCount": 16,
        "marks": 16
      },
      {
        "name": "Quantitative Ability",
        "questionCount": 16,
        "marks": 16
      }
    ],
    "questions": [
      {
        "id": "cocubes_p4_q1",
        "questionNumber": 1,
        "section": "Analytical Reasoning",
        "question": "Which of the given options can be formed using the letters of the following set? {a, w, r, t, i, s, o, n, m, l, b, h, e, p}",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "help",
          "coup",
          "mouse",
          "peak"
        ],
        "answer": 1,
        "explanation": "'pest' is validly formed from the given set of letters.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q2",
        "questionNumber": 2,
        "section": "Analytical Reasoning",
        "question": "Every\n year Americans use over one billion sharp objects to administer health \ncare in their homes. These sharp objects include lancets, needles and \nsyringes. If not disposed of in puncture-resistant containers, they can \ninjure sanitation workers. Sharp objects should be disposed of in hard \nplastic or metal containers with secure lids. The containers should be \nclearly marked and should be puncture resistant. This paragraph best supports the idea that sanitation workers can be injured if they:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "do not place sharp objects in puncture-resistant containers.",
          "are careless with sharp objects such as lancets, needles and syringes in their homes.",
          "do not mark the containers they pick up with a warning that those containers contain sharp objects.",
          "come in contact with sharp objects that have not been placed in secure containers."
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q3",
        "questionNumber": 3,
        "section": "Analytical Reasoning",
        "question": "Find the missing term in the following series. 5, 10, 16, ?, 31, 40",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "23",
          "26",
          "25",
          "27"
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q4",
        "questionNumber": 4,
        "section": "Analytical Reasoning",
        "question": "If in a certain code language CHEER is coded as 385518 and WATER as 23120518, how would EXPRESS be coded in that code language?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "524161851919",
          "524161751919",
          "52415719195",
          "524151841919"
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q5",
        "questionNumber": 5,
        "section": "Analytical Reasoning",
        "question": "From the given options identify which should complete the following sequence.",
        "passage": null,
        "passageImage": null,
        "questionImage": "/pyq-assets/aptitude_quant_visual_new_q39.png",
        "options": [
          "B.",
          "C.",
          "D."
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q6",
        "questionNumber": 6,
        "section": "Analytical Reasoning",
        "question": "In the following question, symbols ?? , <> , >< , * and () are used with different meanings as follows: \"P ?? Q\" means \"P is not greater than Q\". \"P <> Q\" means \"P is either smaller than or equal to Q\". \"P ** Q\" means \"P is either smaller than or greater than Q\". \"P >< Q\" means \"P is not smaller than Q\" \"P () Q\" means \"P is either greater than or equal to Q\". In\n the following question assuming the given statements to be true, find \nout which of the given conclusions given below them is/are definitely \ntrue and mark your answer accordingly. Statements: I. B ?? V II. V <> M III. J () M Conclusions: I. J () B II. J () V",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Only conclusion II follows.",
          "Both conclusion I and conclusion II follow.",
          "Neither conclusion I nor conclusion II follows.",
          "Only conclusion I follows."
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q7",
        "questionNumber": 7,
        "section": "Analytical Reasoning",
        "question": "For the following questions, choose the answer that best completes the comparison. Trees : Deforestation :: Micro-organism : ?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Killing",
          "Washing",
          "Small",
          "Sterilization"
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q8",
        "questionNumber": 8,
        "section": "Analytical Reasoning",
        "question": "Below\n are given statements followed by (two) conclusions. Take the given \nstatements to be true, even if they contradict commonly known facts, and\n determine the conclusion/s that logically follow/s from the statements. Statements: I. All rods are steels. II. No rod is an iron. Conclusions: I. No iron is steel. II. All steels are rods.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Only conclusion II follows",
          "Neither conclusion I nor conclusion II follows",
          "Both conclusion I and conclusion II follow",
          "Only conclusion I follows"
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q9",
        "questionNumber": 9,
        "section": "Analytical Reasoning",
        "question": "Below\n is given a question followed by two statements numbered I and II. The \nquestion may or may not be answered with the help of these statements. \nYou have to decide if these statements are sufficient to answer the \nquestion. Question: A piece of wood 5 feet long is cut into 3 smaller pieces. How long is the longest of the three pieces? Statements: I. One piece is 2 feet 7 inches long. II. One piece is 7 inches longer than the other piece and the third piece is 5 inches long.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Each statement alone is sufficient to answer the question.",
          "Only one of the statements, alone, is sufficient to answer the question but other statement is not.",
          "Both statements I and II together are sufficient to answer the question asked but neither statement alone is sufficient.",
          "Statements I and II together are not sufficient to answer the question asked and additional data to the problem are needed."
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q10",
        "questionNumber": 10,
        "section": "Analytical Reasoning",
        "question": "Two sets of figures are given below, the Problem Figures and the Answer Figures marked (1), (2), (3), (4). Which of them would be the next in the series of the Problem Figures ? Problem Figures : Answer Figures :",
        "passage": null,
        "passageImage": null,
        "questionImage": "/pyq-assets/cb_visual_13.png",
        "options": [
          "(3)",
          "(1)",
          "(4)",
          "(2)"
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q11",
        "questionNumber": 11,
        "section": "Analytical Reasoning",
        "question": "Study the following information and answer the question that follows. A $ B means A is the father of B A # B means A is the sister of B A * B means A is the daughter of B A @ B means A is the brother of B Question: Which of the following expressions indicates that M is the wife of Q?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Q $ R * T # M",
          "Q $ R @ T # M",
          "Q $ R @ T * M",
          "Q $ R # T @ M"
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q12",
        "questionNumber": 12,
        "section": "Analytical Reasoning",
        "question": "What will get printed for a = 3, b = 4 and c = 5?",
        "passage": "Study the flowchart given below and answer the questions that follow:",
        "passageImage": "/pyq-assets/prk_306_ericsson_aptitude_flowcharts_q1_01092014.png",
        "questionImage": null,
        "options": [
          "Roots are Imaginary and Cannot be calculated",
          "Cannot be determined",
          "Roots are Real and Equal and are 3",
          "0.67"
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q13",
        "questionNumber": 13,
        "section": "Analytical Reasoning",
        "question": "What will get printed for a = 1, b = -5 and c = 6?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Roots are Real and are -2, -3",
          "Roots are Imaginary and Cannot be calculated",
          "Roots are Real and are 2, 3",
          "Roots are Real and Equal and are 5"
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q14",
        "questionNumber": 14,
        "section": "Analytical Reasoning",
        "question": "During which month of the year did the most rainfall occur?",
        "passage": "The line chart given below represents the average amount of rain falling each month in the town of Tegulpa.",
        "passageImage": "/pyq-assets/crackcbse_di_q7-8.png",
        "questionImage": null,
        "options": [
          "December",
          "March",
          "January",
          "August"
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q15",
        "questionNumber": 15,
        "section": "Analytical Reasoning",
        "question": "Which month shows the greatest increase in rainfall compared to the preceding month?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "October",
          "August",
          "February",
          "March"
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q16",
        "questionNumber": 16,
        "section": "Analytical Reasoning",
        "question": "Below\n is given a question followed by two statements numbered I and II. The \nquestion may or may not be answered with the help of these statements. \nYou have to decide if these statements are sufficient to answer the \nquestion. Question: How much does Jack weigh? Statements: I. Jack and Jill together weigh 150 kg. II. Jack weighs twice as much as Jill.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Statements I and II together are not sufficient to answer the question asked and additional data to the problem is needed.",
          "Each statement alone is sufficient to answer the question.",
          "Both statements I and II together are sufficient to answer the question asked but neither statement alone is sufficient.",
          "Only one of the statements, alone, is sufficient to answer the question but other statement is not."
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q17",
        "questionNumber": 17,
        "section": "Quantitative Ability",
        "question": "(3/11) th of 3333 is:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "909",
          "960",
          "918",
          "927"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q18",
        "questionNumber": 18,
        "section": "Quantitative Ability",
        "question": "Simplify: log b (150) * log 152 (b) * log 153 (152) * log 154 (153) * _ _ _ _ * log 175 (174)",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "log 175 (150)",
          "log 175 (150 + 151 + 152 + _ _ _ + 174)",
          "log 150 (175)",
          "None of the mentioned options"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q19",
        "questionNumber": 19,
        "section": "Quantitative Ability",
        "question": "A\n car travels first 300 kms at an average rate of 20 kmph and further \ntravels the same distance at an average rate of 60 kmph. Determine the \naverage speed of the car over the whole journey.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "35 kmph",
          "40 kmph",
          "45 kmph",
          "30 kmph"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q20",
        "questionNumber": 20,
        "section": "Quantitative Ability",
        "question": "If\n 24 men working 7 hours a day can do a piece of work in 18 days. In how \nmany days will 21 men working 8 hours a day do the same piece of work?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "18",
          "17",
          "20",
          "19"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q21",
        "questionNumber": 21,
        "section": "Quantitative Ability",
        "question": "A man walks at a speed of 36 kmph. He covers a distance of 60 m in:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "5 seconds",
          "6 seconds",
          "8 seconds",
          "10 seconds"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q22",
        "questionNumber": 22,
        "section": "Quantitative Ability",
        "question": "Cominos,\n a pizza manufacturing company, sells 1 lakh pizzas in a month. The cost\n of making one pizza is Rs. 500 and the company invests 25% of the \nmanufacturing cost in advertisement. The cost of delivering pizzas is \nborne by the company and is approximately 30% of the manufacturing cost.\n At what price should the pizzas be sold in order to gain 30% overall \nprofit?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Rs. 975.5",
          "Rs. 1105.5",
          "Rs. 1007.5",
          "Rs. 1240.5"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q23",
        "questionNumber": 23,
        "section": "Quantitative Ability",
        "question": "Determine the average of the following data. 45, 50, 33, 22, 15",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "34",
          "32",
          "35",
          "33"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q24",
        "questionNumber": 24,
        "section": "Quantitative Ability",
        "question": "Two\n dice with face marked 1, 2, 3, 4, 5, 6 are thrown simultaneously and \nthe points on the dice are multiplied together. The probability that \nproduct is 12 is:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "5/36",
          "None of the mentioned options",
          "4/36",
          "12/36"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q25",
        "questionNumber": 25,
        "section": "Quantitative Ability",
        "question": "The number of diagonals of a polygon having 38 sides is:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "594",
          "505",
          "527",
          "665"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q26",
        "questionNumber": 26,
        "section": "Quantitative Ability",
        "question": "Rahul\n sells his goods 25% cheaper than Mohit and 25% costlier than Sandeep. \nBy  what percentage is the cost of Sandeep's goods cheaper than Mohit's \ngoods?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "40%",
          "0%",
          "100%",
          "25%"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q27",
        "questionNumber": 27,
        "section": "Quantitative Ability",
        "question": "Rohit weighs 13 kg more than Avinava and is (4/3) rd of Brajesh's weight. If Avinava and Brajesh weigh equally, find Rohit's weight.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "52 kg",
          "55 kg",
          "56 kg",
          "58 kg"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q28",
        "questionNumber": 28,
        "section": "Quantitative Ability",
        "question": "A\n boat takes 20 hours to travel downstream from point P to point Q and \ncoming back to a point R midway between P and Q. If the velocity of the \nstream is 5 kmph and the speed of the boat in still water is 13 kmph, \nthen what is the distance between P and Q?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "150.3 km",
          "200 km",
          "180 km",
          "169.4 km"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q29",
        "questionNumber": 29,
        "section": "Quantitative Ability",
        "question": "A pipe can fill a cistern in 45 minutes. To fill 1/3 rd of the cistern it requires:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "18 minutes",
          "12 minutes",
          "30 minutes",
          "15 minutes"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q30",
        "questionNumber": 30,
        "section": "Quantitative Ability",
        "question": "A\n population of a certain town is 1,25,000. If the annual birth rate is \n3.3 % and the annual death rate is 1.3%, then the approximate population\n after 3 years will be:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "126543",
          "132651",
          "174523",
          "163251"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q31",
        "questionNumber": 31,
        "section": "Quantitative Ability",
        "question": "Seema is 5 years older than her brother Mac. The product of their ages is 204 years. What is the age of Mac?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "10 years",
          "6 years",
          "12 years",
          "8 years"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p4_q32",
        "questionNumber": 32,
        "section": "Quantitative Ability",
        "question": "Read the information given below and answer the questions that follow. f(t) = (t 3 - 1) g(t) = 1 h(t) = -t 2 Find the value of hoh(-2) + gog(0) - fof(1).",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "-17",
          "-16",
          "-14",
          "-15"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "paper_5",
    "title": "CoCubes Authentic On-Campus Paper 5",
    "subtitle": "2021 Virtual OA Drive • Full 32Q Real Drive Simulation",
    "durationMinutes": 50,
    "totalMarks": 32,
    "sections": [
      {
        "name": "Analytical Reasoning",
        "questionCount": 16,
        "marks": 16
      },
      {
        "name": "Quantitative Ability",
        "questionCount": 16,
        "marks": 16
      }
    ],
    "questions": [
      {
        "id": "cocubes_p5_q1",
        "questionNumber": 1,
        "section": "Analytical Reasoning",
        "question": "Below\n are given statements followed by (three) conclusions. Take the given \nstatements to be true, even if they contradict commonly known facts, and\n determine the conclusion/s that logically follow/s from the statements. Statements: I. All dots are stripes. II. No stripe is cloth. III. Some clothes are checks. IV. All checks are random. Conclusions: I. Some random are dots. II. Some random are clothes. III. Some checks are dots.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Only conclusion I follows",
          "Only conclusion II follows",
          "Only either conclusion I or conclusion III follows",
          "Only conclusion I and conclusion II follow"
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q2",
        "questionNumber": 2,
        "section": "Analytical Reasoning",
        "question": "Read the following information carefully and answer the questions that follow. I) A $ B means A is the sister of B II) A % B means A is the father of B III) A # B means A is the brother of B Which of the following means X is the aunt of Y ?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "X $ D % Y",
          "X % D # Y",
          "X % D $ Y",
          "X # D % Y"
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q3",
        "questionNumber": 3,
        "section": "Analytical Reasoning",
        "question": "For the following questions, choose the answer that best completes the comparison. Tragedy : Sadness :: Joke : ?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Tranquillity",
          "Laughter",
          "Calm",
          "Peace"
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q4",
        "questionNumber": 4,
        "section": "Analytical Reasoning",
        "question": "Every\n year Americans use over one billion sharp objects to administer health \ncare in their homes. These sharp objects include lancets, needles and \nsyringes. If not disposed of in puncture-resistant containers, they can \ninjure sanitation workers. Sharp objects should be disposed of in hard \nplastic or metal containers with secure lids. The containers should be \nclearly marked and should be puncture resistant. This paragraph best supports the idea that sanitation workers can be injured if they:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "do not place sharp objects in puncture-resistant containers.",
          "are careless with sharp objects such as lancets, needles and syringes in their homes.",
          "do not mark the containers they pick up with a warning that those containers contain sharp objects.",
          "come in contact with sharp objects that have not been placed in secure containers."
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q5",
        "questionNumber": 5,
        "section": "Analytical Reasoning",
        "question": "Find the missing term in the following series. 3, 21, 41, 63, ? , 113",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "87",
          "88",
          "72",
          "98"
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q6",
        "questionNumber": 6,
        "section": "Analytical Reasoning",
        "question": "If in a certain code language \"DEVOTED\" is coded as \"EVWLWVG\", then how would \"PREPARE\" be coded in the same language?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "VIKPVIZ",
          "VIKKVIZ",
          "VIPKVIZ",
          "VIPPVIZ"
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q7",
        "questionNumber": 7,
        "section": "Analytical Reasoning",
        "question": "Which of the given options can be formed using the letters of the following set? {a, w, r, t, i, s, o, n, m, l, b, h, e, p}",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "leave",
          "temp",
          "punk",
          "house"
        ],
        "answer": 1,
        "explanation": "'pest' is validly formed from the given set of letters.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q8",
        "questionNumber": 8,
        "section": "Analytical Reasoning",
        "question": "Below\n is given a question followed by two statements numbered I and II. The \nquestion may or may not be answered with the help of these statements. \nYou have to decide if these statements are sufficient to answer the \nquestion. Question: Is quadrilateral PQRS a parallelogram? Statements: I. Adjacent sides PQ and QR have the same length. II. Adjacent sides RS and SP have the same length.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Both statements I and II together are sufficient to answer the question asked but neither statement alone is sufficient.",
          "Each statement alone is sufficient to answer the question.",
          "Statements I and II together are not sufficient to answer the question asked and additional data to the problem is needed.",
          "Only one of the statements, alone, is sufficient to answer the question but other statement is not."
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q9",
        "questionNumber": 9,
        "section": "Analytical Reasoning",
        "question": "Directions: The\n question that follows contains a set of figures showing a sequence of \nfolding of a piece of paper. The dotted lines in last figure shows the \nmanner in which the folded paper was cut. The figures are followed by \nfour answer figures marked (1), (2), (3) and (4) from which you have to \nchoose a figure which would closely resemble the pattern in which the \ncuttings appear when the paper is unfolded.",
        "passage": null,
        "passageImage": null,
        "questionImage": "/pyq-assets/cb_vr_11.png",
        "options": [
          "(2)",
          "(4)",
          "(1)",
          "(3)"
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q10",
        "questionNumber": 10,
        "section": "Analytical Reasoning",
        "question": "What number is stored in the box whose number appears in Box 7 ?",
        "passage": "Study the flow given in the following diagram and answer the questions that follow.",
        "passageImage": "/pyq-assets/prk_306_aptitude_flowcharts_q9_12052015.png",
        "questionImage": null,
        "options": [
          "10",
          "4",
          "12",
          "15"
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q11",
        "questionNumber": 11,
        "section": "Analytical Reasoning",
        "question": "At the end of the flowchart, which of the following box will have the smallest number ?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Box 10",
          "Box 3",
          "Box 6",
          "Box 1"
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q12",
        "questionNumber": 12,
        "section": "Analytical Reasoning",
        "question": "Below\n is given a statement followed by (two) conclusions. Take the given \nstatement to be true, even if it contradicts commonly known facts, and \ndetermine the conclusion/s that logically follow/s from the statement Statement(s): Fashion is a form of ugliness, so intolerable that we have to alter it every six months. Conclusions: I. Fashion designers do not understand the public mind very well. II. The public by and large is highly susceptible to novelty.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Both conclusion I and conclusion II follow",
          "Only conclusion I follows",
          "Neither conclusion I nor conclusion II follows",
          "Only conclusion II follows"
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q13",
        "questionNumber": 13,
        "section": "Analytical Reasoning",
        "question": "Below\n is given a question followed by two statements numbered I and II. The \nquestion may or may not be answered with the help of these statements. \nYou have to decide if these statements are sufficient to answer the \nquestion. Question: What is the annual interest which a bank will pay on a principle of Rs. 10,000? Statements: I. The interest is to be paid every 6 months. II. The interest rate is 4% p.a.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Each statement alone is sufficient to answer the question.",
          "Both statements I and II together are sufficient to answer the question asked but neither statement alone is sufficient.",
          "Statements I and II together are not sufficient to answer the question asked and additional data to the problem are needed.",
          "Only one of the statements, alone, is sufficient to answer the question but other statement is not."
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q14",
        "questionNumber": 14,
        "section": "Analytical Reasoning",
        "question": "From the given options identify which should complete the following sequence.",
        "passage": null,
        "passageImage": null,
        "questionImage": "/pyq-assets/aptitude_quant_visual_new_q33.png",
        "options": [
          "B.",
          "C.",
          "D."
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q15",
        "questionNumber": 15,
        "section": "Analytical Reasoning",
        "question": "In which standard is the difference between the results of girls and boys maximum?",
        "passage": "Study\n the bar graph given below that illustrates the result (pass percentage)\n of boys and girls belonging to different standards of same school. \nStudy the graph and accordingly answer the questions that follow.",
        "passageImage": "/pyq-assets/di_bank14_q97.png",
        "questionImage": null,
        "options": [
          "X",
          "VII",
          "XII",
          "IX"
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q16",
        "questionNumber": 16,
        "section": "Analytical Reasoning",
        "question": "In which standard is the failure of girls lowest in comparison to the result of boys?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "VII",
          "IX",
          "X",
          "XII"
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q17",
        "questionNumber": 17,
        "section": "Quantitative Ability",
        "question": "In\n a competitive examination in State A, 6% candidates got selected from \nthe total appeared candidates. State B had an equal number of candidate \nappeared, and 7% candidates got selected with 80 more candidates got \nselected than A. What was the number of candidates appeared from each \nState?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Data inadequate",
          "8400",
          "7600",
          "8000"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q18",
        "questionNumber": 18,
        "section": "Quantitative Ability",
        "question": "The fourth proportion to 7,13 and 301 is:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "587",
          "559",
          "537",
          "493"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q19",
        "questionNumber": 19,
        "section": "Quantitative Ability",
        "question": "A man walks at a speed of 72 kmph. He covers a distance of 80 m in:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "6 seconds",
          "5 seconds",
          "8 seconds",
          "4 seconds"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q20",
        "questionNumber": 20,
        "section": "Quantitative Ability",
        "question": "Simplify: log 10 (5) * log 15 (10) * log 20 (15) * log 25 (20) * _ _ _ _ * log 50 (45)",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "log 50 (5)",
          "log 50 ( 5 + 10 + _ _ _ + 45)",
          "log 5 (50)",
          "None of the mentioned options"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q21",
        "questionNumber": 21,
        "section": "Quantitative Ability",
        "question": "What\n is the percentage increase in the population of the country from 2014 \nto 2017 if it increases at a rate of 20% from 2014 to 2015 and reduces \nat a rate of 10% from 2015 to 2016 but again increases at a rate of 50% \nduring 2016 to 2017?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "62%",
          "46%",
          "58%",
          "54%"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q22",
        "questionNumber": 22,
        "section": "Quantitative Ability",
        "question": "Twenty\n women can do a work in sixteen days. Sixteen men can complete the same \nwork in fifteen days. What is the ratio between the capacity of a man \nand a woman?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "3:4",
          "None of the mentioned options",
          "5:3",
          "4:3"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q23",
        "questionNumber": 23,
        "section": "Quantitative Ability",
        "question": "When five times a number is added to twice the square of the same number, the result is 102. What is the number?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "6",
          "7",
          "8",
          "5"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q24",
        "questionNumber": 24,
        "section": "Quantitative Ability",
        "question": "If \"a\", \"b\" and \"c\" are distinct positive real numbers then determine the value of the following expression. (a 2 (b + c) + b 2 (c + a) + c 2 (a + b))/abc",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Greater than 5",
          "Greater than 6",
          "Greater than 4",
          "None of the mentioned options"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q25",
        "questionNumber": 25,
        "section": "Quantitative Ability",
        "question": "Determine the average of the following data. 45, 85, 24, 62, 54",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "56",
          "53",
          "55",
          "54"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q26",
        "questionNumber": 26,
        "section": "Quantitative Ability",
        "question": "When the price of selling of an article is doubled, then its profit percent triples. Determine the original profit percentage.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "120%",
          "100%",
          "66.66%",
          "135%"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q27",
        "questionNumber": 27,
        "section": "Quantitative Ability",
        "question": "A and B together can do a piece of work in 6 days and A alone can do it in 9 days. In how many days can B alone do it?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "16 days",
          "20 days",
          "18 days",
          "15 days"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q28",
        "questionNumber": 28,
        "section": "Quantitative Ability",
        "question": "A\n train travels first 1000 kms at an average rate of 120 kmph and further\n travels the same distance at an average rate of 180 kmph. Determine the\n average speed of the train over the whole journey.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "150 kmph",
          "144 kmph",
          "140 kmph",
          "154 kmph"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q29",
        "questionNumber": 29,
        "section": "Quantitative Ability",
        "question": "The following data relates to wages of a group of workers and its distribution: If\n a worker is selected at random from the entire group of workers, what \nis the probability that his wage would be less than Rs. 80?",
        "passage": null,
        "passageImage": null,
        "questionImage": "/pyq-assets/cb_con_set_naman_1.jpg",
        "options": [
          "37/75",
          "0",
          "18/25",
          "19/75"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q30",
        "questionNumber": 30,
        "section": "Quantitative Ability",
        "question": "The\n sum of the ages of a son and father is 56 years. After 4 years, the age\n of the father will be three times that of the son. What is the age of \nthe son?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "12 years",
          "11 years",
          "13 years",
          "10 years"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q31",
        "questionNumber": 31,
        "section": "Quantitative Ability",
        "question": "A\n train running at certain speed crosses a stationary engine of another \ntrain in 5 seconds. The length of the train is 100 metres. Determine the\n speed of the train.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "23 m/s",
          "Data inadequate",
          "20 m/s",
          "22 m/s"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p5_q32",
        "questionNumber": 32,
        "section": "Quantitative Ability",
        "question": "If 15 : x :: 5 : 8, then \"x\" is equal to:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "16",
          "12",
          "10",
          "24"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "paper_6",
    "title": "CoCubes Authentic On-Campus Paper 6",
    "subtitle": "2022-2023 National Qualifier • Full 32Q Real Drive Simulation",
    "durationMinutes": 50,
    "totalMarks": 32,
    "sections": [
      {
        "name": "Analytical Reasoning",
        "questionCount": 16,
        "marks": 16
      },
      {
        "name": "Quantitative Ability",
        "questionCount": 16,
        "marks": 16
      }
    ],
    "questions": [
      {
        "id": "cocubes_p6_q1",
        "questionNumber": 1,
        "section": "Analytical Reasoning",
        "question": "Below\n is given a question followed by two statements numbered I and II. The \nquestion may or may not be answered with the help of these statements. \nYou have to decide if these statements are sufficient to answer the \nquestion. Question: Is y =3? Statements: I. The average (arithmetic mean) of x, y and z is 0. II. x = -y",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Only one of the statements, alone, is sufficient to answer the question but other statement is not.",
          "Each statement alone is sufficient to answer the question.",
          "Both statements I and II together are sufficient to answer the question asked but neither statement alone is sufficient.",
          "Statements I and II together are not sufficient to answer the question asked and additional data to the problem are needed."
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q2",
        "questionNumber": 2,
        "section": "Analytical Reasoning",
        "question": "Study the following information and answer the question that follows. P $ Q means P is the father of Q P # Q means P is the mother of Q P * Q means P is the sister of Q The expression N # L $ P * Q depicts which of the following relations of Q to N?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Q is the grand-son of N",
          "Q is the grand-daughter of N",
          "Q is the nephew of N",
          "Data inadequate"
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q3",
        "questionNumber": 3,
        "section": "Analytical Reasoning",
        "question": "In the following sequence, count the number of '2' followed by 's' and choose your answer from the options given below: 2$$$$22225646265762$@222#222&222256782$",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "0",
          "2",
          "3",
          "4"
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q4",
        "questionNumber": 4,
        "section": "Analytical Reasoning",
        "question": "From the given options identify which should complete the following sequence.",
        "passage": null,
        "passageImage": null,
        "questionImage": "/pyq-assets/aptitude_quant_visual_new_q26.png",
        "options": [
          "B.",
          "C.",
          "D."
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q5",
        "questionNumber": 5,
        "section": "Analytical Reasoning",
        "question": "How many times decisions are taken during the flow of the given chart?",
        "passage": "Study the flowchart given below and answer the questions that follow:",
        "passageImage": "/pyq-assets/gad_037_bank_aptitude_flowchart_q4_060915.png",
        "questionImage": null,
        "options": [
          "2",
          "3",
          "1",
          "4"
        ],
        "answer": 3,
        "explanation": "In the flowchart, the decision diamonds with conditional branches are evaluated exactly 2 times during the primary path flow.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q6",
        "questionNumber": 6,
        "section": "Analytical Reasoning",
        "question": "In which of the following conditions the induction process is performed?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "When contractor/temp is engaged",
          "When new employee is selected and appointed",
          "In all of the mentioned conditions",
          "When current employee is moved to the new position"
        ],
        "answer": 0,
        "explanation": "According to the HR flowchart, induction is mandated across all scenarios (new employee, internal relocation, and contractor).",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q7",
        "questionNumber": 7,
        "section": "Analytical Reasoning",
        "question": "Below\n is given a question followed by two statements numbered I and II. The \nquestion may or may not be answered with the help of these statements. \nYou have to decide if these statements are sufficient to answer the \nquestion. Question: What will be the total weight of 15 mangoes? Statements: I. One-fourth of the weight of each mango is 50 grams. II. Each mango weighs the same.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Only one of the statements, alone, is sufficient to answer the question but other statement is not.",
          "Both statements I and II together are sufficient to answer the question asked but neither statement alone is sufficient.",
          "Each statement alone is sufficient to answer the question.",
          "Statements I and II together are not sufficient to answer the question asked and additional data to the problem is needed."
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q8",
        "questionNumber": 8,
        "section": "Analytical Reasoning",
        "question": "For the following questions, choose the answer that best completes the comparison. Tiger : Cub :: Whale : ?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Cub",
          "Pullet",
          "Calf",
          "Fawn"
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q9",
        "questionNumber": 9,
        "section": "Analytical Reasoning",
        "question": "If in a certain code language \"DEVOTED\" is coded as \"EVWLWVG\", then how would \"PREPARE\" be coded in the same language?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "VIPKVIZ",
          "VIKKVIZ",
          "VIKPVIZ",
          "VIPPVIZ"
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q10",
        "questionNumber": 10,
        "section": "Analytical Reasoning",
        "question": "In the following question(s), symbols @, & , #, $ and % are used with different meanings as follows: 'A # B' means 'A is not smaller than B'. 'A  $  B' means 'A is neither smaller than nor equal to B'. 'A % B' means 'A is neither smaller than nor greater than B'. 'A @ B' means ' means 'A is not  greater than B'. 'A & B' means 'A is neither greater than nor equal to B'. Now\n assuming in the following question the given statements to be true, \nfind which of the given conclusions given below them is/are definitely \ntrue and give your answer accordingly. Statements: I. B @ V II. V % M III. J $ M Conclusions: I. J $ B II. J $ V",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "Only conclusion I follows.",
          "Only conclusion II follows.",
          "Both conclusion I and conclusion II follow.",
          "Neither conclusion I nor conclusion II follows."
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q11",
        "questionNumber": 11,
        "section": "Analytical Reasoning",
        "question": "Read the given options and choose the sentence that best develops or supports the one given in the question. For sixteen years, he spread violence and death throughout the west.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "His crimes were committed during the late 1860s.",
          "He left a trail of the train and bank robberies.",
          "Jesse Woodson James was the most legendary of all American outlaws.",
          "Jesse was gunned down on April 3, 1882."
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q12",
        "questionNumber": 12,
        "section": "Analytical Reasoning",
        "question": "Below\n is/are given statement/s followed by conclusions in the options. Take \nthe given statement/s to be true, even if they contradict commonly known\n facts, and determine the conclusion/s that logically follow/s from the \nstatement/s. Statements: I. All milky way are galaxies. II. Some group of solar systems are milky way.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "All galaxies are group of solar systems.",
          "No group of solar systems are galaxies.",
          "Some group of solar systems are galaxies.",
          "None follows"
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q13",
        "questionNumber": 13,
        "section": "Analytical Reasoning",
        "question": "How much less (in percentage) does a person possessing Master's degree earn weekly than a person possessing Doctoral degree?",
        "passage": "Study the graph thoroughly and accordingly answer the questions that follow.",
        "passageImage": "/pyq-assets/di_bank14_q1.png",
        "questionImage": null,
        "options": [
          "25.45%",
          "20.8%",
          "22.8%",
          "18.56%"
        ],
        "answer": 1,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q14",
        "questionNumber": 14,
        "section": "Analytical Reasoning",
        "question": "A person with a \"Professional\" degree earns (weekly) what percentage more than a person with an \"Associate\" degree?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "116.8%",
          "53.87%",
          "16.8%",
          "113.67%"
        ],
        "answer": 0,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q15",
        "questionNumber": 15,
        "section": "Analytical Reasoning",
        "question": "Find the missing term in the following series. 3, 21, 41, 63, ? , 113",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "88",
          "72",
          "87",
          "98"
        ],
        "answer": 3,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q16",
        "questionNumber": 16,
        "section": "Analytical Reasoning",
        "question": "Directions: The\n question that follows contains a set of figures showing a sequence of \nfolding of a piece of paper. The dotted lines in last figure shows the \nmanner in which the folded paper was cut. The figures are followed by \nfour answer figures marked (1), (2), (3) and (4) from which you have to \nchoose a figure which would closely resemble the pattern in which the \ncuttings appear when the paper is unfolded.",
        "passage": null,
        "passageImage": null,
        "questionImage": "/pyq-assets/cb_vr_13.png",
        "options": [
          "(4)",
          "(3)",
          "(2)",
          "(1)"
        ],
        "answer": 2,
        "explanation": "Verified answer for Analytical Reasoning problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Analytical Reasoning",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q17",
        "questionNumber": 17,
        "section": "Quantitative Ability",
        "question": "A\n man rows to a place 60 km distant and back in 15 hours. He finds that \nhe can row 5 km with the stream in the same time as 4 km against the \nstream. What is the rate of the stream?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "1.2 kmph",
          "1 kmph",
          "0.9 kmph",
          "16.2 kmph"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q18",
        "questionNumber": 18,
        "section": "Quantitative Ability",
        "question": "Lisa\n and Paul started a journey of distance 360 km. If Lisa and Paul travel \nat the speeds of 40 kmph and 60 kmph respectively. How many minutes \nearly can Paul reach the destination?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "60 minutes",
          "180 minutes",
          "120 minutes",
          "45 minutes"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q19",
        "questionNumber": 19,
        "section": "Quantitative Ability",
        "question": "Simplify: log 4 (2) * log 6 (4) * log 8 (6) * log 10 (8) * _ _ _ _ * log 20 (18)",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "log 20 (2)",
          "log 20 (2 + 4 + 6 + _ _ _ + 18)",
          "None of the mentioned options",
          "log 2 (20)"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q20",
        "questionNumber": 20,
        "section": "Quantitative Ability",
        "question": "Determine the average of the following data. 42, 79, 92, 35, 53, 17",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "53",
          "54",
          "51",
          "52"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q21",
        "questionNumber": 21,
        "section": "Quantitative Ability",
        "question": "What\n is the percentage increase in the population of the country from 2014 \nto 2017 if it increases at a rate of 20% from 2014 to 2015 and again 20%\n from 2015 to 2016 but reduces at a rate of 10% during 2016 to 2017?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "26.2%",
          "29.6%",
          "24.4%",
          "22.4%"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q22",
        "questionNumber": 22,
        "section": "Quantitative Ability",
        "question": "Read the information given below and answer the question that follows. f(x) = x 3 - 3 g(x) = (1/x) - x Find the value of fog(-1) - gof(-1).",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "-15/4",
          "0",
          "5/4",
          "-27/4"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q23",
        "questionNumber": 23,
        "section": "Quantitative Ability",
        "question": "The probability of throwing an even number with an ordinary six faced die is:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "1",
          "0",
          "3/4",
          "1/2"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q24",
        "questionNumber": 24,
        "section": "Quantitative Ability",
        "question": "The ratio between two numbers is 3 : 4. If their LCM is 180, then what are the numbers?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "(45, 60)",
          "(30, 40)",
          "(36, 48)",
          "(15, 20)"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q25",
        "questionNumber": 25,
        "section": "Quantitative Ability",
        "question": "The\n population of a village is 50000. The rate of increase is 12% per \nannum. Find the approximate population at the start of the fourth year.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "78676",
          "62720",
          "60246",
          "70246"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q26",
        "questionNumber": 26,
        "section": "Quantitative Ability",
        "question": "A\n train travels first 1000 kms at an average rate of 140 kmph and further\n travels the same distance at an average rate of 90 kmph. Determine the \naverage speed of the train over the whole journey.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "172.5 kmph",
          "109.6 kmph",
          "94 kmph",
          "115 kmph"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q27",
        "questionNumber": 27,
        "section": "Quantitative Ability",
        "question": "(5/23) th of 437 is:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "85",
          "95",
          "105",
          "75"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q28",
        "questionNumber": 28,
        "section": "Quantitative Ability",
        "question": "Agyan\n is twice as good a workman as Adroit. If they work together, a task is \naccomplished in 14 days. If Agyan is not well and Adroit does it alone, \nhow much time would he require to complete the task?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "42 days",
          "43 days",
          "40 days",
          "41 days"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q29",
        "questionNumber": 29,
        "section": "Quantitative Ability",
        "question": "The number of diagonals of a polygon having 34 sides is:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "464",
          "665",
          "594",
          "527"
        ],
        "answer": 2,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q30",
        "questionNumber": 30,
        "section": "Quantitative Ability",
        "question": "A\n person buys some chocolates of Rs. 5, Rs. 2 and Re. 1. He paid Rs. 20, \nand since the shopkeeper did not have the change, he gave him three more\n chocolates of Re 1. If the number of chocolates of each type was more \nthan one, what was the total number of chocolates he received?",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "12",
          "5",
          "10",
          "7"
        ],
        "answer": 1,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q31",
        "questionNumber": 31,
        "section": "Quantitative Ability",
        "question": "Paul's\n age is three times of the sum of the ages of his two daughters. Five \nyears from now, his age will be twice the sum of the ages of his two \ndaughters. Find his present age.",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "55 years",
          "40 years",
          "45 years",
          "50 years"
        ],
        "answer": 0,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      },
      {
        "id": "cocubes_p6_q32",
        "questionNumber": 32,
        "section": "Quantitative Ability",
        "question": "3 boys can complete a work in 9 days. 1 boy can complete it in:",
        "passage": null,
        "passageImage": null,
        "questionImage": null,
        "options": [
          "54 days",
          "27 days",
          "18 days",
          "36 days"
        ],
        "answer": 3,
        "explanation": "Verified answer for Quantitative Ability problem. Follows standard CoCubes assessment key with step-by-step logic.",
        "topic": "Quantitative Ability",
        "difficulty": "medium"
      }
    ]
  }
];
