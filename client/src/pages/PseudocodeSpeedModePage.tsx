import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flag, CheckCircle, XCircle } from 'lucide-react';
import { pseudocodeService, PseudocodeQuestion } from '../services/pseudocodeService';
import CodeBlock from '../components/practice/CodeBlock';
import toast from 'react-hot-toast';

interface SpeedAnswer {
  questionId: string;
  selectedAnswer: number;
}

const PseudocodeSpeedModePage: React.FC = () => {
  const [questions, setQuestions] = useState<PseudocodeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [isActive, setIsActive] = useState(false);
  
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Results
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchSpeedSet = async () => {
      try {
        const data = await pseudocodeService.getSpeedSet();
        setQuestions(data);
        setIsActive(true);
      } catch (err) {
        toast.error('Failed to load speed set');
      } finally {
        setLoading(false);
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
    const qId = questions[currentIndex]._id;
    setAnswers(prev => ({ ...prev, [qId]: answerIdx }));
    // Auto advance unless it's the last question
    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    }
  };

  const toggleFlag = () => {
    const qId = questions[currentIndex]._id;
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

  if (loading) return <div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-white">Generating 30-Question Speed Set...</div>;
  if (!questions.length) return <div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-white">Failed to generate set.</div>;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-gray-200">
        <div className="bg-[#1e1e2e] p-8 rounded-xl max-w-lg w-full text-center shadow-xl border border-gray-800">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-white">Time's Up!</h1>
          <p className="text-gray-400 mb-6">You've completed the Capgemini Pseudocode Speed Challenge.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#1a1a2e] p-4 rounded-lg border border-gray-800">
              <div className="text-2xl font-bold text-blue-400">{Object.keys(answers).length} / 30</div>
              <div className="text-xs text-gray-500 uppercase">Attempted</div>
            </div>
            <div className="bg-[#1a1a2e] p-4 rounded-lg border border-gray-800">
              <div className="text-2xl font-bold text-yellow-400">{formatTime(30 * 60 - timeLeft)}</div>
              <div className="text-xs text-gray-500 uppercase">Time Taken</div>
            </div>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-colors"
          >
            Try Another Set
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const qId = currentQ._id;
  const isAnswered = answers[qId] !== undefined;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#1e1e2e] p-4 rounded-xl border border-gray-800 mb-6">
        <h1 className="text-xl font-bold text-white">Speed Challenge</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#252538] px-4 py-2 rounded-lg font-mono text-xl border border-gray-700">
            <Clock size={20} className={timeLeft < 300 ? 'text-red-500' : 'text-blue-400'} />
            <span className={timeLeft < 300 ? 'text-red-500 font-bold' : 'text-white'}>{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={handleFinish}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
          >
            Finish Test
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* Main Content */}
        <div className="flex-1 bg-[#1e1e2e] rounded-xl p-6 shadow-lg border border-gray-800 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 font-medium">Question {currentIndex + 1} of {questions.length}</span>
            <button 
              onClick={toggleFlag}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                flagged.has(qId) ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-[#2a2a3e] border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <Flag size={16} /> {flagged.has(qId) ? 'Flagged' : 'Flag for Review'}
            </button>
          </div>
          
          <h2 className="text-lg font-medium mb-4">{currentQ.question}</h2>
          
          <CodeBlock code={currentQ.codeBlock} />

          <div className="mt-6 space-y-3 flex-1">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 
                  ${answers[qId] === idx 
                    ? 'border-blue-500 bg-blue-500/20 text-white' 
                    : 'border-gray-700 bg-[#252538] hover:border-gray-500 text-gray-300'}`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6 pt-6 border-t border-gray-800">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-6 py-2 bg-[#2a2a3e] hover:bg-[#3a3a4e] rounded-lg disabled:opacity-50 transition-colors font-medium"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </div>

        {/* Navigator Panel */}
        <div className="w-full lg:w-72 bg-[#1e1e2e] rounded-xl p-6 shadow-lg border border-gray-800 h-fit">
          <h3 className="font-bold mb-4 text-white">Navigator</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isDone = answers[q._id] !== undefined;
              const isFlagged = flagged.has(q._id);
              
              let classes = "h-10 w-full flex items-center justify-center rounded text-sm font-medium transition-all ";
              
              if (isCurrent) classes += "ring-2 ring-white ";
              
              if (isFlagged) classes += "bg-yellow-500/20 text-yellow-500 border border-yellow-500";
              else if (isDone) classes += "bg-blue-600 text-white";
              else classes += "bg-[#252538] text-gray-400 border border-gray-700 hover:bg-[#3a3a4e]";

              return (
                <button
                  key={q._id}
                  onClick={() => setCurrentIndex(idx)}
                  className={classes}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          
          <div className="mt-6 space-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-600"></div> Answered</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded border border-yellow-500 bg-yellow-500/20"></div> Flagged</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#252538] border border-gray-700"></div> Unanswered</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PseudocodeSpeedModePage;
