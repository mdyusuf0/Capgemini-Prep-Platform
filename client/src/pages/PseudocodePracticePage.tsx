import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Bookmark, Timer, Flag, CheckCircle, XCircle } from 'lucide-react';
import { pseudocodeService, PseudocodeQuestion } from '../services/pseudocodeService';
import CodeBlock from '../components/practice/CodeBlock';
import DryRunTrace from '../components/practice/DryRunTrace';
import toast from 'react-hot-toast';

const PseudocodePracticePage: React.FC = () => {
  const [questions, setQuestions] = useState<PseudocodeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultInfo, setResultInfo] = useState<{ correct: boolean; correctAnswer: number; explanation: string; dryRunTrace?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Session Stats
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    fetchTopics();
    fetchQuestions();
  }, [selectedTopic]);

  const fetchTopics = async () => {
    try {
      const data = await pseudocodeService.getTopics();
      setTopics(['All', ...data]);
    } catch (err) {
      toast.error('Failed to load topics');
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await pseudocodeService.getQuestions({ 
        topic: selectedTopic !== 'All' ? selectedTopic : undefined, 
        limit: 50 
      });
      setQuestions(data.questions);
      setCurrentIndex(0);
      resetState();
    } catch (err) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setResultInfo(null);
  };

  const currentQ = questions[currentIndex];

  const handleSubmit = async () => {
    if (selectedAnswer === null || !currentQ) return;
    
    try {
      const res = await pseudocodeService.submitAnswer(currentQ._id, selectedAnswer);
      setIsSubmitted(true);
      setResultInfo(res);
      if (res.correct) setCorrectCount(prev => prev + 1);
      else setIncorrectCount(prev => prev + 1);
    } catch (err) {
      toast.error('Failed to submit answer');
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetState();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      resetState();
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-white">Loading pseudocode questions...</div>;
  if (!questions.length) return <div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-white">No questions found.</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-6 flex justify-center">
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-6">
        
        {/* Left Panel */}
        <div className="w-full md:w-[65%] flex flex-col gap-4">
          <div className="bg-[#1e1e2e] rounded-xl p-6 shadow-lg border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                {currentQ.topic}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold
                ${currentQ.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : 
                  currentQ.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                  'bg-red-500/20 text-red-400'}`}>
                {currentQ.difficulty}
              </span>
            </div>
            
            <h2 className="text-xl font-medium mb-4">{currentQ.question}</h2>
            
            <CodeBlock code={currentQ.codeBlock} />

            <div className="mt-6 space-y-3">
              {currentQ.options.map((opt, idx) => {
                let borderClass = 'border-gray-700 hover:border-gray-500 bg-[#252538]';
                if (isSubmitted) {
                  if (resultInfo?.correctAnswer === idx) borderClass = 'border-green-500 bg-green-500/10 text-green-400 font-medium';
                  else if (selectedAnswer === idx) borderClass = 'border-red-500 bg-red-500/10 text-red-400';
                  else borderClass = 'border-gray-800 bg-[#1a1a25] opacity-50';
                } else if (selectedAnswer === idx) {
                  borderClass = 'border-blue-500 bg-blue-500/20';
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => setSelectedAnswer(idx)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center justify-between ${borderClass}`}
                  >
                    <span>{opt}</span>
                    {isSubmitted && resultInfo?.correctAnswer === idx && <CheckCircle size={20} className="text-green-500" />}
                    {isSubmitted && selectedAnswer === idx && resultInfo?.correctAnswer !== idx && <XCircle size={20} className="text-red-500" />}
                  </button>
                );
              })}
            </div>

            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <div className="mt-6">
                <div className="p-4 rounded-lg bg-[#1a1a2e] border border-gray-700">
                  <h3 className="font-semibold text-lg mb-2">Explanation</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{resultInfo?.explanation}</p>
                </div>
                {resultInfo?.dryRunTrace && (
                  <DryRunTrace trace={resultInfo.dryRunTrace} />
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center bg-[#1e1e2e] p-4 rounded-xl border border-gray-800">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-[#2a2a3e] rounded-lg disabled:opacity-50 hover:bg-[#3a3a4e] transition-colors"
            >
              <ChevronLeft size={20} /> Previous
            </button>
            <span className="text-gray-400 font-medium">
              {currentIndex + 1} / {questions.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-[#2a2a3e] rounded-lg disabled:opacity-50 hover:bg-[#3a3a4e] transition-colors"
            >
              Next <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-[35%] flex flex-col gap-6">
          <div className="bg-[#1e1e2e] rounded-xl p-6 shadow-lg border border-gray-800">
            <h3 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">Topic Filter</h3>
            <div className="flex flex-wrap gap-2">
              {topics.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border
                    ${selectedTopic === t ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#252538] border-gray-700 text-gray-300 hover:bg-[#2a2a3e]'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#1e1e2e] rounded-xl p-6 shadow-lg border border-gray-800">
            <h3 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">Session Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a2e] p-4 rounded-lg text-center border border-gray-800">
                <div className="text-3xl font-bold text-green-400 mb-1">{correctCount}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Correct</div>
              </div>
              <div className="bg-[#1a1a2e] p-4 rounded-lg text-center border border-gray-800">
                <div className="text-3xl font-bold text-red-400 mb-1">{incorrectCount}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Incorrect</div>
              </div>
            </div>
            {correctCount + incorrectCount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="flex justify-between text-sm mb-1">
                  <span>Accuracy</span>
                  <span className="font-bold">{Math.round((correctCount / (correctCount + incorrectCount)) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(correctCount / (correctCount + incorrectCount)) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PseudocodePracticePage;
