import Editor, { useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';

interface MonacoEditorProps {
  code: string;
  language: string;
  onChange: (value: string | undefined) => void;
  readOnly?: boolean;
}

export const MonacoEditor = ({ code, language, onChange, readOnly = false }: MonacoEditorProps) => {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('paper-charcoal', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#141414',
        },
      });
      monaco.editor.setTheme('paper-charcoal');
    }
  }, [monaco]);

  const handleEditorChange = (value: string | undefined) => {
    onChange(value);
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-border-hairline shadow-xs">
      <Editor
        height="100%"
        language={language === 'c' ? 'c' : language === 'cpp' ? 'cpp' : language === 'python' ? 'python' : 'java'}
        value={code}
        theme="paper-charcoal"
        onChange={handleEditorChange}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          formatOnPaste: true,
          lineNumbers: 'on',
        }}
      />
    </div>
  );
};
