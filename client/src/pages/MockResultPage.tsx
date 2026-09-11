import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mockService } from '../services/mockService';
import { Button } from '../components/ui/button';
import { CheckCircle, XCircle, Clock, Target, ArrowLeft } from 'lucide-react';

export default function MockResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: result, isLoading } = useQuery({
    queryKey: ['mock-result', id],
    queryFn: () => mockService.getMockResult(id!)
  });

  if (isLoading) return <div className="text-white p-8">Loading results...</div>;
  if (!result) return <div className="text-white p-8">Result not found.</div>;

  const percentage = Math.round((result.score / result.totalQuestions) * 100) || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="ghost" onClick={() => navigate('/mocks')} className="mb-6 text-gray-400">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Mocks
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Overall Score */}
        <div className="col-span-1 md:col-span-1 bg-[#1e1e2e] rounded-xl border border-gray-800 p-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl text-gray-400 mb-4">Overall Score</h2>
          <div className="relative w-40 h-40 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" className="stroke-gray-800" strokeWidth="10" fill="none" />
              <circle 
                cx="80" cy="80" r="70" 
                className={`stroke-current ${percentage >= 70 ? 'text-green-500' : percentage >= 40 ? 'text-yellow-500' : 'text-red-500'}`} 
                strokeWidth="10" fill="none" 
                strokeDasharray="439.8" 
                strokeDashoffset={439.8 - (439.8 * percentage) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold text-white">{percentage}%</span>
              <span className="text-sm text-gray-400">{result.score} / {result.totalQuestions}</span>
            </div>
          </div>
          <p className="text-lg font-medium text-white">
            {percentage >= 70 ? 'Excellent!' : percentage >= 40 ? 'Needs Improvement' : 'Poor Performance'}
          </p>
        </div>

        {/* Stats */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-gray-400 font-medium">Correct</span>
            </div>
            <span className="text-3xl font-bold text-white">{result.score}</span>
          </div>
          <div className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="w-6 h-6 text-red-500" />
              <span className="text-gray-400 font-medium">Incorrect</span>
            </div>
            <span className="text-3xl font-bold text-white">{result.totalQuestions - result.score}</span>
          </div>
          <div className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-blue-500" />
              <span className="text-gray-400 font-medium">Accuracy</span>
            </div>
            <span className="text-3xl font-bold text-white">{percentage}%</span>
          </div>
          <div className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-purple-500" />
              <span className="text-gray-400 font-medium">Time Taken</span>
            </div>
            <span className="text-3xl font-bold text-white">
              {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
            </span>
          </div>
        </div>
      </div>

      {/* Questions Review Dummy */}
      <div className="bg-[#1e1e2e] rounded-xl border border-gray-800 p-6">
        <h3 className="text-xl font-bold text-white mb-6">Question Review</h3>
        <div className="space-y-4">
          {result.answers.map((ans: any, idx: number) => (
            <div key={idx} className={`p-4 rounded-lg border ${ans.isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-300">Question {idx + 1}</span>
                {ans.isCorrect ? (
                  <span className="text-green-500 flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-1"/> Correct</span>
                ) : (
                  <span className="text-red-500 flex items-center text-sm"><XCircle className="w-4 h-4 mr-1"/> Incorrect</span>
                )}
              </div>
              <div className="text-sm text-gray-400">
                <p>Your Answer: <span className="text-white">{ans.selectedAnswer || 'Skipped'}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
