import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { mockService } from '../services/mockService';
import { Button } from '../components/ui/button';
import { Clock, CheckSquare, Square, Flag, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MockTestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Dummy data for the UI since we don't have full questions populated in DB yet
  const [questions] = useState(Array.from({ length: 20 }, (_, i) => ({
    _id: `q${i}`,
    text: `Sample Question ${i + 1} text?`,
    options: ['Option A', 'Option B', 'Option C', 'Option D']
  })));
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reviewMarked, setReviewMarked] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(20 * 60);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const completeMutation = useMutation({
    mutationFn: (data: any) => mockService.completeMock(id!, data.answers, data.timeSpent),
    onSuccess: () => {
      toast.success('Test submitted successfully');
      navigate(`/mocks/result/${id}`);
    }
  });

  const submitTest = () => {
    const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
      questionId: qId,
      selectedAnswer: ans,
      isCorrect: Math.random() > 0.5 // Dummy evaluation
    }));
    
    completeMutation.mutate({
      answers: formattedAnswers,
      timeSpent: (20 * 60) - timeLeft
    });
  };

  const handleConfirmSubmit = () => {
    const unanswered = questions.length - Object.keys(answers).length;
    if (unanswered > 0) {
      if (window.confirm(`You have ${unanswered} unanswered questions. Are you sure you want to submit?`)) {
        submitTest();
      }
    } else {
      submitTest();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] fixed inset-0 z-50">
      {/* Top Bar */}
      <div className="h-16 border-b border-gray-800 bg-[#1e1e2e] flex items-center px-6 justify-between shadow-md">
        <h2 className="text-xl font-bold text-white">Mock Test Environment</h2>
        <div className={`flex items-center gap-3 font-mono text-2xl font-bold px-4 py-1 rounded ${
          timeLeft < 300 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-indigo-500/10 text-indigo-400'
        }`}>
          <Clock className="w-6 h-6" />
          {formatTime(timeLeft)}
        </div>
        <Button onClick={handleConfirmSubmit} disabled={completeMutation.isPending} className="bg-green-600 hover:bg-green-700">
          Submit Test
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigator */}
        <div className="w-64 border-r border-gray-800 bg-[#151521] flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-semibold text-gray-300">Question Navigator</h3>
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                let stateClass = 'bg-gray-800 text-gray-400 border-gray-700'; // not visited
                if (answers[q._id]) stateClass = 'bg-green-600/20 text-green-400 border-green-600/50'; // answered
                if (reviewMarked[q._id]) stateClass = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'; // review
                if (currentIndex === idx) stateClass = 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]'; // current

                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 w-full rounded border flex items-center justify-center text-sm font-medium transition-all ${stateClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Legend */}
          <div className="p-4 border-t border-gray-800 text-xs space-y-2 text-gray-400">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-600/20 border border-green-600/50"></div> Answered</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-gray-800 border border-gray-700"></div> Not Answered</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/50"></div> Marked for Review</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-indigo-600 border border-indigo-500"></div> Current</div>
          </div>
        </div>

        {/* Center - Question Area */}
        <div className="flex-1 flex flex-col bg-[#0a0a0a]">
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <span className="text-gray-400 font-medium">Question {currentIndex + 1}</span>
                <h3 className="text-2xl text-white mt-2 font-medium">{currentQ.text}</h3>
              </div>

              <div className="space-y-4">
                {currentQ.options.map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => setAnswers({ ...answers, [currentQ._id]: opt })}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-4 ${
                      answers[currentQ._id] === opt 
                        ? 'bg-indigo-600/10 border-indigo-500 text-white' 
                        : 'bg-[#1e1e2e] border-gray-800 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {answers[currentQ._id] === opt ? (
                      <CheckSquare className="w-6 h-6 text-indigo-400" />
                    ) : (
                      <Square className="w-6 h-6 text-gray-500" />
                    )}
                    <span className="text-lg">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="h-20 border-t border-gray-800 bg-[#1e1e2e] flex items-center justify-between px-8">
            <Button 
              variant="outline" 
              onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>

            <Button 
              variant="outline"
              className={reviewMarked[currentQ._id] ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' : 'text-gray-400'}
              onClick={() => setReviewMarked({ ...reviewMarked, [currentQ._id]: !reviewMarked[currentQ._id] })}
            >
              <Flag className="w-4 h-4 mr-2" />
              {reviewMarked[currentQ._id] ? 'Unmark Review' : 'Mark for Review'}
            </Button>

            <Button 
              onClick={() => setCurrentIndex(c => Math.min(questions.length - 1, c + 1))}
              disabled={currentIndex === questions.length - 1}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Save & Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
