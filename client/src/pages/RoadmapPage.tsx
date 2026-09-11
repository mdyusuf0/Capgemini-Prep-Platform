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
    <div className="p-8 max-w-4xl mx-auto text-on-surface">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-medium text-on-surface mb-3">
        <span>✨ CAPGEMINI PREP BY YUSUF</span>
      </div>
      <h1 className="text-3xl font-extrabold mb-2 flex items-center space-x-3 text-on-surface tracking-tight">
        <Map className="w-8 h-8 text-secondary" />
        <span>20-Day Preparation Roadmap</span>
      </h1>
      <p className="text-on-surface-variant text-sm mb-8">
        Follow this structured 6-phase master strategy designed by Yusuf to secure your Capgemini selection. Your progress updates dynamically as you complete practice sets and mock challenges.
      </p>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border-hairline">
        {phases.map((phase: any) => (
          <div key={phase.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-surface-container text-zinc-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm absolute left-0 md:left-1/2 -translate-x-1/2 z-10">
              {phase.progress >= 100 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : phase.progress > 0 ? (
                <Circle className="w-5 h-5 text-secondary fill-secondary/20" />
              ) : (
                <Circle className="w-5 h-5 text-zinc-300" />
              )}
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-border-hairline p-6 rounded-2xl ml-10 md:ml-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-base text-on-surface">{phase.title}</h3>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  phase.progress >= 100 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : phase.progress > 0 
                    ? 'bg-secondary-fixed text-on-secondary-fixed border-secondary/20' 
                    : 'bg-surface-cream text-zinc-500 border-border-hairline'
                }`}>
                  {phase.progress}%
                </span>
              </div>
              <p className="text-on-surface-variant text-xs mb-4 leading-relaxed">{phase.desc}</p>
              <div className="w-full bg-surface-cream border border-border-hairline rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-700 ${
                    phase.progress >= 100 
                      ? 'bg-emerald-500' 
                      : 'bg-gradient-to-r from-secondary to-primary-container'
                  }`} 
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
