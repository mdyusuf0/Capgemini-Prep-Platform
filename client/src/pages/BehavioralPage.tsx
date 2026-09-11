import React, { useState } from 'react';
import { Target, Users, Shield, Briefcase, Zap, Brain, MessageSquare } from 'lucide-react';

const DIMENSIONS = [
  { name: 'Teamwork', icon: <Users size={16}/>, score: 85 },
  { name: 'Adaptability', icon: <Zap size={16}/>, score: 70 },
  { name: 'Ownership', icon: <Target size={16}/>, score: 90 },
  { name: 'Communication', icon: <MessageSquare size={16}/>, score: 80 },
  { name: 'Problem Solving', icon: <Brain size={16}/>, score: 75 },
  { name: 'Professionalism', icon: <Briefcase size={16}/>, score: 95 },
  { name: 'Integrity', icon: <Shield size={16}/>, score: 100 },
];

export const BehavioralPage: React.FC = () => {
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setTimeout(() => {
      setShowResults(true);
    }, 500);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto flex gap-8">
      {/* Left side: SJT Scenario */}
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Situational Judgment Test</h1>
          <p className="text-gray-400">Evaluate your alignment with Capgemini's 7 Core Values.</p>
        </div>

        <div className="bg-[#1e1e2e] p-8 rounded-xl border border-gray-800 shadow-xl">
          <div className="inline-block bg-indigo-900/50 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full mb-4">
            Scenario 1: Teamwork & Deadlines
          </div>
          <h2 className="text-xl text-white font-medium mb-4 leading-relaxed">
            Your project deadline is tomorrow, and a team member suddenly falls ill without finishing their critical module. What do you do?
          </h2>
          
          <div className="space-y-4 mt-8">
            {[
              'Complain to the manager that the deadline will be missed due to the team member.',
              'Work overnight to complete the module yourself without telling anyone.',
              'Immediately inform the project manager, assess the remaining work, and distribute it among the available team members.',
              'Submit the project as is, explaining the module is missing due to illness.'
            ].map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleAnswer(i)}
                disabled={showResults}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  showResults 
                    ? i === 2 
                      ? 'bg-green-900/20 border-green-500 text-green-100' // Correct
                      : selectedAnswer === i 
                        ? 'bg-red-900/20 border-red-500 text-red-100' // Incorrect selection
                        : 'bg-[#0a0a0a] border-gray-800 text-gray-500 opacity-50' // Unselected
                    : selectedAnswer === i
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-[#0a0a0a] border-gray-700 hover:border-indigo-500 hover:bg-indigo-900/20 text-gray-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {showResults && (
            <div className="mt-8 p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-lg animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold text-indigo-400 mb-2">Alignment Analysis</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                The best approach is to immediately inform the project manager, assess the remaining work, and distribute it among the available team members.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#0a0a0a] text-gray-300 border border-gray-700 px-3 py-1 rounded text-xs">Values: Team Spirit, Honesty</span>
                <span className="bg-[#0a0a0a] text-gray-300 border border-gray-700 px-3 py-1 rounded text-xs">+15 Teamwork</span>
                <span className="bg-[#0a0a0a] text-gray-300 border border-gray-700 px-3 py-1 rounded text-xs">+10 Communication</span>
              </div>
              <button 
                onClick={() => { setShowResults(false); setSelectedAnswer(null); }}
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-sm font-medium transition-colors"
              >
                Next Scenario →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Capgemini Values Radar (Simplified representation for UI) */}
      <div className="w-[350px] flex-shrink-0 space-y-6">
        <div className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800 sticky top-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Target className="text-indigo-400" />
            Your Value Profile
          </h3>
          
          <div className="space-y-4">
            {DIMENSIONS.map((dim, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1 text-gray-300">
                  <span className="flex items-center gap-2">{dim.icon} {dim.name}</span>
                  <span className="text-indigo-400 font-mono">{dim.score}%</span>
                </div>
                <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden border border-gray-800">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">Capgemini's 7 Core Values</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Honesty', 'Boldness', 'Trust', 'Freedom', 'Fun', 'Modesty', 'Team Spirit'].map(v => (
                <span key={v} className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded border border-indigo-900/50">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
