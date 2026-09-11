import React, { useEffect, useState } from 'react';
import { interviewService } from '../services/interviewService';
import { ChevronDown, ChevronUp, CheckCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InterviewQuestion {
  _id: string;
  question: string;
  difficulty: string;
  idealAnswer: string;
  keyPoints: string[];
  followUpQuestions: string[];
  topic: string;
}

export default function TechInterviewPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await interviewService.getQuestions('technical-interview');
        setQuestions(data);
      } catch (error) {
        console.error('Failed to load questions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading Questions...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Technical Interview Prep</h1>
        <p className="text-gray-400">Practice Capgemini-style technical interview questions. Study the ideal answers and key points.</p>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q._id} className="bg-[#1e1e2e] border border-gray-800 rounded-xl overflow-hidden">
            <button 
              className="w-full p-5 text-left flex justify-between items-center hover:bg-gray-800/50 transition-colors"
              onClick={() => setExpandedId(expandedId === q._id ? null : q._id)}
            >
              <div>
                <div className="flex space-x-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    q.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                    q.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {q.difficulty}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400 font-medium">
                    {q.topic}
                  </span>
                </div>
                <h3 className="text-lg font-medium">{q.question}</h3>
              </div>
              {expandedId === q._id ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
            </button>

            <AnimatePresence>
              {expandedId === q._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5 border-t border-gray-800"
                >
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-indigo-400 font-semibold mb-1 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" /> <span>Ideal Answer</span>
                      </h4>
                      <p className="text-gray-300 bg-black/20 p-4 rounded-lg text-sm leading-relaxed">
                        {q.idealAnswer}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-gray-400 text-sm font-semibold mb-2">Key Points to Mention:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                          {q.keyPoints.map((kp, idx) => <li key={idx}>{kp}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-gray-400 text-sm font-semibold mb-2 flex items-center space-x-2">
                          <HelpCircle className="w-4 h-4" /> <span>Follow-up Questions:</span>
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                          {q.followUpQuestions.map((fq, idx) => <li key={idx}>{fq}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {questions.length === 0 && (
          <div className="text-center text-gray-500 p-8 border border-dashed border-gray-700 rounded-xl">
            No questions found. Have you seeded the database?
          </div>
        )}
      </div>
    </div>
  );
}
