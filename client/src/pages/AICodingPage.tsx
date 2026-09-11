import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { aiService, AIConversation } from '../services/aiService';
import { Send, Bot, User, Loader2, Play } from 'lucide-react';
import toast from 'react-hot-toast';

export const AICodingPage: React.FC = () => {
  const [code, setCode] = useState<string>('// Start coding here...');
  const [conversation, setConversation] = useState<AIConversation | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [assistanceLevel, setAssistanceLevel] = useState(2);
  const [isInitializing, setIsInitializing] = useState(false);

  const problemContext = `
Problem: Two Sum
Description: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
Constraints: You may assume that each input would have exactly one solution, and you may not use the same element twice.
`;

  const initializeChat = async () => {
    try {
      setIsInitializing(true);
      const conv = await aiService.startConversation(problemContext, undefined, assistanceLevel);
      setConversation(conv);
      toast.success('AI Assistant Ready');
    } catch (error) {
      toast.error('Failed to start AI session');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !conversation) return;
    
    const userMessage = message;
    setMessage('');
    
    // Optimistic update
    const updatedConv = { ...conversation };
    updatedConv.messages = [...updatedConv.messages, { role: 'user' as const, content: userMessage, timestamp: new Date().toISOString() }];
    setConversation(updatedConv);

    try {
      setLoading(true);
      // Send code context as well
      const fullContextMessage = `User Code:\n${code}\n\nQuestion:\n${userMessage}`;
      const response = await aiService.sendMessage(conversation._id, fullContextMessage);
      setConversation(response);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-surface-cream text-on-surface">
      {/* Left Panel: Problem */}
      <div className="w-[30%] border-r border-border-hairline p-6 overflow-y-auto bg-white shadow-xs">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-surface-cream border border-border-hairline rounded-full text-xs font-mono font-medium text-secondary mb-3">
          <span>AI-ASSISTED CHALLENGE</span>
        </div>
        <h2 className="text-xl font-extrabold mb-3 text-on-surface tracking-tight">Two Sum</h2>
        <div className="text-xs text-on-surface-variant space-y-3 leading-relaxed">
          <p>Given an array of integers <code className="bg-surface-cream px-1.5 py-0.5 rounded border border-border-hairline font-mono text-zinc-800">nums</code> and an integer <code className="bg-surface-cream px-1.5 py-0.5 rounded border border-border-hairline font-mono text-zinc-800">target</code>, return indices of the two numbers such that they add up to target.</p>
          <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
          <h4 className="mt-4 font-mono font-bold text-on-surface uppercase tracking-wider text-[11px]">Example 1:</h4>
          <pre className="bg-surface-cream border border-border-hairline p-3 rounded-xl font-mono text-zinc-800 text-xs">
            Input: nums = [2,7,11,15], target = 9{"\n"}
            Output: [0,1]
          </pre>
        </div>
      </div>

      {/* Center Panel: Editor */}
      <div className="w-[42%] border-r border-border-hairline flex flex-col bg-surface-charcoal">
        <div className="p-3 bg-primary-container border-b border-white/10 flex justify-between items-center px-4">
          <span className="font-mono text-xs text-white/70 font-semibold uppercase tracking-wider">JAVASCRIPT LAB IDE</span>
          <button className="flex items-center gap-1.5 bg-white hover:bg-zinc-100 text-black px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer">
            <Play size={13} className="fill-black" /> Run Code
          </button>
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 12 } }}
          />
        </div>
      </div>

      {/* Right Panel: AI Chat */}
      <div className="w-[28%] flex flex-col bg-white">
        <div className="p-4 border-b border-border-hairline bg-surface-cream">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-sm flex items-center gap-2 text-on-surface"><Bot size={18} className="text-secondary"/> AI Pair Engineer</span>
            <div className="text-xs font-mono text-on-surface-variant bg-white px-2 py-0.5 rounded-full border border-border-hairline">
              Prompts: {conversation?.promptCount || 0}
            </div>
          </div>
          <select 
            value={assistanceLevel}
            onChange={(e) => setAssistanceLevel(Number(e.target.value))}
            className="w-full bg-white border border-border-hairline rounded-xl p-2 text-xs focus:border-black outline-none font-medium text-on-surface"
            disabled={!!conversation}
          >
            <option value={1}>Level 1: Conceptual Hints Only</option>
            <option value={2}>Level 2: Hints + Debugging</option>
            <option value={3}>Level 3: Explanation + Optimization</option>
            <option value={4}>Level 4: Full Assistance (Code provided)</option>
          </select>
          {!conversation && (
            <button 
              onClick={initializeChat}
              disabled={isInitializing}
              className="mt-2.5 w-full bg-primary-container hover:bg-black text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              {isInitializing ? 'Starting...' : 'Start Collaborative Session'}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          {conversation?.messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${msg.role === 'user' ? 'bg-primary-container text-white' : 'bg-surface-cream text-secondary border border-border-hairline'}`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${msg.role === 'user' ? 'bg-primary-container text-white font-medium' : 'bg-surface-cream border border-border-hairline text-on-surface'}`}>
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-surface-cream border border-border-hairline flex items-center justify-center text-secondary">
                <Loader2 size={14} className="animate-spin" />
              </div>
              <div className="p-3 rounded-xl bg-surface-cream border border-border-hairline text-on-surface-variant text-xs flex items-center gap-2">
                Analyzing prompt context...
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-border-hairline bg-surface-cream">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={conversation ? "Ask pair assistant..." : "Start session first..."}
              disabled={!conversation || loading}
              className="flex-1 bg-white border border-border-hairline rounded-xl px-3 py-2 text-xs focus:border-black outline-none text-on-surface placeholder:text-zinc-400"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!conversation || !message.trim() || loading}
              className="bg-primary-container hover:bg-black text-white disabled:opacity-40 disabled:cursor-not-allowed p-2 rounded-xl transition-all flex items-center justify-center w-9 h-9 cursor-pointer"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
