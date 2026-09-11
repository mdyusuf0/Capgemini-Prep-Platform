import React from 'react';
import { Map, CheckCircle2, Circle, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';

const defaultPhases = [
  { id: 1, title: 'Phase 1: Fundamentals', desc: 'Java, OOP, DBMS, SQL, OS, Networks', progress: 0 },
  { id: 2, title: 'Phase 2: Assessment Skills', desc: 'Technical MCQ, Pseudocode, Communication', progress: 0 },
  { id: 3, title: 'Phase 3: Coding', desc: 'Arrays, Strings, Hashing, Sorting, DSA', progress: 0 },
  { id: 4, title: 'Phase 4: New Assessment', desc: 'Debugging, AI Coding, AI Literacy, Games', progress: 0 },
  { id: 5, title: 'Phase 5: Interview Prep', desc: 'Technical, Projects, HR & Behavioral', progress: 0 },
  { id: 6, title: 'Phase 6: Mock Tests', desc: 'Sectional, Full, Weakness targeting', progress: 0 },
];

export default function RoadmapPage() {
  const { data: roadmapData, isLoading } = useQuery({
    queryKey: ['roadmap-progress'],
    queryFn: () => analyticsService.getRoadmapProgress(),
    refetchOnWindowFocus: true
  });

  const phases = roadmapData?.phases || defaultPhases;

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-400 mb-3">
        <span>✨ Capgemini Prep By Yusuf</span>
      </div>
      <h1 className="text-3xl font-bold mb-2 flex items-center space-x-3">
        <Map className="w-8 h-8 text-indigo-500" />
        <span>20-Day Preparation Roadmap</span>
      </h1>
      <p className="text-gray-400 mb-8">
        Follow this structured 6-phase master strategy designed by Yusuf to secure your Capgemini selection. Your progress updates dynamically as you solve problems.
      </p>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent">
        {phases.map((phase: any) => (
          <div key={phase.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0a0a0a] bg-gray-800 text-gray-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow absolute left-0 md:left-1/2 -translate-x-1/2 z-10">
              {phase.progress >= 100 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : phase.progress > 0 ? (
                <Circle className="w-5 h-5 text-indigo-400 fill-indigo-500/30" />
              ) : (
                <Circle className="w-5 h-5 text-gray-600" />
              )}
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#1e1e2e] border border-gray-800 p-6 rounded-xl ml-10 md:ml-0 shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg text-white">{phase.title}</h3>
                <span className={`text-sm font-semibold ${phase.progress >= 100 ? 'text-emerald-400' : phase.progress > 0 ? 'text-indigo-400' : 'text-gray-500'}`}>
                  {phase.progress}%
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">{phase.desc}</p>
              <div className="w-full bg-gray-800/80 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-700 ${phase.progress >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} 
                  style={{ width: `${phase.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
