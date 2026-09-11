import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { debuggingService } from '../services/debuggingService';
import Editor from '@monaco-editor/react';
import { Button } from '../components/ui/button';
import { Bug, Lightbulb, Play, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function DebuggingChallengePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { data: problem, isLoading } = useQuery({
    queryKey: ['debugging-problem', id],
    queryFn: () => debuggingService.getProblemById(id!),
    enabled: !!id
  });

  useEffect(() => {
    if (problem) {
      setCode(problem.buggyCode);
      setResult(null);
      setShowHint(false);
    }
  }, [problem]);

  const submitMutation = useMutation({
    mutationFn: (fixedCode: string) => debuggingService.submitFix(id!, fixedCode),
    onSuccess: (data) => {
      setResult(data);
      if (data.correct) {
        toast.success('Correct fix!');
      } else {
        toast.error('Not quite right. Try again!');
      }
    }
  });

  if (isLoading) return <div className="text-white p-8">Loading...</div>;
  if (!problem) return <div className="text-white p-8">Problem not found</div>;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="h-14 border-b border-gray-800 bg-[#1e1e2e] flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/debugging')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h2 className="text-lg font-semibold text-white">{problem.title}</h2>
          <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 font-mono">
            {problem.language}
          </span>
        </div>
        <div>
          <Button 
            onClick={() => submitMutation.mutate(code)}
            disabled={submitMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            {submitMutation.isPending ? 'Submitting...' : 'Submit Fix'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Description */}
        <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-800 bg-[#0a0a0a]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Bug className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Bug Type</h3>
              <p className="text-white font-medium capitalize">{problem.bugType}</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-8">
            <h3 className="text-xl font-semibold mb-2">Problem Description</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{problem.description}</p>
          </div>

          {/* Hint Section */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => setShowHint(!showHint)}
              className="text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/10"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showHint ? 'Hide Hint' : 'Get a Hint'}
            </Button>
            
            <AnimatePresence>
              {showHint && problem.hints?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200"
                >
                  <ul className="list-disc list-inside space-y-1">
                    {problem.hints.map((hint: string, i: number) => (
                      <li key={i}>{hint}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Section */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl border ${
                  result.correct ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {result.correct ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                  <h3 className={`text-lg font-semibold ${result.correct ? 'text-green-500' : 'text-red-500'}`}>
                    {result.correct ? 'Bug Fixed!' : 'Still Buggy'}
                  </h3>
                </div>
                <div className="prose prose-invert max-w-none text-sm">
                  <p>{result.explanation}</p>
                </div>
                
                {result.correct && (
                  <Button 
                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 w-full"
                    onClick={() => navigate('/debugging')}
                  >
                    Back to Challenges
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel - Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage={
                problem.language === 'cpp' ? 'cpp' : 
                problem.language === 'python' ? 'python' : 
                problem.language === 'java' ? 'java' : 'c'
              }
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'JetBrains Mono, monospace',
                padding: { top: 20 }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
