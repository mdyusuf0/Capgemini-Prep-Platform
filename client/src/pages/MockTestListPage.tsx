import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { mockService } from '../services/mockService';
import { useNavigate } from 'react-router-dom';
import { Zap, Cpu, Code, Target, Flame, Play, Clock, CheckCircle, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

export default function MockTestListPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'profiles' | 'sectional'>('profiles');

  const { data: history } = useQuery({
    queryKey: ['mock-history'],
    queryFn: () => mockService.getHistory()
  });

  const generateMutation = useMutation({
    mutationFn: (type: string) => mockService.generateMock(type),
    onSuccess: (data) => {
      startMutation.mutate(data._id);
    }
  });

  const startMutation = useMutation({
    mutationFn: (testId: string) => mockService.startMock(testId),
    onSuccess: (data) => {
      navigate(`/mocks/attempt/${data.attemptId}`);
    }
  });

  const handleStart = (type: string) => {
    generateMutation.mutate(type);
  };

  const assessmentProfiles = [
    {
      id: 'profile-a',
      type: 'full-capgemini',
      badge: '2026 Traditional Pattern',
      title: 'Structure A: Aon CoCubes Full OA',
      desc: 'Standard on-campus assessment pattern with strict elimination stages.',
      sections: ['Technical MCQs (20Q)', 'Pseudocode Tracing (20Q)', 'English Verbal (30Q)', 'Cognitive Games (4)', 'Coding Round (2)'],
      duration: '165 Mins',
      cutoff: '70% Elimination',
      icon: ShieldCheck,
      color: 'border-indigo-500/40 bg-indigo-950/20'
    },
    {
      id: 'profile-b',
      type: 'full-capgemini',
      badge: '2027 Emerging AI Pattern',
      title: 'Structure B: AI-Assisted Modern OA',
      desc: 'Emerging developer pattern evaluating live debugging, AI tools, and prompt engineering.',
      sections: ['Communication (25Q)', 'Debugging (12Q)', 'AI Debugging (2)', 'AI Feature Dev (1)', 'Prompt Engineering (20Q)'],
      duration: '160 Mins',
      cutoff: '65% Elimination',
      icon: Sparkles,
      color: 'border-cyan-500/40 bg-cyan-950/20'
    }
  ];

  const mockTypes = [
    { type: 'quick', title: 'Quick Sprint Mock', desc: '20 questions, 20 min rapid fire', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { type: 'section', title: 'Technical Core MCQ', desc: '40 questions, 40 min core CS', icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { type: 'section', title: 'Pseudocode Speed Test', desc: '20 questions, 25 min dry running', icon: Code, color: 'text-green-500', bg: 'bg-green-500/10' },
    { type: 'weakness', title: 'Target Weaknesses', desc: 'Adaptive review based on mistakes', icon: Flame, color: 'text-red-500', bg: 'bg-red-500/10' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-400 mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Configurable Assessment Profiles</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Capgemini Simulation Mocks</h1>
        <p className="text-gray-400 max-w-2xl text-sm">
          Simulate official test conditions. Select between the traditional CoCubes elimination pattern and the emerging 2027 AI-assisted structure.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-3">
        <button
          onClick={() => setSelectedTab('profiles')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            selectedTab === 'profiles' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white bg-[#1e1e2e]'
          }`}
        >
          Full Assessment Profiles (2026 vs 2027)
        </button>
        <button
          onClick={() => setSelectedTab('sectional')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            selectedTab === 'sectional' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white bg-[#1e1e2e]'
          }`}
        >
          Sectional & Sprint Mocks
        </button>
      </div>

      {/* Assessment Profiles Section */}
      {selectedTab === 'profiles' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assessmentProfiles.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`border rounded-2xl p-7 flex flex-col justify-between space-y-6 shadow-xl ${p.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-bold font-mono">
                      {p.badge}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{p.duration}</span>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                      <Icon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{p.title}</h2>
                      <p className="text-xs text-gray-400">{p.desc}</p>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">Included Assessment Sections:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {p.sections.map((sec, sIdx) => (
                        <span key={sIdx} className="px-2.5 py-1 bg-black/40 border border-white/10 rounded-lg text-xs text-gray-300">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-indigo-300 font-mono font-semibold">Cutoff: {p.cutoff}</span>
                  <Button
                    onClick={() => handleStart(p.type)}
                    disabled={generateMutation.isPending || startMutation.isPending}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-2 rounded-xl"
                  >
                    <Play className="w-4 h-4 mr-2" /> Start Simulation
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sectional Mocks */}
      {selectedTab === 'sectional' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockTypes.map((mock, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="bg-[#1e1e2e] border border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer shadow-lg"
              onClick={() => handleStart(mock.type)}
            >
              <div className={`p-4 rounded-2xl ${mock.bg} mb-4`}>
                <mock.icon className={`w-8 h-8 ${mock.color}`} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">{mock.title}</h3>
              <p className="text-xs text-gray-400 mb-6">{mock.desc}</p>
              <Button 
                className="w-full mt-auto bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-semibold"
                disabled={generateMutation.isPending || startMutation.isPending}
              >
                <Play className="w-3.5 h-3.5 mr-1.5" /> Start Practice
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* History */}
      {history && history.length > 0 && (
        <div className="pt-4">
          <h2 className="text-xl font-bold text-white mb-4">Past Assessment Attempts</h2>
          <div className="bg-[#1e1e2e] rounded-2xl border border-gray-800 overflow-hidden shadow-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Test Name</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Score</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {history.map((attempt: any) => (
                  <tr key={attempt._id} className="hover:bg-gray-800/30">
                    <td className="p-4 font-medium">{attempt.mockTestId?.title || 'Capgemini Assessment'}</td>
                    <td className="p-4 text-xs text-gray-400">{new Date(attempt.startedAt).toLocaleDateString()}</td>
                    <td className="p-4 font-mono font-bold text-indigo-400">{attempt.score} / {attempt.totalQuestions}</td>
                    <td className="p-4">
                      {attempt.status === 'completed' ? (
                        <span className="inline-flex items-center text-green-400 text-xs font-semibold"><CheckCircle className="w-3.5 h-3.5 mr-1"/> Completed</span>
                      ) : (
                        <span className="inline-flex items-center text-yellow-400 text-xs font-semibold"><Clock className="w-3.5 h-3.5 mr-1"/> In Progress</span>
                      )}
                    </td>
                    <td className="p-4">
                      {attempt.status === 'completed' ? (
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/mocks/result/${attempt._id}`)}>
                          View Results
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-indigo-400" onClick={() => navigate(`/mocks/attempt/${attempt._id}`)}>
                          Resume
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
