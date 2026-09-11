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
      <div className="p-8 max-w-5xl mx-auto space-y-6 text-on-surface">
        <button 
          onClick={() => setSelectedTopic(null)}
          className="text-secondary hover:underline font-mono text-xs font-bold flex items-center gap-2 mb-4 cursor-pointer"
        >
          ← Return to AI Literacy Modules
        </button>
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">{TOPICS.find(t => t.id === selectedTopic)?.title} Practice</h1>
        <p className="text-on-surface-variant text-sm">Interactive evaluation on modern neural concepts, prompt design, and safety protocols.</p>
        
        <div className="bg-white p-6 rounded-2xl border border-border-hairline shadow-sm">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-secondary mb-2">Item 1 of 10</div>
          <h2 className="text-lg font-bold text-on-surface mb-6 tracking-tight">What does LLM stand for in Generative AI?</h2>
          <div className="space-y-3">
            {['Large Logic Model', 'Large Language Model', 'Local Language Machine', 'Logical Learning Mechanism'].map((opt, i) => (
              <button key={i} className="w-full text-left p-4 rounded-xl bg-surface-cream border border-border-hairline hover:border-zinc-400 hover:bg-white text-on-surface text-sm transition-colors cursor-pointer">
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 text-on-surface">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-3">
          <span>✨ CAPGEMINI PREP BY YUSUF</span>
        </div>
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">AI Literacy & Prompt Engineering</h1>
        <p className="text-on-surface-variant text-sm max-w-2xl">Master the foundational core of Artificial Intelligence, transformer architectures, and prompt safety expected in Capgemini candidate profiles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOPICS.map((topic) => (
          <div 
            key={topic.id}
            onClick={() => setSelectedTopic(topic.id)}
            className="bg-white p-6 rounded-2xl border border-border-hairline hover:border-zinc-400 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm group"
          >
            <div className="w-12 h-12 bg-secondary-fixed text-on-secondary-fixed rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-secondary/20">
              {topic.icon}
            </div>
            <h3 className="text-base font-bold text-on-surface mb-1.5">{topic.title}</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
