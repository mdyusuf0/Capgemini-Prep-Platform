import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flag, CheckCircle, XCircle } from 'lucide-react';
import { pseudocodeService, PseudocodeQuestion } from '../services/pseudocodeService';
import { FALLBACK_PSEUDOCODE_QUESTIONS } from '../data/pseudocodeFallback';
import CodeBlock from '../components/practice/CodeBlock';
import toast from 'react-hot-toast';

interface SpeedAnswer {
  questionId: string;
  selectedAnswer: number;
}

const PseudocodeSpeedModePage: React.FC = () => {
  const [questions, setQuestions] = useState<PseudocodeQuestion[]>(() => 
    [...FALLBACK_PSEUDOCODE_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 30)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [isActive, setIsActive] = useState(true);
  
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Results
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchSpeedSet = async () => {
      try {
        const data = await pseudocodeService.getSpeedSet();
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data);
        }
        setIsActive(true);
      } catch (err) {
        console.warn('Failed to load speed set from API, using local questions bank:', err);
      }
    };
    fetchSpeedSet();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleFinish();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleFinish = async () => {
    setIsActive(false);
    setIsFinished(true);
    let currentScore = 0;
    // Basic local scoring (in real app, we might send array to backend)
    // The backend provides answers via submit. For speed mode, we can fetch results batch,
    // For this UI demo we will just show submission is done.
    toast.success('Speed Mode Completed!');
  };

  const handleSelectAnswer = (answerIdx: number) => {
    if (!currentQ) return;
    const qId = currentQ._id || `speed_q_${currentIndex}`;
    setAnswers(prev => ({ ...prev, [qId]: answerIdx }));
    // Auto advance unless it's the last question
    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    }
  };

  const toggleFlag = () => {
    if (!currentQ) return;
    const qId = currentQ._id || `speed_q_${currentIndex}`;
    setFlagged(prev => {
      const newSet = new Set(prev);
      if (newSet.has(qId)) newSet.delete(qId);
      else newSet.add(qId);
      return newSet;
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-surface-cream text-on-surface font-mono text-sm">Generating 30-Question Speed Protocol...</div>;
  if (!questions.length) return <div className="flex items-center justify-center h-screen bg-surface-cream text-on-surface font-mono text-sm">Failed to generate set.</div>;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-surface-cream flex items-center justify-center p-6 text-on-surface">
        <div className="bg-white p-8 rounded-2xl max-w-lg w-full text-center shadow-sm border border-border-hairline">
          <CheckCircle size={56} className="text-secondary mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold mb-2 text-on-surface tracking-tight">Time Protocol Concluded</h1>
          <p className="text-on-surface-variant text-sm mb-6">Completed Capgemini Pseudocode Speed Challenge evaluation.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-surface-cream p-4 rounded-xl border border-border-hairline">
              <div className="text-2xl font-black text-secondary font-mono">{Object.keys(answers).length} / 30</div>
              <div className="text-[10px] text-on-surface-variant font-mono uppercase font-bold tracking-wider">Attempted</div>
            </div>
            <div className="bg-surface-cream p-4 rounded-xl border border-border-hairline">
              <div className="text-2xl font-black text-amber-600 font-mono">{formatTime(30 * 60 - timeLeft)}</div>
              <div className="text-[10px] text-on-surface-variant font-mono uppercase font-bold tracking-wider">Elapsed Time</div>
            </div>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-primary-container hover:bg-black text-white py-3 rounded-xl font-bold transition-all shadow-sm cursor-pointer text-xs"
          >
            Start Another Velocity Run
          </button>
        </div>
      </div>
    );
  }

  const currentQ = (questions && questions.length > 0 && questions[currentIndex])
    ? questions[currentIndex]
    : (FALLBACK_PSEUDOCODE_QUESTIONS[0] || {} as PseudocodeQuestion);
  const qId = currentQ?._id || `speed_q_${currentIndex}`;

  return (
    <div className="min-h-screen bg-surface-cream text-on-surface p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-border-hairline mb-6 shadow-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-bold block">Round 1.2 Speed Protocol</span>
          <h1 className="text-lg font-extrabold text-on-surface tracking-tight">Pseudocode Speed Challenge</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-surface-cream px-4 py-2 rounded-xl font-mono text-lg font-bold border border-border-hairline text-on-surface">
            <Clock size={18} className={timeLeft < 300 ? 'text-red-500' : 'text-secondary'} />
            <span className={timeLeft < 300 ? 'text-red-600 font-bold' : 'text-on-surface'}>{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={handleFinish}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Finish Test
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* Main Content */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-border-hairline flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant">Question {currentIndex + 1} of {questions.length}</span>
            <button 
              onClick={toggleFlag}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
                flagged.has(qId) ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-surface-cream border-border-hairline text-zinc-600 hover:text-black'
              }`}
            >
              <Flag size={14} /> {flagged.has(qId) ? 'Flagged' : 'Flag for Review'}
            </button>
          </div>
          
          <h2 className="text-base font-bold text-on-surface mb-4 leading-snug">{currentQ?.question || 'What will be the output of the following pseudocode?'}</h2>
          
          <CodeBlock code={currentQ?.codeBlock || ''} />

          <div className="mt-6 space-y-3 flex-1">
            {(currentQ?.options || []).map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm transition-all cursor-pointer 
                  ${answers[qId] === idx 
                    ? 'border-secondary bg-secondary-fixed/40 text-on-surface font-semibold shadow-xs' 
                    : 'border-border-hairline bg-surface-cream hover:bg-white hover:border-zinc-400 text-on-surface'}`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6 pt-5 border-t border-border-hairline">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-5 py-2 bg-surface-cream hover:bg-zinc-200 rounded-xl disabled:opacity-30 transition-colors font-bold text-xs border border-border-hairline text-on-surface cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="px-5 py-2 bg-primary-container hover:bg-black text-white rounded-xl disabled:opacity-30 transition-all font-bold text-xs shadow-sm cursor-pointer"
            >
              Next Question
            </button>
          </div>
        </div>

        {/* Navigator Panel */}
        <div className="w-full lg:w-72 bg-white rounded-2xl p-6 shadow-sm border border-border-hairline h-fit">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Question Grid</h3>
          <div className="grid grid-cols-5 gap-2">
            {(questions || []).map((q, idx) => {
              const qKey = q?._id || `speed_cell_${idx}`;
              const isCurrent = idx === currentIndex;
              const isDone = answers[qKey] !== undefined;
              const isFlagged = flagged.has(qKey);
              
              let classes = "h-9 w-full flex items-center justify-center rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ";
              
              if (isCurrent) classes += "border-black bg-primary-container text-white shadow-xs ";
              else if (isFlagged) classes += "bg-amber-50 text-amber-800 border-amber-300 ";
              else if (isDone) classes += "bg-secondary-fixed text-on-secondary-fixed border-secondary/30 ";
              else classes += "bg-surface-cream text-zinc-600 border-border-hairline hover:bg-zinc-200 ";

              return (
                <button
                  key={qKey}
                  onClick={() => setCurrentIndex(idx)}
                  className={classes}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          
          <div className="mt-6 space-y-2 text-xs font-mono text-on-surface-variant">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md bg-secondary-fixed border border-secondary/30"></div> Answered</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md border border-amber-300 bg-amber-50"></div> Flagged</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md bg-surface-cream border border-border-hairline"></div> Unvisited</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PseudocodeSpeedModePage;
