import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { mockService } from '../services/mockService';
import { getQuestions } from '@/services/questionService';
import { pseudocodeService } from '@/services/pseudocodeService';
import { Button } from '../components/ui/button';
import { 
  Clock, CheckSquare, Square, Flag, AlertTriangle, BookOpen, 
  Loader2, LayoutGrid, X, ChevronRight, ChevronLeft, Code, 
  Sparkles, Brain, ShieldCheck, CheckCircle2, Play, Terminal, 
  ArrowRight, Award, Layers, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import { FALLBACK_TECHNICAL_QUESTIONS } from '../data/technicalFallback';
import { FALLBACK_PSEUDOCODE_QUESTIONS } from '../data/pseudocodeFallback';
import { FALLBACK_COMMUNICATION_QUESTIONS } from '../data/communicationFallback';

// Section Definitions for 2026 Traditional Pattern (Aon CoCubes Full OA)
export interface SectionMeta {
  id: string;
  name: string;
  category: 'technical' | 'pseudocode' | 'communication' | 'cognitive' | 'coding';
  questionCount: number;
  durationMinutes: number;
  cutoffPercentage: number;
  description: string;
  icon: any;
}

export const OA_SECTIONS: SectionMeta[] = [
  {
    id: 'technical-mcq',
    name: 'Technical MCQs',
    category: 'technical',
    questionCount: 20,
    durationMinutes: 20,
    cutoffPercentage: 70,
    description: 'OOPs, DBMS, Operating Systems, Computer Networks & Cloud fundamentals.',
    icon: ShieldCheck
  },
  {
    id: 'pseudocode',
    name: 'Pseudocode Tracing',
    category: 'pseudocode',
    questionCount: 20,
    durationMinutes: 25,
    cutoffPercentage: 70,
    description: 'Bitwise logic, recursion tracing, nested loops, array modifications.',
    icon: Code
  },
  {
    id: 'communication',
    name: 'English Verbal',
    category: 'communication',
    questionCount: 30,
    durationMinutes: 30,
    cutoffPercentage: 60,
    description: 'Grammar, sentence correction, reading comprehension, vocabulary.',
    icon: BookOpen
  },
  {
    id: 'cognitive',
    name: 'Cognitive Games',
    category: 'cognitive',
    questionCount: 4,
    durationMinutes: 25,
    cutoffPercentage: 60,
    description: 'GeoSudo, Grid Challenge, Switch Challenge, Motion Challenge.',
    icon: Brain
  },
  {
    id: 'coding',
    name: 'Coding Round',
    category: 'coding',
    questionCount: 2,
    durationMinutes: 45,
    cutoffPercentage: 50,
    description: 'Two algorithmic programming challenges with multi-language compiler.',
    icon: Terminal
  }
];

// Curated Cognitive Mini-Games for Section 4
const COGNITIVE_GAMES_DATA = [
  {
    _id: 'cog_1',
    title: 'GeoSudo Challenge',
    type: 'Deductive Logic',
    timeLimit: '6 Mins',
    skills: ['Spatial Elimination', 'Latin Square Deduction'],
    description: 'Place geometric shapes into 4x4 and 5x5 grids such that each symbol appears exactly once in each row and column.',
    instructions: '1. Examine the row and column constraints.\n2. Deduce missing symbols using process of elimination.\n3. Complete the grid before the step countdown timer expires.',
    options: ['Completed with >85% Accuracy (High Velocity)', 'Completed with 70-85% Accuracy (Benchmark Passed)', 'Completed with <70% Accuracy (Borderline)', 'Incomplete / Skipped'],
    answer: 0,
    explanation: 'GeoSudo evaluates deductive non-verbal logic under timed constraints.'
  },
  {
    _id: 'cog_2',
    title: 'Grid Challenge',
    type: 'Working Memory',
    timeLimit: '6 Mins',
    skills: ['Working Memory Capacity', 'Dual-Task Executive Attention'],
    description: 'Memorize successive dot coordinates on dynamic grids while solving intermediate symmetrical shape verification puzzles.',
    instructions: '1. Memorize the illuminated dot positions sequentially.\n2. Answer the symmetry verification task promptly.\n3. Recall and reproduce the dot sequence in exact chronological order.',
    options: ['Completed with >85% Accuracy (High Velocity)', 'Completed with 70-85% Accuracy (Benchmark Passed)', 'Completed with <70% Accuracy (Borderline)', 'Incomplete / Skipped'],
    answer: 0,
    explanation: 'Grid Challenge measures dual-task working memory capacity and visual-spatial recall.'
  },
  {
    _id: 'cog_3',
    title: 'Switch Challenge',
    type: 'Inductive Logic',
    timeLimit: '6 Mins',
    skills: ['Inverse Mapping', 'Transposition Operators'],
    description: 'Deduce the 4-digit transposition switch code translating input shapes into output sequence order.',
    instructions: '1. Compare input shape arrangement with output order.\n2. Test operator permutations to find the matching 4-digit transposition switch code.\n3. Validate the sequence across secondary distractor options.',
    options: ['Completed with >85% Accuracy (High Velocity)', 'Completed with 70-85% Accuracy (Benchmark Passed)', 'Completed with <70% Accuracy (Borderline)', 'Incomplete / Skipped'],
    answer: 0,
    explanation: 'Switch Challenge tests rule discovery and algorithmic inductive problem solving.'
  },
  {
    _id: 'cog_4',
    title: 'Motion Challenge',
    type: 'Spatial Planning',
    timeLimit: '6 Mins',
    skills: ['Lookahead Planning', 'Minimum Step Optimization'],
    description: 'Navigate the designated primary block to the target exit port using the minimum number of obstacle moves.',
    instructions: '1. Visualize collision boundaries before moving.\n2. Minimize intermediate displacement steps.\n3. Clear the exit corridor in fewest possible moves.',
    options: ['Completed with >85% Accuracy (High Velocity)', 'Completed with 70-85% Accuracy (Benchmark Passed)', 'Completed with <70% Accuracy (Borderline)', 'Incomplete / Skipped'],
    answer: 0,
    explanation: 'Motion Challenge tests lookahead planning and spatial optimization efficiency.'
  }
];

// Curated Coding Challenges for Section 5
const CODING_PROBLEMS_DATA = [
  {
    _id: 'code_1',
    title: 'Two Sum Target Pair',
    difficulty: 'Medium',
    category: 'Arrays & Two Pointers',
    timeLimit: '20 Mins',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    inputFormat: 'Line 1: N (number of elements)\nLine 2: N space-separated integers\nLine 3: Target sum integer',
    outputFormat: 'Two space-separated 0-based indices in ascending order',
    sampleInput: '4\n2 7 11 15\n9',
    sampleOutput: '0 1',
    options: [
      'Optimal Solution Implemented (O(N) time with Hash Map, all testcases passed)',
      'Partial Solution Implemented (O(N^2) brute force, passed public testcases)',
      'Syntactically correct with minor edge case runtime errors',
      'Incomplete / Unattempted'
    ],
    answer: 0,
    starterCode: {
      python: 'def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []',
      cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (seen.count(comp)) return {seen[comp], i};\n        seen[nums[i]] = i;\n    }\n    return {};\n}',
      java: 'import java.util.*;\n\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (seen.containsKey(comp)) return new int[]{seen.get(comp), i};\n            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}'
    },
    explanation: 'Using a Hash Map gives optimal O(N) time complexity and O(N) space complexity.'
  },
  {
    _id: 'code_2',
    title: 'Subarray with Given Sum',
    difficulty: 'Medium',
    category: 'Sliding Window / Prefix Sum',
    timeLimit: '25 Mins',
    description: 'Given an unsorted array `arr` of non-negative integers and an integer `S`, find a continuous subarray which adds to a given sum `S`.\nReturn the 1-based start and end indices of the first matching subarray.',
    inputFormat: 'Line 1: N S (array size and target sum)\nLine 2: N space-separated integers',
    outputFormat: 'Two space-separated 1-based indices, or -1 if no subarray exists',
    sampleInput: '5 12\n1 2 3 7 5',
    sampleOutput: '2 4',
    options: [
      'Optimal Solution Implemented (O(N) Sliding Window, all testcases passed)',
      'Partial Solution Implemented (O(N^2) nested scan, passed sample tests)',
      'Compile error or incomplete logic',
      'Incomplete / Unattempted'
    ],
    answer: 0,
    starterCode: {
      python: 'def subarraySum(arr, n, s):\n    left = 0\n    curr_sum = 0\n    for right in range(n):\n        curr_sum += arr[right]\n        while curr_sum > s and left < right:\n            curr_sum -= arr[left]\n            left += 1\n        if curr_sum == s:\n            return [left + 1, right + 1]\n    return [-1]',
      cpp: '#include <vector>\nusing namespace std;\n\nvector<int> subarraySum(vector<int>& arr, int n, long long s) {\n    int left = 0;\n    long long curr = 0;\n    for (int right = 0; right < n; right++) {\n        curr += arr[right];\n        while (curr > s && left < right) {\n            curr -= arr[left++];\n        }\n        if (curr == s) return {left + 1, right + 1};\n    }\n    return {-1};\n}',
      java: 'import java.util.*;\n\npublic class Solution {\n    public static ArrayList<Integer> subarraySum(int[] arr, int n, int s) {\n        int left = 0;\n        long sum = 0;\n        for (int right = 0; right < n; right++) {\n            sum += arr[right];\n            while (sum > s && left < right) sum -= arr[left++];\n            if (sum == s) return new ArrayList<>(Arrays.asList(left + 1, right + 1));\n        }\n        return new ArrayList<>(Arrays.asList(-1));\n    }\n}'
    },
    explanation: 'A sliding window maintains running sum with two pointers in O(N) time and O(1) extra space.'
  }
];

