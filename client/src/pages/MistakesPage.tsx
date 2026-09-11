import React from 'react';
import { XCircle, RefreshCw } from 'lucide-react';

export default function MistakesPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-2 flex items-center space-x-3">
        <XCircle className="w-8 h-8 text-red-500" />
        <span>Mistakes Notebook</span>
      </h1>
      <p className="text-gray-400 mb-8">Review questions you got wrong to improve your accuracy.</p>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          {['MCQ', 'Pseudocode', 'Coding', 'Debugging'].map(tab => (
            <button key={tab} className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700">
              {tab}
            </button>
          ))}
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg">
          <RefreshCw className="w-4 h-4" /> <span>Practice My Mistakes</span>
        </button>
      </div>

      <div className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-8 text-center text-gray-500">
        No mistakes recorded yet. Keep practicing!
      </div>
    </div>
  );
}
