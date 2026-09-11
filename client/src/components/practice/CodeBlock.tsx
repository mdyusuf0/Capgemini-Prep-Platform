import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  // Basic syntax highlighting for pseudocode keywords
  const highlightLine = (line: string) => {
    const keywords = ['SET', 'PRINT', 'IF', 'ELSE', 'FOR', 'WHILE', 'FUNCTION', 'RETURN', 'END', 'EACH'];
    let highlighted = line;

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-blue-400 font-bold">${keyword}</span>`);
    });

    // Highlight strings
    highlighted = highlighted.replace(/"(.*?)"/g, '<span class="text-green-400">"$1"</span>');
    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
    
    return { __html: highlighted };
  };

  return (
    <div className="relative rounded-md overflow-hidden bg-[#1a1a2e] border border-gray-800 my-4 shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 bg-[#0a0a0a] border-b border-gray-800 text-xs text-gray-400">
        <span>Pseudocode</span>
        <button 
          onClick={handleCopy} 
          className="hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-sm font-mono text-gray-300">
        {lines.map((line, idx) => (
          <div key={idx} className=" table-row">
            <span className="table-cell pr-4 text-right text-gray-600 select-none min-w-[2rem] border-r border-gray-800">
              {idx + 1}
            </span>
            <span 
              className="table-cell pl-4 whitespace-pre" 
              dangerouslySetInnerHTML={highlightLine(line)} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeBlock;
