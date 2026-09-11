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
    <div className="container mx-auto px-4 py-8 space-y-8 text-on-surface">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-3">
          <Layers className="w-3.5 h-3.5 text-secondary" />
          <span>CONFIGURABLE ASSESSMENT PROFILES</span>
        </div>
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">Capgemini Simulation Mocks</h1>
        <p className="text-on-surface-variant max-w-2xl text-sm">
          Simulate official examination conditions. Choose between the traditional Aon CoCubes elimination pattern and the emerging AI-assisted benchmark structure.
        </p>
      </div>

      {/* Tabs */}
      <div className="inline-flex gap-1.5 p-1 bg-surface-container-high rounded-xl border border-border-hairline">
        <button
          onClick={() => setSelectedTab('profiles')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedTab === 'profiles' ? 'bg-white text-on-surface shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Full Assessment Profiles (2026 vs 2027)
        </button>
        <button
          onClick={() => setSelectedTab('sectional')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedTab === 'sectional' ? 'bg-white text-on-surface shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
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
                className="bg-white border border-border-hairline rounded-2xl p-7 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-surface-cream text-on-surface border border-border-hairline rounded-full text-xs font-bold font-mono">
                      {p.badge}
                    </span>
                    <span className="text-xs font-mono font-semibold text-on-surface-variant">{p.duration}</span>
                  </div>

                  <div className="flex items-start gap-3.5 pt-1">
                    <div className="p-3 bg-secondary-fixed text-on-secondary-fixed rounded-xl border border-secondary/20 shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-on-surface tracking-tight">{p.title}</h2>
                      <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <span className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-wider block">Assessment Sequence:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {p.sections.map((sec, sIdx) => (
                        <span key={sIdx} className="px-2.5 py-1 bg-surface-cream border border-border-hairline rounded-lg text-xs text-zinc-700 font-mono">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-hairline flex items-center justify-between">
                  <span className="text-xs text-on-surface font-mono font-bold">Cutoff: {p.cutoff}</span>
                  <Button
                    onClick={() => handleStart(p.type)}
                    disabled={generateMutation.isPending || startMutation.isPending}
                    className="bg-primary-container hover:bg-black text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5 fill-white" /> Start Simulation
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
              whileHover={{ y: -2 }}
              className="bg-white border border-border-hairline rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer shadow-sm hover:shadow-md transition-all"
              onClick={() => handleStart(mock.type)}
            >
              <div className={`p-4 rounded-2xl ${mock.bg} mb-4 border border-border-hairline`}>
                <mock.icon className={`w-7 h-7 ${mock.color}`} />
              </div>
              <h3 className="text-base font-bold text-on-surface mb-1">{mock.title}</h3>
              <p className="text-xs text-on-surface-variant mb-6">{mock.desc}</p>
              <Button 
                className="w-full mt-auto bg-primary-container text-white hover:bg-black rounded-xl text-xs font-bold shadow-sm"
                disabled={generateMutation.isPending || startMutation.isPending}
              >
                <Play className="w-3.5 h-3.5 mr-1.5 fill-white" /> Start Practice
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* History */}
      {history && history.length > 0 && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-on-surface tracking-tight">Past Assessment Attempts</h2>
            <span className="text-xs font-mono text-on-surface-variant">Archived Runs</span>
          </div>
          <div className="bg-white rounded-2xl border border-border-hairline overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-cream text-on-surface-variant text-xs font-mono uppercase tracking-wider border-b border-border-hairline">
                <tr>
                  <th className="p-4 font-semibold">Test Name</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Score</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline text-zinc-700">
                {history.map((attempt: any) => (
                  <tr key={attempt._id} className="hover:bg-surface-cream/60 transition-colors">
                    <td className="p-4 font-bold text-on-surface">{attempt.mockTestId?.title || 'Capgemini Assessment'}</td>
                    <td className="p-4 text-xs font-mono text-on-surface-variant">{new Date(attempt.startedAt).toLocaleDateString()}</td>
                    <td className="p-4 font-mono font-bold text-secondary">{attempt.score} / {attempt.totalQuestions}</td>
                    <td className="p-4">
                      {attempt.status === 'completed' ? (
                        <span className="inline-flex items-center text-emerald-700 text-xs font-semibold"><CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600"/> Completed</span>
                      ) : (
                        <span className="inline-flex items-center text-amber-700 text-xs font-semibold"><Clock className="w-3.5 h-3.5 mr-1 text-amber-600"/> In Progress</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {attempt.status === 'completed' ? (
                        <Button variant="outline" size="sm" className="rounded-lg text-xs font-bold" onClick={() => navigate(`/mocks/result/${attempt._id}`)}>
                          View Results
                        </Button>
                      ) : (
                        <Button variant="default" size="sm" className="rounded-lg text-xs font-bold" onClick={() => navigate(`/mocks/attempt/${attempt._id}`)}>
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
