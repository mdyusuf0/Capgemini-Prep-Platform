import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';
import {
  Terminal,
  Play,
  ArrowRight,
  CheckCircle2,
  Check,
  Lock,
  Timer,
  AlertCircle,
  BookOpen,
  Code2,
  Bug,
  HelpCircle,
  Zap,
  Flame,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-progress'],
    queryFn: () => analyticsService.getDashboardProgress(),
    refetchOnWindowFocus: true
  });

  const questionsSolved = dashboardData?.stats?.questionsSolved ?? 0;
  const codingProblems = dashboardData?.stats?.codingProblems ?? 0;
  const avgAccuracy = dashboardData?.stats?.avgAccuracy ?? 0;
  const streak = dashboardData?.stats?.streak ?? 0;
  const overallReadiness = dashboardData?.overallReadiness ?? 0;
  const sections = dashboardData?.sections || [];

  const getSection = (title: string) => {
    return sections.find((s: any) => s.title?.toLowerCase().includes(title.toLowerCase())) || {
      progress: 0,
      solved: 0,
      target: 40
    };
  };

  const mcqSec = getSection('MCQ');
  const pseudoSec = getSection('Pseudocode');
  const codingSec = getSection('Coding');
  const debugSec = getSection('Debugging');

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 pb-12">
      {/* Top Command Banner */}
      <section className="bg-surface-paper rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-border-hairline shadow-xs">
        <div className="flex flex-col gap-2">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Operational Overview
            </span>
            <span className="text-on-surface-variant text-xs">/</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Target Drive: Capgemini 2026
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-on-surface text-xs font-medium border border-border-hairline">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-mint" />
              20-Day Velocity: On Track
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight font-sans">
            Welcome back, {user?.name || 'Yusuf'}
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant">
            Cohort cycle active. Benchmark calibration synchronized for Capgemini recruitment drives.
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto shrink-0">
          <button
            onClick={() => navigate('/practice')}
            className="h-9 px-4 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 flex-1 md:flex-initial border border-border-hairline cursor-pointer"
            type="button"
          >
            <Terminal size={14} />
            Practice Hub
          </button>
          <button
            onClick={() => navigate('/daily-challenge')}
            className="h-9 px-4 rounded-lg bg-primary text-on-primary hover:bg-surface-charcoal transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 flex-1 md:flex-initial shadow-xs cursor-pointer"
            type="button"
          >
            <Zap size={14} className="text-accent-mint" />
            Start Daily Mission
          </button>
        </div>
      </section>

      {/* Top Stats Grid: 5 Compact Metric Cells */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Stat 1: Questions Solved */}
        <div className="bg-surface-paper rounded-xl p-4 flex flex-col justify-between border border-border-hairline shadow-xs min-h-[128px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Questions Solved</span>
            <HelpCircle size={15} className="text-on-surface-variant" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-on-surface">{questionsSolved}</span>
              <span className="text-xs text-on-surface-variant">/ 870 pool</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden border border-border-hairline">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-700" 
                style={{ width: `${Math.min(100, Math.round((questionsSolved / 100) * 100))}%` }} 
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-on-surface-variant">Round 1.1 Target</span>
            <span className="text-[11px] text-secondary font-semibold">Stage 1</span>
          </div>
        </div>

        {/* Stat 2: Coding Problems */}
        <div className="bg-surface-paper rounded-xl p-4 flex flex-col justify-between border border-border-hairline shadow-xs min-h-[128px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Coding Lab</span>
            <Code2 size={15} className="text-on-surface-variant" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-on-surface">{codingProblems}</span>
              <span className="text-xs text-on-surface-variant">/ 155 solved</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-mint" />
              <span className="text-[11px] text-on-surface font-medium">Judge0 Verified Sandbox</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-on-surface-variant">{155 - codingProblems} remaining</span>
            <span className="text-[11px] text-on-surface-variant font-medium">[TESTS: PASS]</span>
          </div>
        </div>

        {/* Stat 3: Accuracy */}
        <div className="bg-surface-paper rounded-xl p-4 flex flex-col justify-between border border-border-hairline shadow-xs min-h-[128px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Accuracy</span>
            <Award size={15} className="text-on-surface-variant" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-on-surface">{avgAccuracy}%</span>
              <span className="text-xs text-accent-mint font-semibold">+4.2%</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-on-surface-variant text-[11px]">
              <span>Rolling assessment delta</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-on-surface-variant">Combined Score</span>
            <span className="text-[11px] text-secondary font-semibold">[RANK: 94.2]</span>
          </div>
        </div>

        {/* Stat 4: Streak */}
        <div className="bg-surface-paper rounded-xl p-4 flex flex-col justify-between border border-border-hairline shadow-xs min-h-[128px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Cadence</span>
            <span className="text-xs text-accent-pink">🔥</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-on-surface">{streak}</span>
              <span className="text-xs font-semibold text-on-surface ml-1">Days Active</span>
            </div>
            <div className="flex gap-1 mt-2">
              {[...Array(7)].map((_, i) => (
                <span 
                  key={i} 
                  className={cn(
                    "h-1.5 flex-1 rounded-xs",
                    i < Math.min(streak, 7) ? "bg-primary" : "bg-surface-container-high"
                  )} 
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-on-surface-variant">Daily Goal: Met</span>
            <span className="text-[11px] text-on-surface-variant">Target: 30D</span>
          </div>
        </div>

        {/* Stat 5: Overall Readiness */}
        <div className="bg-surface-paper rounded-xl p-4 flex flex-col justify-between border border-border-hairline shadow-xs min-h-[128px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Readiness</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-secondary-fixed text-on-secondary-fixed font-semibold">
              {overallReadiness >= 75 ? 'CLEARED' : 'IN PROGRESS'}
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-on-surface">{overallReadiness}</span>
              <span className="text-xs text-on-surface-variant">/ 100</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden border border-border-hairline">
              <div 
                className="bg-secondary h-full rounded-full transition-all duration-700" 
                style={{ width: `${overallReadiness}%` }} 
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-on-surface-variant">Assessment Tier</span>
            <span className="text-[11px] text-accent-mint font-semibold">
              {overallReadiness >= 75 ? 'Qualified' : 'Advancing'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content 2-Column Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 2/3 Width */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Section Progress (2x2 Matrix) */}
          <div className="bg-surface-paper rounded-xl p-6 border border-border-hairline shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Modular Progress</span>
                <h2 className="text-lg font-bold text-on-surface">Section Breakdown & Execution</h2>
              </div>
              <button 
                onClick={() => navigate('/roadmap')}
                className="text-xs text-secondary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>View Roadmap</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Module 1: Technical MCQ */}
              <div className="bg-surface-container-low rounded-lg p-4 flex flex-col justify-between gap-3 border border-border-hairline hover:bg-surface-container transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-on-surface-variant font-semibold">SEC:01</span>
                    <h3 className="text-sm font-bold text-on-surface">Technical MCQ</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-paper border border-border-hairline text-on-surface text-xs font-semibold">
                    {mcqSec.progress}%
                  </span>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[11px] text-on-surface-variant">Completed Questions</span>
                    <span className="text-xs font-semibold text-on-surface">{mcqSec.solved} / {mcqSec.target}</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden border border-border-hairline">
                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${mcqSec.progress}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-on-surface-variant">Core CS, DBMS, OS</span>
                  <button
                    onClick={() => navigate('/practice/mcq')}
                    className="h-7 px-3 rounded bg-surface-paper border border-border-hairline text-on-surface font-semibold text-xs hover:bg-surface-container-high flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Practice</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* Module 2: Pseudocode Tracing */}
              <div className="bg-surface-container-low rounded-lg p-4 flex flex-col justify-between gap-3 border border-border-hairline hover:bg-surface-container transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-on-surface-variant font-semibold">SEC:02</span>
                    <h3 className="text-sm font-bold text-on-surface">Pseudocode Tracing</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-paper border border-border-hairline text-secondary text-xs font-semibold">
                    {pseudoSec.progress}%
                  </span>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[11px] text-on-surface-variant">Completed Traces</span>
                    <span className="text-xs font-semibold text-on-surface">{pseudoSec.solved} / {pseudoSec.target}</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden border border-border-hairline">
                    <div className="bg-secondary h-full rounded-full transition-all" style={{ width: `${pseudoSec.progress}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-accent-mint font-semibold">60s Speed Mode</span>
                  <button
                    onClick={() => navigate('/practice/pseudocode')}
                    className="h-7 px-3 rounded bg-surface-paper border border-border-hairline text-on-surface font-semibold text-xs hover:bg-surface-container-high flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Resume</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* Module 3: Coding Lab */}
              <div className="bg-surface-container-low rounded-lg p-4 flex flex-col justify-between gap-3 border border-border-hairline hover:bg-surface-container transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-on-surface-variant font-semibold">SEC:03</span>
                    <h3 className="text-sm font-bold text-on-surface">Coding Lab</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-paper border border-border-hairline text-on-surface text-xs font-semibold">
                    {codingSec.progress}%
                  </span>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[11px] text-on-surface-variant">Accepted Submissions</span>
                    <span className="text-xs font-semibold text-on-surface">{codingSec.solved} / {codingSec.target}</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden border border-border-hairline">
                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${codingSec.progress}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-on-surface-variant">C++, Java, Python</span>
                  <button
                    onClick={() => navigate('/coding')}
                    className="h-7 px-3 rounded bg-surface-paper border border-border-hairline text-on-surface font-semibold text-xs hover:bg-surface-container-high flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Code Lab</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* Module 4: Code Debugging */}
              <div className="bg-surface-container-low rounded-lg p-4 flex flex-col justify-between gap-3 border border-border-hairline hover:bg-surface-container transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-on-surface-variant font-semibold">SEC:04</span>
                    <h3 className="text-sm font-bold text-on-surface">Code Debugging</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-paper border border-border-hairline text-on-surface text-xs font-semibold">
                    {debugSec.progress}%
                  </span>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[11px] text-on-surface-variant">Mastery Ratio</span>
                    <span className="text-xs font-semibold text-on-surface">{debugSec.solved} / {debugSec.target}</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden border border-border-hairline">
                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${debugSec.progress}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-on-surface-variant">Logic & Pointer checks</span>
                  <button
                    onClick={() => navigate('/debugging')}
                    className="h-7 px-3 rounded bg-surface-paper border border-border-hairline text-on-surface font-semibold text-xs hover:bg-surface-container-high flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Inspect</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap Phase Progression Widget */}
          <div className="bg-surface-paper rounded-xl p-6 border border-border-hairline shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Trajectory</span>
                <h2 className="text-lg font-bold text-on-surface">Roadmap Phase Progression</h2>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-semibold border border-border-hairline">
                CYCLE: CAP-2026
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Phase 1 */}
              <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between gap-3 border border-border-hairline">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-accent-mint/20 text-accent-mint flex items-center justify-center text-xs font-bold shrink-0">
                    <Check size={14} />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface">Phase 1: Core Fundamentals</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-paper text-on-surface font-semibold border border-border-hairline">
                        {mcqSec.progress >= 100 ? 'COMPLETED' : 'ACTIVE'}
                      </span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant">DSA Primitives, Bit Manipulation, Architecture</span>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-on-surface">{mcqSec.progress}%</span>
                  <p className="text-[10px] text-on-surface-variant">Live benchmark</p>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="p-3 rounded-lg bg-surface-container flex items-center justify-between gap-3 border border-border-hairline">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface">Phase 2: Pseudocode & Data Tracing</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-secondary-fixed text-on-secondary-fixed font-semibold">
                        ACTIVE
                      </span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant">Control flow, recursive stack execution, state vectors</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-xs font-bold text-secondary">{pseudoSec.progress}%</span>
                  <p className="text-[10px] text-on-surface-variant">Est. clearance: 4 days</p>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between gap-3 border border-border-hairline opacity-80">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-on-surface">Phase 3: Coding & Judge0 Testing</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-paper text-on-surface-variant font-semibold border border-border-hairline">
                        UPCOMING
                      </span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant">Live compiler test suites, memory edge-cases</span>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-medium text-on-surface-variant">{codingSec.progress}%</span>
                </div>
              </div>

              {/* Phase 4 */}
              <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between gap-3 border border-border-hairline opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-xs font-bold shrink-0">
                    <Lock size={12} />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-on-surface-variant">Phase 4: Capgemini Cognitive Mini-Games</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-paper text-on-surface-variant border border-border-hairline">
                        LOCKED
                      </span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant">Deductive logic, inductive speed grids, spatial drills</span>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs text-on-surface-variant">Requires Phase 2</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: 1/3 Width */}
        <div className="flex flex-col gap-6">
          {/* Card 1: Adaptive Daily Mission */}
          <div className="bg-surface-paper rounded-xl p-6 border border-border-hairline shadow-xs flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-secondary uppercase font-bold tracking-wider">Adaptive Mission</span>
                <span className="text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-semibold border border-border-hairline">
                  10 Qs
                </span>
              </div>
              <h3 className="text-base font-bold text-on-surface">Daily Diagnostic Sprint</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Targeted algorithmically to reinforce your weakest question vectors based on recent activity.
              </p>
            </div>

            <div className="flex flex-col gap-2 bg-surface-container-low p-3 rounded-lg border border-border-hairline">
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold tracking-wider">Target Weak Vectors</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-surface-paper text-on-surface text-[11px] border border-border-hairline">Bitwise Recursion</span>
                <span className="px-2 py-0.5 rounded bg-surface-paper text-on-surface text-[11px] border border-border-hairline">Off-by-one Loops</span>
                <span className="px-2 py-0.5 rounded bg-surface-paper text-on-surface text-[11px] border border-border-hairline">Pointer Boundary</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
              <span>Time budget: ~15 mins</span>
              <span className="text-on-surface font-semibold">Difficulty: Adaptive</span>
            </div>

            <button
              onClick={() => navigate('/daily-challenge')}
              className="w-full h-9 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:bg-surface-charcoal transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              type="button"
            >
              <Play size={13} />
              Resume Mission
            </button>
          </div>

          {/* Card 2: Mistakes Notebook Alert */}
          <div className="bg-surface-paper rounded-xl p-6 border border-border-hairline shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-error uppercase font-bold tracking-wider">Attention Required</span>
              <span className="w-2 h-2 rounded-full bg-accent-pink" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-base font-bold text-on-surface">Mistakes Notebook</h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-error-container text-on-error-container font-semibold">
                  Unresolved
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Review incorrectly answered questions and misconceptions to solidify your foundation.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="p-2 rounded bg-surface-container-low flex items-center justify-between text-xs border border-border-hairline">
                <span className="truncate text-on-surface font-medium">Q-309: Bitwise XOR shift trace</span>
                <span className="text-error font-semibold shrink-0">Review</span>
              </div>
              <div className="p-2 rounded bg-surface-container-low flex items-center justify-between text-xs border border-border-hairline">
                <span className="truncate text-on-surface font-medium">Q-412: Double pointer step-off</span>
                <span className="text-error font-semibold shrink-0">Review</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/mistakes')}
              className="w-full h-9 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors font-semibold text-xs flex items-center justify-center gap-1.5 border border-border-hairline cursor-pointer"
              type="button"
            >
              <BookOpen size={14} />
              Review Mistakes
            </button>
          </div>

          {/* Card 3: Upcoming Mock Assessment */}
          <div className="bg-surface-paper rounded-xl p-6 border border-border-hairline shadow-xs flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant uppercase font-semibold tracking-wider">Simulator Schedule</span>
              <span className="text-xs px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-semibold">
                RECOMMENDED
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-on-surface">Capgemini Structure A Mock</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Full benchmark rehearsal mimicking exact drive timing constraints and section locks.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-3 rounded-lg text-xs border border-border-hairline">
              <div>
                <span className="text-on-surface-variant block text-[10px]">DURATION</span>
                <span className="text-on-surface font-semibold">90 Minutes</span>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[10px]">SECTIONS</span>
                <span className="text-on-surface font-semibold">4 Modules</span>
              </div>
              <div className="mt-1">
                <span className="text-on-surface-variant block text-[10px]">QUESTIONS</span>
                <span className="text-on-surface font-semibold">55 Total</span>
              </div>
              <div className="mt-1">
                <span className="text-on-surface-variant block text-[10px]">PROCTORING</span>
                <span className="text-secondary font-semibold">Strict Enforced</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/mocks')}
                className="flex-1 h-9 rounded-lg bg-surface-paper border border-border-hairline text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                type="button"
              >
                <Timer size={14} />
                Details
              </button>
              <button
                onClick={() => navigate('/mocks')}
                className="flex-1 h-9 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:bg-surface-charcoal transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                type="button"
              >
                Start Mock
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="pt-6 border-t border-border-hairline text-center text-xs text-on-surface-variant space-y-1">
        <p className="font-bold text-on-surface">Capgemini Prep • A platform by Yusuf</p>
        <p className="text-[11px]">Procedural assessment architecture and recruitment preparation platform</p>
      </footer>
    </div>
  );
};
