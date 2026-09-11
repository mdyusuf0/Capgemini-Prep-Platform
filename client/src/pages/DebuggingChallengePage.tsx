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

  if (isLoading) return <div className="text-on-surface font-mono text-sm p-8">Loading problem...</div>;
  if (!problem) return <div className="text-on-surface font-mono text-sm p-8">Problem not found</div>;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-surface-cream text-on-surface">
      {/* Header */}
      <div className="h-14 border-b border-border-hairline bg-white flex items-center px-6 justify-between shadow-xs z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/debugging')} className="text-zinc-600 hover:text-black rounded-lg">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="h-4 w-px bg-border-hairline hidden md:block"></div>
          <h2 className="text-base font-bold text-on-surface">{problem.title}</h2>
          <span className="px-2.5 py-0.5 bg-surface-cream border border-border-hairline rounded-full text-xs text-zinc-700 font-mono font-semibold">
            {problem.language.toUpperCase()}
          </span>
        </div>
        <div>
          <Button 
            onClick={() => submitMutation.mutate(code)}
            disabled={submitMutation.isPending}
            className="bg-primary-container hover:bg-black text-white rounded-xl font-bold shadow-sm text-xs px-4"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-white" />
            {submitMutation.isPending ? 'Verifying...' : 'Submit Fix'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Description */}
        <div className="w-1/2 p-6 overflow-y-auto border-r border-border-hairline bg-white">
          <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-surface-cream border border-border-hairline">
            <div className="p-2 bg-red-100 rounded-lg">
              <Bug className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-on-surface-variant text-xs font-mono uppercase tracking-wider font-semibold">Bug Category</h3>
              <p className="text-on-surface font-bold capitalize text-sm">{problem.bugType}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-bold mb-2">Problem Description</h3>
            <p className="text-on-surface text-sm whitespace-pre-wrap leading-relaxed">{problem.description}</p>
          </div>

          {/* Hint Section */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => setShowHint(!showHint)}
              className="text-amber-800 border-amber-300 bg-amber-50 hover:bg-amber-100 rounded-xl text-xs font-semibold"
            >
              <Lightbulb className="w-4 h-4 mr-2 text-amber-600" />
              {showHint ? 'Hide Hint' : 'Reveal Strategic Hint'}
            </Button>
            
            <AnimatePresence>
              {showHint && problem.hints?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-950 text-xs leading-relaxed"
                >
                  <ul className="list-disc list-inside space-y-1.5">
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border ${
                  result.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {result.correct ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <h3 className={`text-sm font-bold ${result.correct ? 'text-emerald-800' : 'text-red-800'}`}>
                    {result.correct ? 'Bug Successfully Fixed!' : 'Correction Incomplete'}
                  </h3>
                </div>
                <div className="text-xs leading-relaxed text-on-surface">
                  <p>{result.explanation}</p>
                </div>
                
                {result.correct && (
                  <Button 
                    className="mt-4 bg-primary-container hover:bg-black text-white w-full rounded-xl font-semibold text-xs shadow-sm"
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
        <div className="w-1/2 flex flex-col bg-surface-charcoal">
          <div className="h-8 bg-primary-container border-b border-white/10 px-4 flex items-center justify-between text-xs font-mono text-white/60">
            <span>TERMINAL CODE REVIEW: {problem.language.toUpperCase()}</span>
            <span>CAPGEMINI BUG ENGINE</span>
          </div>
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
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                padding: { top: 16 }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