function parseReadingQuestion(rawText: string): { passage: string | null; questionText: string } {
  if (!rawText) return { passage: null, questionText: '' };

  const matchExcerpt = rawText.match(/(?:Read the excerpt|Passage|Read the following passage)[:\s]*\n*["“]([\s\S]+?)["”]\s*(?:\n+Question:\s*|\n+Q:\s*|\n+)?([\s\S]*)/i);
  if (matchExcerpt) {
    const passage = matchExcerpt[1].trim();
    const prompt = matchExcerpt[2].replace(/^Question:\s*/i, '').trim();
    return { passage, questionText: prompt || 'Based on the passage above, select the most appropriate option.' };
  }

  const splitQuestion = rawText.split(/\n+Question:\s*/i);
  if (splitQuestion.length > 1) {
    const passage = splitQuestion[0].replace(/^(?:Read the excerpt|Passage)[:\s]*/i, '').trim().replace(/^["“]|["”]$/g, '');
    const prompt = splitQuestion.slice(1).join('\nQuestion: ').trim();
    return { passage, questionText: prompt };
  }

  return { passage: null, questionText: rawText };
}

// Real answer evaluation: Compares candidate's choice with the question's actual answer key
export function evaluateAnswer(q: any, selectedChoice: string): boolean {
  if (!selectedChoice) return false;
  const selClean = selectedChoice.trim().toLowerCase();
  
  // 1. Check numeric / string-numeric answer index pointing into options
  const rawIdx = q.answer !== undefined ? q.answer : q.correctAnswer;
  if (rawIdx !== undefined && rawIdx !== null) {
    const num = Number(rawIdx);
    if (!isNaN(num) && q.options && q.options[num] !== undefined) {
      if (selClean === q.options[num].trim().toLowerCase()) return true;
      if (selClean === String(num)) return true;
    }
  }

  // 2. Direct string equality against answer or correctAnswer
  if (typeof q.correctAnswer === 'string' && selClean === q.correctAnswer.trim().toLowerCase()) {
    return true;
  }
  if (typeof q.answer === 'string' && selClean === q.answer.trim().toLowerCase()) {
    return true;
  }

  return false;
}

