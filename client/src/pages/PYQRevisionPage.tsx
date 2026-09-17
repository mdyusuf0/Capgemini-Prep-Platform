import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Code2,
  Brain,
  PenTool,
  Compass,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Award,
  AlertCircle,
  HelpCircle,
  Search,
  BookOpen,
  Filter,
  Check,
  Eye,
  Flag,
  Share2,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  COCUBES_REAL_PAPERS,
  CoCubesPaper,
  CoCubesQuestion,
  PSEUDOCODE_PYQ_BANK,
  PseudocodePYQ,
  TOPIC_WISE_PYQ_BANK,
  TopicWisePYQ,
  ESSAY_TOPICS,
  EssayTopic,
  PATTERN_GUIDE
} from '@/data/pyq';
import toast from 'react-hot-toast';

type TabType = 'exam' | 'pseudocode' | 'topicwise' | 'essay' | 'blueprint';

export const PYQRevisionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('exam');

  // -------------------------------------------------------------
  // TAB 1: COCUBES REAL EXAM SIMULATOR STATE
  // -------------------------------------------------------------
  const [selectedPaperId, setSelectedPaperId] = useState<string>(COCUBES_REAL_PAPERS[0]?.id || 'paper_1');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [examSecondsLeft, setExamSecondsLeft] = useState<number>(50 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [examFilterSection, setExamFilterSection] = useState<string>('All');

  const currentPaper: CoCubesPaper = useMemo(() => {
    return COCUBES_REAL_PAPERS.find(p => p.id === selectedPaperId) || COCUBES_REAL_PAPERS[0];
  }, [selectedPaperId]);

  const filteredExamQuestions = useMemo(() => {
    if (examFilterSection === 'All') return currentPaper.questions;
    return currentPaper.questions.filter(q => q.section === examFilterSection);
  }, [currentPaper, examFilterSection]);

  const currentExamQuestion: CoCubesQuestion | undefined = filteredExamQuestions[currentQIndex];

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isExamSubmitted && examSecondsLeft > 0) {
      interval = setInterval(() => {
        setExamSecondsLeft(sec => {
          if (sec <= 1) {
            clearInterval(interval);
            setIsExamSubmitted(true);
            toast.error('Time is up! Exam auto-submitted.');
            return 0;
          }
          return sec - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isExamSubmitted, examSecondsLeft]);

  const handleSelectPaper = (paperId: string) => {
    setSelectedPaperId(paperId);
    setCurrentQIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setIsExamSubmitted(false);
    setExamSecondsLeft(50 * 60);
    setIsTimerRunning(true);
  };

  const handleOptionSelect = (qId: string, optIdx: number) => {
    if (isExamSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const toggleReviewMark = (qId: string) => {
    setMarkedForReview(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleExamSubmit = () => {
    setIsExamSubmitted(true);
    setIsTimerRunning(false);
    toast.success('Exam submitted successfully! Review your detailed scorecard below.');
  };

  const examScore = useMemo(() => {
    let score = 0;
    currentPaper.questions.forEach(q => {
      if (userAnswers[q.id] === q.answer) {
        score += 1;
      }
    });
    return score;
  }, [currentPaper, userAnswers]);

  // -------------------------------------------------------------
  // TAB 2: PSEUDOCODE TRACING STATE
  // -------------------------------------------------------------
  const [pseudoCategory, setPseudoCategory] = useState<string>('All');
  const [pseudoAnswers, setPseudoAnswers] = useState<Record<string, number>>({});
  const [revealedPseudo, setRevealedPseudo] = useState<Record<string, boolean>>({});

  const pseudoCategories = useMemo(() => {
    const set = new Set(PSEUDOCODE_PYQ_BANK.map(q => q.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredPseudo = useMemo(() => {
    if (pseudoCategory === 'All') return PSEUDOCODE_PYQ_BANK;
    return PSEUDOCODE_PYQ_BANK.filter(q => q.category === pseudoCategory);
  }, [pseudoCategory]);

  const handlePseudoSelect = (id: string, optIdx: number) => {
    setPseudoAnswers(prev => ({ ...prev, [id]: optIdx }));
    setRevealedPseudo(prev => ({ ...prev, [id]: true }));
  };

  // -------------------------------------------------------------
  // TAB 3: TOPIC-WISE PYQ DRILL STATE
  // -------------------------------------------------------------
  const [topicCategory, setTopicCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [topicAnswers, setTopicAnswers] = useState<Record<string, number>>({});
  const [revealedTopic, setRevealedTopic] = useState<Record<string, boolean>>({});

  const topicCategories = ['All', 'Quantitative Aptitude', 'Logical Reasoning', 'Computer Fundamentals'];

  const filteredTopicWise = useMemo(() => {
    return TOPIC_WISE_PYQ_BANK.filter(q => {
      const matchCat = topicCategory === 'All' || q.category === topicCategory;
      const matchSearch =
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.subtopic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [topicCategory, searchQuery]);

  // -------------------------------------------------------------
  // TAB 4: WET ESSAY SIMULATOR STATE
  // -------------------------------------------------------------
  const [selectedEssayId, setSelectedEssayId] = useState<string>(ESSAY_TOPICS[0]?.id || 'wet_1');
  const [essayText, setEssayText] = useState<string>('');
  const [showModelEssay, setShowModelEssay] = useState<boolean>(false);
  const [wetTimerSeconds, setWetTimerSeconds] = useState<number>(30 * 60);
  const [isWetTimerRunning, setIsWetTimerRunning] = useState<boolean>(false);

  const currentEssay: EssayTopic = useMemo(() => {
    return ESSAY_TOPICS.find(e => e.id === selectedEssayId) || ESSAY_TOPICS[0];
  }, [selectedEssayId]);

  const wordCount = useMemo(() => {
    const trimmed = essayText.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [essayText]);

  useEffect(() => {
    let interval: any = null;
    if (isWetTimerRunning && wetTimerSeconds > 0) {
      interval = setInterval(() => {
        setWetTimerSeconds(s => (s <= 1 ? 0 : s - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWetTimerRunning, wetTimerSeconds]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 text-on-surface">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-container via-surface-card to-white border border-border-hairline rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-mono font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AUTHENTIC DRIVE ARCHIVE • 2017–2023</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
              PYQ Revision Archive
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant max-w-3xl leading-relaxed">
              Authentic Capgemini on-campus recruitment papers, CoCubes 32-question drive tests, C & pseudocode output tracing, Written English Test (WET) topics, and placement blueprints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-2xl border border-border-hairline shadow-2xs text-center">
              <span className="block text-[11px] font-mono text-on-surface-variant">CoCubes Bank</span>
              <span className="text-lg font-black text-secondary">192+ Qs</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl border border-border-hairline shadow-2xs text-center">
              <span className="block text-[11px] font-mono text-on-surface-variant">Tracing Lab</span>
              <span className="text-lg font-black text-emerald-600">20 Traces</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl border border-border-hairline shadow-2xs text-center">
              <span className="block text-[11px] font-mono text-on-surface-variant">WET Essays</span>
              <span className="text-lg font-black text-purple-600">6 Sets</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-border-hairline/60 pt-4">
          {[
            { id: 'exam', label: 'CoCubes Real Mocks', icon: FileText, count: '6 Papers' },
            { id: 'pseudocode', label: 'Pseudocode Tracing Lab', icon: Code2, count: '20 Traces' },
            { id: 'topicwise', label: 'Topic-Wise Drill', icon: Brain, count: '17 High-Yield' },
            { id: 'essay', label: 'WET Essay Simulator', icon: PenTool, count: 'Capgemini Rule' },
            { id: 'blueprint', label: 'Pattern Blueprint & Games', icon: Compass, count: 'Cutoffs & Tips' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-white shadow-sm'
                    : 'bg-white/80 hover:bg-white text-on-surface-variant hover:text-on-surface border border-border-hairline'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-surface-cream text-secondary'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COCUBES REAL EXAM SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'exam' && (
        <div className="space-y-6">
          {/* Paper Selector & Control Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-border-hairline shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider mr-1">Select Paper:</span>
              {COCUBES_REAL_PAPERS.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPaper(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPaperId === p.id
                      ? 'bg-secondary text-white shadow-xs'
                      : 'bg-surface-cream text-on-surface-variant hover:bg-zinc-200'
                  }`}
                >
                  {p.title.replace('CoCubes Authentic On-Campus ', '')}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-cream border border-border-hairline font-mono text-xs font-bold text-secondary">
                <Clock className="w-4 h-4" />
                <span>{formatTimer(examSecondsLeft)}</span>
              </div>

              {!isExamSubmitted ? (
                <button
                  onClick={handleExamSubmit}
                  className="px-4 py-1.5 rounded-xl bg-primary-container hover:bg-black text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Submit Paper
                </button>
              ) : (
                <button
                  onClick={() => handleSelectPaper(selectedPaperId)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake
                </button>
              )}
            </div>
          </div>

          {/* Scorecard Banner if Exam Submitted */}
          {isExamSubmitted && (
            <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50/40 border border-emerald-200 rounded-3xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 font-black text-2xl">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-on-surface">Test Results: {currentPaper.title}</h3>
                    <p className="text-xs text-on-surface-variant font-mono">
                      Accuracy: {Math.round((examScore / currentPaper.questions.length) * 100)}% • Total: {examScore} / {currentPaper.questions.length} marks
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl font-bold">
                    Correct: {examScore}
                  </span>
                  <span className="px-3 py-1.5 bg-rose-100 text-rose-800 rounded-xl font-bold">
                    Incorrect: {Object.keys(userAnswers).length - examScore}
                  </span>
                  <span className="px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-xl font-bold">
                    Unattempted: {currentPaper.questions.length - Object.keys(userAnswers).length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Main Exam Interface Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Question Workspace (Left Col: 8/12) */}
            <div className="lg:col-span-8 space-y-6">
              {currentExamQuestion && (
                <div className="bg-white p-5 sm:p-7 rounded-3xl border border-border-hairline shadow-xs space-y-6">
                  {/* Top Bar: Question Meta */}
                  <div className="flex items-center justify-between border-b border-border-hairline pb-4 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-surface-cream text-secondary font-bold rounded-lg border border-border-hairline">
                        {currentExamQuestion.section}
                      </span>
                      <span className="text-on-surface-variant">Item #{currentExamQuestion.questionNumber} of {currentPaper.questions.length}</span>
                    </div>

                    <button
                      onClick={() => toggleReviewMark(currentExamQuestion.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        markedForReview[currentExamQuestion.id]
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{markedForReview[currentExamQuestion.id] ? 'Marked' : 'Mark Review'}</span>
                    </button>
                  </div>

                  {/* Passage Card if Question has passage */}
                  {currentExamQuestion.passage && (
                    <div className="p-4 sm:p-5 bg-surface-cream/80 border border-border-hairline rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-secondary uppercase tracking-wider">
                        <BookOpen className="w-4 h-4" />
                        <span>Reference Context / Passage</span>
                      </div>
                      <p className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-line font-serif italic">
                        {currentExamQuestion.passage}
                      </p>
                      {currentExamQuestion.passageImage && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-border-hairline bg-white p-2">
                          <img
                            src={currentExamQuestion.passageImage}
                            alt="Passage Illustration"
                            className="max-h-72 mx-auto object-contain"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Question Image if any */}
                  {currentExamQuestion.questionImage && (
                    <div className="overflow-hidden rounded-2xl border border-border-hairline bg-surface-cream/40 p-3">
                      <img
                        src={currentExamQuestion.questionImage}
                        alt="Question Diagram"
                        className="max-h-72 mx-auto object-contain"
                      />
                    </div>
                  )}

                  {/* Question Prompt */}
                  <div className="text-base sm:text-lg font-bold text-on-surface leading-relaxed">
                    {currentExamQuestion.question}
                  </div>

                  {/* Options List */}
                  <div className="space-y-3">
                    {currentExamQuestion.options.map((opt, idx) => {
                      const isSelected = userAnswers[currentExamQuestion.id] === idx;
                      const isCorrect = currentExamQuestion.answer === idx;
                      
                      let optionClasses = 'border-border-hairline bg-white hover:bg-surface-cream text-on-surface';

                      if (isExamSubmitted) {
                        if (isCorrect) {
                          optionClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                        } else if (isSelected && !isCorrect) {
                          optionClasses = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                        } else {
                          optionClasses = 'border-border-hairline/60 bg-white/60 text-on-surface-variant opacity-60';
                        }
                      } else if (isSelected) {
                        optionClasses = 'border-secondary bg-secondary/10 text-secondary font-bold shadow-2xs';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isExamSubmitted}
                          onClick={() => handleOptionSelect(currentExamQuestion.id, idx)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${optionClasses}`}
                        >
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                            isExamSubmitted && isCorrect
                              ? 'bg-emerald-600 text-white'
                              : isExamSubmitted && isSelected && !isCorrect
                              ? 'bg-rose-500 text-white'
                              : isSelected
                              ? 'bg-secondary text-white'
                              : 'bg-surface-cream text-on-surface-variant'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <div className="flex-1 text-xs sm:text-sm pt-0.5 leading-relaxed">
                            {opt}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Detailed Explanation if Exam Submitted */}
                  {isExamSubmitted && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-surface-cream/90 border border-border-hairline space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-secondary uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Verified Pedagogical Explanation</span>
                      </div>
                      <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                        {currentExamQuestion.explanation}
                      </p>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-border-hairline">
                    <button
                      disabled={currentQIndex === 0}
                      onClick={() => setCurrentQIndex(i => Math.max(0, i - 1))}
                      className="px-4 py-2 rounded-xl bg-surface-cream hover:bg-zinc-200 disabled:opacity-40 text-on-surface text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <span className="text-xs font-mono text-on-surface-variant">
                      {currentQIndex + 1} / {filteredExamQuestions.length}
                    </span>

                    <button
                      disabled={currentQIndex === filteredExamQuestions.length - 1}
                      onClick={() => setCurrentQIndex(i => Math.min(filteredExamQuestions.length - 1, i + 1))}
                      className="px-5 py-2 rounded-xl bg-primary-container hover:bg-black disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Question Palette & Section Filter (Right Col: 4/12) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white p-5 rounded-3xl border border-border-hairline shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border-hairline pb-3">
                  <h4 className="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">
                    Question Palette
                  </h4>
                  <span className="text-[11px] font-mono text-on-surface-variant">
                    {Object.keys(userAnswers).length}/{currentPaper.questions.length} Attempted
                  </span>
                </div>

                {/* Section filter tabs */}
                <div className="flex items-center gap-1.5 bg-surface-cream p-1 rounded-xl">
                  {['All', 'Analytical Reasoning', 'Quantitative Ability'].map(sec => (
                    <button
                      key={sec}
                      onClick={() => {
                        setExamFilterSection(sec);
                        setCurrentQIndex(0);
                      }}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                        examFilterSection === sec
                          ? 'bg-white text-on-surface shadow-2xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {sec === 'All' ? 'All' : sec.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* Numbered Palette Grid */}
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 pt-2">
                  {filteredExamQuestions.map((q, idx) => {
                    const isAnswered = userAnswers[q.id] !== undefined;
                    const isCurrent = idx === currentQIndex;
                    const isMarked = markedForReview[q.id];
                    const isCorrect = isExamSubmitted && userAnswers[q.id] === q.answer;
                    const isWrong = isExamSubmitted && isAnswered && !isCorrect;

                    let bg = 'bg-surface-cream text-on-surface-variant border-transparent';
                    if (isExamSubmitted) {
                      if (isCorrect) bg = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                      else if (isWrong) bg = 'bg-rose-500 text-white border-rose-600 font-bold';
                      else bg = 'bg-zinc-200 text-zinc-500 border-transparent';
                    } else if (isCurrent) {
                      bg = 'bg-secondary text-white border-secondary font-black ring-2 ring-secondary/30';
                    } else if (isMarked) {
                      bg = 'bg-amber-300 text-amber-900 border-amber-400 font-bold';
                    } else if (isAnswered) {
                      bg = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQIndex(idx)}
                        className={`w-9 h-9 rounded-xl border text-xs font-mono flex items-center justify-center transition-all cursor-pointer ${bg}`}
                      >
                        {q.questionNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-on-surface-variant pt-3 border-t border-border-hairline">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Answered ({Object.keys(userAnswers).length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span>Marked Review</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-secondary" />
                    <span>Current Item</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-surface-cream border border-border-hairline" />
                    <span>Unvisited</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PSEUDOCODE TRACING LAB */}
      {/* ========================================================================= */}
      {activeTab === 'pseudocode' && (
        <div className="space-y-6">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {pseudoCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setPseudoCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  pseudoCategory === cat
                    ? 'bg-secondary text-white shadow-xs'
                    : 'bg-white hover:bg-surface-cream text-on-surface-variant border border-border-hairline'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards of Pseudocode Traces */}
          <div className="grid grid-cols-1 gap-6">
            {filteredPseudo.map((item, idx) => {
              const isRevealed = revealedPseudo[item.id];
              const selectedOpt = pseudoAnswers[item.id];

              return (
                <div
                  key={item.id}
                  className="bg-white p-6 md:p-7 rounded-3xl border border-border-hairline shadow-xs space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-hairline pb-4 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-cream text-secondary font-bold border border-border-hairline">
                        Trace #{idx + 1}
                      </span>
                      <span className="font-bold text-on-surface">{item.title}</span>
                      <span className="text-[11px] text-on-surface-variant">• {item.category}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.difficulty === 'easy'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.difficulty === 'hard'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.difficulty}
                    </span>
                  </div>

                  {/* Code Editor Styled Block */}
                  {item.code && (
                    <div className="bg-zinc-950 text-zinc-100 rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-sm overflow-x-auto border border-zinc-800 shadow-inner">
                      <pre className="leading-relaxed whitespace-pre font-mono">
                        {item.code}
                      </pre>
                    </div>
                  )}

                  {/* Question statement */}
                  <p className="text-sm sm:text-base font-bold text-on-surface leading-relaxed">
                    {item.question}
                  </p>

                  {/* Interactive Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.options.map((opt, oIdx) => {
                      const isChoiceSelected = selectedOpt === oIdx;
                      const isChoiceCorrect = item.answer === oIdx;

                      let btnStyle = 'bg-white border-border-hairline hover:bg-surface-cream text-on-surface';
                      if (isRevealed) {
                        if (isChoiceCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                        } else if (isChoiceSelected && !isChoiceCorrect) {
                          btnStyle = 'bg-rose-50 border-rose-400 text-rose-800 line-through';
                        } else {
                          btnStyle = 'bg-white/60 border-border-hairline/60 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handlePseudoSelect(item.id, oIdx)}
                          className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                            isRevealed && isChoiceCorrect
                              ? 'bg-emerald-600 text-white'
                              : isRevealed && isChoiceSelected && !isChoiceCorrect
                              ? 'bg-rose-500 text-white'
                              : 'bg-surface-cream text-on-surface-variant'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="text-xs sm:text-sm pt-0.5 leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Block */}
                  {isRevealed && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-surface-cream border border-border-hairline space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-secondary uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Output Trace Logic & Verification</span>
                      </div>
                      <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TOPIC-WISE PYQ DRILL */}
      {/* ========================================================================= */}
      {activeTab === 'topicwise' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-border-hairline shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
              {topicCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setTopicCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    topicCategory === cat
                      ? 'bg-secondary text-white shadow-xs'
                      : 'bg-surface-cream text-on-surface-variant hover:bg-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search PYQ problems..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-cream border border-border-hairline text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>
          </div>

          {/* Questions Stream */}
          <div className="grid grid-cols-1 gap-5">
            {filteredTopicWise.map((item, idx) => {
              const isRevealed = revealedTopic[item.id];
              const selectedOpt = topicAnswers[item.id];

              return (
                <div
                  key={item.id}
                  className="bg-white p-5 sm:p-6 rounded-3xl border border-border-hairline shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono border-b border-border-hairline pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-cream text-secondary font-bold">
                        {item.category}
                      </span>
                      <span className="text-on-surface-variant">• {item.topic} ({item.subtopic})</span>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase bg-zinc-100 px-2 py-0.5 rounded-full">
                      {item.difficulty}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-on-surface leading-relaxed">
                    {item.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {item.options.map((opt, oIdx) => {
                      const isChoiceSelected = selectedOpt === oIdx;
                      const isChoiceCorrect = item.answer === oIdx;

                      let btnStyle = 'bg-white border-border-hairline hover:bg-surface-cream text-on-surface';
                      if (isRevealed) {
                        if (isChoiceCorrect) btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                        else if (isChoiceSelected && !isChoiceCorrect) btnStyle = 'bg-rose-50 border-rose-400 text-rose-800 line-through';
                        else btnStyle = 'bg-white/60 border-border-hairline/60 opacity-60';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => {
                            setTopicAnswers(prev => ({ ...prev, [item.id]: oIdx }));
                            setRevealedTopic(prev => ({ ...prev, [item.id]: true }));
                          }}
                          className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                            isRevealed && isChoiceCorrect
                              ? 'bg-emerald-600 text-white'
                              : isRevealed && isChoiceSelected && !isChoiceCorrect
                              ? 'bg-rose-500 text-white'
                              : 'bg-surface-cream text-on-surface-variant'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="text-xs sm:text-sm pt-0.5">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isRevealed && (
                    <div className="p-4 rounded-2xl bg-surface-cream/80 border border-border-hairline text-xs sm:text-sm text-on-surface leading-relaxed">
                      <span className="font-bold text-secondary block font-mono text-xs uppercase mb-1">
                        Step-by-Step Solution:
                      </span>
                      {item.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: WET ESSAY WRITING SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'essay' && (
        <div className="space-y-6">
          {/* Topic Picker Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-border-hairline shadow-xs space-y-3">
            <span className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider block">
              Authentic Capgemini Essay Prompt:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {ESSAY_TOPICS.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedEssayId(topic.id);
                    setEssayText('');
                    setShowModelEssay(false);
                    setWetTimerSeconds(30 * 60);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedEssayId === topic.id
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-surface-cream text-on-surface-variant hover:bg-zinc-200'
                  }`}
                >
                  {topic.title.length > 35 ? topic.title.slice(0, 35) + '...' : topic.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Editor Workspace (Left Col: 8/12) */}
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-white p-6 rounded-3xl border border-border-hairline shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-hairline pb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-on-surface">
                      {currentEssay.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">{currentEssay.category}</p>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <button
                      onClick={() => setIsWetTimerRunning(r => !r)}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition-colors cursor-pointer ${
                        isWetTimerRunning ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-surface-cream text-secondary border-border-hairline'
                      }`}
                    >
                      {isWetTimerRunning ? 'Pause Timer' : 'Start 30m Timer'}
                    </button>
                    <span className="px-3 py-1.5 bg-surface-cream rounded-xl border border-border-hairline font-bold text-secondary">
                      {formatTimer(wetTimerSeconds)}
                    </span>
                  </div>
                </div>

                {/* Essay Writing Textarea */}
                <div className="space-y-2">
                  <textarea
                    rows={12}
                    value={essayText}
                    onChange={e => setEssayText(e.target.value)}
                    placeholder="Begin typing your essay here following the Capgemini WET structure (Introduction, 2 Body Paragraphs, and Conclusion)..."
                    className="w-full p-4 rounded-2xl border border-border-hairline bg-surface-cream/30 text-on-surface placeholder:text-on-surface-variant/70 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500 font-serif"
                  />

                  {/* Word Count Live Indicator */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">Word Count: {wordCount}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        wordCount < 200
                          ? 'bg-amber-100 text-amber-800'
                          : wordCount <= 400
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {wordCount < 200 ? 'Under Minimum (200 Words)' : wordCount <= 400 ? 'Optimal Range (200–400)' : 'Exceeds Maximum (400 Words)'}
                      </span>
                    </div>
                    <span className="text-on-surface-variant text-[11px]">Capgemini Rule: 200–400 words</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setShowModelEssay(s => !s)}
                    className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{showModelEssay ? 'Hide Model Essay' : 'View High-Scoring Model Essay'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (wordCount < 150) {
                        toast.error('Your essay is too short! Capgemini requires at least 200 words.');
                      } else {
                        toast.success('Essay saved! Compare with the reference model below.');
                        setShowModelEssay(true);
                      }
                    }}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Evaluate & Compare
                  </button>
                </div>
              </div>

              {/* Model Essay View */}
              {showModelEssay && (
                <div className="bg-purple-50/70 border border-purple-200 rounded-3xl p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-purple-200 pb-3">
                    <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-purple-700" />
                      <span>Benchmark 400-Word Model Essay</span>
                    </div>
                    <span className="text-xs font-mono bg-purple-200 text-purple-900 px-2.5 py-0.5 rounded-full">
                      Capgemini Standard
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-purple-950 leading-relaxed font-serif whitespace-pre-line">
                    {currentEssay.modelEssay}
                  </div>
                </div>
              )}
            </div>

            {/* Rubric & Brainstorming Tips (Right Col: 4/12) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white p-5 rounded-3xl border border-border-hairline shadow-xs space-y-4">
                <h4 className="text-xs font-mono font-bold text-on-surface uppercase tracking-wider border-b border-border-hairline pb-2">
                  Key Arguments & Outline
                </h4>
                <ul className="space-y-2 text-xs text-on-surface-variant">
                  {currentEssay.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="text-xs font-mono font-bold text-on-surface uppercase tracking-wider border-b border-border-hairline pb-2 pt-2">
                  Capgemini WET Scoring Rules
                </h4>
                <div className="space-y-2 text-[11px] text-on-surface-variant font-mono">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Check className="w-3.5 h-3.5" /> <span>3 distinct paragraphs required</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Check className="w-3.5 h-3.5" /> <span>Zero grammatical contractions (no didn't/can't)</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Check className="w-3.5 h-3.5" /> <span>Target range: 250–350 words</span>
                  </div>
                  <div className="flex items-center gap-2 text-rose-700">
                    <XCircle className="w-3.5 h-3.5" /> <span>Do NOT use informal bullet points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PATTERN BLUEPRINT & GAME MECHANICS */}
      {/* ========================================================================= */}
      {activeTab === 'blueprint' && (
        <div className="space-y-6">
          {/* Company Profile Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border-hairline shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary font-black">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-on-surface">
                  {PATTERN_GUIDE.companyProfile.name} Overview
                </h3>
                <p className="text-xs text-on-surface-variant font-mono">
                  {PATTERN_GUIDE.companyProfile.industry} • Headquartered in {PATTERN_GUIDE.companyProfile.headquarters}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-3.5 bg-surface-cream rounded-2xl border border-border-hairline">
                <span className="block text-[11px] font-mono text-on-surface-variant">Founded</span>
                <span className="font-bold text-on-surface">{PATTERN_GUIDE.companyProfile.founded}</span>
              </div>
              <div className="p-3.5 bg-surface-cream rounded-2xl border border-border-hairline">
                <span className="block text-[11px] font-mono text-on-surface-variant">Global Reach</span>
                <span className="font-bold text-on-surface">{PATTERN_GUIDE.companyProfile.globalPresence}</span>
              </div>
              <div className="p-3.5 bg-surface-cream rounded-2xl border border-border-hairline">
                <span className="block text-[11px] font-mono text-on-surface-variant">Key Divisions</span>
                <span className="font-bold text-on-surface">Invent, Engineering, Sogeti</span>
              </div>
            </div>
          </div>

          {/* Recruitment Rounds Timeline */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-on-surface">
              Capgemini On-Campus Selection Rounds & Cutoffs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PATTERN_GUIDE.recruitmentProcess2017to2023.map((rnd, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-border-hairline shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-secondary text-white font-mono font-bold text-xs flex items-center justify-center">
                      {i + 1}
                    </span>
                    <h4 className="font-bold text-sm text-on-surface">{rnd.round}</h4>
                  </div>
                  {rnd.sections && (
                    <div className="space-y-1.5 pt-1">
                      {rnd.sections.map((sec, sIdx) => (
                        <div key={sIdx} className="flex items-center justify-between text-xs bg-surface-cream p-2 rounded-xl font-mono">
                          <span className="font-bold">{sec.name}</span>
                          <span className="text-on-surface-variant">{sec.questions}Q ({sec.time}) • Cutoff {sec.cutoff}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {rnd.games && (
                    <div className="text-xs space-y-1 pt-1">
                      <span className="font-mono text-secondary font-bold block">Included Cognitive Games:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {rnd.games.map((g, gIdx) => (
                          <span key={gIdx} className="px-2.5 py-1 bg-surface-cream rounded-lg text-[11px] font-bold">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {rnd.focus && (
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      <strong className="text-on-surface">Key Focus:</strong> {rnd.focus}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cognitive Mini-Game Strategy Guide */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-on-surface">
              Cognitive Mini-Games Mastery Blueprint
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PATTERN_GUIDE.gameMechanicsGuide.map((g, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-border-hairline shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-secondary font-bold text-sm">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>{g.name}</span>
                  </div>
                  <p className="text-xs text-on-surface leading-relaxed">
                    <strong className="text-on-surface-variant">Objective:</strong> {g.objective}
                  </p>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-mono">
                    <strong>Pro-Tip:</strong> {g.proTip}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capgemini 7 Core Values */}
          <div className="bg-white p-6 rounded-3xl border border-border-hairline shadow-xs space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-on-surface">
              Capgemini 7 Core Values (Essential for HR Round)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PATTERN_GUIDE.coreValues.map((val, i) => (
                <div key={i} className="p-4 rounded-2xl bg-surface-cream border border-border-hairline space-y-1.5">
                  <span className="text-xs font-mono font-bold text-secondary uppercase tracking-wider">
                    {val.value}
                  </span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PYQRevisionPage;
