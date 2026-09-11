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
    <div className="flex h-[calc(100vh-4rem)] bg-[#0a0a0a] text-white">
      {/* Left Panel: Problem */}
      <div className="w-[30%] border-r border-[#1e1e2e] p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-indigo-400">Problem Description</h2>
        <div className="prose prose-invert">
          <h3>Two Sum</h3>
          <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to target.</p>
          <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
          <h4 className="mt-4">Example 1:</h4>
          <pre className="bg-[#1e1e2e] p-3 rounded-md">
            Input: nums = [2,7,11,15], target = 9<br/>
            Output: [0,1]
          </pre>
        </div>
      </div>

      {/* Center Panel: Editor */}
      <div className="w-[40%] border-r border-[#1e1e2e] flex flex-col">
        <div className="p-4 border-b border-[#1e1e2e] flex justify-between items-center">
          <span className="font-semibold">Code Editor</span>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm transition-colors">
            <Play size={16} /> Run Code
          </button>
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>
      </div>

      {/* Right Panel: AI Chat */}
      <div className="w-[30%] flex flex-col bg-[#1e1e2e]/30">
        <div className="p-4 border-b border-[#1e1e2e]">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold flex items-center gap-2"><Bot size={20} className="text-indigo-400"/> AI Assistant</span>
            <div className="text-xs text-gray-400">
              Prompts: {conversation?.promptCount || 0}
            </div>
          </div>
          <select 
            value={assistanceLevel}
            onChange={(e) => setAssistanceLevel(Number(e.target.value))}
            className="w-full bg-[#1e1e2e] border border-gray-700 rounded p-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
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
              className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {isInitializing ? 'Starting...' : 'Start Discussion'}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation?.messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-lg max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-indigo-600/20 text-indigo-100' : 'bg-[#1e1e2e] text-gray-200'}`}>
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="p-3 rounded-lg bg-[#1e1e2e] text-gray-400 text-sm flex items-center gap-2">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#1e1e2e] bg-[#1a1a2e]">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={conversation ? "Ask for help..." : "Start discussion first..."}
              disabled={!conversation || loading}
              className="flex-1 bg-[#1e1e2e] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:border-indigo-500 outline-none"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!conversation || !message.trim() || loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors flex items-center justify-center w-10 h-10"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