export default function MockTestPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Section State
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const currentSection = OA_SECTIONS[currentSectionIndex];

  // Section Question Index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Global answers map: { [questionId]: selectedOptionText }
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reviewMarked, setReviewMarked] = useState<Record<string, boolean>>({});

  // Coding round editor state
  const [codingLanguage, setCodingLanguage] = useState<'python' | 'cpp' | 'java'>('python');

  // Section Transition Modal
  const [transitionModalOpen, setTransitionModalOpen] = useState(false);
  const [mobileMatrixOpen, setMobileMatrixOpen] = useState(false);

  // Overall Timer (165 Mins) & Section Timer
  const [totalTimeLeft, setTotalTimeLeft] = useState(165 * 60);
  const [sectionTimeLeft, setSectionTimeLeft] = useState(currentSection.durationMinutes * 60);

  // Section 1: Technical MCQs (exactly 20 questions)
  const { data: techData } = useQuery({
    queryKey: ['mock-technical-questions'],
    queryFn: async () => {
      try {
        const res = await getQuestions({ category: 'technical', limit: 20 });
        if (res?.data && Array.isArray(res.data) && res.data.length >= 20) {
          return res.data.slice(0, 20);
        }
      } catch (err) {
        console.warn('API error fetching technical questions, using verified fallback:', err);
      }
      return FALLBACK_TECHNICAL_QUESTIONS.slice(0, 20);
    }
  });

  // Section 2: Pseudocode Tracing (exactly 20 questions)
  const { data: pseudoData } = useQuery({
    queryKey: ['mock-pseudocode-questions'],
    queryFn: async () => {
      try {
        const res = await pseudocodeService.getQuestions({ limit: 20 });
        if (res?.questions && Array.isArray(res.questions) && res.questions.length >= 20) {
          return res.questions.slice(0, 20);
        }
      } catch (err) {
        console.warn('API error fetching pseudocode questions, using verified fallback:', err);
      }
      return FALLBACK_PSEUDOCODE_QUESTIONS.slice(0, 20);
    }
  });

  // Section 3: English Communication (exactly 30 questions)
  const { data: commData } = useQuery({
    queryKey: ['mock-communication-questions'],
    queryFn: async () => {
      try {
        const res = await getQuestions({ category: 'communication', limit: 30 });
        if (res?.data && Array.isArray(res.data) && res.data.length >= 30) {
          return res.data.slice(0, 30);
        }
      } catch (err) {
        console.warn('API error fetching communication questions, using verified fallback:', err);
      }
      return FALLBACK_COMMUNICATION_QUESTIONS.slice(0, 30);
    }
  });

  // Current questions for active section
  const currentSectionQuestions = useMemo(() => {
    switch (currentSection.category) {
      case 'technical':
        return (techData && techData.length > 0) ? techData : FALLBACK_TECHNICAL_QUESTIONS.slice(0, 20);
      case 'pseudocode':
        return (pseudoData && pseudoData.length > 0) ? pseudoData : FALLBACK_PSEUDOCODE_QUESTIONS.slice(0, 20);
      case 'communication':
        return (commData && commData.length > 0) ? commData : FALLBACK_COMMUNICATION_QUESTIONS.slice(0, 30);
      case 'cognitive':
        return COGNITIVE_GAMES_DATA;
      case 'coding':
        return CODING_PROBLEMS_DATA;
      default:
        return FALLBACK_TECHNICAL_QUESTIONS.slice(0, 20);
    }
  }, [currentSection.category, techData, pseudoData, commData]);

  // Handle unload prevention
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Update section timer when switching sections
  useEffect(() => {
    setSectionTimeLeft(currentSection.durationMinutes * 60);
    setCurrentQuestionIndex(0);
  }, [currentSectionIndex]);

  // Timers countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitAllSections();
          return 0;
        }
        return prev - 1;
      });

      setSectionTimeLeft((prev) => {
        if (prev <= 1) {
          handleSectionTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSectionIndex]);

  const handleSectionTimeout = () => {
    if (currentSectionIndex < OA_SECTIONS.length - 1) {
      toast.error(`Time elapsed for ${currentSection.name}! Advancing to next section.`);
      setCurrentSectionIndex(prev => prev + 1);
    } else {
      submitAllSections();
    }
  };

  const completeMutation = useMutation({
    mutationFn: (payload: any) => mockService.completeMock(
      id!, 
      payload.answers, 
      payload.timeSpent,
      payload.sectionScores
    ),
    onSuccess: (data) => {
      toast.success('Capgemini Assessment Submitted Successfully');
      if (data) {
        sessionStorage.setItem(`mock_result_${id}`, JSON.stringify(data));
      }
      navigate(`/mocks/result/${id}`);
    },
    onError: (err) => {
      console.warn('Complete mock API returned error, proceeding to result with local session cache:', err);
      navigate(`/mocks/result/${id}`);
    }
  });

  // Calculate section scores and formatted answers
  const compileResults = () => {
    const allQuestions = [
      ...((techData && techData.length > 0) ? techData : FALLBACK_TECHNICAL_QUESTIONS.slice(0, 20)),
      ...((pseudoData && pseudoData.length > 0) ? pseudoData : FALLBACK_PSEUDOCODE_QUESTIONS.slice(0, 20)),
      ...((commData && commData.length > 0) ? commData : FALLBACK_COMMUNICATION_QUESTIONS.slice(0, 30)),
      ...COGNITIVE_GAMES_DATA,
      ...CODING_PROBLEMS_DATA
    ];

    const formattedAnswers = allQuestions.map((q: any) => {
      const selected = answers[q._id] || '';
      const isCorrect = evaluateAnswer(q, selected);
      const correctAnswerText = (typeof q.answer === 'number' && q.options && q.options[q.answer] !== undefined)
        ? q.options[q.answer]
        : (typeof q.correctAnswer === 'string' ? q.correctAnswer : 'Provided in solution');

      return {
        questionId: q._id,
        questionType: q.codeBlock ? 'pseudocode' : (q.starterCode ? 'coding' : 'mcq'),
        selectedAnswer: selected,
        isCorrect: isCorrect,
        timeTaken: 30,
        questionText: q.question || q.title || '',
        correctAnswer: correctAnswerText,
        explanation: q.explanation || ''
      };
    });

    // Compute scores per section
    const sectionScores = OA_SECTIONS.map((sec) => {
      let secQuestions: any[] = [];
      if (sec.category === 'technical') secQuestions = ((techData && techData.length > 0) ? techData : FALLBACK_TECHNICAL_QUESTIONS.slice(0, 20));
      else if (sec.category === 'pseudocode') secQuestions = ((pseudoData && pseudoData.length > 0) ? pseudoData : FALLBACK_PSEUDOCODE_QUESTIONS.slice(0, 20));
      else if (sec.category === 'communication') secQuestions = ((commData && commData.length > 0) ? commData : FALLBACK_COMMUNICATION_QUESTIONS.slice(0, 30));
      else if (sec.category === 'cognitive') secQuestions = COGNITIVE_GAMES_DATA;
      else if (sec.category === 'coding') secQuestions = CODING_PROBLEMS_DATA;

      let correct = 0;
      secQuestions.forEach(q => {
        const userChoice = answers[q._id];
        if (userChoice && evaluateAnswer(q, userChoice)) {
          correct++;
        }
      });

      const total = secQuestions.length;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      const passed = accuracy >= sec.cutoffPercentage;

      return {
        sectionName: sec.name,
        category: sec.category,
        correct,
        total,
        accuracy,
        cutoff: sec.cutoffPercentage,
        passed
      };
    });

    return { formattedAnswers, sectionScores };
  };

  const submitAllSections = () => {
    const { formattedAnswers, sectionScores } = compileResults();
    const totalTimeSpent = (165 * 60) - totalTimeLeft;

    // Cache locally
    const localAttempt = {
      _id: id,
      mockTestId: {
        title: 'Structure A: Aon CoCubes Full OA (2026 Pattern)',
        type: 'full-capgemini',
        totalTimeMinutes: 165
      },
      status: 'completed',
      completedAt: new Date().toISOString(),
      answers: formattedAnswers,
      sectionScores,
      score: formattedAnswers.filter(a => a.isCorrect).length,
      totalQuestions: formattedAnswers.length,
      timeSpent: totalTimeSpent
    };
    sessionStorage.setItem(`mock_result_${id}`, JSON.stringify(localAttempt));

    completeMutation.mutate({
      answers: formattedAnswers,
      timeSpent: totalTimeSpent,
      sectionScores
    });
  };

  const handleNextSectionClick = () => {
    setTransitionModalOpen(true);
  };

  const confirmAdvanceSection = () => {
    setTransitionModalOpen(false);
    if (currentSectionIndex < OA_SECTIONS.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
      toast.success(`Started Section ${currentSectionIndex + 2}: ${OA_SECTIONS[currentSectionIndex + 1].name}`);
    } else {
      submitAllSections();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = currentSectionQuestions[currentQuestionIndex] || currentSectionQuestions[0];
  const isLastQuestionInSection = currentQuestionIndex === currentSectionQuestions.length - 1;
  const isFinalSection = currentSectionIndex === OA_SECTIONS.length - 1;

  // Stats for current section
  const answeredCountInSection = currentSectionQuestions.filter((q: any) => !!answers[q._id]).length;

  return (
    <div className="h-dvh flex flex-col bg-surface-cream text-on-surface fixed inset-0 z-50 overflow-hidden select-none">
      
      {/* Top Bar */}
      <div className="h-14 sm:h-16 border-b border-border-hairline bg-white flex items-center px-3 sm:px-6 justify-between gap-2 shadow-xs shrink-0 z-20">
        
        {/* Left: Mobile Matrix Drawer Trigger & Section Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMatrixOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-cream border border-border-hairline text-xs font-mono font-bold text-secondary cursor-pointer touch-manipulation active:scale-95 shrink-0"
            title="Open Question Matrix"
          >
            <LayoutGrid size={15} />
            <span>{currentQuestionIndex + 1}/{currentSectionQuestions.length}</span>
          </button>

          <div className="hidden sm:flex w-9 h-9 rounded-xl bg-primary-container text-white items-center justify-center font-mono font-bold text-xs shrink-0">
            OA
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-on-surface uppercase tracking-wider truncate">
                Sec {currentSectionIndex + 1}: {currentSection.name}
              </span>
              <span className="hidden md:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-cream border border-border-hairline text-secondary font-bold">
                {currentSection.cutoffPercentage}% Cutoff
              </span>
            </div>
            <p className="hidden sm:block text-[11px] font-mono text-on-surface-variant truncate">
              Aon CoCubes Benchmark • {answeredCountInSection}/{currentSectionQuestions.length} Answered
            </p>
          </div>
        </div>

        {/* Center: Section Navigation Pills (Desktop) */}
        <div className="hidden xl:flex items-center gap-1 bg-surface-cream p-1 rounded-xl border border-border-hairline">
          {OA_SECTIONS.map((sec, sIdx) => {
            const isCurrent = sIdx === currentSectionIndex;
            const isDone = sIdx < currentSectionIndex;
            const Icon = sec.icon;

            return (
              <button
                key={sec.id}
                onClick={() => {
                  setCurrentSectionIndex(sIdx);
                  setCurrentQuestionIndex(0);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  isCurrent 
                    ? 'bg-primary-container text-white shadow-xs' 
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'text-on-surface-variant hover:bg-zinc-200'
                }`}
              >
                {isDone ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Icon className="w-3 h-3" />}
                <span>{sec.name}</span>
                <span className="opacity-70 text-[10px]">({sec.questionCount})</span>
              </button>
            );
          })}
        </div>

        {/* Right: Timers & Submit / Next Section Action */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Section Timer */}
          <div className={`flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-1 rounded-lg border ${
            sectionTimeLeft < 300 
              ? 'bg-red-50 text-red-700 border-red-300 animate-pulse' 
              : 'bg-surface-cream text-secondary border-border-hairline'
          }`}>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>{formatTime(sectionTimeLeft)}</span>
            <span className="hidden md:inline text-[10px] text-on-surface-variant font-normal">sec</span>
          </div>

          {/* Action Button */}
          {isLastQuestionInSection && !isFinalSection ? (
            <Button
              onClick={handleNextSectionClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs px-3 sm:px-4 py-1.5 h-9 shadow-sm cursor-pointer touch-manipulation active:scale-95"
            >
              <span>Next Sec</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={submitAllSections} 
              disabled={completeMutation.isPending} 
              className="bg-primary-container hover:bg-black text-white font-bold rounded-xl text-xs px-3 sm:px-4 py-1.5 h-9 shadow-sm cursor-pointer touch-manipulation active:scale-95"
            >
              {completeMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
              <span>Finish OA</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Desktop Left Sidebar: Question Matrix */}
        <div className="hidden lg:flex w-64 border-r border-border-hairline bg-white flex-col shadow-xs shrink-0">
          
          <div className="p-4 border-b border-border-hairline flex items-center justify-between">
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface">
                {currentSection.name}
              </h3>
              <p className="text-[11px] font-mono text-on-surface-variant">
                {currentSection.questionCount} Questions • {currentSection.durationMinutes}m
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-secondary-fixed text-secondary px-2 py-0.5 rounded-full">
              Sec {currentSectionIndex + 1}/{OA_SECTIONS.length}
            </span>
          </div>

          {/* Matrix Grid */}
          <div className="p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-4 gap-2">
              {currentSectionQuestions.map((q: any, idx: number) => {
                let stateClass = 'bg-surface-cream text-zinc-600 border-border-hairline hover:bg-zinc-200';
                if (answers[q._id]) stateClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
                if (reviewMarked[q._id]) stateClass = 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
                if (currentQuestionIndex === idx) stateClass = 'bg-primary-container text-white border-black font-bold shadow-xs';

                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-10 w-full rounded-xl border flex items-center justify-center text-xs font-mono font-semibold transition-all cursor-pointer ${stateClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Legend */}
          <div className="p-4 border-t border-border-hairline text-xs space-y-2 text-on-surface-variant font-mono">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-300"></div> Answered</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-surface-cream border border-border-hairline"></div> Unvisited</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-50 border border-amber-300"></div> Marked Review</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary-container border border-black"></div> Active Item</div>
          </div>
        </div>

        {/* Mobile Slide-Up Drawer: Question Matrix */}
        {mobileMatrixOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
              onClick={() => setMobileMatrixOpen(false)} 
            />
            <div className="relative bg-white rounded-t-3xl border-t border-border-hairline shadow-2xl p-5 max-h-[75vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-200">
              
              <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
                <div>
                  <div className="flex items-center gap-2">
                    <LayoutGrid size={18} className="text-secondary" />
                    <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-on-surface">
                      {currentSection.name}
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-on-surface-variant mt-0.5">
                    Section {currentSectionIndex + 1} of 5 • {answeredCountInSection} of {currentSectionQuestions.length} completed
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMatrixOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-surface-cream text-muted cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Matrix Grid */}
              <div className="py-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-5 gap-2.5">
                  {currentSectionQuestions.map((q: any, idx: number) => {
                    let stateClass = 'bg-surface-cream text-zinc-600 border-border-hairline';
                    if (answers[q._id]) stateClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
                    if (reviewMarked[q._id]) stateClass = 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
                    if (currentQuestionIndex === idx) stateClass = 'bg-primary-container text-white border-black font-bold shadow-xs';

                    return (
                      <button
                        key={q._id}
                        onClick={() => {
                          setCurrentQuestionIndex(idx);
                          setMobileMatrixOpen(false);
                        }}
                        className={`h-11 w-full rounded-xl border flex items-center justify-center text-xs font-mono font-semibold transition-all cursor-pointer touch-manipulation active:scale-95 ${stateClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section Jump Bar in Drawer */}
              <div className="pt-3 border-t border-border-hairline">
                <p className="font-mono text-[11px] font-bold text-on-surface-variant uppercase mb-2">Switch Assessment Section:</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {OA_SECTIONS.map((sec, sIdx) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setCurrentSectionIndex(sIdx);
                        setCurrentQuestionIndex(0);
                        setMobileMatrixOpen(false);
                      }}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-mono font-bold text-center truncate ${
                        sIdx === currentSectionIndex ? 'bg-primary-container text-white' : 'bg-surface-cream border border-border-hairline text-on-surface'
                      }`}
                    >
                      {sec.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Center: Question Workspace */}
        <div className="flex-1 flex flex-col bg-surface-cream min-w-0">
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Question Header & Category Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-secondary font-bold bg-secondary-fixed px-3 py-1 rounded-full border border-secondary/20">
                    Question {currentQuestionIndex + 1} of {currentSectionQuestions.length}
                  </span>
                  <span className="text-xs font-mono text-on-surface-variant">
                    • {currentSection.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-xs text-on-surface-variant bg-white px-2.5 py-1 rounded-lg border border-border-hairline">
                  <Award className="w-3.5 h-3.5 text-secondary" />
                  <span>Cutoff: {currentSection.cutoffPercentage}%</span>
                </div>
              </div>

              {/* Render Question Content by Type */}
              {(() => {
                if (!currentQ) return <div>Loading assessment item...</div>;

                // 1. Pseudocode Rendering (Section 2)
                if (currentQ.codeBlock) {
                  return (
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-xl font-bold text-on-surface leading-snug">
                        {currentQ.question || 'What will be the output of the following pseudocode?'}
                      </h3>

                      {/* Code Block Terminal */}
                      <div className="rounded-2xl border border-zinc-800 bg-[#0f172a] text-zinc-100 overflow-hidden shadow-md">
                        <div className="h-8 bg-[#1e293b] px-4 flex items-center justify-between border-b border-zinc-800 text-[11px] font-mono text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                            <span className="ml-2">Capgemini Pseudocode Console</span>
                          </div>
                          <span>{currentQ.topic || 'Bitwise / Recursion'}</span>
                        </div>
                        <pre className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-emerald-400">
                          <code>{currentQ.codeBlock}</code>
                        </pre>
                      </div>
                    </div>
                  );
                }

                // 2. Reading Comprehension Passage (Section 3)
                const rawPrompt = currentQ.question || currentQ.text || currentQ.title || '';
                const { passage, questionText } = parseReadingQuestion(rawPrompt);

                if (passage) {
                  return (
                    <div className="space-y-4">
                      <div className="bg-white border border-border-hairline rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-xs">
                        <div className="flex items-center gap-2 text-secondary font-mono text-xs font-bold uppercase tracking-wider">
                          <BookOpen className="w-4 h-4" />
                          <span>Reading Passage Excerpt</span>
                        </div>
                        <div className="text-sm md:text-base leading-relaxed text-on-surface bg-surface-cream/50 p-3.5 sm:p-4 rounded-xl border border-border-hairline/70 font-serif italic">
                          "{passage}"
                        </div>
                      </div>

                      <h3 className="text-base sm:text-xl font-bold text-on-surface leading-snug">
                        {questionText || 'Select the most appropriate option based on the passage above.'}
                      </h3>
                    </div>
                  );
                }

                // 3. Cognitive Challenge Game Card (Section 4)
                if (currentSection.category === 'cognitive') {
                  return (
                    <div className="space-y-5 bg-white border border-border-hairline rounded-2xl p-5 sm:p-6 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-secondary" />
                            <h3 className="text-lg sm:text-xl font-extrabold text-on-surface">
                              {currentQ.title}
                            </h3>
                          </div>
                          <p className="text-xs font-mono text-secondary mt-1 font-semibold">
                            Format: {currentQ.type} • Target: {currentQ.timeLimit}
                          </p>
                        </div>
                        <span className="text-[11px] font-mono px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full font-bold shrink-0">
                          Aon cut-e Standard
                        </span>
                      </div>

                      <p className="text-sm text-on-surface leading-relaxed">
                        {currentQ.description}
                      </p>

                      <div className="bg-surface-cream/60 rounded-xl p-4 border border-border-hairline space-y-2">
                        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
                          Execution Guidelines:
                        </h4>
                        <pre className="font-mono text-xs text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                          {currentQ.instructions}
                        </pre>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <div className="flex-1 text-xs font-mono text-on-surface-variant">
                          Select your self-evaluated simulation performance or automated benchmark:
                        </div>
                      </div>
                    </div>
                  );
                }

                // 4. Coding Round Sandbox (Section 5)
                if (currentSection.category === 'coding') {
                  return (
                    <div className="space-y-5 bg-white border border-border-hairline rounded-2xl p-5 sm:p-6 shadow-sm">
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-border-hairline">
                        <div>
                          <div className="flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-secondary" />
                            <h3 className="text-lg sm:text-xl font-extrabold text-on-surface">
                              {currentQ.title}
                            </h3>
                          </div>
                          <span className="text-xs font-mono text-on-surface-variant">
                            Category: {currentQ.category} • Target Time: {currentQ.timeLimit}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full">
                          {currentQ.difficulty}
                        </span>
                      </div>

                      <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                        {currentQ.description}
                      </p>

                      {/* Format Specification */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-surface-cream/50 p-3 rounded-xl border border-border-hairline text-xs font-mono">
                          <span className="font-bold text-secondary block mb-1">Input Format:</span>
                          <span className="whitespace-pre-wrap">{currentQ.inputFormat}</span>
                        </div>
                        <div className="bg-surface-cream/50 p-3 rounded-xl border border-border-hairline text-xs font-mono">
                          <span className="font-bold text-secondary block mb-1">Output Format:</span>
                          <span className="whitespace-pre-wrap">{currentQ.outputFormat}</span>
                        </div>
                      </div>

                      {/* Code Editor Preview */}
                      <div className="rounded-xl border border-zinc-800 bg-[#0f172a] text-zinc-100 overflow-hidden">
                        <div className="h-9 bg-[#1e293b] px-4 flex items-center justify-between border-b border-zinc-800 text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-400">Language:</span>
                            <div className="flex gap-1">
                              {(['python', 'cpp', 'java'] as const).map(lang => (
                                <button
                                  key={lang}
                                  onClick={() => setCodingLanguage(lang)}
                                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                    codingLanguage === lang ? 'bg-primary-container text-white' : 'text-zinc-400 hover:text-white'
                                  }`}
                                >
                                  {lang.toUpperCase()}
                                </button>
                              ))}
                            </div>
                          </div>
                          <span className="text-zinc-500">Judge0 Live Engine</span>
                        </div>
                        <pre className="p-4 font-mono text-xs leading-relaxed text-cyan-300 overflow-x-auto max-h-48">
                          <code>{currentQ.starterCode?.[codingLanguage] || ''}</code>
                        </pre>
                      </div>

                      <div className="pt-2 text-xs font-mono text-on-surface-variant">
                        Select your implementation test case verification result:
                      </div>
                    </div>
                  );
                }

                // 5. Standard Technical MCQs (Section 1)
                return (
                  <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl md:text-2xl text-on-surface font-extrabold tracking-tight leading-snug">
                      {rawPrompt || 'Select the most appropriate answer.'}
                    </h3>
                  </div>
                );
              })()}

              {/* Multiple Choice Options List */}
              <div className="space-y-2.5 sm:space-y-3">
                {(currentQ.options || []).map((opt: string, i: number) => {
                  const isSelected = answers[currentQ._id] === opt;

                  return (
                    <div
                      key={i}
                      onClick={() => setAnswers({ ...answers, [currentQ._id]: opt })}
                      className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3.5 min-h-[50px] touch-manipulation active:scale-98 ${
                        isSelected 
                          ? 'bg-secondary-fixed/30 border-secondary text-on-surface font-semibold shadow-xs' 
                          : 'bg-white border-border-hairline text-on-surface hover:border-zinc-400'
                      }`}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-secondary shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-zinc-400 shrink-0" />
                      )}
                      <span className="text-sm sm:text-base font-medium break-words leading-relaxed">{opt}</span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="h-16 sm:h-20 border-t border-border-hairline bg-white flex items-center justify-between px-3 sm:px-8 shadow-xs pb-safe shrink-0 z-10">
            
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestionIndex(c => Math.max(0, c - 1))}
              disabled={currentQuestionIndex === 0}
              className="rounded-xl text-xs font-semibold px-3 sm:px-4 h-9 sm:h-10 touch-manipulation active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <Button 
              variant="outline"
              className={`rounded-xl text-xs font-semibold px-2.5 sm:px-4 h-9 sm:h-10 touch-manipulation active:scale-95 cursor-pointer ${
                reviewMarked[currentQ._id] 
                  ? 'bg-amber-50 text-amber-800 border-amber-300' 
                  : 'text-on-surface-variant'
              }`}
              onClick={() => setReviewMarked({ ...reviewMarked, [currentQ._id]: !reviewMarked[currentQ._id] })}
            >
              <Flag className="w-3.5 h-3.5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{reviewMarked[currentQ._id] ? 'Unmark Review' : 'Mark for Review'}</span>
              <span className="sm:hidden">{reviewMarked[currentQ._id] ? 'Unmark' : 'Review'}</span>
            </Button>

            {isLastQuestionInSection ? (
              !isFinalSection ? (
                <Button 
                  onClick={handleNextSectionClick}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold px-4 sm:px-6 h-9 sm:h-10 shadow-sm touch-manipulation active:scale-95 cursor-pointer"
                >
                  <span>Next Section: {OA_SECTIONS[currentSectionIndex + 1]?.name}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              ) : (
                <Button 
                  onClick={submitAllSections}
                  disabled={completeMutation.isPending}
                  className="bg-primary-container hover:bg-black text-white rounded-xl text-xs font-bold px-5 sm:px-7 h-9 sm:h-10 shadow-sm touch-manipulation active:scale-95 cursor-pointer"
                >
                  <span>Submit Assessment</span>
                  <CheckCircle2 className="w-4 h-4 ml-1.5" />
                </Button>
              )
            ) : (
              <Button 
                onClick={() => setCurrentQuestionIndex(c => Math.min(currentSectionQuestions.length - 1, c + 1))}
                className="bg-primary-container hover:bg-black text-white rounded-xl text-xs font-bold px-4 sm:px-5 h-9 sm:h-10 shadow-sm touch-manipulation active:scale-95 cursor-pointer"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}

          </div>
        </div>
      </div>

      {/* Section Transition Confirmation Modal */}
      {transitionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-border-hairline shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-on-surface">
                  Section Complete: {currentSection.name}
                </h3>
                <p className="text-xs font-mono text-on-surface-variant">
                  {answeredCountInSection} of {currentSectionQuestions.length} Questions Attempted
                </p>
              </div>
            </div>

            <div className="bg-surface-cream rounded-2xl p-4 border border-border-hairline space-y-2.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Section Completed:</span>
                <span className="font-bold text-on-surface">Section {currentSectionIndex + 1} of 5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Elimination Cutoff:</span>
                <span className="font-bold text-secondary">{currentSection.cutoffPercentage}% Required</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Upcoming Section:</span>
                <span className="font-bold text-emerald-700">
                  {OA_SECTIONS[currentSectionIndex + 1]?.name} ({OA_SECTIONS[currentSectionIndex + 1]?.questionCount}Q • {OA_SECTIONS[currentSectionIndex + 1]?.durationMinutes}m)
                </span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Once you proceed to the next section, you will begin the timer for <strong>{OA_SECTIONS[currentSectionIndex + 1]?.name}</strong>. You can return to previous sections using the section navigator if time permits.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setTransitionModalOpen(false)}
                className="flex-1 rounded-xl text-xs font-bold py-2.5 h-11"
              >
                Review Current Section
              </Button>
              <Button
                onClick={confirmAdvanceSection}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold py-2.5 h-11 shadow-sm"
              >
                <span>Begin Next Section</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
