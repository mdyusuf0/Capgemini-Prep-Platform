import React, { useState } from 'react';
import { Bot, Send, Mic } from 'lucide-react';

export default function AIInterviewPage() {
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Hello! I am your AI Interview Coach. Shall we start a Technical or HR mock interview?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: 'That is a good start. Can you elaborate more on the specific challenges you faced?' }]);
    }, 1000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full flex flex-col text-on-surface">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-2">
            <span>✨ CAPGEMINI PREP BY YUSUF</span>
          </div>
          <h1 className="text-3xl font-extrabold flex items-center space-x-3 text-on-surface tracking-tight">
            <Bot className="w-8 h-8 text-secondary" />
            <span>AI Mock Interview Simulator</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">Practice dynamic recruiter questions with an AI coach trained on Capgemini competencies.</p>
        </div>
        <select className="bg-white border border-border-hairline rounded-xl px-3 py-2 text-xs font-mono font-semibold text-on-surface shadow-xs outline-none">
          <option>Technical Architecture Track</option>
          <option>HR & Values Track</option>
          <option>Project & Scenario Track</option>
        </select>
      </div>

      <div className="flex-1 bg-white border border-border-hairline rounded-2xl flex flex-col overflow-hidden shadow-sm min-h-[480px]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary-container text-white font-medium shadow-xs' 
                  : 'bg-surface-cream border border-border-hairline text-on-surface'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border-hairline bg-surface-cream flex space-x-2">
          <button className="p-3 rounded-xl bg-white border border-border-hairline text-zinc-600 hover:text-black transition-colors cursor-pointer shadow-xs">
            <Mic className="w-5 h-5 text-secondary" />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Structure your interview response..."
            className="flex-1 bg-white border border-border-hairline rounded-xl px-4 text-xs md:text-sm focus:border-black outline-none text-on-surface placeholder:text-zinc-400 shadow-xs"
          />
          <button onClick={handleSend} className="p-3 rounded-xl bg-primary-container hover:bg-black text-white shadow-sm transition-all cursor-pointer">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
