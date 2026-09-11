import React, { useState } from 'react';
import { Brain, Shield, Code, Cpu, ShieldAlert, Bot } from 'lucide-react';

const TOPICS = [
  { id: 'genai', title: 'Generative AI Basics', icon: <Bot />, description: 'Learn about LLMs, transformers, and model inference.' },
  { id: 'prompt', title: 'Prompt Engineering', icon: <Code />, description: 'Master zero-shot, few-shot, and chain-of-thought.' },
  { id: 'responsible', title: 'Responsible AI', icon: <Shield />, description: 'Understand bias, fairness, and hallucination.' },
  { id: 'dev', title: 'AI in Software Dev', icon: <Cpu />, description: 'Using Copilot, code generation, and AI testing.' },
  { id: 'ml', title: 'ML Basics', icon: <Brain />, description: 'Supervised vs Unsupervised, classification.' },
  { id: 'security', title: 'AI Security', icon: <ShieldAlert />, description: 'Adversarial attacks, data poisoning, and deepfakes.' }
];

export const AILiteracyPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  if (selectedTopic) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <button 
          onClick={() => setSelectedTopic(null)}
          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-6"
        >
          ← Back to Topics
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">{TOPICS.find(t => t.id === selectedTopic)?.title} Practice</h1>
        <p className="text-gray-400">Loading questions from backend...</p>
        
        {/* Placeholder for actual QuestionCard component usage */}
        <div className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800">
          <div className="text-sm text-indigo-400 font-medium mb-2">Question 1 of 10</div>
          <h2 className="text-xl text-white mb-6">What does LLM stand for in Generative AI?</h2>
          <div className="space-y-3">
            {['Large Logic Model', 'Large Language Model', 'Local Language Machine', 'Logical Learning Mechanism'].map((opt, i) => (
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
        <h1 className="text-3xl font-bold text-white mb-2">AI Literacy</h1>
        <p className="text-gray-400">Master the fundamentals of Artificial Intelligence to excel in Capgemini interviews.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOPICS.map((topic) => (
          <div 
            key={topic.id}
            onClick={() => setSelectedTopic(topic.id)}
            className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800 hover:border-indigo-500 cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              {topic.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{topic.title}</h3>
            <p className="text-sm text-gray-400">{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
