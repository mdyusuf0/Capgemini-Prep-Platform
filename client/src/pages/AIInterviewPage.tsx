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
    <div className="p-8 max-w-4xl mx-auto h-full flex flex-col text-white">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center space-x-3">
            <Bot className="w-8 h-8 text-indigo-500" />
            <span>AI Mock Interview</span>
          </h1>
          <p className="text-gray-400">Practice dynamic interviews with an AI coach.</p>
        </div>
        <select className="bg-[#1e1e2e] border border-gray-700 rounded-lg p-2 text-white">
          <option>Technical Mode</option>
          <option>HR Mode</option>
          <option>Project Mode</option>
        </select>
      </div>

      <div className="flex-1 bg-[#1e1e2e] border border-gray-800 rounded-xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-xl ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-gray-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-800 bg-black/20 flex space-x-2">
          <button className="p-3 rounded-lg bg-gray-800 text-gray-400 hover:text-white">
            <Mic className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your response..."
            className="flex-1 bg-gray-800 border-none rounded-lg px-4 focus:ring-2 focus:ring-indigo-500 text-white outline-none"
          />
          <button onClick={handleSend} className="p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
