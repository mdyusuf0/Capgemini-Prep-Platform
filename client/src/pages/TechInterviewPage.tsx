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

interface TechInterviewPageProps {
  category?: 'technical-interview' | 'hr-interview' | 'project-interview';
  title?: string;
  description?: string;
}

export default function TechInterviewPage({
  category = 'technical-interview',
  title = 'Technical Interview Preparation',
  description = 'Practice Capgemini-standard technical interview questions. Study structured responses, architectural trade-offs, and follow-up topics.'
}: TechInterviewPageProps) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await interviewService.getQuestions(category);
        setQuestions(data);
      } catch (error) {
        console.error('Failed to load questions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [category]);

  if (loading) return <div className="p-8 text-on-surface font-mono text-sm">Loading Questions...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto text-on-surface">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-3">
          <span>✨ CAPGEMINI PREP BY YUSUF</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">{title}</h1>
        <p className="text-on-surface-variant text-sm">{description}</p>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q._id} className="bg-white border border-border-hairline rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <button 
              className="w-full p-5 text-left flex justify-between items-center hover:bg-surface-cream transition-colors cursor-pointer"
              onClick={() => setExpandedId(expandedId === q._id ? null : q._id)}
            >
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-full border ${
                    q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    q.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {q.difficulty}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-secondary-fixed text-on-secondary-fixed border border-secondary/20">
                    {q.topic}
                  </span>
                </div>
                <h3 className="text-base font-bold text-on-surface tracking-tight">{q.question}</h3>
              </div>
              {expandedId === q._id ? <ChevronUp className="text-zinc-500 w-5 h-5 shrink-0" /> : <ChevronDown className="text-zinc-500 w-5 h-5 shrink-0" />}
            </button>

            <AnimatePresence>
              {expandedId === q._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5 border-t border-border-hairline bg-surface-cream/50"
                >
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-secondary font-bold mb-2 flex items-center space-x-1.5">
                        <CheckCircle className="w-4 h-4" /> <span>Structured Response Model</span>
                      </h4>
                      <p className="text-on-surface bg-white border border-border-hairline p-4 rounded-xl text-xs leading-relaxed shadow-xs">
                        {q.idealAnswer}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="bg-white border border-border-hairline p-4 rounded-xl shadow-xs">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant mb-2">Key Discussion Points:</h4>
                        <ul className="list-disc list-inside text-xs text-on-surface space-y-1.5 leading-relaxed">
                          {q.keyPoints.map((kp, idx) => <li key={idx}>{kp}</li>)}
                        </ul>
                      </div>
                      <div className="bg-white border border-border-hairline p-4 rounded-xl shadow-xs">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant mb-2 flex items-center space-x-1.5">
                          <HelpCircle className="w-4 h-4 text-secondary" /> <span>Anticipated Follow-ups:</span>
                        </h4>
                        <ul className="list-disc list-inside text-xs text-on-surface space-y-1.5 leading-relaxed">
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
          <div className="text-center text-on-surface-variant p-8 border border-dashed border-border-hairline rounded-2xl bg-white font-mono text-xs">
            No questions found for this interview track.
          </div>
        )}
      </div>
    </div>
  );
}
