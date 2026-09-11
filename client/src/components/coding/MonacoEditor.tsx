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
      monaco.editor.defineTheme('vs-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#1e1e2e',
        },
      });
      monaco.editor.setTheme('vs-dark');
    }
  }, [monaco]);

  const handleEditorChange = (value: string | undefined) => {
    onChange(value);
  };

  return (
    <div className="h-full w-full rounded-md overflow-hidden border border-gray-700">
      <Editor
        height="100%"
        language={language === 'c' ? 'c' : language === 'cpp' ? 'cpp' : language === 'python' ? 'python' : 'java'}
        value={code}
        theme="vs-dark"
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
