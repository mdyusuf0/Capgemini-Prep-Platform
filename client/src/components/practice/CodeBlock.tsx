import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';

interface CodeBlockProps {
  code: string;
  filename?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, filename = "trace_routine.pseudo" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Pseudocode copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  // Syntax highlighting for Paper Engine Charcoal IDE
  const highlightLine = (line: string) => {
    let highlighted = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Control flow keywords
    const flowKeywords = ['while', 'WHILE', 'if', 'IF', 'else', 'ELSE', 'then', 'THEN', 'for', 'FOR', 'to', 'TO', 'do', 'DO'];
    flowKeywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-[#bde9ff] font-semibold">$1</span>`);
    });

    // Declaration & return
    const typeKeywords = ['integer', 'INTEGER', 'int', 'INT', 'char', 'CHAR', 'string', 'STRING', 'return', 'RETURN', 'function', 'FUNCTION', 'SET', 'set'];
    typeKeywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-[#fc618d] font-semibold">$1</span>`);
    });

    // Bitwise & logical operators
    const logicOps = ['AND', 'and', 'OR', 'or', 'XOR', 'xor', 'NOT', 'not', '&lt;&lt;', '&gt;&gt;', 'MOD', 'mod'];
    logicOps.forEach(op => {
      const regex = new RegExp(`\\b(${op})\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-[#7bd88f] font-semibold">$1</span>`);
    });

    // Numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, `<span class="text-[#f8e67a] font-semibold">$1</span>`);

    // Comments
    highlighted = highlighted.replace(/(\/\/.*$)/g, `<span class="text-[#888888] font-light italic">$1</span>`);

    return { __html: highlighted };
  };

  return (
    <div className="w-full rounded-xl bg-surface-charcoal text-inverse-on-surface shadow-md overflow-hidden flex flex-col my-3 border border-surface-charcoal">
      {/* Terminal Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-primary-container text-on-primary">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-pink inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-accent-yellow inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-accent-mint inline-block"></span>
          </div>
          <span className="font-mono text-xs text-on-primary-container flex items-center gap-1 ml-2">
            <Terminal className="w-3.5 h-3.5 text-on-primary-container" /> {filename}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-on-primary-container/80">
            ENV: CAP_PSEUDO_STD_24
          </span>
          <button 
            onClick={handleCopy}
            className="p-1 rounded text-on-primary-container hover:text-white transition-colors cursor-pointer" 
            title="Copy Pseudocode"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-accent-mint" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Monospace Code Lines */}
      <div className="p-4 font-mono text-xs md:text-sm overflow-x-auto leading-relaxed select-text bg-[#222222]">
        {lines.map((line, idx) => (
          <div key={idx} className="flex items-start group hover:bg-white/5 px-1 py-0.5 rounded transition-colors">
            <span className="w-8 text-[#666666] select-none text-right pr-3 font-mono text-xs shrink-0">
              {idx + 1}
            </span>
            <div 
              className="flex-1 min-w-0 text-[#f6f6f6] whitespace-pre" 
              dangerouslySetInnerHTML={highlightLine(line)} 
            />
          </div>
        ))}
      </div>

      {/* Execution Control Footer */}
      <div className="px-4 py-2 bg-surface-charcoal flex items-center justify-between text-xs font-mono border-t border-white/5">
        <div className="flex items-center gap-2 text-white/70">
          <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse"></span>
          <span>Interpreter Ready</span>
          <span className="text-white/20">|</span>
          <span className="text-accent-yellow">{lines.length} Lines Parsed</span>
        </div>
        <span className="text-white/40 text-[10px]">Deterministic Evaluation</span>
      </div>
    </div>
  );
};

export default CodeBlock;

