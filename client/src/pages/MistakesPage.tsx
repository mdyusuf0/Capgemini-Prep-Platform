import React from 'react';
import { XCircle, RefreshCw } from 'lucide-react';

export default function MistakesPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto text-on-surface">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-3">
        <span>✨ CAPGEMINI PREP BY YUSUF</span>
      </div>
      <h1 className="text-3xl font-extrabold mb-2 flex items-center space-x-3 text-on-surface tracking-tight">
        <XCircle className="w-8 h-8 text-red-500" />
        <span>Mistakes Notebook & Error Ledger</span>
      </h1>
      <p className="text-on-surface-variant text-sm mb-8">Review questions you previously failed or missed to target recurring conceptual blindspots.</p>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="inline-flex gap-1.5 p-1 bg-surface-container-high rounded-xl border border-border-hairline">
          {['MCQ', 'Pseudocode', 'Coding', 'Debugging'].map((tab, idx) => (
            <button key={tab} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${idx === 0 ? 'bg-white text-on-surface shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}>
              {tab}
            </button>
          ))}
        </div>
        <button className="flex items-center space-x-2 bg-primary-container hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" /> <span>Practice Mistakes Set</span>
        </button>
      </div>

      <div className="bg-white border border-border-hairline rounded-2xl p-12 text-center text-on-surface-variant font-mono text-xs shadow-sm">
        No recorded errors in this section yet. 100% accuracy velocity maintained!
      </div>
    </div>
  );
}
