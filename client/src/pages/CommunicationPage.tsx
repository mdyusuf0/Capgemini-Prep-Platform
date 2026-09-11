import React, { useState } from 'react';
import { BookOpen, Edit3, Type, FileText, CheckCircle, AlignLeft } from 'lucide-react';

const SECTIONS = [
  { id: 'grammar', title: 'Grammar', icon: <Edit3 />, description: 'Tenses, subject-verb agreement, conditionals.' },
  { id: 'sentence', title: 'Sentence Correction', icon: <CheckCircle />, description: 'Spot the error, choose correct sentence.' },
  { id: 'prepositions', title: 'Prepositions', icon: <AlignLeft />, description: 'Fill in correct preposition.' },
  { id: 'vocabulary', title: 'Vocabulary', icon: <Type />, description: 'Synonyms, antonyms, contextual meaning.' },
  { id: 'reading', title: 'Reading Comprehension', icon: <BookOpen />, description: 'Passages and questions.' },
  { id: 'articles', title: 'Articles', icon: <FileText />, description: 'a/an/the usage.' }
];

export const CommunicationPage: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  if (selectedSection) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <button 
          onClick={() => setSelectedSection(null)}
          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-6"
        >
          ← Back to Sections
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">{SECTIONS.find(s => s.id === selectedSection)?.title} Practice</h1>
        <p className="text-gray-400">Loading questions from backend...</p>
        
        {/* Placeholder for actual QuestionCard component usage */}
        <div className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800">
          <div className="text-sm text-indigo-400 font-medium mb-2">Question 1 of 10</div>
          <h2 className="text-xl text-white mb-6">Choose the correct form of the verb: "The group of students ___ arriving late."</h2>
          <div className="space-y-3">
            {['are', 'is', 'were', 'have'].map((opt, i) => (
              <button key={i} className="w-full text-left p-4 rounded-lg bg-[#0a0a0a] border border-gray-700 hover:border-indigo-500 hover:bg-indigo-900/20 text-gray-200 transition-colors">
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">English Communication</h1>
        <p className="text-gray-400">Enhance your verbal and written skills for Capgemini's communication assessment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SECTIONS.map((section) => (
          <div 
            key={section.id}
            onClick={() => setSelectedSection(section.id)}
            className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800 hover:border-indigo-500 cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              {section.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{section.title}</h3>
            <p className="text-sm text-gray-400">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
